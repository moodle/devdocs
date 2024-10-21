<!-- markdownlint-disable first-line-heading -->
<!-- cspell:ignore choosereadme, configtitle -->

Each plugin must define a set of language strings with, at a minimum, an English translation. These are specified in the plugin's lang/en directory in a file named after the plugin.

Language strings for the plugin. Required strings:

- **`pluginname`** - name of plugin.
- **`choosereadme`** - descriptive text displayed beneath the theme information dialog screenshot.
- **`configtitle`** - settings text for this type of plugin.

You will usually need to add your own strings for two main purposes:

- Creating suitable form controls for users who are editing the theme settings; and
- Displaying information about the theme.
