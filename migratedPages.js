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
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const obsoleteDocs = require('./data/obsoletePages.json');

/**
 * A list of documents which have been migrated with their source and destination paths shown.
 */
/* eslint-disable-next-line no-restricted-properties */
const migratedDocs = yaml.load(fs.readFileSync('./data/migratedPages.yml', 'utf8'));

const isObsolete = (legacyPath) => obsoleteDocs.indexOf(legacyPath) !== -1;

/**
 * Whether the specified path has been migrated.
 *
 * @returns {bool}
 */
const isMigrated = (legacyPath) => (typeof migratedDocs[legacyPath] !== 'undefined');

/**
 * Get the path to the new doc from a legacy doc path.
 *
 * @param legacyPath {string}
 * @returns {string}
 */
const getMigratedDoc = (legacyPath) => {
    if (!isMigrated) {
        return null;
    }

    const filename = migratedDocs[legacyPath].slug;

    if (filename.startsWith('/')) {
        return filename.substr(1);
    }

    return filename;
};

const getAbsoluteDirectory = (relativePath) => {
    const absolutePath = path.join(process.env.PWD, relativePath);
    /* eslint-disable-next-line no-restricted-properties */
    const pathStat = fs.statSync(absolutePath);
    if (pathStat.isFile()) {
        return path.dirname(absolutePath);
    }

    return absolutePath;
};

/**
 * Get the path to the new doc relative to the file it was in.
 *
 * This has to consider whether the file is in the same docs instance or not due to versioning.
 *
 * @param {string} legacyPath
 * @param {string} usedIn
 * @returns {string}
 */
const getMigrationLink = (legacyPath, usedIn) => {
    const replacementFile = getMigratedDoc(legacyPath);
    if (!replacementFile) {
        return null;
    }

    const relativeUsedIn = path.relative(process.env.PWD, usedIn);

    const replacementIsGeneral = replacementFile.startsWith('general/');
    const usedInIsGeneral = relativeUsedIn.startsWith('general/');
    const bothGeneral = replacementIsGeneral && usedInIsGeneral;
    const neitherGeneral = !replacementIsGeneral && !usedInIsGeneral;

    if (bothGeneral || neitherGeneral) {
        const absRelativeUsedIn = getAbsoluteDirectory(relativeUsedIn);
        const absReplacementFile = path.join(process.env.PWD, replacementFile);
        const relativeLink = path.relative(absRelativeUsedIn, absReplacementFile);

        if (relativeLink.startsWith('.')) {
            return relativeLink;
        }
        return `./${relativeLink}`;
    }

    if (replacementFile.endsWith('index.md')) {
        return `/${replacementFile.replace(/\/index\.md$/, '')}`;
    }

    if (replacementFile.endsWith('.md')) {
        return `/${replacementFile.replace(/\.md$/, '')}`;
    }

    return `/${replacementFile}`;
};

module.exports = {
    isMigrated,
    isObsolete,
    getMigrationLink,
};
