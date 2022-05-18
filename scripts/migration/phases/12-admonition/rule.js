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

module.exports = {
    names: ['convert-admonition'],
    description: 'Convert admonition-like paragraphs to admonitions',
    tags: ['migration'],
    function: function lint(params, onError) {
        const sameLineNote = /(?<admonition><p class="(?<type>note)">(?<content>.*?)(?=<\/p>)<\/p>)/g;
        const templateNote = /(?<admonition>\{\{Note\|(?<content>[^}]*)\}\})/;

        const processMatches = (matches, lineNumber) => {
            if (!matches) {
                return;
            }
            addError(
                onError,
                lineNumber,
                matches.input,
                matches.input,
                [matches.index + 1, matches.groups.admonition.length],
                {
                    editColumn: matches.index + 1,
                    deleteCount: matches.groups.admonition.length,
                    insertText: `\n\n:::${matches.groups?.type || 'note'}\n\n${matches.groups.content}\n\n:::\n\n`,
                },
            );
        };

        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                // Do not make changes to code stanzas.
                return;
            }

            const lineNumber = lineIndex + 1;

            processMatches(sameLineNote.exec(line), lineNumber);
            processMatches(templateNote.exec(line), lineNumber);
        });
    },
};
