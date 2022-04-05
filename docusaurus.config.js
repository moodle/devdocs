// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require('dotenv').config();

const Versions = require('./versions.json');
const versionConfig = Object.fromEntries(Versions.map(version => {
    return [version, {
        label: version,
        banner: 'none',
    }];
}));
versionConfig['current'] = {
    label: 'master',
    banner: 'none',
};

// Share the remarkPlugins between all presets.
const remarkPlugins = [
    require('./src/remark/trackerLinks'),
    require('./src/remark/legacyDocLinks'),
    require('mdx-mermaid'),
];

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Moodle',
    tagline: 'Official Developer Documentation',
    //url: 'https://develop.moodle.org',
    url: process.env?.url || 'https://andrewnicols.github.io',
    baseUrl: process.env?.baseUrl || '/dinodevdocs/',
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

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/andrewnicols/dinodevdocs/edit/main/',
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    remarkPlugins,
                    lastVersion: 'current',
                    versions: versionConfig,
                    /*
                    versions: {
                        current: {
                            label: 'master',
                            banner: 'none',
                        },
                        "4.0": {
                            banner: 'none',
                        },
                    },
                    */
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    themeConfig: ({
        navbar: require('./config/navbar.js'),

        // Customisation for the left sidebar:
        autoCollapseSidebarCategories: true,
        hideableSidebar: true,

        footer: require('./config/footer.js'),
        prism: require('./config/prism.js'),
        imageZoom: require('./config/imageZoom.js'),
    }),
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    plugins: [
        'plugin-image-zoom',
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'community',
                path: 'community',
                routeBasePath: 'community',
                sidebarPath: require.resolve('./sidebars/community.js'),
                editUrl: 'https://github.com/andrewnicols/dinodevdocs/edit/main/',
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                remarkPlugins,
                editCurrentVersion: true,
            },
        ],

    ],
};

module.exports = config;
