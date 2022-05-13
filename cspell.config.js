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

const fs = require('fs');
const path = require('path');

const config = {
    version: 0.2,
    gitignoreRoot: '.',
    useGitignore: true,
    dictionaries: [
        'en',
        'en-gb',
        'css',
        'html',
        'fonts',
        'typescript',
        'softwareTerms',
        'companies',
        'lorem-ipsum',
        'moodle-components',
        'moodle-contributors',
        'project-words',
    ],
    dictionaryDefinitions: [
        {
            name: 'moodle-components',
            path: './data/component-spelling.txt',
            noSuggest: true,
        },
        {
            name: 'moodle-contributors',
            path: './data/moodle-contributors.txt',
            noSuggest: true,
        },
        {
            name: 'project-words',
            path: './project-words.txt',
            noSuggest: true,
        },
    ],
    ignorePaths: [
        '*.js',
        '*.mjs',
        'CHANGELOG.md',
        'package.json',
        'yarn.lock',
        'project-words.txt',
        'versioned_docs',
        '*.min.*',
        'src/*',

        // Ignore release notes for now.
        'docs/release-notes.md',
    ],
    ignoreRegExpList: [
        // Both Email and Urls are in the list of Predefined regexps.
        'Email',
        'Urls',

        // Ignore Code blocks in ```multiline backticks```.
        '/^\\s*```[\\s\\S]*?^\\s*```/gm',

        // Ignore inline code blocks in `single backticks`.
        '/`[^`]*`/g',

        // Links to the legacy documentation are ignored.
        // These are in the format [[<LINK>]].
        '\\[\\[.*\\]\\]',

        // Ignore relative paths in markdown links.
        '/\\]([^)]*)/gm',
    ],
};

// Add the content of any .git/info/exclude file too.
const addGitIgnoreFile = (gitignore) => {
    /* eslint-disable no-restricted-properties */
    const relPath = path.join(process.env.PWD, gitignore);
    if (!fs.statSync(relPath, { throwIfNoEntry: false })) {
        return [];
    }

    const content = fs.readFileSync(relPath, { encoding: 'utf-8' });
    return content.split('\n').filter((glob) => !glob.startsWith('#')).filter((val) => val);
    /* eslint-enable */
};

config.ignorePaths = config.ignorePaths.concat(addGitIgnoreFile('.git/info/exclude'));

module.exports = config;
