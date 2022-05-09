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
const yaml = require('js-yaml');
const { exec } = require('child_process');
const { program } = require('commander');
const { writeFile } = require('fs/promises');

// eslint-disable-next-line import/no-extraneous-dependencies
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
            '01-codeblocks',

            // Run lists before headers
            '02-lists',
            '03-headers',

            // External links before wikilinks.
            '04-externallinks',
            '05-wikilinks',

            // Bold must be before italic
            '08-bold',
            '09-italic',

            // Run a final lint of the global config.
            // Run it twice becuase some changes lead to other changes.
            '100-final',
            '100-final',
        ];

        logger.info('Passing through transformation lints');
        for (const phaseName of phaseScripts) {
            // Use markdownlint-cli2-config to specify these as separate phases.
            // This is necessary because if two rules operate on the same text, then no fix is made.
            // The order of these is important because they often do operate on the same line.
            // For example, we *must* convert all numbered lists before converting markup headers to markdown.
            const phaseScript = getNormalizedPath(`scripts/migration/phases/${phaseName}/.markdownlint-cli2.cjs`);
            logger.info(`=> Running migration phase ${phaseName}`);
            logger.debug(`yarn markdownlint-cli2-config ${phaseScript} ${newFile}`);

            await new Promise((resolve) => {
                exec(`yarn markdownlint-cli2-config ${phaseScript} ${newFile}`, async (error, stdout, stderr) => {
                    if (error) {
                        logger.warn(
                            `The '${phaseName}' conversion reported warnings that you will need to resolve manually`,
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

        // Update the migratedPages file.
        logger.info('=> Adding to migrated page list');
        addMigratedPage(title.replaceAll(/ /g, '_'), newFile, guessSlug(newFile));
    });

program.parse();
