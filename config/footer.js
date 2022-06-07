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
const copyright = `
Copyright © ${new Date().getFullYear()} Moodle Pty Ltd. Built with Docusaurus.`;

module.exports = {
    style: 'dark',
    links: [
        {
            title: 'Moodle',
            items: [
                {
                    label: 'Release notes',
                    to: '/general/releases',
                },
                {
                    label: 'Projects',
                    to: '/general/projects',
                },
            ],
        },
        {
            title: 'Docs',
            items: [
                {
                    label: 'Developer docs',
                    to: '/general/documentation',
                },
                {
                    label: 'User docs',
                    href: 'https://docs.moodle.org/',
                },
                {
                    label: 'Legacy docs',
                    href: 'https://docs.moodle.org/dev/',
                },
            ],
        },
        {
            title: 'Community',
            items: [
                {
                    label: 'Code of conduct',
                    to: 'general/documentation/code-of-conduct',
                },
                {
                    label: 'General Developer Forum',
                    href: 'https://moodle.org/mod/forum/view.php?id=55',
                },
                {
                    label: 'Twitter',
                    href: 'https://twitter.com/moodle',
                },
            ],
        },
        {
            title: 'More',
            items: [
                {
                    label: 'GitHub',
                    href: 'https://github.com/moodle',
                },
                {
                    html: `
                    <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                        <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" width="114" height="51" />
                    </a>
                    `,
                },
            ],
        },
    ],
    copyright,
};
