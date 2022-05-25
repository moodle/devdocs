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

const path = require('path');

const getFileName = (matches) => {
    const [link] = matches.groups.link.split('|');
    if (link.startsWith('File:')) {
        return link.replace(/^File:/, '');
    }

    return null;
};

const getWikilinkLink = (matches) => {
    const [link] = matches.groups.link.split('|');

    const normalisedLink = link.replaceAll(' ', '_');

    if (link.indexOf(':') !== -1) {
        const pages = normalisedLink.split(':');
        const page = pages.pop();
        const lang = pages.pop();
        return `https://docs.moodle.org/${lang}/${page}`;
    }

    return `https://docs.moodle.org/dev/${normalisedLink}`;
};

const getWikilinkDescription = (matches) => {
    const [link, description] = matches.groups.link.split('|');

    const value = description || link;

    if (link.indexOf(':') !== -1 && !description) {
        const [, title] = link.split(':', 2);
        return title.replaceAll('_', ' ');
    }

    return value
        .replaceAll('_', ' ');
};

const getFixInfo = (matches, filename) => {
    const imageFilename = getFileName(matches);
    if (imageFilename) {
        const description = matches.groups.link.split('|').pop().replace('File:', '');
        const imageDirName = `./_${path.basename(filename.replace(/\.md.?/, '').replaceAll(' ', '_'))}`;
        return `![${description}](${imageDirName}/${imageFilename.replaceAll(' ', '_')})`;
    }

    const description = getWikilinkDescription(matches);
    const link = getWikilinkLink(matches);
    return `[${description}](${link})`;
};

const replaceWikiLinks = (line, lineNumber, onError, filename) => {
    const linkSearch = /(?<wikilink>\[\[(?<link>[^\]]*)\]\])/g;
    let matches = linkSearch.exec(line);
    if (!matches) {
        return;
    }
    do {
        const foundWikilink = matches.groups.wikilink;
        const replacement = getFixInfo(matches, filename);
        const column = matches.index + 1;

        const fixInfo = {
            editColumn: column,
            deleteCount: matches.groups.link.length + 4,
            insertText: replacement,
        };

        addErrorDetailIf(
            onError,
            lineNumber,
            replacement,
            foundWikilink,
            null,
            line,
            [matches.index + 1, matches.groups.wikilink.length],
            fixInfo,
        );
        matches = linkSearch.exec(line);
    } while (matches !== null);
};

module.exports = {
    names: ['convert-markup-wikilinks'],
    description: 'Do not allow use of MediaWiki [[wikilinks]]',
    tags: ['migration'],
    function: function lint(params, onError) {
        forEachLine(getLineMetadata(params), (line, lineIndex, inCode) => {
            if (inCode) {
                // Do not make changes to code stanzas.
                return;
            }

            const lineNumber = lineIndex + 1;
            replaceWikiLinks(line, lineNumber, onError, params.name);
        });
    },
};
