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
const yaml = require('js-yaml');
const path = require('path');
const { exec } = require('child_process');
const { program } = require('commander');
const { writeFile } = require('fs/promises');
const inquirer = require('inquirer');

const {
    getFetchDoc,
    getClient,
    getLogger,
    getNormalizedPath,
    addMigratedPage,
    guessSlug,
} = require('./utils');

const remoteHost = 'docs.moodle.org/dev';

const client = getClient(remoteHost);
const logger = getLogger();
const fetchDoc = getFetchDoc(logger)(client);

// This regular expression matches any Wikimedia Category tag taking the entire line.
// const categoryRegexp = /^\[\[Category:(?<categoryName>.+?)\]\]$/g;
const categoryRegexp = /\[\[Category:(?<categoryName>[^\]]*)\]\]/g;
const getFrontmatterData = (title, content) => {
    const data = {
        title: title.replaceAll('_', ' '),
        tags: [],
    };

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
    .action(async (title, newPath, options) => {
        logger.info(`Fetching ${title} to ${newPath}`);

        const doc = await fetchDoc(title);
        const newFile = getNormalizedPath(newPath);

        logger.info('Guessing frontmatter');
        let frontMatter = getFrontmatterData(title, doc.data);

        // Remove any categories- they were picked up by the frontmatter detector.
        doc.data = doc.data.replaceAll(categoryRegexp, '');

        logger.info('');
        logger.info(getFrontmatter(frontMatter));

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

        logger.info('Passing through transformation lints');
        for (const phaseData of phaseScripts) {
            const phasePath = path.resolve(path.join(
                'scripts/migration/phases',
                phaseData.path,
            ));
            logger.info(`=> Running migration phase ${phaseData.path}`);
            if (phaseData.type === 'markdownlint') {
                // Use markdownlint-cli2-config to specify these as separate phases.
                // This is necessary because if two rules operate on the same text, then no fix is made.
                // The order of these is important because they often do operate on the same line.
                // For example, we *must* convert all numbered lists before converting markup headers to markdown.
                const phaseScript = path.join(phasePath, '.markdownlint-cli2.cjs');
                logger.debug(`yarn markdownlint-cli2-config ${phaseScript} ${newFile}`);

                await new Promise((resolve) => {
                    exec(`yarn markdownlint-cli2-config ${phaseScript} ${newFile}`, async (error, stdout, stderr) => {
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
    });

program.parse();
