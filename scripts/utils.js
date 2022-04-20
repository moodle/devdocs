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

const Bot = require('nodemw'); // cspell:ignore nodemw
const path = require('path');
const winston = require('winston');
const yaml = require('js-yaml');
const { readFile, writeFile } = require('fs/promises');

/**
 * Get the fetchDoc function with a logger and client applied.
 *
 * @param {winston} logger
 * @param {Bot} client
 * @param {string} pageTitle
 * @returns {Promise}
 */
const getFetchDoc = (logger) => (client) => (pageTitle) => new Promise((resolve, reject) => {
    logger.debug(`Fetching article with title ${pageTitle}`);
    client.getArticle(pageTitle, (err, data) => {
        if (err) {
            reject(err);
        }

        resolve({
            pageTitle,
            data,
        });
    });
});

const getGetMigratedPageIds = (logger) => (client) => async (pageTitle) => {
    const articleData = await getFetchDoc(logger)(client)(pageTitle);

    const docRegexp = /\{\{Template:Migrated\|newDocId=(?<newDocId>[^}]*)\}\}/g;

    articleData.newDocIds = Array.from(articleData.data.matchAll(docRegexp))
        .map((result) => result.groups.newDocId)
        .filter((result) => !!result);

    return articleData;
};

const getClient = (remoteHost) => new Bot({
    protocol: 'https',
    server: remoteHost,
    debug: !!process.env.WIKIMEDIA_DEBUG,
    username: process.env.WIKIMEDIA_USER,
    password: process.env.WIKIMEDIA_SECRET,
});

const getLogger = () => winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

/**
 * Get all pages which transclude the named template.
 *
 * @param {String} templateName
 * @returns {<Promise>String[]}
 */
const getGetPagesTranscluding = (logger) => (client) => (templateName) => new Promise((resolve, reject) => {
    logger.info(`Fetching all pages which transclude ${templateName}`);
    client.getPagesTranscluding(templateName, (err, data) => {
        if (err) {
            reject(new Error(err));
        }
        resolve(data.map((pageData) => pageData.title));
    });
});

const getLogIn = (logger) => (client) => async () => new Promise((resolve, reject) => {
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

const getNormalizedPath = (...subPath) => path.normalize(path.join(__dirname, '../', ...subPath));

/**
 * Get the path used to store obsolete page data.
 *
 * @returns {String}
 */
const getObsoletePagePath = () => getNormalizedPath('data', 'obsoletePages.json');

/**
 * Get the path used to store migrated page data.
 *
 * @returns {String}
 */
const getMigrationPagePath = () => getNormalizedPath('data', 'migratedPages.yml');

/**
 * Update the migrated page docs in Wikimedia.
 */
const getUpdateMigratedPages = (logger) => (client) => async () => {
    const getDocIdList = (newDocIds) => {
        if (Array.isArray(newDocIds)) {
            return newDocIds.map((newDoc) => newDoc.slug);
        }

        return [newDocIds.slug];
    };

    const getCurrentMigratedIdsForPage = (pageTitle) => getGetMigratedPageIds(logger)(client)(pageTitle);

    const migratedPageData = yaml.load(await readFile(getMigrationPagePath(), 'utf8'));

    for (const [legacyPage, newPages] of Object.entries(migratedPageData)) {
        logger.info(`=> Checking ${legacyPage}`);
        const newDocIds = getDocIdList(newPages);

        const migratedDocData = (await getCurrentMigratedIdsForPage(legacyPage));
        const docIds = migratedDocData.newDocIds.sort();

        if (JSON.stringify(docIds) === JSON.stringify(newDocIds)) {
            logger.info(`==> No changes (${docIds.join(', ')})`);
        } else {
            logger.info(`==> Updating ${legacyPage}`);
            logger.info(`===> Current docIds are: ${docIds.join(', ')}`);
            logger.info(`===> Setting docIds of ${newDocIds.join(', ')}`);
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

const guessSlug = (filePath) => {
    const normalisedPath = path.join('/', path.relative(process.env.PWD, filePath));

    if (normalisedPath.endsWith('/index.md')) {
        return normalisedPath.replace(/\/index.md$/, '/');
    }

    return normalisedPath.replace(/\.md$/, '');
};

const addMigratedPage = async (legacyPath, filePath, slug) => {
    const migratedPageData = yaml.load(await readFile(getMigrationPagePath(), 'utf8'));
    migratedPageData[legacyPath] = [{
        filePath: path.join('/', path.relative(process.env.PWD, filePath)),
        slug,
    }];

    const updatedPageData = Object.fromEntries(Array.from(Object.entries(migratedPageData)).sort());

    await writeFile(getMigrationPagePath(), yaml.dump(updatedPageData, {
        noArrayIndent: true,
        forceQuotes: true,
        quotingType: '"',
    }), 'utf8');
};

module.exports = {
    addMigratedPage,
    getClient,
    getFetchDoc,
    getGetMigratedPageIds,
    getGetPagesTranscluding,
    getLogIn,
    getLogger,
    getMigrationPagePath,
    getObsoletePagePath,
    getNormalizedPath,
    getUpdateMigratedPages,
    guessSlug,
};
