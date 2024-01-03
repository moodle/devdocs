#!/usr/bin/env node
/**
 * Copyright (c) Moodle Pty Ltd.
 *
 * Moodle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Moodle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-disable import/no-extraneous-dependencies */
import yaml from 'js-yaml';
import path from 'path';
import { exec } from 'child_process';
import { program } from 'commander';
import { writeFile, mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import inquirer from 'inquirer';

import {
    getFetchDoc,
    getGetPagesByPrefix,
    getClient,
    getLogger,
    getNormalizedPath,
    addMigratedPage,
    guessSlug,
    getGetImagesFromArticle,
    getGetImageInfo,
} from './utils.js';

const fetch = (...args) => import('node-fetch').then(({ default: get }) => get(...args));

const remoteHost = 'docs.moodle.org/dev';

const client = getClient(remoteHost);
const logger = getLogger();
const fetchDoc = getFetchDoc(logger)(client);
const getImagesFromArticle = getGetImagesFromArticle(logger)(client);
const getImageInfo = getGetImageInfo(logger)(client);

// This regular expression matches any Wikimedia Category tag taking the entire line.
// const categoryRegexp = /^\[\[Category:(?<categoryName>.+?)\]\]$/g;
const categoryRegexp = /\[\[Category:(?<categoryName>[^\]]*)\]\]/g;
const getFrontmatterData = (options, title, content) => {
    const data = {
        title: title.replaceAll('_', ' '),
        tags: [],
    };

    if (options.titleSearch !== undefined && options.titleReplacement !== undefined) {
        data.title = data.title.replaceAll(new RegExp(options.titleSearch, 'g'), options.titleReplacement);
    }

    if (options?.positionRegex && !options?.position) {
        const positionRegex = new RegExp(options.positionRegex);
        const matches = positionRegex.exec(data.title);
        if (matches?.groups.position) {
            const position = parseInt(matches.groups.position, 10);
            if (position === Number(matches.groups.position)) {
                data.sidebar_position = Number(matches.groups.position);
            } else {
                logger.warn(`Failed to get a usable sidebar position from '${matches.groups.position}'`);
            }
        } else {
            logger.warn(`No position found in ${data.title} using ${positionRegex}`);
        }
    }

    if (options?.position) {
        data.sidebar_position = Number(options.position);
    }

    if (options?.invertPosition) {
        data.sidebar_position = 0 - data.sidebar_position;
    }

    if (options?.versionRegex) {
        const versionRegex = new RegExp(options.versionRegex);
        console.log(data.title);
        const matches = versionRegex.exec(data.title);
        if (matches?.groups.moodleVersion) {
            data.moodleVersion = matches.groups.moodleVersion;
        } else {
            logger.warn(`No version found in ${data.title} using ${options.moodleVersion}`);
        }
    }

    data.tags = Array.from(content.matchAll(categoryRegexp))
        .map((result) => result.groups.categoryName.replace(/\|.*$/, ''))
        .filter((result) => !!result);

    return data;
};

const getFrontmatter = (data) => {
    const frontmatter = yaml.dump(data);

    return `---
${frontmatter}---`;
};

const checkData = (data) => new Promise((resolve) => {
    const allQuestions = [{
        message: 'Enter page title',
        name: 'title',
        default: data.title,
    }];

    const addConfirmTagsQuestion = (questions, tags) => {
        questions.push({
            type: 'checkbox',
            message: 'Confirm tags',
            name: 'tags',
            choices: tags.map((tag) => ({
                name: tag,
                checked: true,
            })),
        });

        return questions;
    };

    const addAddTagQuestion = (questions) => {
        questions.push({
            message: 'Enter another tag',
            name: 'extraTag',
            default: '',
        });

        return questions;
    };

    if (data.tags.length) {
        addConfirmTagsQuestion(allQuestions, data.tags);
    }
    addAddTagQuestion(allQuestions);

    const ask = (theseQuestions) => {
        inquirer.prompt(theseQuestions)
            .then((answers) => {
                if (answers.title) {
                    data.title = answers.title;
                }

                if (answers.tags) {
                    data.tags = answers.tags;
                }

                if (answers.extraTag) {
                    data.tags.push(answers.extraTag);
                    ask(addAddTagQuestion([]));
                } else {
                    resolve(data);
                }
            });
    };

    ask(allQuestions);
});

