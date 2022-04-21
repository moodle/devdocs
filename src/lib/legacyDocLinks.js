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

const getLinkFromString = (vfile, string) => {
    let [linkComponent] = string.split('|');

    // Links never have spaces in them.
    linkComponent = linkComponent.replaceAll(' ', '_');

    // Split on the bookmark (if present).
    let [pageComponent, bookmarkComponent] = linkComponent.split('#');

    if (pageComponent) {
        if (isMigrated(pageComponent)) {
            if (bookmarkComponent) {
                bookmarkComponent = `#${bookmarkComponent.replaceAll('_', '-')}`;
            } else {
                bookmarkComponent = '';
            }
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
        return linkComponent.toLowerCase().replaceAll('_', '-');
    }

    // Point to a link on the old docs site.
    return `https://docs.moodle.org/dev/${linkComponent}`;
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
 */
const updateLink = (vfile) => (node, index, parent) => {
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

    const linkNode = {
        type: 'link',
        url: getLinkFromString(vfile, node.label),
        children: [{
            type: 'text',
            value: getDescriptionFromString(node.label),
        }],
    };

    parent.children[index - 1].value = parent.children[index - 1].value.slice(0, -1);
    parent.children.splice(index, 1, linkNode);
    parent.children[index + 1].value = parent.children[index + 1].value.slice(1);

    return null;
};

const transformer = async (ast, vfile) => {
    visit(ast, 'linkReference', updateLink(vfile));
};

module.exports = {
    transformer,
};
