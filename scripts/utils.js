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

const getGetPagesByPrefix = (logger) => (client) => (prefix) => new Promise((resolve, reject) => {
    logger.debug(`Fetching all articles with prefix ${prefix}`);
    client.getPagesByPrefix(prefix, (err, data) => {
        if (err) {
            reject(err);
        }

        resolve(data);
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

const getGetPageProtectionState = (logger) => (client) => async (pageTitle) => {
    logger.debug(`===> Fetching protection state for ${pageTitle}`);
    const options = {
        inprop: [
            'protection',
        ],
    };
    return new Promise((resolve, reject) => {
        client.getArticleInfo([pageTitle], options, (err, [data]) => {
            if (err) {
                reject(err);
            }
            resolve({
                pageTitle,
                data,
            });
        });
    });
};

const getProtectPage = (logger) => (client) => async (pageTitle, protections, options) => {
    logger.debug(`===> Setting protection state for ${pageTitle} to ${protections}`);

    return new Promise((resolve, reject) => {
        client.protect(pageTitle, protections, options, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve({
                pageTitle,
                data,
            });
        });
    });
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

const getGetImageInfo = (logger) => (client) => (filename) => new Promise((resolve, reject) => {
    logger.info(`Fetching image info for ${filename}`);
    client.getImageInfo(filename, (err, data) => {
        if (err) {
            reject(new Error(err));
        }
        resolve(data);
    });
});

const getGetImagesFromArticle = (logger) => (client) => (title) => new Promise((resolve, reject) => {
    logger.info(`Fetching images forpage ${title}`);
    client.getImagesFromArticle(title, (err, data) => {
        if (err) {
            reject(new Error(err));
        }
        resolve(data);
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

const getUpdateMigratedPagesProtection = (logger) => (client) => async () => {
    const migratedPageData = yaml.load(await readFile(getMigrationPagePath(), 'utf8'));

    const getPageProtectionState = (pageTitle) => getGetPageProtectionState(logger)(client)(pageTitle);
    const protectPage = (pageTitle, protections, reason) => getProtectPage(logger)(client)(
        pageTitle,
        protections,
        {
            // This is a bot. It does not need to subscribe.
            watchlist: 'nochange',
            reason,
        },
    );

    /**
     * Get the intended protection for the current page, modifying the 'edit' level to sysop.
     * Other protections will be preserved.
     * If an existing protection exists for edit=sysop, then it will only be modified if the expiry must be updated.
     * If no change are required, none will be made.
     *
     * @param {object[]} current
     * @returns {object}
     */
    const getTargetProtection = (current) => {
        // There are synonyms for 'infinite' which can be returned by the API.
        const infiniteNames = [
            'never',
            'infinite',
            'indefinite',
            'infinity',
        ];

        const protectionValue = {
            type: 'edit',
            level: 'sysop',
            expiry: 'infinite',
        };

        let isProtected = false;
        let changed = false;
        if (!Array.isArray(current)) {
            return {
                changed: true,
                protection: [protectionValue],
            };
        }

        const protection = current.map((protectionItem) => {
            if (protectionItem.type !== 'edit') {
                return protectionItem;
            }

            if (protectionItem.level !== 'sysop') {
                protectionItem.level = 'sysop';
                changed = true;
            }

            if (infiniteNames.indexOf(protectionItem.expiry) === -1) {
                protectionItem.expiry = 'infinite';
                changed = true;
            }

            isProtected = true;

            return protectionItem;
        });

        if (!isProtected) {
            changed = true;
            protection.push(protectionValue);
        }

        return {
            protection,
            changed,
        };
    };

    for (const [legacyPage] of Object.entries(migratedPageData)) {
        logger.debug(`=> Checking ${legacyPage}`);

        const [
            protectionState,
        ] = await Promise.all([
            getPageProtectionState(legacyPage),
        ]);

        const protectionReason = 'Developer Docs Migration';
        const { protection, changed } = getTargetProtection(protectionState.data.protection);
        if (changed) {
            logger.info(`==> Updating page protection for ${legacyPage}`);
            protectPage(legacyPage, protection, protectionReason)
                .then(() => {
                    logger.debug(`===> Updated ${legacyPage}`);
                })
                .catch((...err) => {
                    logger.error(err);
                });
        } else {
            logger.debug(`===> No need to update protection for ${legacyPage}`);
        }
    }
};

/**
 * Update the migrated page docs in Wikimedia.
 */
const getUpdateMigratedPages = (logger) => (client) => async () => {
    const migratedPageData = yaml.load(await readFile(getMigrationPagePath(), 'utf8'));

    const getDocIdList = (newDocIds) => {
        if (Array.isArray(newDocIds)) {
            return newDocIds.map((newDoc) => newDoc.slug);
        }

        return [newDocIds.slug];
    };

    const getCurrentMigratedIdsForPage = (pageTitle) => getGetMigratedPageIds(logger)(client)(pageTitle);

    for (const [legacyPage, newPages] of Object.entries(migratedPageData)) {
        logger.debug(`=> Checking ${legacyPage}`);
        const newDocIds = getDocIdList(newPages);

        const migratedDocData = await getCurrentMigratedIdsForPage(legacyPage);
        const docIds = migratedDocData.newDocIds.sort();

        if (JSON.stringify(docIds) === JSON.stringify(newDocIds)) {
            logger.debug(`==> No changes for ${legacyPage} (${docIds.join(', ')})`);
        } else {
            logger.debug(`===> Current docIds for ${legacyPage} are: ${docIds.join(', ')}`);
            logger.info(`===> Setting docIds for ${legacyPage} to: ${newDocIds.join(', ')}`);
            const newTemplates = newDocIds.map((newDocId) => `{{Template:Migrated|newDocId=${newDocId}}}\n`).join('');

            const newContent = newTemplates + migratedDocData.data.replaceAll(
                /\{\{Template:Migrated[^}]*\}\}/g,
                '',
            ).trimStart();
            client.edit(
                legacyPage,
                newContent,
                'Update migration status and path',

                // This is a major edit. minor = false.
                false,
                (err, data) => {
                    if (err) {
                        throw err;
                    }
                    logger.debug(`===> Updated ${legacyPage} to ${data.newrevid}`);
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
    getGetImagesFromArticle,
    getGetImageInfo,
    getGetPagesTranscluding,
    getLogIn,
    getLogger,
    getMigrationPagePath,
    getObsoletePagePath,
    getNormalizedPath,
    getGetPagesByPrefix,
    getUpdateMigratedPages,
    getUpdateMigratedPagesProtection,
    guessSlug,
};
