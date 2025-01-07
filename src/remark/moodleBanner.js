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
import { find } from 'unist-util-find';

import * as acorn from 'acorn';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxjsEsm } from 'micromark-extension-mdxjs-esm';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';
import { mdxjsEsmFromMarkdown } from 'mdast-util-mdxjs-esm';

const getImportAst = () => fromMarkdown(
    'import MoodlePageBanner from "@site/src/theme/MoodlePageBanner";',
    {
        extensions: [mdxjsEsm({ acorn, addResult: true })],
        mdastExtensions: [mdxjsEsmFromMarkdown()],
    },
).children[0];

const getPageBannerAst = () => fromMarkdown(
    '<MoodlePageBanner frontMatter={frontMatter} />',
    {
        extensions: [mdxJsx({ acorn, addResult: true })],
        mdastExtensions: [mdxJsxFromMarkdown()],
    },
).children[0];

const plugin = () => async (ast) => {
    const importAst = getImportAst();
    const pageBannerAst = getPageBannerAst();

    visit(ast, 'root', (root) => {
        const frontMatterNode = find(ast, { type: 'yaml' });
        if (!frontMatterNode) {
            return;
        }

        const frontMatterIndex = root.children.indexOf(frontMatterNode);

        root.children.splice(
            frontMatterIndex + 1,
            0,
            importAst,
            pageBannerAst,
        );
    });
};

export default plugin;
