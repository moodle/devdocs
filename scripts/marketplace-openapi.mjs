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
 * Manage the Moodle Marketplace OpenAPI spec used by docusaurus-plugin-openapi-docs.
 *
 * - `fetch` downloads the spec and stores it, unmodified, in the repository. It is run
 *   on a schedule by the update-marketplace-api workflow, which opens a pull request
 *   when the spec changes, so building the site never depends on the Marketplace
 *   being reachable.
 * - `prepare` turns the stored spec into the one the plugin generates the reference
 *   from. The spec is environment-agnostic: its `servers` entry is a bare `/` and the
 *   Markdown in its descriptions uses root-relative links, so the public URL of the
 *   environment being documented is injected to show full endpoint URLs and working
 *   links. It only reads local files.
 *
 * Environment variables (a local `.env` file is honoured):
 * - MARKETPLACE_OPENAPI_URL  Where `fetch` downloads the spec from.
 * - MARKETPLACE_URL          Public base URL of that environment. Defaults to the
 *                            origin of MARKETPLACE_OPENAPI_URL.
 */

import { program } from 'commander';
import { config as dotEnvConfig } from 'dotenv';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

dotEnvConfig();

const specUrl = process.env.MARKETPLACE_OPENAPI_URL
    || 'https://marketplace.moodle.com/api/docs.jsonopenapi';
const publicUrl = (process.env.MARKETPLACE_URL || new URL(specUrl).origin).replace(/\/$/, '');

const fetchTimeout = 30 * 1000;

const storedSpecFile = path.join('data', 'marketplace', 'openapi.json');

// Must match the `specPath` of the docusaurus-plugin-openapi-docs instance in docusaurus.config.js.
const preparedSpecFile = path.join('.openapi', 'marketplace.json');

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

/**
 * Guard against storing something that is not an OpenAPI 3 document, such as an error
 * body or a maintenance page served with a 200 status.
 *
 * @param {unknown} spec
 */
const assertOpenApiSpec = (spec) => {
    const isSpec = spec
        && typeof spec.openapi === 'string'
        && spec.openapi.startsWith('3.')
        && spec.info && typeof spec.info.title === 'string'
        && spec.paths && typeof spec.paths === 'object';
    if (!isSpec) {
        throw new Error(`${specUrl} did not return an OpenAPI 3 document`);
    }
};

const writeJson = async (file, data) => {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
};

const fetchSpec = async () => {
    const response = await fetch(specUrl, { signal: AbortSignal.timeout(fetchTimeout) });
    if (!response.ok) {
        throw new Error(`Unable to fetch ${specUrl}: ${response.status} ${response.statusText}`);
    }
    const spec = await response.json();
    assertOpenApiSpec(spec);

    await writeJson(storedSpecFile, spec);
    console.log(`Wrote ${storedSpecFile} from ${specUrl}`);
};

const prepareSpec = async () => {
    const spec = JSON.parse(await readFile(storedSpecFile, 'utf-8'));

    spec.servers = [{ url: publicUrl }];
    rewriteDescriptions(spec);

    await writeJson(preparedSpecFile, spec);
    console.log(`Wrote ${preparedSpecFile} from ${storedSpecFile} (server: ${publicUrl})`);
};

program
    .name('marketplace-openapi')
    .description('Manage the Moodle Marketplace OpenAPI spec');

program
    .command('fetch')
    .description(`Download the spec and store it in ${storedSpecFile}`)
    .action(fetchSpec);

program
    .command('prepare')
    .description(`Prepare ${storedSpecFile} for docusaurus-plugin-openapi-docs`)
    .action(prepareSpec);

await program.parseAsync();
