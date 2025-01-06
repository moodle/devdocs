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

import { config as dotEnvConfig } from 'dotenv';
import Versions from './versions.json';
import MoodleBannerRemark from './src/remark/moodleBanner.js';
import TrackerLinksRemark from './src/remark/trackerLinks.js';
import UnversionedDocsLinksRemark from './src/remark/unversionedDocsLinks.js';
import * as nextVersion from './nextVersion.js';

// eslint-disable global-require

dotEnvConfig();

const versionConfig = Object.fromEntries(Versions.map((version) => [version, {
    label: version,
    banner: 'none',
}]));
versionConfig.current = {
    label: `main (${nextVersion.nextVersion})`,
    banner: 'none',
    path: nextVersion.nextVersion,
};

// Share the remarkPlugins between all presets.
const remarkPlugins = [
    MoodleBannerRemark,
    TrackerLinksRemark,
    UnversionedDocsLinksRemark,
];

const isDeployPreview = !!process.env.NETLIFY && process.env.CONTEXT === 'deploy-preview';

const getBaseUrl = () => {
    if (typeof process.env.BASEURL !== 'undefined') {
        // Respect the env.
        return process.env.BASEURL;
    }

    return '/';
};

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Moodle Developer Resources',
    tagline: 'Nurturing Moodle Developers',
    future: {
        experimental_faster: true,
    },

    // url: 'https://develop.moodle.org',
    url: process.env?.URL || 'https://moodledev.io',
    baseUrl: getBaseUrl(),
    trailingSlash: false,
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'moodle', // Usually your GitHub org/user name.
    projectName: 'devdocs', // Usually your repo name.
    i18n: {
        locales: [
            'en-AU',
        ],
        defaultLocale: 'en-AU',
    },

    markdown: {
        mermaid: true,
    },

    themes: ['@docusaurus/theme-mermaid'],

    scripts: [
        // Zipchat integration.
        // See Martin Dougiamas for details on configuration.
        {
            src: 'https://zipchat.ai/widget/zipchat.js?id=gQKDVDpI9xQWW4n04W4K',
            defer: true,
        },
    ],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars/docs.js'),
                    editUrl: 'https://github.com/moodle/devdocs/edit/main/',
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    remarkPlugins,
                    lastVersion: 'current',
                    versions: versionConfig,

                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                gtag: !isDeployPreview
                    ? {
                        trackingID: 'G-L9EE8RW5B1',
                    }
                    : undefined,
            }),
        ],
    ],

    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    themeConfig: ({
        navbar: require('./config/navbar.js'),

        footer: require('./config/footer.js'),
        prism: require('./config/prism.js'),
        imageZoom: require('./config/imageZoom.js'),
        algolia: require('./config/algolia.js'),
        docs: {
            sidebar: {
                // Customisation for the left sidebar:
                autoCollapseCategories: true,
                hideable: true,
            },
        },
    }),
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'general',
                path: 'general',
                routeBasePath: 'general',
                sidebarPath: require.resolve('./sidebars/general.js'),
                editUrl: 'https://github.com/moodle/devdocs/edit/main/',
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                remarkPlugins,
                editCurrentVersion: true,
            },
        ],

        // This is the GA-4 tag for all Moodle properties.
        [
            '@docusaurus/plugin-google-gtag',
            {
                id: 'central-analytics',
                trackingID: 'G-QWYJYEY9P5',
            },
        ],

        [
            '@docusaurus/plugin-pwa',
            {
                debug: isDeployPreview,
                offlineModeActivationStrategies: [
                    'appInstalled',
                    'standalone',
                    'queryString',
                ],
                pwaHead: [
                    {
                        tagName: 'link',
                        rel: 'icon',
                        href: '/img/icons/orange_m.svg',
                    },
                    {
                        tagName: 'link',
                        rel: 'manifest',
                        href: '/manifest.json',
                    },
                    {
                        tagName: 'meta',
                        name: 'theme-color',
                        content: 'rgb(208, 99, 0)',
                    },
                    {
                        tagName: 'meta',
                        name: 'apple-mobile-web-app-capable',
                        content: 'yes',
                    },
                    {
                        tagName: 'meta',
                        name: 'apple-mobile-web-app-status-bar-style',
                        content: '#000',
                    },
                    {
                        tagName: 'link',
                        rel: 'apple-touch-icon',
                        href: '/img/icons/maskable_icon.png',
                    },
                    {
                        tagName: 'link',
                        rel: 'mask-icon',
                        href: '/img/icons/maskable_icon.png',
                        color: 'rgb(208, 99, 0)',
                    },
                    {
                        tagName: 'meta',
                        name: 'msapplication-TileImage',
                        content: '/img/icons/maskable_icon.png',
                    },
                    {
                        tagName: 'meta',
                        name: 'msapplication-TileColor',
                        content: '#000',
                    },
                ],
            },
        ],
    ],
};

export default config;
