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

const markupNumberedList = /^(?<marker># *)/;

module.exports = {
    names: ['convert-markup-lists'],
    description: 'Convert markup lists to markdown lists',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                return;
            }

            const lineNumber = lineIndex + 1;

            const numberedListMatches = markupNumberedList.exec(line);
            if (numberedListMatches) {
                addError(
                    onError,
                    lineNumber,
                    numberedListMatches.input,
                    numberedListMatches.input,
                    [numberedListMatches.index + 1, numberedListMatches.input.length],
                    {
                        editColumn: numberedListMatches.index + 1,
                        deleteCount: numberedListMatches.groups.marker.length,
                        insertText: '1. ',
                    },
                );
            }
        });
    },
};
