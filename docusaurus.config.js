// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const VersionsArchived = require('./versionsArchived.json');
const ArchivedVersionsDropdownItems = Object.entries(VersionsArchived).splice(
  0,
  5,
);


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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Moodle',
        logo: {
          alt: 'Moodle',
          src: 'img/Moodle_M_icon.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'gettingstarted/quickstart',
            position: 'left',
            label: 'Guides',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/community', label: 'Community', position: 'left'},

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
            href: 'https://github.com/moodle/moodle',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      // Customisation for the left sidebar:
      autoCollapseSidebarCategories: true,
      hideableSidebar: true,

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
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
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/moodlehq',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Moodle Pty Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
           'php',
            'handlebars',
        ],
          lineNumbers: true
      },
    }),
};

module.exports = config;
