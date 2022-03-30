// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require('dotenv').config();

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

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/andrewnicols/dinodevdocs/edit/main/',
                    remarkPlugins: [
                        require('./src/remark/trackerLinks'),
                        require('./src/remark/legacyDocLinks'),
                    ],
                },
                blog: {
                    showReadingTime: true,
                    editUrl: 'https://github.com/andrewnicols/dinodevdocs/edit/main/',
                },
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
    ],
};

module.exports = config;
