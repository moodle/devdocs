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
const nextVersionData = require('../nextVersion.js');

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
            to: nextVersionData.nextVersionRoot,
            label: 'Guides',
            position: 'left',
        },
        {
            to: '/general/community/contribute',
            label: 'Community',
            position: 'left',
            activeBasePath: '/general/community',
        },
        {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'coding',
            label: 'Coding',
            docsPluginId: 'general',
        },
        {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'process',
            label: 'Processes',
            docsPluginId: 'general',
        },
        {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'moodleapp',
            label: 'Moodle App',
            docsPluginId: 'general',
        },
        {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'releaseNotes',
            label: 'Releases',
            docsPluginId: 'general',
        },
        {
            type: 'dropdown',
            label: 'Writing',
            items: [
                {
                    type: 'docSidebar',
                    // position: 'left',
                    sidebarId: 'contentguidelines',
                    label: 'Content guidelines',
                    docsPluginId: 'general',
                },
                {
                    type: 'docSidebar',
                    // position: 'left',
                    sidebarId: 'documentation',
                    label: 'Documentation',
                    docsPluginId: 'general',
                },
            ],
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
    ],
};

module.exports = navbar;
