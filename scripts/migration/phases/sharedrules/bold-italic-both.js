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

const getExpression = (count) => new RegExp(`(?<type>'{${count}})(?<content>.+?(?='{${count}}))'{${count}}`, 'g');

const getReplacement = (type) => {
    if (type === "''") {
        return '*';
    }
    if (type === "'''") {
        return '**';
    }
    if (type === "'''''") {
        return '***';
    }
    return null;
};

const getErrorLength = (matches) => matches.groups.type.length
    + matches.groups.content.length
    + matches.groups.type.length;

const getFixInfo = (matches, errorLength) => {
    const bounds = getReplacement(matches.groups.type);
    return {
        editColumn: matches.index + 1,
        deleteCount: errorLength,
        insertText: `${bounds}${matches.groups.content}${bounds}`,
    };
};

module.exports = {
    names: ['convert-bold-and-italic'],
    description: 'Convert markup bold + italic to markdown',
    tags: ['migration'],
    function: function lint(params, onError) {
        const tokenCount = params.config.tokenCount || 5;
        const expression = getExpression(tokenCount);
        console.log(expression);
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                return;
            }

            const lineNumber = lineIndex + 1;

            let matches = expression.exec(line);
            if (!matches) {
                return;
            }

            do {
                const errorLength = getErrorLength(matches);
                const errorValue = matches.input.substr(matches.index, errorLength);
                addError(
                    onError,
                    lineNumber,
                    errorValue,
                    matches.input,
                    [matches.index + 1, errorLength],
                    getFixInfo(matches, errorLength),
                );
                matches = expression.exec(line);
            } while (matches !== null);
        });
    },
};
