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
const { updateMarketplaceApiSpec } = require('./marketplaceApiSpec');

jest.mock('fs/promises');

const specUrl = 'https://marketplace.next.moodle.org/api/docs.jsonopenapi';
const specFile = path.join(__dirname, '../../static/marketplace-api/openapi.json');

const remoteSpec = {
    openapi: '3.1.0',
    info: {
        title: 'Moodle Marketplace API',
        description: 'Create a token from your [security settings](/account/security).',
    },
    paths: {},
};

const expectedContent = `${JSON.stringify({
    ...remoteSpec,
    info: {
        ...remoteSpec.info,
        description: 'Create a token from your [security settings](https://marketplace.next.moodle.org/account/security).',
    },
}, null, 2)}\n`;

const jsonResponse = (body, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
});

describe('updateMarketplaceApiSpec', () => {
    let warn;

    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(global, 'fetch').mockImplementation();
        warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

        // By default, a local copy exists with older content.
        fs.readFile.mockResolvedValue('{}\n');
        fs.access.mockResolvedValue();
        fs.mkdir.mockResolvedValue();
        fs.writeFile.mockResolvedValue();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('when the Marketplace returns a valid spec', () => {
        it('fetches the spec with a 15 second timeout', async () => {
            const { signal } = new AbortController();
            const timeout = jest.spyOn(AbortSignal, 'timeout').mockReturnValue(signal);
            global.fetch.mockResolvedValue(jsonResponse(remoteSpec));

            await updateMarketplaceApiSpec();

            expect(timeout).toHaveBeenCalledWith(15000);
            expect(global.fetch).toHaveBeenCalledWith(specUrl, { signal });
        });

        it('replaces the local copy with the rewritten spec', async () => {
            global.fetch.mockResolvedValue(jsonResponse(remoteSpec));

            await expect(updateMarketplaceApiSpec()).resolves.toBe(specFile);

            expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(specFile), { recursive: true });
            expect(fs.writeFile).toHaveBeenCalledWith(specFile, expectedContent);
            expect(warn).not.toHaveBeenCalled();
        });

        it('creates the local copy when none exists', async () => {
            global.fetch.mockResolvedValue(jsonResponse(remoteSpec));
            fs.readFile.mockRejectedValue(Object.assign(new Error('ENOENT'), { code: 'ENOENT' }));

            await expect(updateMarketplaceApiSpec()).resolves.toBe(specFile);

            expect(fs.writeFile).toHaveBeenCalledWith(specFile, expectedContent);
        });

        it('leaves the local copy untouched when the spec has not changed', async () => {
            global.fetch.mockResolvedValue(jsonResponse(remoteSpec));
            fs.readFile.mockResolvedValue(expectedContent);

            await expect(updateMarketplaceApiSpec()).resolves.toBe(specFile);

            expect(fs.writeFile).not.toHaveBeenCalled();
            expect(warn).not.toHaveBeenCalled();
        });
    });

    describe('when the Marketplace cannot provide the spec', () => {
        it.each([
            [
                'an HTTP error',
                () => global.fetch.mockResolvedValue(jsonResponse({ title: 'Service Unavailable' }, 503)),
                'HTTP 503',
            ],
            [
                'a timeout',
                () => global.fetch.mockRejectedValue(
                    new DOMException('The operation was aborted due to timeout', 'TimeoutError'),
                ),
                'The operation was aborted due to timeout',
            ],
            [
                'a network error',
                () => global.fetch.mockRejectedValue(new TypeError('fetch failed')),
                'fetch failed',
            ],
            [
                'a response that is not JSON',
                () => global.fetch.mockResolvedValue({
                    ok: true,
                    status: 200,
                    json: async () => {
                        throw new SyntaxError('Unexpected token < in JSON at position 0');
                    },
                }),
                'Unexpected token < in JSON at position 0',
            ],
            [
                'a JSON response that is not an OpenAPI spec',
                () => global.fetch.mockResolvedValue(jsonResponse({ error: 'Not found' })),
                'The response is not an OpenAPI spec',
            ],
            [
                'an OpenAPI response without paths',
                () => global.fetch.mockResolvedValue(jsonResponse({ openapi: '3.1.0', info: {} })),
                'The response is not an OpenAPI spec',
            ],
        ])('falls back to the local copy on %s', async (_, mockFailure, reason) => {
            mockFailure();

            await expect(updateMarketplaceApiSpec()).resolves.toBe(specFile);

            expect(fs.access).toHaveBeenCalledWith(specFile);
            expect(fs.writeFile).not.toHaveBeenCalled();
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith(
                `[WARNING] Unable to fetch the Marketplace API spec from ${specUrl}: ${reason}. Using the local copy.`,
            );
        });

        it('fails the build when there is no local copy to fall back to', async () => {
            global.fetch.mockResolvedValue(jsonResponse({}, 503));
            fs.access.mockRejectedValue(Object.assign(new Error('ENOENT'), { code: 'ENOENT' }));

            await expect(updateMarketplaceApiSpec()).rejects.toThrow(
                `Unable to fetch the Marketplace API spec from ${specUrl}: HTTP 503. No local copy exists.`,
            );

            expect(fs.writeFile).not.toHaveBeenCalled();
            expect(warn).not.toHaveBeenCalled();
        });
    });
});
