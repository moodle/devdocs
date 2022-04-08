const VersionsArchived = require('../versionsArchived.json');
const ArchivedVersionsDropdownItems = Object.entries(VersionsArchived).splice(
  0,
  5,
);

const navbar = {
    title: 'Moodle',
    logo: {
        alt: '',
        src: 'img/Moodle_M_icon.svg',
        height: '32px',
        width: '32px',
    },
    items: [
        {
            type: 'doc',
            docId: 'gettingstarted/quickstart',
            position: 'left',
            label: 'Guides',
        },
        {to: '/general/community', label: 'Community', position: 'left'},
        {to: '/general/development', label: 'Process & policies', position: 'left'},

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
};

module.exports = navbar;
