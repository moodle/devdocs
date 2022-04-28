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

/* eslint-disable-next-line import/no-extraneous-dependencies */
const visit = require('unist-util-visit');

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
 *     {tracker MDL-12345}
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 */
const updateTextLink = (node, index, parent) => {
    const { value } = node;
    const tokenStart = value.indexOf('{tracker ');
    if (tokenStart === -1) {
        return null;
    }

    const linkStart = tokenStart + '{tracker '.length;
    const linkEnd = value.indexOf('}', linkStart);

    const tokenEnd = linkEnd + 1;
    const issueNumber = value.substring(linkStart, linkEnd);

    const link = getLinkFromIssueNumber(issueNumber);

    parent.children.splice(index, 1, {
        type: 'text',
        value: node.value.substring(0, tokenStart),
    }, link, {
        type: 'text',
        value: node.value.substring(tokenEnd),
    });

    return null;
};

/**
 * Update an inline representation of a tracker issue into a link to that issue.
 *
 * These are in the format:
 *
 *     {tracker}`MDL-12345`
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 */
const updateInlineLink = (node, index, parent) => {
    const tokenStart = node.value.indexOf('{tracker}');
    if (tokenStart === -1) {
        return null;
    }

    if (parent.children.length < index + 2) {
        return null;
    }

    const followingNode = parent.children[index + 1];
    if (followingNode.type !== 'inlineCode') {
        return null;
    }

    const issueNumber = followingNode.value;
    const link = getLinkFromIssueNumber(issueNumber);

    parent.children.splice(index, 2, {
        type: 'text',
        value: node.value.substring(0, tokenStart),
    }, link);

    return null;
};

const plugin = () => {
    const transformer = async (ast) => {
        visit(ast, 'text', (node, index, parent) => {
            updateTextLink(node, index, parent);
            updateInlineLink(node, index, parent);
        });
    };
    return transformer;
};

module.exports = plugin;
