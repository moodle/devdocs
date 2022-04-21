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
const { program } = require('commander');
const { readFile, writeFile } = require('fs/promises');

const remoteHost = 'docs.moodle.org/dev';

const {
    getGetPagesTranscluding,
    getLogger,
    getLogIn,
    getClient,
    getObsoletePagePath,
    getUpdateMigratedPages,
} = require('./utils');

program
    .name('wikimedia-sync')
    .description('CLI tool to sync data with https://docs.moodle.org/dev/')
    .version('1.0.0');

const logger = getLogger();
const client = getClient(remoteHost);

const getPagesTranscluding = getGetPagesTranscluding(logger)(client);
const logIn = getLogIn(logger)(client);

program
    .command('push-migrated')
    .description('Update the list of migrated pages on the remote WikiMedia site')
    .option('-d, --debug', 'Add debugging logging')
    .action(async (options) => {
        if (options.debug || process.env.DEBUG) {
            logger.level = 'debug';
        }

        const updateMigratedPages = getUpdateMigratedPages(logger)(client);

        logger.info('Logging in');
        try {
            await logIn();
        } catch (err) {
            logger.error(err.message);
            logger.debug(err);
            process.exit(1);
        }

        logger.info('Starting update of migrated pages in remote site');
        await updateMigratedPages();
        logger.info('Run completed');
    });

program
    .command('fetch-obsolete')
    .description('Fetch the list of obsolete pages from Wikimedia')
    .option('-d, --debug', 'Add debugging logging')
    .action(async (options) => {
        if (options.debug || process.env.DEBUG) {
            logger.level = 'debug';
        }
        const fetchObsoletePageData = async () => {
            logger.info('Reading list of current obsolete files');
            const obsoletePagePath = getObsoletePagePath();
            const currentPageTitlesJSON = await readFile(obsoletePagePath);
            const currentPageTitles = JSON.parse(currentPageTitlesJSON);
            logger.info(`=> Found ${currentPageTitles.length} entries`);

            logger.info('Fetching list of obsolete pages');
            const updatesPageTitles = (await getPagesTranscluding('Template:obsolete')).sort();
            logger.info(`=> Found ${updatesPageTitles.length} entries`);

            const updatesPageTitlesJSON = JSON.stringify(updatesPageTitles, null, '  ');
            if (updatesPageTitlesJSON === currentPageTitlesJSON) {
                logger('==> No changes to fetch - skipping');
            } else {
                logger.info('==> Changes detected. Updating stored copy');
                writeFile(obsoletePagePath, updatesPageTitlesJSON);
            }
        };

        logger.info('Fetching the list of obsolete pages');
        await fetchObsoletePageData();
        logger.info('Run completed');
    });

program.parse();
