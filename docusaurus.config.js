// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion


/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Moodle',
    tagline: 'Official Developer Documentation',
    //url: 'https://develop.moodle.org',
    //baseUrl: '/',
    url: 'https://andrewnicols.github.io',
    baseUrl: '/dinodevdocs/',
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

    themeConfig: require('./config/themeConfig.js'),
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
};

module.exports = config;
