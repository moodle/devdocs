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
    codeBlockAndSpanRanges,
    withinAnyRange,
} = require('markdownlint-rule-helpers');

const path = require('path');
const fs = require('fs');

const rootDir = path.posix.dirname(__dirname);

// A simple regex to capture all links which are not images.
const linkFinder = /(?<!!)(?<description>\[[^\]]*\](?=\((?<target>[^)]*)\)|\[[^\]]*\]))/g;

/**
 * Get the mapping of renamed locations.
 *
 * @param {Object[]} renames The list of renames with oldFile, and newFile
 * @returns {Object}
 */
const getRenamedFileMapping = (renames) => {
    if (!renames) {
        return {};
    }

    const mappings = {};
    renames.every(({ oldFile, newFile }) => {
        mappings[oldFile] = newFile;
        mappings[`${oldFile}/`] = newFile;
        if (oldFile.endsWith('/index.md')) {
            mappings[oldFile.replace(/\/index.md$/, '')] = newFile;
            mappings[`${oldFile.replace(/\/index.md$/, '')}/`] = newFile;
        } else {
            mappings[oldFile.replace(/.md$/, '')] = newFile;
            mappings[`${oldFile.replace(/.md$/, '')}/`] = newFile;
        }
        return true;
    });

    return mappings;
};

/**
 * Get a file path relative to the root directory of the project.
 *
 * @param {string} file The file to normalise the location of
 * @returns {string} The normalised location
 */
const getNormalisedFile = (file) => `/${path.posix.relative(rootDir, file)}`;

/**
 * Get an absolute link relative to the root directory of the project.
 *
 * @param {string} file The file that the link was found in
 * @param {string} link The link within the file
 * @returns {string} The path relative to the root of the project
 */
const getNormalisedLink = (file, link) => {
    if (link.startsWith('/')) {
        // The link already starts with /, it probably is already an absolute link.
        return link;
    }

    // Get the absolute link for the source markdown file.
    const normalisedFile = getNormalisedFile(file);

    // Get the directory that it is in.
    const normalisedDir = path.posix.dirname(normalisedFile);

    // Return a link relative to the file that the link was found in.
    return path.posix.join(normalisedDir, link);
};

/**
 * Whether to force use of a relative link for this link.
 *
 * @param {string} link
 * @param {boolean|array} forceRelative Whether to force relative paths
 * @returns {boolean}
 */
const shouldForceRelativeForLink = (link, forceRelative) => {
    if (!forceRelative) {
        return false;
    }

    if (forceRelative === true) {
        return true;
    }

    const linkFolder = link.split('/')[1];
    return forceRelative.indexOf(linkFolder) !== -1;
};

/**
 * Whether a relative link is actually possible
 *
 * @param {string} link
 * @param {string} file
 * @returns {boolean}
 */
