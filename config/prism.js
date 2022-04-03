const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

module.exports = {
    theme: lightCodeTheme,
    darkTheme: darkCodeTheme,
    additionalLanguages: [
        // Note: Do not add handlebars here.
        // We get colour highlighting without adding it as a language, and adding it to this list actually breaks the
        // formatting.
        'php',
    ],
};
