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

const markupHeader = /^(?<marker>=+)(?<header>[^=].*)$/;

module.exports = {
    names: ['convert-markup-headers'],
    description: 'Convert markup headers to markdown syntax',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                return;
            }

            const lineNumber = lineIndex + 1;

            const headerMatches = markupHeader.exec(line);
            if (headerMatches) {
                const headerLevel = headerMatches.groups.marker.length;
                const headerMarkup = '#'.repeat(headerLevel);
                const headerText = headerMatches.groups.header.slice(0, 0 - headerLevel);

                const fixInfo = {
                    editColumn: 1,
                    deleteCount: line.length,
                    insertText: `\n${headerMarkup} ${headerText}\n`,
                };

                addError(
                    onError,
                    lineNumber,
                    headerMatches.input,
                    headerMatches.input,
                    [headerMatches.index + 1, headerMatches.input.length],
                    fixInfo,
                );
            }
        });
    },
};
