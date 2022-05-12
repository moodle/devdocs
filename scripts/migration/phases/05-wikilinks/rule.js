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

const getWikilinkLink = (matches) => {
    const [link] = matches.groups.link.split('|');

    return link
        .replaceAll(' ', '_');
};

const getWikilinkDescription = (matches) => {
    const [link, description] = matches.groups.link.split('|');

    const value = description || link;

    return value
        .replaceAll('_', ' ');
};

const replaceWikiLinks = (line, lineNumber, onError) => {
    const linkSearch = /(?<wikilink>\[\[(?<link>[^\]]*)\]\])/g;
    let matches = linkSearch.exec(line);
    if (!matches) {
        return;
    }
    do {
        const foundWikilink = matches.groups.wikilink;
        const link = getWikilinkLink(matches);
        const description = getWikilinkDescription(matches);
        const column = matches.index + 1;
        const replacement = `[${description}](https://docs.moodle.org/dev/${link})`;
        const fixInfo = {
            editColumn: column,
            deleteCount: matches.groups.link.length + 4,
            insertText: replacement,
        };

        addErrorDetailIf(
            onError,
            lineNumber,
            replacement,
            foundWikilink,
            null,
            line,
            [matches.index + 1, matches.groups.wikilink.length],
            fixInfo,
        );
        matches = linkSearch.exec(line);
    } while (matches !== null);
};

module.exports = {
    names: ['convert-markup-wikilinks'],
    description: 'Do not allow use of MediaWiki [[wikilinks]]',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                // Do not make changes to code stanzas.
                return;
            }

            const lineNumber = lineIndex + 1;
            replaceWikiLinks(line, lineNumber, onError);
        });
    },
};
