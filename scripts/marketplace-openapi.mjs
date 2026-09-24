#!/usr/bin/env node
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

/**
 * Fetch the Moodle Marketplace OpenAPI spec and prepare it for docusaurus-plugin-openapi-docs.
 *
 * The Marketplace API runs in several environments and the spec it publishes is
 * environment-agnostic: its `servers` entry is a bare `/` and the Markdown in its
 * descriptions uses root-relative links. This script injects the public URL of
 * the environment being documented so that the generated reference shows full
 * endpoint URLs and working links.
 *
 * Environment variables (a local `.env` file is honoured):
 * - MARKETPLACE_OPENAPI_URL  Where to download the spec from.
 * - MARKETPLACE_URL          Public base URL of that environment. Defaults to the
 *                            origin of MARKETPLACE_OPENAPI_URL.
 */

import { config as dotEnvConfig } from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

dotEnvConfig();

const specUrl = process.env.MARKETPLACE_OPENAPI_URL
    || 'https://marketplace.next.moodle.org/api/docs.jsonopenapi';
const publicUrl = (process.env.MARKETPLACE_URL || new URL(specUrl).origin).replace(/\/$/, '');

// Must match the `specPath` of the docusaurus-plugin-openapi-docs instance in docusaurus.config.js.
const outputFile = path.join('.openapi', 'marketplace.json');

/**
 * Turn root-relative Markdown links (`[text](/path)`) into absolute ones on the public URL.
 *
 * @param {string} markdown
 * @returns {string}
 */
const absolutiseLinks = (markdown) => markdown.replace(/\]\(\/(?!\/)/g, `](${publicUrl}/`);

/**
 * Apply absolutiseLinks to every `description` found anywhere in the spec.
 *
 * @param {unknown} node
 */
const rewriteDescriptions = (node) => {
    if (Array.isArray(node)) {
        node.forEach(rewriteDescriptions);
        return;
    }
    if (node && typeof node === 'object') {
        Object.entries(node).forEach(([key, value]) => {
            if (key === 'description' && typeof value === 'string') {
                node[key] = absolutiseLinks(value);
            } else {
                rewriteDescriptions(value);
            }
        });
    }
};

const response = await fetch(specUrl);
if (!response.ok) {
    throw new Error(`Unable to fetch ${specUrl}: ${response.status} ${response.statusText}`);
}
const spec = await response.json();

spec.servers = [{ url: publicUrl }];
rewriteDescriptions(spec);

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(spec, null, 2)}\n`);

console.log(`Wrote ${outputFile} from ${specUrl} (server: ${publicUrl})`);
