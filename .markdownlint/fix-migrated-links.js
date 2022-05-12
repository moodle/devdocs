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

const { isMigrated, getMigrationLink } = require('../migratedPages');

// eslint-disable-next-line max-len
const linkFinder = /(?<description>\[.*\](?=(?<link>\(https:\/\/docs.moodle.org\/dev\/(?<target>[^)]*)\)|\[[^\]]*\])))/g;

module.exports = {
    names: ['MDLDOC003', 'fix-legacylinks'],
    description: 'Find and replace links to any migrated docs',
    tags: ['migration'],
    function: function MDLDOC003(params, onError) {
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
                    return;
                }
                const [targetPage, bookmark] = target.split('#');
                const context = `${matches.groups.description}${matches.groups.link}`;

                if (isMigrated(targetPage)) {
                    const column = matches.index;
                    const getReplacementValue = () => {
                        const link = getMigrationLink(targetPage, params.name);
                        if (bookmark) {
                            const migratedBookmark = bookmark
                                .replaceAll('_', '-')
                                .toLowerCase();
                            return `${link}#${migratedBookmark}`;
                        }

                        return link;
                    };
                    const fixInfo = {
                        editColumn: column + 1,
                        deleteCount: context.length,
                        insertText: `${matches.groups.description}(${getReplacementValue()})`,
                    };

                    addError(
                        onError,
                        lineNumber,
                        target,
                        context,
                        [matches.index + 1, context.length],
                        fixInfo,
                    );
                }

                matches = linkFinder.exec(line);
            } while (matches !== null);
        });
    },
};
