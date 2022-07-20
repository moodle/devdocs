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

const projects = [
    'MDL',
    'MDLQA',
    'MDLSITE',
    'MOBILE',
    'CONTRIB',
];

const expression = new RegExp(`(?<issueNumber>(${projects.join('|')})\\-\\d+)`, 'g');

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
 */
const updateTextLink = (node, index, parent) => {
    const { value } = node;

    if (parent.type === 'link') {
        return null;
    }

    const match = expression.exec(value);
    if (match === null) {
        return null;
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

    return null;
};

const plugin = () => {
    const transformer = async (ast) => {
        visit(ast, 'text', (node, index, parent) => {
            updateTextLink(node, index, parent);
        });
    };
    return transformer;
};

module.exports = plugin;
