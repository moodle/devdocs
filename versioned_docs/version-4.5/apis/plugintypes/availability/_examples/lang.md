<!-- markdownlint-disable first-line-heading -->

Each plugin must define a set of language strings with, at a minimum, an English translation. These are specified in the plugin's lang/en directory in a file named after the plugin. For example the LDAP authentication plugin:

Language strings for the plugin. Required strings:

- **pluginname** - name of plugin.
- **title** - text of button for adding this type of plugin.
- **description** - explanatory text that goes alongside the button in the 'add restriction' dialog.

You will usually need to add your own strings for two main purposes:

- Creating suitable form controls for users who are editing the activity settings.
- Displaying information about the condition.
