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

import { SKIP, CONTINUE, visit } from 'unist-util-visit';
import { nextVersionRoot } from '../../nextVersion.js';

/**
 * Update any /docs/* link to point to /docs/:nextVersion.
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 * @returns {Number|String} The next index to process, or 'skip' to skip this node.
 */
const updateLink = (node) => {
    if (!node.url) {
        return SKIP;
    }

    if (!node.url.startsWith('/docs/')) {
        return SKIP;
    }

    if (node.url.match(/\/docs\/\d\.\d/)) {
        return SKIP;
    }

    // Get the current version.
    node.url = node.url.replace(/^\/docs\//, `${nextVersionRoot}/`);

    return CONTINUE;
};

const plugin = () => async (ast) => {
    // Visit all nodes on the AST which are of type 'link' and apply the updateLink function on them.
    // The visit function's third parameter is a Visitor function.
    // See the docs at https://github.com/syntax-tree/unist-util-visit-parents
    // Note: It has a mixed return type.
    // - If the Visitor function returns 'skip', then the visit function will skip this node and continue.
    // - If the Visitor function returns a Number, then the visit function will continue from that index.
    visit(ast, 'link', (node, index, parent) => updateLink(node, index, parent));
};

export default plugin;
