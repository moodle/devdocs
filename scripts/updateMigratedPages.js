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
const remoteHost = 'docs.moodle.org/dev';

const Bot = require('nodemw');
const winston = require('winston');
const { writeFile, readFile } = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');

// Create a logger.
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

/**
 * Get the path used to store obsolete page data.
 *
 * @returns {String}
 */
const getObsoletePagePath = () => path.normalize(path.join(__dirname, '../data/', 'obsoletePages.json'));

/**
 * Get the path used to store migrated page data.
 *
 * @returns {String}
 */
const getMigrationPagePath = () => path.normalize(path.join(__dirname, '../data/', 'migratedPages.yml'));

// Fetch the Wikimedia client.
const client = new Bot({
    protocol: 'https',
    server: remoteHost,
    debug: !!process.env.WIKIMEDIA_DEBUG,
    username: process.env.WIKIMEDIA_USER,
    password: process.env.WIKIMEDIA_SECRET,
});

/**
 * Get all pages which transclude the named template.
 *
 * @param {String} templateName
 * @returns {<Promise>String[]}
 */
const getPagesTranscluding = (templateName) => new Promise((resolve, reject) => {
    logger.info(`Fetching all pages which transclude ${templateName}`);
    client.getPagesTranscluding(templateName, (err, data) => {
        if (err) {
            reject(new Error(err));
        }
        resolve(data.map((pageData) => pageData.title));
    });
});

/**
 * Get the current list of template values with a newDocId.
 *
 * @param {String} pageTitle
 * @returns {<Promise>Object}
 */
const getCurrentMigratedIdsForPage = (pageTitle) => new Promise((resolve, reject) => {
    client.getArticle(pageTitle, (err, data) => {
        if (err) {
            reject(err);
        }

        const newDocIds = Array.from(data.matchAll(/\{\{Template:Migrated\|newDocId=(?<newDocId>[^}]*)\}\}/g))
            .map((result) => result.groups.newDocId)
            .filter((result) => !!result);
        resolve({
            pageTitle,
            data,
            newDocIds,
        });
    });
});

/**
 * Fetch the obsolete page data from the wiki and store it to the obsolete page path.
 */
const fetchObsoletePageData = async () => {
    const pageTitles = (await getPagesTranscluding('Template:obsolete')).sort();
    const jsonPageTitles = JSON.stringify(pageTitles, null, '  ');

    return writeFile(getObsoletePagePath(), jsonPageTitles);
};

/**
 * Update the migrated page docs in Wikimedia.
 */
const updateMigratedPages = async () => {
    const getDocIdList = (newDocIds) => {
        if (Array.isArray(newDocIds)) {
            return newDocIds.map((newDoc) => newDoc.slug);
        }

        return [newDocIds.slug];
    };

    const migratedPageData = yaml.load(await readFile(getMigrationPagePath(), 'utf8'));

    for (const [legacyPage, newPages] of Object.entries(migratedPageData)) {
        const newDocIds = getDocIdList(newPages);

        const migratedDocData = (await getCurrentMigratedIdsForPage(legacyPage));
        const docIds = migratedDocData.newDocIds.sort();

        if (JSON.stringify(docIds) !== JSON.stringify(newDocIds)) {
            logger.info(`=> Updating ${legacyPage}`);
            logger.info(`==> Current docIds are: ${docIds.join(', ')}`);
            logger.info(`==> Setting docIds of ${newDocIds.join(', ')}`);
            const newTemplates = newDocIds.map((newDocId) => `{{Template:Migrated|newDocId=${newDocId}}}\n`).join('');

            const newContent = newTemplates + migratedDocData.data.replaceAll(
                /\{\{Template:Migrated[^}]*\}\}/g,
                '',
            ).trimStart();
            client.edit(
                legacyPage,
                newContent,
                'Update migration status and path',
                true,
                (err, data) => {
                    if (err) {
                        throw err;
                    }
                    logger.info(`===> Updated ${legacyPage} to ${data.newrevid}`);
                },
            );
        }
    }
};

const logIn = async () => new Promise((resolve, reject) => {
    if (!process.env.WIKIMEDIA_SECRET) {
        reject(new Error('No credentials to log in with'));
        return;
    }
    client.logIn((err, data) => {
        if (err) {
            reject(err);
        }

        if (data.result !== 'Success') {
            reject(new Error('Unknown log in failure'));
        }

        client.whoami((whoAmIErr, whoAmI) => {
            if (whoAmIErr) {
                reject(new Error(whoAmIErr));
            }

            logger.warn(`Logged in as ${whoAmI.name}`);
            resolve(data);
        });
    });
});

const runUpdates = async () => {
    try {
        await logIn();
        updateMigratedPages();
    } catch (err) {
        logger.warn(`Not attempting to login: ${err}`);
    }

    fetchObsoletePageData();
};

logger.info('Starting run');
runUpdates();
logger.info('Run completed');
