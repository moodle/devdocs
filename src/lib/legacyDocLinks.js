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

/* cspell:disable */

/* eslint-disable import/no-extraneous-dependencies */
const visit = require('unist-util-visit');
const { isObsolete, isMigrated, getMigrationLink } = require('../../migratedPages');

const getDescriptionFromString = (string) => {
    const [linkComponent, description] = string.split('|');
    if (description) {
        // A description was present.
        return description;
    }

    // No description present.
    // We'll guess one based on the link itself.
    const [page, bookmark] = linkComponent.split('#');
    if (bookmark) {
        // There was a bookmark. Just return a tidied version of that.
        return bookmark.replaceAll('_', ' ');
    }

    // No bookmark. Return a tidied version of the page title.
    return page.replaceAll('_', ' ');
};

const getLegacyMessage = (vfile, string, replacement) => `---
- Use of legacy docs link found for migrated doc
- File:  \t ${vfile.path}
- Found: \t [[${string}]]
- Replacement: \t ${replacement}
---`;

const getObsoleteMessage = (vfile, string) => `---
- Use of obsoleted legacy doc link found for migrated doc
- File:  \t ${vfile.path}
- Found: \t [[${string}]]
---`;

const getPageComponent = (string) => {
    // Split the string to fetch everything before the | and normalise.
    // Links never have spaces in them.
    const linkComponent = string.split('|')[0].replaceAll(' ', '_');

    // Split on the bookmark (if present).
    return linkComponent.split('#')[0] ?? null;
};

const getPageBookmark = (string) => {
    const linkComponent = string.split('|')[0];
    const [, bookmark] = linkComponent.split('#');

    if (bookmark) {
        return `#${bookmark.replaceAll(' ', '-')}`;
    }

    return '';
};

const getLinkFromString = (vfile, string) => {
    const linkComponent = string.split('|')[0];

    // Split on the bookmark (if present).
    const pageComponent = getPageComponent(string);

    if (pageComponent) {
        const bookmarkComponent = getPageBookmark(string);
        if (isMigrated(pageComponent)) {
            const migrationLink = getMigrationLink(pageComponent, vfile.path);
            const replacement = `[${getDescriptionFromString(string)}](${migrationLink}${bookmarkComponent})`;

            console.warn(getLegacyMessage(vfile, string, replacement));

            return migrationLink + bookmarkComponent;
        } else if (isObsolete(pageComponent)) {
            console.warn(getObsoleteMessage(vfile, string));
        }
    }

    if (linkComponent.substring(0, 1) === '#') {
        // This is a relative link in the same page.
        // Update it to meet the correct format.
        return getPageBookmark(string);
    }

    // Point to a link on the old docs site.
    return `https://docs.moodle.org/dev/${linkComponent}`;
};

const replaceWithLink = (parent, index, url, description) => {
    const linkNode = {
        type: 'link',
        url,
        children: [{
            type: 'text',
            value: description,
        }],
    };

    // Remove the [ before the link (which is not seen as a link).
    parent.children[index - 1].value = parent.children[index - 1].value.slice(0, -1);

    // Splice in the shiny new link.
    parent.children.splice(index, 1, linkNode);

    // Remove the ] after the link.
    parent.children[index + 1].value = parent.children[index + 1].value.slice(1);

    return null;
};

/**
 * Update a text representation of a link to legacy docs.
 *
 * These are in the format:
 *
 *     [[Link target|Optional description]]
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 * @param {bool} migratedOnly
 */
const updateLink = (vfile, migratedOnly = false) => (node, index, parent) => {
    if (parent.children[index - 1]?.type !== 'text') {
        return null;
    }

    if (parent.children[index - 1]?.value.slice(-1) !== '[') {
        return null;
    }

    if (parent.children[index + 1]?.type !== 'text') {
        return null;
    }

    if (parent.children[index + 1]?.value.substr(0, 1) !== ']') {
        return null;
    }

    const isInterWikiLink = node.label.startsWith(':');

    if (isInterWikiLink) {
        const interWikiLink = getPageComponent(node.label).replaceAll(':', '/');

        replaceWithLink(
            parent,
            index,
            `https://docs.moodle.org/${interWikiLink}`,
            getDescriptionFromString(node.label),
        );

        return null;
    }

    // This is an internal wiki link.
    if (migratedOnly) {
        const pageComponent = getPageComponent(node.label);
        if (pageComponent) {
            if (!isMigrated(pageComponent)) {
                return null;
            }
        }
    }

    replaceWithLink(
        parent,
        index,
        getLinkFromString(vfile, node.label),
        getDescriptionFromString(node.label),
    );

    return null;
};

const updateMarkdown = async (ast, vfile) => {
    visit(ast, 'linkReference', updateLink(vfile, true));
};

const transformer = async (ast, vfile) => {
    visit(ast, 'linkReference', updateLink(vfile));
};

module.exports = {
    transformer,
    updateMarkdown,
};
