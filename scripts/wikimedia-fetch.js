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

/* eslint-disable import/no-extraneous-dependencies */
const unified = require('unified');
const parse = require('remark-parse');
const legacyDocLinks = require('../src/lib/legacyDocLinks');
const VFile = require('vfile');
const rehype2remark = require('rehype-remark');
const stringify = require('remark-stringify');

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

const getFrontpage = (title, content) => {
    const data = {
        title: title.replaceAll('_', ' '),
        tags: [],
    };

    const categoryRegexp = /\[\[Category:(?<categoryName>[^\]]*)\]\]/g;
    data.tags = Array.from(content.matchAll(categoryRegexp))
        .map((result) => result.groups.categoryName.replace(/\|.*$/, ''))
        .filter((result) => !!result);

    const frontpageMatter = yaml.dump(data);

    return `---
${frontpageMatter}---`;
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
    .action(async (title, newPath) => {
        const doc = await fetchDoc(title);

        const frontpageMatter = getFrontpage(title, doc.data);

        const regexedData = doc.data
            // Convert ordered lists to numbered ordered lists.
            .replaceAll(/^###/gm, '      1. ')
            .replaceAll(/^##/gm, '   1. ')
            .replaceAll(/^#/gm, '1. ')

            // Remove duplicate spaces after the ordered list number.
            .replaceAll(/^(?<li>\d)+. {2}/gm, '$1. ')

            // Convert bullet lists to -.
            .replaceAll(/^\* +/gm, '- ')

            // Convert heading in reverse order.
            .replaceAll(/^==== ?(?<heading>[^=]+)====/gm, '#### $1')
            .replaceAll(/^=== ?(?<heading>[^=]+)===/gm, '### $1')
            .replaceAll(/^== ?(?<heading>[^=]+)==/gm, '## $1')

            // Convert Wikimedia bold to markdown strong.
            .replaceAll(/'''(?<value>[^']*)'''/g, '**$1**')

            // Convert Wikimedia italic to markdown emphasis.
            .replaceAll(/''(?<value>[^']*)''/g, '__$1__')

            // Convert code blocks to a fenced codeblock.
            .replaceAll(/^<syntaxhighlight lang="(?<language>[^"]*)">/gm, '```$1')
            .replaceAll(/^<\/syntaxhighlight>/gm, '```')

            // Remove trailing whitespace.
            .replace(/ *$/m, '')
            .replaceAll(/^\[\[Category:.*$/gm, '')
        ; // eslint-disable-line semi-style

        const newFile = getNormalizedPath(newPath);

        // Write it initially as some of the remark plugins use the absolute path.
        writeFile(newFile, regexedData);

        // This section uses remark to convert the file to an AST tree and then pass it through some of the remark
        // plugins.
        // This allows us to do things like convert tracker links, update legacy doc links, and warn of obsolete doc
        // links.
        const vFile = new VFile({
            path: newFile,
            value: regexedData,
        });

        const tree = unified()
            .use(parse)
            .parse(regexedData);

        legacyDocLinks.updateMarkdown(tree, vFile);

        const remarkedContent = unified()
            .use(rehype2remark)
            .use(stringify, {
                bullet: '-',
                fence: '`',
                fences: true,
            })
            .stringify(tree)

            // Unescape \[[ to [[. This is markdown trying to parse our weird and wonderful wiki links.
            .replaceAll('\\[[', '[[')

            // Convert any non-interwiki link `[link this is a description]` into a markdown link.
            // Basically:
            // - `/\[*?!\[)`        look for any `[` which is not followed by another `[`.
            //                      This excludes any Wiki links which start with [[.
            // - `([^ ]+)( )`       The first capture is any character which is not a space, followed by a space.
            //                      This is the link and a pointless second capture to work around super lineal
            //                      backtracking exploits.
            // - `([^\]]+)\](?!\])` The third capture group is any character which is not a `]` followed by another `]`
            // - `(?![([])/`        And which matches a negative lookahead for either a `(` or a `[` chracter.
            //                      These are used in some cases for other links - e.g. [Existing desc](link) or
            //                      [Thumbnail][Description].
            // eslint-disable-next-line prefer-named-capture-group
            .replaceAll(/\[(?!\[)([^ ]+)( )([^\]]+)\](?!\])(?![([])/g, '[$3]($1)')
        ; // eslint-disable-line semi-style

        const pageContent = `${frontpageMatter}\n${remarkedContent}`;
        writeFile(newFile, pageContent);

        // Execute the lint twice as the first time seems to be able to introduce things which can then be fixed in a
        // second run.
        exec(`yarn markdownlint --fix ${newFile}`);
        exec(`yarn markdownlint --fix ${newFile}`);

        // Update the migratedPages file.
        addMigratedPage(title.replaceAll(/ /g, '_'), newFile, guessSlug(newFile));
    });
program.parse();
