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
} = require('markdownlint-rule-helpers');

// Track these link types.
const trackerIssueTypes = [
    'MDL-', // Moodle project.
    'MDLQA-', // QA Testing.
    'MDLSITE-', // Community sites.
    'MDLUX-', // UX issues for the Moodle project.
    'MOBILE-', // Mobile issues.
    'MUA-', // Moodle Users Association.
    'UX-', // UX issues.
];

const issueTypes = trackerIssueTypes.join('|');
const expression = new RegExp(`(?<issueNumber>(?:${issueTypes})\\d+)`, 'g');
const linkSearch = /(?<markdownLink>\[[^\]]*\]\([^)]*\))/g;

const getAllLinkLocation = (line) => {
    const linkLocations = [];
    let searchResult = linkSearch.exec(line);
    if (!searchResult) {
        return linkLocations;
    }
    do {
        linkLocations.push({
            start: searchResult.index,
            end: searchResult.index + searchResult.groups.markdownLink.length,
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
    names: ['convert-MDL-links'],
    description: 'Convert plain text matching the old tracker filter to Tracker links',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                // Don't touch links in code blocks.
                return;
            }

            const lineNumber = lineIndex + 1;

            let matches = expression.exec(line);
            if (!matches) {
                return;
            }

            do {
                const { issueNumber } = matches.groups;

                if (isTextInLink(line, matches.index)) {
                    // Don't touch issue numbers which are already in links.
                    return;
                }

                const fixInfo = {
                    editColumn: matches.index + 1,
                    deleteCount: issueNumber.length,
                    insertText: `[${issueNumber}](https://tracker.moodle.org/browse/${issueNumber})`,
                };

                addError(
                    onError,
                    lineNumber,
                    issueNumber,
                    fixInfo.insertText,
                    [matches.index + 1, issueNumber.length],
                    fixInfo,
                );

                matches = expression.exec(line);
            } while (matches !== null);
        });
    },
};