const fetchImagesForDoc = async (title, newPath) => {
    logger.info('Fetching images');

    const imageList = await getImagesFromArticle(title);
    if (imageList.length === 0) {
        return [];
    }

    const imageDirName = `_${path.basename(newPath.replace(/\.md.?/, ''))}`;
    const newFileImagePath = path.join(path.dirname(newPath), imageDirName);
    await mkdir(newFileImagePath, { recursive: true });

    return Promise.all(imageList.map(async ({ title: filename }) => {
        const imageData = await getImageInfo(filename);
        const response = await fetch(imageData.url);
        const imagePath = `${newFileImagePath}/${filename.replace(/^File:/, '').replaceAll(' ', '_')}`;

        response.body.pipe(createWriteStream(imagePath));
        return {
            ...imageData,
            imagePath,
        };
    }));
};

const fetchOneDoc = async (pageTitle, newPath, options) => {
    if (options.debug || process.env.DEBUG) {
        logger.level = 'debug';
    }

    let title = pageTitle;
    if (title.startsWith('https://docs.moodle.org/dev/')) {
        const url = new URL(title);
        title = url.pathname.replace('/dev/', '');
        logger.info(`URL detected. Using a value of ${title}`);
    }

    logger.info(`Fetching ${title} to ${newPath}`);

    const doc = await fetchDoc(title);
    const newFile = getNormalizedPath(newPath);
    const newFileDir = path.dirname(newFile);
    await mkdir(newFileDir, { recursive: true });

    logger.info('Guessing frontmatter');
    let frontMatter = getFrontmatterData(options, title, doc.data);

    // Remove any categories- they were picked up by the frontmatter detector.
    doc.data = doc.data.replaceAll(categoryRegexp, '');

    logger.info('');
    logger.info(getFrontmatter(frontMatter));

    await fetchImagesForDoc(title, newPath, options);

    if (options.interactive) {
        frontMatter = await checkData(frontMatter);
        logger.info(getFrontmatter(frontMatter));
    }

    const pageContent = `${getFrontmatter(frontMatter)}\n${doc.data}`;
    await writeFile(newFile, pageContent);

    const phaseScripts = [
        // Run codeblocks first because many other rules depend on detecting if the content is in code.
        {
            type: 'markdownlint',
            path: '01-codeblocks',
        },

        // Fix noincludes before processing headers and lists.
        {
            type: 'markdownlint',
            path: '10-noinclude',
        },

        // Run lists before headers
        {
            type: 'markdownlint',
            path: '02-lists',
        },
        {
            type: 'markdownlint',
            path: '03-headers',
        },

        // External links before wikilinks.
        {
            type: 'markdownlint',
            path: '04-externallinks',
        },
        {
            type: 'markdownlint',
            path: '05-wikilinks',
        },

        // Replace MDL-\d+ strings with links to the tracker.
        // This replaced the wikimedia filter to do the same.
        {
            type: 'markdownlint',
            path: '06-trackerlinkfilter',
        },

        // Bold must be before italic
        {
            type: 'markdownlint',
            path: '08-bold',
        },
        {
            type: 'markdownlint',
            path: '09-italic',
        },

        // Update tables.
        {
            type: 'script',
            path: '20-tables/migrate-table.mjs',
            args: [
                newFile,
            ],
        },

        // Run a final lint of the global config.
        // Run it twice becuase some changes lead to other changes.
        {
            type: 'markdownlint',
            path: '100-final',
        },
        {
            type: 'markdownlint',
            path: '100-final',
        },
    ];

    if (options.interactive) {
        logger.warn('About to pass through transformation links.');

        await inquirer.prompt([{
            message: 'Press [enter] to continue.',
            name: 'ready',
            default: '',
        }]);
    }

    logger.info('Passing through transformation lints');
    for (const phaseData of phaseScripts) {
        const phasePath = path.resolve(path.join(
            'scripts/migration/phases',
            phaseData.path,
        ));
        logger.info(`=> Running migration phase ${phaseData.path}`);
        if (phaseData.type === 'markdownlint') {
            // Use markdownlint-cli2 to specify these as separate phases.
            // This is necessary because if two rules operate on the same text, then no fix is made.
            // The order of these is important because they often do operate on the same line.
            // For example, we *must* convert all numbered lists before converting markup headers to markdown.
            const phaseScript = path.join(phasePath, '.markdownlint-cli2.cjs');
            logger.debug(`yarn markdownlint-cli2 --config ${phaseScript} ${newFile}`);

            await new Promise((resolve) => {
                exec(`yarn markdownlint-cli2 --config ${phaseScript} ${newFile}`, async (error, stdout, stderr) => {
                    if (error) {
                        logger.warn(
                            `The '${phaseData.path}' conversion reported warnings `
                            + 'that you will need to resolve manually',
                        );
                        logger.warn(stderr);
                        if (options.interactive) {
                            logger.warn('If possible, correct this issue before continuing');

                            await inquirer.prompt([{
                                message: 'Press [enter] to continue.',
                                name: 'ready',
                                default: '',
                            }]);
                        } else {
                            logger.warn('----');
                        }
                    }
                    logger.debug(stdout);
                    resolve();
                });
            });
        }

        if (phaseData.type === 'script') {
            await new Promise((resolve) => {
                exec(`${phasePath} ${phaseData.args.join(' ')}`, async (error, stdout, stderr) => {
                    if (error) {
                        logger.warn(
                            `The '${phaseData.path}' conversion reported warnings `
                            + 'that you will need to resolve manually',
                        );
                        logger.warn(stderr);
                        if (options.interactive) {
                            logger.warn('If possible, correct this issue before continuing');

                            await inquirer.prompt([{
                                message: 'Press [enter] to continue.',
                                name: 'ready',
                                default: '',
                            }]);
                        } else {
                            logger.warn('----');
                        }
                    }
                    logger.debug(stdout);
                    resolve();
                });
            });
        }
    }

    // Update the migratedPages file.
    logger.info('=> Adding to migrated page list');
    addMigratedPage(title.replaceAll(/ /g, '_'), newFile, guessSlug(newFile));

    logger.info('=> Running automated fixes and checks');
    await new Promise((resolve) => {
        exec('yarn fix', async (error, stdout, stderr) => {
            if (error) {
                logger.warn('fix reported warnings that you will need to resolve manually');
                logger.warn(stderr);
                logger.warn('----');
            }
            logger.debug(stdout);
            resolve();
        });
    });
};

