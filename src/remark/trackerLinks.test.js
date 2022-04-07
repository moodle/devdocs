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

const module = require('./trackerLinks');

describe('trackerLinks', () => {
    it('must be a function', () => {
        expect(typeof module).toBe('function');
    });

    it.concurrent.each([
        [
            'Simple link in text',
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        value: 'See MDL-12345 for more information',
                    },
                ],
            },
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        value: 'See ',
                    },
                    {
                        type: 'link',
                        url: 'https://tracker.moodle.org/browse/MDL-12345',
                        children: [
                            {
                                type: 'text',
                                value: 'MDL-12345',
                            },
                        ],
                    },
                    {
                        type: 'text',
                        value: ' for more information',
                    },
                ],
            },
        ],
        [
            'Does not update existing links',
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        value: 'Do not modify ',
                    },
                    {
                        type: 'link',
                        url: 'https://example.com',
                        children: [{
                            type: 'text',
                            value: 'MDL-12345',
                        }],
                    }, {
                        type: 'text',
                        value: 'that link',
                    },
                ],
            },
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        value: 'Do not modify ',
                    },
                    {
                        type: 'link',
                        url: 'https://example.com',
                        children: [{
                            type: 'text',
                            value: 'MDL-12345',
                        }],
                    }, {
                        type: 'text',
                        value: 'that link',
                    },
                ],
            },
        ],
    ])('updates tracker links for testcase "%s"', async (name, input, expected) => {
        const transformer = module();

        const sampleTree = {
            type: 'root',
            children: [input],
        };

        await transformer(sampleTree);
        expect(sampleTree.children[0]).toEqual(expected);
    });
});
