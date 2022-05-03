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

/**
 * Get the whole word at the position, given a position within the word.
 *
 * @param {string} line The full line of texct
 * @param {number} position The position within the line that the word is found
 * @returns {string}
 */
const getWord = (line, position) => {
    const left = line.slice(0, position + 1).search(/\S+$/);
    const right = line.slice(left).search(/\s/);

    if (right < 0) {
        // This is the last word in the line.
        // Return from the start of the word to the end of the line.
        return line.slice(left);
    }

    return line.slice(left, left + right);
};

const characterReplacementMap = {
    '“': '"',
    '”': '"',
    '‘': "'",
    '’': "'",
};

const punctuation = /(?<character>[“‘’”])/g;
module.exports = {
    names: ['MDLDOC001', 'no-directional-quotation-marks'],
    description: 'Do not use directional quotations (use apostrophe or double-quote)',
    tags: ['punctuation'],
    function: function MDLDOC001(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                // Do not make changes to code stanzas.
                return;
            }

            const lineNumber = lineIndex + 1;
            let matches = punctuation.exec(line);
            if (!matches) {
                return;
            }
            do {
                const foundCharacter = matches.groups.character;
                const replacementCharacter = characterReplacementMap[foundCharacter];
                const column = matches.index + 1;
                const fixInfo = {
                    editColumn: column,
                    deleteCount: 1,
                    insertText: replacementCharacter,
                };

                const word = getWord(line, matches.index);
                const expectedWord = word.replace(foundCharacter, replacementCharacter);

                addErrorDetailIf(
                    onError,
                    lineNumber,
                    expectedWord,
                    word,
                    null,
                    line,
                    [matches.index + 1, 1],
                    fixInfo,
                );
                matches = punctuation.exec(line);
            } while (matches !== null);
        });
    },
};
