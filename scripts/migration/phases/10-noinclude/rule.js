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

const search = /(?<match><\/?noinclude>)/;

const getFixInfo = (matches) => {
    if (matches.index === 0) {
        return {
            editColumn: matches.index + matches.groups.match.length + 1,
            deleteCount: 0,
            insertText: '\n\n',
        };
    }
    return {
        editColumn: matches.index + 1,
        deleteCount: 0,
        insertText: '\n\n',
    };
};

module.exports = {
    names: ['noinclude-own-line'],
    description: 'The noinclude tag should be on its own line',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                return;
            }

            const lineNumber = lineIndex + 1;

            const matches = search.exec(line);
            if (!matches) {
                return;
            }
            if (matches.input === matches.groups.match) {
                return;
            }

            const fixInfo = getFixInfo(matches);
            addError(
                onError,
                lineNumber,
                matches.input,
                matches.input,
                [matches.index + 1, matches.groups.match.length],
                fixInfo,
            );
        });
    },
};
