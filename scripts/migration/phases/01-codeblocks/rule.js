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

const codeblockStart = /^<syntaxhighlight lang="(?<language>[^"]*)">/g;
const codeblockEnd = /^<\/syntaxhighlight>/g;

module.exports = {
    names: ['convert-markup-codeblocks'],
    description: 'Find and replace links to any migrated docs',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex) => {
            const lineNumber = lineIndex + 1;
            const codeblockStartMatches = codeblockStart.exec(line);
            if (codeblockStartMatches) {
                addError(
                    onError,
                    lineNumber,
                    codeblockStartMatches.input,
                    codeblockStartMatches.input,
                    [codeblockStartMatches.index + 1, codeblockStartMatches.input.length],
                    {
                        editColumn: codeblockStartMatches.index + 1,
                        deleteCount: codeblockStartMatches.input.length,
                        insertText: `\n\`\`\`${codeblockStartMatches.groups.language}`,
                    },
                );

                return;
            }

            const codeblockEndMatches = codeblockEnd.exec(line);
            if (codeblockEndMatches) {
                addError(
                    onError,
                    lineNumber,
                    codeblockEndMatches.input,
                    codeblockEndMatches.input,
                    [codeblockEndMatches.index + 1, codeblockEndMatches.input.length],
                    {
                        editColumn: codeblockEndMatches.index + 1,
                        deleteCount: codeblockEndMatches.input.length,
                        insertText: '```\n',
                    },
                );
            }
        });
    },
};
