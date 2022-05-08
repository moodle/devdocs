---
title: Moodle App Translation
sidebar_label: Translation
sidebar_position: 3
tags:
  - Moodle App
  - Translation
---

:::note TODO
Move this page next to LMS translation page
:::

## Moodle App translations

The Moodle App is being translated into more and more languages! Check out [the latest translation stats](https://moodle.org/plugins/translations.php?plugin=local_moodlemobileapp).

## How do I translate words and phrases used in the Moodle App?

To help with translating, you first need to create an account on the [Moodle translation site](http://lang.moodle.org).

Moodle App strings may be found using this filter: https://lang.moodle.org/local/amos/view.php?t=1&v=l&l=&c=*app&s&d&m=1&a=1

Just select the desired language and click "Save filter" to display them.

### Advanced selection of strings

All strings used in the app are indexed in [the langindex.json file](https://github.com/moodlehq/moodleapp/blob/master/scripts/langindex.json).

They have the following format:

- `"{module}.{string-identifier}": "{component}"` — In this case the string will be translated using the `{string-identifier}` on the `{component}` file.
- `"{module}.{string-identifier}": "{component}/{component-string}"` — In this case the string will be translated using the `{component-string}` on the `{component}` file.

Some examples are:

- `"addon.block_recentlyaccessedcourses.nocourses": "block_recentlyaccessedcourses"` — This means it will use the `nocourses` translation from the `block_recentlyaccessedcourses` component in AMOS.
- `"addon.mod_workshop.yourassessment": "workshop/assessmentbyyourself"` — This means it will use the `assessmentbyyourself` string from the `workshop` component in AMOS.

The `local_moodlemobileapp` component has the specific strings of the Moodle App, but most of the strings are located in other components. To select all the Moodle App strings, click on "Moodle App" below the components selector. This action will auto-select the following:

- Last version available option (it is selected by default). The propagation to other version is done automatically.
- Components used in the App.
- Only strings that are being used in the Moodle App: This will filter only the strings used in every component on the app.

Additionally, you will see a little mobile in the strings used in the app. Hovering over this icon, you can read the string identifier in the app.

## I am not a language pack maintainer. How can I contribute a translation?

The process is the same as for core Moodle. See [Contributing a translation](https://docs.moodle.org/dev/Contributing_a_translation).

Note: Please contact the maintainer of your language pack as listed in the [Translation credits](http://lang.moodle.org/local/amos/credits.php) to tell them that you are translating the Moodle App. If you don't receive a reply within a reasonable time, contact our Moodle translation coordinator, Koen Roggemans, at [translation@moodle.org](mailto:translation@moodle.org).

## When will the translated strings be shown in the Moodle App?

Translations are not automatically synchronised with the app, you will have to wait to the next release to see your latest contributions.

## My language does not appear in the app

Only some languages are available in the app, the selection is done using the following criteria:

- Over 75% of the strings used in the app are available in the language and more than 50 strings are from the `local_moodlemobileapp` component.
- Over 50% of the strings used in the app are available in the language and more than 75 strings are from the `local_moodlemobileapp` component.

This is done to ensure translations are rich enough.

## How can I translate my plugin?

If you are developing a plugin, you'll have to indicate which strings you want to use in the `lang` configuration option. You can learn more about this in the [Moodle App Plugins development guide](./development/plugins-development-guide).
