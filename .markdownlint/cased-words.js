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
    addError,
    forEachLine,
    getLineMetadata,
    codeBlockAndSpanRanges,
    overlapsAnyRange,
} = require('markdownlint-rule-helpers');

const linkSearch = /(?<markdownLink>\[[^\]]*\](?<link>\([^)]*\)))/g;

const getAllLinkLocation = (line) => {
    const linkLocations = [];
    let searchResult = linkSearch.exec(line);
    if (!searchResult) {
        return linkLocations;
    }
    do {
        const start = searchResult.index + searchResult.groups.markdownLink.indexOf(searchResult.groups.link);
        linkLocations.push({
            start,
            end: start + searchResult.groups.markdownLink.length,
        });
        searchResult = linkSearch.exec(line);
    } while (searchResult);

    return linkLocations;
};

const isTextInLink = (line, location) => {
    const linkLocations = getAllLinkLocation(line);
    return linkLocations.some(({ start, end }) => (location > start && location < end));
};

module.exports = {
    names: ['casedWords'],
    description: 'Ensure that words are cased correctly',
    tags: ['migration'],
    function: function casedWords(params, onError) {
        const searchFor = new RegExp(`(?<word>(${Object.keys(params.config.words).join('|')}))`, 'gi');

        const lineMetadata = getLineMetadata(params);
        const exclusions = codeBlockAndSpanRanges(params, lineMetadata);

        forEachLine(lineMetadata, (line, lineIndex, inCode) => {
            if (inCode || line.startsWith('```')) {
                // Do not make changes to code stanzas.
                return;
            }

            const lineNumber = lineIndex + 1;
            let match = null;

            // eslint-disable-next-line no-cond-assign
            while (!inCode && ((match = searchFor.exec(line)) !== null)) {
                const { word } = match.groups;

                const insertText = params.config.words[word.toLowerCase()];
                if (word === insertText) {
                    continue;
                }

                if (overlapsAnyRange(exclusions, lineIndex, match.index, match[0].length)) {
                    continue;
                }

                if (isTextInLink(line, match.index)) {
                    // Don't touch anything in a link.
                    continue;
                }

                const fixInfo = {
                    editColumn: match.index + 1,
                    deleteCount: word.length,
                    insertText,
                };

                addError(
                    onError,
                    lineNumber,
                    word,
                    word,
                    [match.index + 1, word.length],
                    fixInfo,
                );
            }
        });
    },
};
