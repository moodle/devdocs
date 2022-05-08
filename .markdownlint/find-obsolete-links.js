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

const { isObsolete } = require('../migratedPages');

// eslint-disable-next-line max-len
const linkFinder = /(?<description>\[.*\](?=(?<link>\(https:\/\/docs.moodle.org\/dev\/(?<target>[^)]*)\)|\[[^\]]*\])))/g;

module.exports = {
    names: ['MDLDOC004', 'find-obsolete-links'],
    description: 'Identify obsolete links',
    tags: ['migration'],
    function: function MDLDOC004(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                // Do not make changes to code stanzas.
                return;
            }

            const lineNumber = lineIndex + 1;
            let matches = linkFinder.exec(line);
            if (!matches) {
                return;
            }
            do {
                const { target } = matches.groups;
                if (!target) {
                    break;
                }
                const [targetPage] = target.split('#');
                const context = `${matches.groups.description}${matches.groups.link}`;
                if (isObsolete(targetPage)) {
                    addError(
                        onError,
                        lineNumber,
                        target,
                        context,
                        [matches.index + 1, context.length],
                        null,
                    );
                }

                matches = linkFinder.exec(line);
            } while (matches !== null);
        });
    },
};