program
    .name('wikimedia-fetch')
    .description('CLI to migrate a legacy page from https://docs.moodle.org/dev/')
    .version('1.0.0');

program
    .command('migrate')
    .description('Migrate a document to the new path')
    .arguments('<title>', 'Title of doc to migrate')
    .arguments('<newpath>', 'New path')
    .option('-i, --no-interactive', 'Run without any prompts')
    .option('--title-search [regex]', 'Title RegExp', null)
    .option('--title-replacement [replacement]', 'Title replacement', null)
    .option(
        '--position-regex [regex]',
        'RegExp to apply to the title to obtain a sidebar_position. '
        + 'A named capture with the name \'position\' will be used.',
        null,
    )
    .option('--position [position]', 'A fixed sidebar position to use instead of regex')
    .option('--invert-position', 'Position should be negative')
    .option(
        '--version-regex [regex]',
        'RegExp to apply to the title to obtain a moodleVersion. '
        + 'A named capture with the name \'moodleVersion\' will be used.',
        null,
    )
    .option('--debug')
    .action(fetchOneDoc);

program
    .command('migrate-batch')
    .description('Migrate a batch of docuemnts to a folder')
    .arguments('<prefix>', 'Prefix')
    .arguments('<folder>', 'Target folder')
    .arguments('<filenameRegex>', 'Filename regex')
    .arguments('<filenameReplacement>', 'Filename replacement')
    .option('--title-search [regex]', 'Title RegExp', null)
    .option('--title-replacement [replacement]', 'Title replacement', null)
    .option(
        '--position-regex [regex]',
        'RegExp to apply to the title to obtain a sidebar_position. '
        + 'A named capture with the name \'position\' will be used.',
        null,
    )
    .option('--position [position]', 'A fixed sidebar position to use instead of regex')
    .option('--invert-position', 'Position should be negative')
    .option(
        '--version-regex [regex]',
        'RegExp to apply to the title to obtain a moodleVersion. '
        + 'A named capture with the name \'moodleVersion\' will be used.',
        null,
    )
    .action(async (match, folder, filenameRegex, filenameReplacement, options) => {
        if (options.debug || process.env.DEBUG) {
            logger.level = 'debug';
        }

        const getPagesByPrefix = getGetPagesByPrefix(logger)(client);
        const pages = await getPagesByPrefix(match);
        for (const { title: pageTitle } of pages) {
            const newFileName = pageTitle.replace(new RegExp(filenameRegex), filenameReplacement);
            const pagePath = path.join(folder, newFileName);
            await fetchOneDoc(pageTitle, pagePath, options);
        }
    });

program.parse();
