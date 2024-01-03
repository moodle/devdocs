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

import { visit } from 'unist-util-visit';

const projects = [
    'MDL',
    'MDLQA',
    'MDLSITE',
    'MOBILE',
    'CONTRIB',
];

/**
 * Get the AST for a link pointing to the Moodle Tracker for the specified issue number.
 *
 * @param {String} issueNumber
 * @returns {Tree}
 */
const getLinkFromIssueNumber = (issueNumber) => ({
    type: 'link',
    url: `https://tracker.moodle.org/browse/${issueNumber}`,
    children: [{
        type: 'text',
        value: issueNumber,
    }],
});

/**
 * Update a text representation of a tracker issue into a link to that issue.
 *
 * These are in the format:
 *
 *     [PROJECT]-12345
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 * @returns {Number|String} The next index to process, or 'skip' to skip this node.
 */
const updateTextLink = (node, index, parent) => {
    const { value } = node;

    if (parent.type === 'link') {
        // This is already a link, so skip this one, but keep processing.
        return 'skip';
    }

    const expression = new RegExp(`(?<issueNumber>(${projects.join('|')})-\\d+)`);
    const match = expression.exec(value);
    if (match === null) {
        // No matches found in this node, so skip this one, but keep processing.
        return 'skip';
    }

    const tokenStart = match.index;
    const tokenEnd = match.index + match.groups.issueNumber.length;

    parent.children.splice(index, 1, {
        type: 'text',
        value: node.value.substring(0, tokenStart),
    }, getLinkFromIssueNumber(match.groups.issueNumber), {
        type: 'text',
        value: node.value.substring(tokenEnd),
    });

    // A match was found and the parent modified.
    // We have added two nodes - the link, and the text after the link.
    // The next index to check is therefore the original index + 2 - which will be the text after the link.
    // Returning a Number here will mean that the `visit` function will call us again with the next index.
    return index + 2;
};

const plugin = () => async (ast) => {
    // Visit all nodes on the AST which are of type 'text' and apply the updateTextLink function on them.
    // The visit function's third parameter is a Visitor function.
    // See the docs at https://github.com/syntax-tree/unist-util-visit-parents
    // Note: It has a mixed return type.
    // - If the Visitor function returns 'skip', then the visit function will skip this node and continue.
    // - If the Visitor function returns a Number, then the visit function will continue from that index.
    visit(ast, 'text', (node, index, parent) => updateTextLink(node, index, parent));
};

export default plugin;
