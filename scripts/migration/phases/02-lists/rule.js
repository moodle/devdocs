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

const markupNumberedList = /^(?<whole>(?<marker>#+) *)/;
const markupBulletedList = /^(?<whole>(?<marker>\*+) *)/;

module.exports = {
    names: ['convert-markup-lists'],
    description: 'Convert markup lists to markdown lists',
    tags: ['migration'],
    function: function lint(params, onError) {
        const replaceListType = (line, lineNumber, listRegExp, insertText) => {
            const matches = listRegExp.exec(line);
            if (!matches) {
                return;
            }
            const linePrefix = '  '.repeat(matches.groups.marker.length - 1);
            addError(
                onError,
                lineNumber,
                matches.input,
                matches.input,
                [matches.index + 1, matches.input.length],
                {
                    editColumn: matches.index + 1,
                    deleteCount: matches.groups.whole.length,
                    insertText: `${linePrefix}${insertText}`,
                },
            );
        };

        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                return;
            }

            const lineNumber = lineIndex + 1;
            replaceListType(line, lineNumber, markupNumberedList, '1. ');
            replaceListType(line, lineNumber, markupBulletedList, '- ');
        });
    },
};
