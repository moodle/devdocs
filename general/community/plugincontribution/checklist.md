---
title: Plugin contribution checklist
sidebar_position: 2
sidebar_label: Checklist
tags:
  - Guidelines for contributors
  - Plugins
  - Plugin documentation
---
Before approaching the [Moodle plugins directory](https://moodle.org/plugins) and submitting your plugin (or a new plugin version), you are encouraged to go through the checklists below and fix eventual issues with your plugin. Doing so will make the reviewer of your plugin happy :-) and may have impact on how long your plugin has to spend in the approval queue before it lands smoothly.

## Meta-data

### Plugin descriptions

- Have a meaningful description of your plugin prepared in English.
- You will need a short concise description (just a sentence or two) for the short description field, and another elaborated one for the full description field.
- It is encouraged to have the same info at the plugin record page and in its `README` file.

### Supported Moodle versions

- New plugins submitted into the plugins directory must support at least one of the currently maintained Moodle version.

:::info

See [Releases](../../releases.md) for the list of currently maintained Moodle versions (policy issue [MDL-47579](https://tracker.moodle.org/browse/MDL-47579)).

:::

### Code repository name

- Provide a consistent experience for other Moodle developers and site administrators - follow the repository naming convention for Moodle plugins: `moodle-{plugintype}_{pluginname}`.

### Source control URL

- Facilitate sharing and further development of your open-source plugin - provide publicly accessible URL of your code repository.
- Github is a choice of most Moodle plugin developers.

### Bug tracker URL

- Encourage participation and have a place to report issues, bugs, make feature requests, or suggest other types of improvements.
- Both [Moodle tracker](../../development/tracker/guide.md) and [Github issues](https://guides.github.com/features/issues/) are common.

:::info

See [Plugin contribution#Tracker](./index.md#tracker) if you want to use the Moodle tracker.

:::

### Documentation URL

- Have a place where further documentation of your plugin will be located.
- [Moodle docs](../../community/plugincontribution/documentation) is preferred location, [Github wikis](https://guides.github.com/features/wikis/) or your own website will work, too.

### Illustrative screenshots

- Capture some screenshots of your plugin to help folks get an idea of what it looks like when installed.
- We will use these screenshots at more places in the plugins directory in the future.

### Licensing

- All files that implement the interface between the Moodle core and the plugin must be licensed under GNU GPL v3 (or later).
- Additional files contained in the plugin ZIP package (such as third party libraries used by the plugin, or included media) may eventually use other license as long as it is [GPL compatible](http://www.gnu.org/licenses/license-list.html#GPLCompatibleLicenses). See [Plugin files#thirdpartylibs.xml](/docs/apis/commonfiles#thirdpartylibsxml) for how to do it.
- Note that binary files violate GPL unless the source code is also included or available (e.g. Java classes or Flash).

### Intellectual property rights

You represent and warrant that any and all intellectual property that you upload or submit via the [Moodle plugins directory](https://moodle.org/plugins) is either your sole and exclusive property or you have secured any and all authorisation, licences and rights to use such intellectual property as applicable under relevant laws. You hereby grant Moodle a licence to use, copy, transmit, store, process and back-up your data, account information, intellectual property and other related information ("Data") and consent to Moodle removing all Data should it determine to do so.

### Subscription needed

- If the plugin requires a third-party subscription based service, make sure the description states it very clearly.
- If the plugin requires some credentials to integrate with an external system (such as API keys etc), the description should provide clear information of where and how the users can obtain them.
- To allow the testing of the plugin functionality, please provide us with demo credentials (such as API keys etc) so that the approval team can use them to see the plugin in action.

## Usability

### Installation

- Make sure the plugin installs smoothly from the ZIP package using the in-build plugin installation interface.
- If any non-standard post-installation steps are needed, make sure they are clearly listed in both plugin description and the `README` file.

### Dependencies

- If the plugin depends on another additional plugin, make sure it is clearly stated in the description and in the `README` file.
- Also declare the dependency explicitly in the plugin's [version.php](/docs/apis/commonfiles/version.php) file.
- Plugins must not require the admin to run **composer** or similar dependency manager tools. Many Moodle admins do not have access to their server shell and/or are not experienced with PHP building tools. Moodle plugins are supposed to be distributed in packages that work out of the box.

### Functionality

- Test the plugin functionality with full developer debugging enabled.
- Make sure the code does not throw unexpected PHP warnings, notices or even errors.

### Cross-DB compatibility

- Test the plugin with multiple database engines supported by Moodle.
- At very least, the plugin is supposed to work with MySQL and PostgreSQL unless reasons are clearly explained in the description and the `README` file (such as the plugin is a wrapper for third-party DB specific utility).

:::info

[Data manipulation API](/docs/apis/core/dml) helps you to ensure cross-db compatibility.

:::

## Coding

### Coding style

- It is encouraged to follow [Moodle coding style](../../development/policies/codingstyle) and other [coding guidelines](../../development/policies.md).
- It's not always possible to achieve "all greens" in automated syntax checks (especially when third party libraries are involved) but you should aim to it.
- Consistent style helps others to read and understand your code (not only during the approval review).

### English

- Moodle is an international project. To facilitate sharing, reviews of and contributions to your code, all comments, variable names, function names etc. should be in English.

### Boilerplate

- All files should contain the common boilerplate at the beginning with explicit GPL license statement.

:::info

See the section [Coding style#Files](../../development/policies/codingstyle/index.md#files) for the template.

:::

### Copyrights

- All files should contain the `@copyright` tag with your name.
- If you are re-using someone else's file, keep the original copyrights reference to the previous author and add your name as a copyright holder.
- Both things should be clear: (1) that it is you to be blamed for the file code and (2) that your work is based on someone else's work.

```php
/**
 * @copyright John Smith <john.smith@example.com>
 * @copyright based on work by Mary Stuart <mary.stuart@example.com>
 */
```

### CSS styles

- All styles.css files from all plugins are concatenated, cached and served as a one big resource on all pages of the given Moodle installation.
- For that reason, plugins must use properly namespaced selectors so that their style sheets can be safely combined with others without affecting other pages and elements beyond the plugin's scope.
- Plugin specific CSS selectors are needed to make sure that your styling does not accidentally affect other parts of Moodle outside your plugin scope.

:::tip Example

Instead of the selector `.contentarea` it is better to use something like `.path-mod-mymodule .contentarea` as the `.path-\*` classes are automatically added by the Moodle core renderers to the HTML `<body>` tag.

:::

### Namespace collisions

- Check that all your DB tables, settings, functions, classes, constants and variables are named correctly. In most cases their names must start with the plugin type and plugin name, as in `block_yourname_something` (so called [frankenstyle](../../development/policies/codingstyle/frankenstyle.md) prefix). Modules are an exception to this rule as functions such as get_coursemodule_from_id() rely on there being no preface of 'mod'.
- Do not define own classes, functions, variables or constants in the top-level scope (global space) without the valid frankenstyle prefix.

:::info

See [Coding style#Functions and Methods](../../development/policies/codingstyle/index.md#functions-and-methods) for details.

:::

### Settings storage

- Check that your settings are stored in the table `config_plugins` and not in the main `config` table.
- This helps to avoid `$CFG` bloat and potential collisions.
- Use `get_config()` to pull the settings data out of the `config_plugins` table.
- In the file ```settings.php```, the setting names are supposed to be `plugintype_pluginname/settingname` (note the slash) and not `plugintype_pluginname_settingname` or even just `settingname`.
- If you eventually need to change the settings yourself, use `set_config()`.

### Strings

- Avoid hard-code texts in the code, always use `get_string()`.
- Just the English strings should ship with the plugin. All other translations are supposed to be submitted as contributions at [https://lang.moodle.org](https://lang.moodle.org) once your plugin is approved - see [Translating plugins](https://docs.moodle.org/dev/Translating_plugins).
- Your code must not rely on trailing and leading whitespace in strings.
- The string file must be considered as pure data file with the syntax `$string[]('id') = 'value';`. No other PHP syntax such as [concatenation](http://php.net/manual/en/language.operators.string.php),  [heredoc and nowdoc](http://php.net/manual/en/language.types.string.php) is supported by the tools that we use when processing your strings (even if it may work in Moodle itself).
- The English language pack (`lang/en/`) in Moodle does not use "Capitalised Titles".

### Privacy

- Avoid gathering, storing, processing and sharing personal data unless they are needed for the plugin functionality.
- For plugins that integrate with an external system, privacy API implementation is required prior approval in the plugins directory (most notably the meta-data provider part).

:::info

Inform about all the personal data that the plugin processes, via both description and the [Privacy API](/docs/apis/subsystems/privacy/).

:::

### Security

- Never trust the user input.
- Do not access superglobals like `$_REQUEST` directly, use wrappers like <tt>required_param()</tt> with correct type declared to sanitize input.
- Always use placeholders in custom SQL queries (`?` or `:named`).
- Always check for the `sesskey` before taking an action on submitted data.
- Check for `require_login()`.
- Always check that the user has appropriate capabilities before displaying the widgets *and* before taking the actual action.
- Avoid using malicious functions like `call_user_func()`, `eval()`, `unserialize()` and so on, especially when they would be called with user-supplied data.

## Approval blockers

Examples of issues that will prevent your plugin from being approved:

1. There is no public and transparent issue tracker where the community members can leave feedback, report bugs and suggest improvements.
1. Your SQL fails to work on PostgreSQL even when working on MySQL.
1. [Namespace collisions](../../development/policies/codingstyle/frankenstyle.md).
1. Compliance with [security guidelines](../../development/policies/security/index.md).
1. It integrates with an external system and does not have the privacy API correctly implemented.
1. It is an activity module and does not have the backup and restore API implemented.

## See also

- [Some common issues in submitted plugins](https://moodle.org/mod/forum/discuss.php?d=263614) post at the Plugins traffic forum at moodle.org
- [Moodle Coding Style](https://moodle.org/mod/forum/discuss.php?d=371967) forum thread at the General Developer Forum at moodle.org
- [Plugin files](/docs/apis/commonfiles) has a list and descriptions of files that work the same in all plugin types
