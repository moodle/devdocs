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

const {
    addErrorDetailIf,
    forEachLine,
    getLineMetadata,
} = require('markdownlint-rule-helpers');

const replaceExternalLinks = (line, lineNumber, onError) => {
    const linkSearch = /(?<markuplink>\[(?<link>[^\]]*)\](?!\())/g;

    let matches = linkSearch.exec(line);
    if (!matches) {
        return;
    }
    do {
        if (!matches.groups.markuplink.startsWith('[[')) {
            const foundWikilink = matches.groups.markuplink;
            const [link, ...descriptionParts] = matches.groups.link.split(' ');
            const description = descriptionParts ? descriptionParts.join(' ') : link;
            const column = matches.index + 1;
            const replacement = `[${description}](${link})`;
            const fixInfo = {
                editColumn: column,
                deleteCount: matches.groups.markuplink.length,
                insertText: replacement,
            };

            addErrorDetailIf(
                onError,
                lineNumber,
                replacement,
                foundWikilink,
                null,
                line,
                [matches.index + 1, matches.groups.markuplink.length],
                fixInfo,
            );
        }
        matches = linkSearch.exec(line);
    } while (matches !== null);
};

module.exports = {
    names: ['convert-markup-externallinks'],
    description: 'Do not allow use of MediaWiki [external links]',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                // Do not make changes to code stanzas.
                return;
            }

            const lineNumber = lineIndex + 1;
            replaceExternalLinks(line, lineNumber, onError);
        });
    },
};
