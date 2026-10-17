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

const fs = require('fs/promises');
const path = require('path');

const specUrl = 'https://marketplace.next.moodle.org/api/docs.jsonopenapi';

// The copy of the spec used to build the site.
// It is committed so that the site still builds when the Marketplace is unreachable.
const specFile = path.join(__dirname, '../../static/marketplace-api/openapi.json');

/**
 * Make site-relative links in the spec point to the Marketplace instead of this site.
 *
 * Covers Markdown links, e.g. [security settings](/account/security), and HTML href/src attributes.
 *
 * @param {*} value Any value from the spec.
 * @param {string} origin The Marketplace origin.
 * @returns {*}
 */
const absolutiseLinks = (value, origin) => {
    if (typeof value === 'string') {
        return value
            .replace(/\]\(\/(?!\/)/g, `](${origin}/`)
            .replace(/\b(?<attr>href|src)=(?<quote>["'])\/(?!\/)/g, `$<attr>=$<quote>${origin}/`);
    }
    if (Array.isArray(value)) {
        return value.map((item) => absolutiseLinks(item, origin));
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, absolutiseLinks(item, origin)]),
        );
    }

    return value;
};

/**
 * Refresh the local copy of the Marketplace API spec from the Marketplace.
 *
 * If the Marketplace cannot be reached, or returns something that is not an OpenAPI spec,
 * the committed copy is kept and used instead.
 *
 * @returns {Promise<string>} The path to the spec file.
 */
const updateMarketplaceApiSpec = async () => {
    try {
        const response = await fetch(specUrl, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const spec = await response.json();
        if (!spec?.openapi || !spec?.paths) {
            throw new Error('The response is not an OpenAPI spec');
        }

        const content = `${JSON.stringify(absolutiseLinks(spec, new URL(specUrl).origin), null, 2)}\n`;
        const current = await fs.readFile(specFile, 'utf8').catch(() => null);
        if (content !== current) {
            await fs.mkdir(path.dirname(specFile), { recursive: true });
            await fs.writeFile(specFile, content);
        }
    } catch (error) {
        const message = `Unable to fetch the Marketplace API spec from ${specUrl}: ${error.message}`;
        await fs.access(specFile).catch(() => {
            throw new Error(`${message}. No local copy exists.`);
        });
        console.warn(`[WARNING] ${message}. Using the local copy.`);
    }

    return specFile;
};

module.exports = {
    updateMarketplaceApiSpec,
};
