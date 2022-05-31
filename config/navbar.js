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
const VersionsArchived = require('../versionsArchived.json');

const ArchivedVersionsDropdownItems = Object.entries(VersionsArchived).splice(
    0,
    5,
);

const navbar = {
    title: '',
    logo: {
        alt: '',
        src: 'img/Moodle.svg',
        height: '35px',
        width: '138px',
    },
    items: [
        {
            type: 'doc',
            docId: 'apis',
            position: 'left',
            label: 'Guides',
        },
        {
            to: '/general/community/contribute',
            label: 'Community',
            position: 'left',
        },
        {
            to: '/general/development/gettingstarted',
            label: 'Coding',
            position: 'left',
        },
        {
            to: '/general/development/process',
            label: 'Process',
            position: 'left',
        },

        // Right.
        {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
                ...ArchivedVersionsDropdownItems.map(
                    ([versionName, versionUrl]) => ({
                        label: versionName,
                        href: versionUrl,
                    }),
                ),
                {
                    href: 'https://docs.moodle.org/dev/',
                    label: 'Legacy documentation',
                },
                {
                    to: '/versions',
                    label: 'All versions',
                },
            ],
        },
        {
            href: 'https://github.com/moodle',
            label: 'GitHub',
            position: 'right',
        },
    ],
};

module.exports = navbar;