const isRelativeLinkPossible = (link, file) => {
    const linkFolder = link.split('/')[1];
    const fileFolder = file.split('/')[1];

    if (linkFolder === 'docs' && fileFolder === 'docs') {
        if (link.match(/^\/docs\/\d\.\d\//)) {
            // This is a versioned link.
            // We don't want to normalise these.
            return false;
        }
    }

    // In Docusaurus, different root folders contain different plugin instances.
    // Docusaurus does not support relative links between different plugins.
    return linkFolder === fileFolder;
};

/**
 * Find a file path for the specified link
 *
 * @param {string} file
 * @returns string
 */
const findFile = (file) => {
    const paths = [
        file,
        `${file}.md`,
        `${file}/index.md`,
        `${file}.mdx`,
        `${file}/index.mdx`,
    ];

    for (const filePath of paths) {
        const fullPath = path.posix.join(rootDir, filePath);
        try {
            // Allow use of fs.statSync here because it's preferable to asynchronous rule handling for markdownlint.
            // eslint-disable-next-line no-restricted-properties
            const pathStat = fs.statSync(fullPath);
            if (pathStat.isFile()) {
                return filePath;
            }
        } catch {}
    }

    return file;
};

const getOptimisedLink = (mappings, file, currentLink, forceRelative) => {
    const normalisedCurrentLink = getNormalisedLink(file, currentLink);
    const normalisedCurrentFile = getNormalisedFile(file);
    const updatedLink = mappings[normalisedCurrentLink] ? mappings[normalisedCurrentLink] : normalisedCurrentLink;
    const relativeLinkPossible = isRelativeLinkPossible(updatedLink, normalisedCurrentFile);
    const forceRelativeLink = shouldForceRelativeForLink(currentLink, forceRelative);
    const isRelativeLink = currentLink.startsWith('./') || currentLink.startsWith('../');

    if (isRelativeLink && !relativeLinkPossible) {
        return updatedLink;
    }
    if (updatedLink === normalisedCurrentLink && !forceRelativeLink) {
        // There is no rename for this file.
        // Configuration is set to _not_ force a relative link for this section.
        // No changes to make.
        return currentLink;
    }

    if (relativeLinkPossible) {
        // This file can be normalised to a relative link.
        // In Moodle docs we only do this within the /docs section.
        // Either the link has changed, or the forceRelative configuration is set.
        // Update to point to a relative _file_ if possible.
        const updatedFileLink = findFile(updatedLink);
        let relativeLink = path.posix.relative(path.posix.dirname(normalisedCurrentFile), updatedFileLink);

        if (relativeLink.length === 0) {
            // This is a link to the current document.
            return '';
        }

        if (!relativeLink.startsWith('.')) {
            relativeLink = `./${relativeLink}`;
        }

        return relativeLink;
    }

    if (updatedLink === normalisedCurrentLink) {
        // No change.
        return currentLink;
    }

    return updatedLink.replace(/\/index.md/, '').replace(/\.md$/, '');
};

module.exports = {
    names: ['renamedLinks'],
    description: 'Identify and fix renamed links',
    tags: ['rename'],
    function: function renamedLinks(params, onError) {
        // Get the metadata for all lines.
        const lineMetadata = getLineMetadata(params);

        // Get the list of exclusions - this is usually code blocks.
        const exclusions = codeBlockAndSpanRanges(params, lineMetadata);

        // Get the list of from => to mappings.
        const mappings = getRenamedFileMapping(params.config.renames);

        // Normalise the forceRelative config.
        const forceRelative = params.config.forceRelative || false;

        forEachLine(lineMetadata, (line, lineIndex, inCode) => {
            let match = null;

            // eslint-disable-next-line no-cond-assign
            while (!inCode && ((match = linkFinder.exec(line)) !== null)) {
                const { target } = match.groups;
                if (!target) {
                    // This was probably a [Description][Reference] style link and we don't handle them yet.
                    continue;
                }
                if (target.startsWith('#')) {
                    // A bookmark link within the same page.
                    // Just skip.
                    continue;
                }

                if (target.indexOf('://') !== -1) {
                    // This has a protocol and is likely an external link.
                    // We can probably do more to detect these, but we'll keep it simple for now.
                    continue;
                }

                if (target.startsWith('mailto:')) {
                    // This is a mailto: external link.
                    // Skip.
                    continue;
                }

                if (withinAnyRange(exclusions, lineIndex, match.index, match[0].length)) {
                    // This match was within a code block.
                    // Skip.
                    continue;
                }

                const [targetLink, targetBookmark] = target.split('#');
                const bookmark = targetBookmark ? `#${targetBookmark}` : '';

                // Get the best possible link that we can use for this link.
                const optimisedLink = getOptimisedLink(mappings, params.name, targetLink, forceRelative);
                if (optimisedLink === targetLink) {
                    // No change.
                    continue;
                }

                const editColumn = match.index + 1 + match.groups.description.length + 1;

                addError(
                    onError,
                    lineIndex + 1,
                    target,
                    null,
                    [editColumn, target.length],
                    {
                        editColumn,
                        deleteCount: target.length,
                        insertText: `${optimisedLink}${bookmark ?? ''}`,
                    },
                );
            }
        });
    },
};
