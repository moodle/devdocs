---
title: Placements
tags:
  - AI
  - LLM
  - Placement
---

The aim of Placements is to provide a consistent UX and UI for users when they use AI backed functionality.

Placement plugins leverage the functionality of the other components of the AI subsystem.
This means plugin authors can focus on how users interact with the AI functionality, without needing to
implement the AI functionality itself.

Because Placements are LMS plugins in their own right and are not "other" types of LMS plugins,
it gives great flexibility in how AI functionality is presented to users.

:::warning The Golden Rule:

Placements DO NOT know about Providers, and Providers DO NOT know about Placements.
Everything should go via the Manager.

:::

Placements are defined as classes in their own namespace according to their plugin name.
The naming convention for Action classes is `aiplacement_<plugin name>`,
for example: `aiplacement_editor`. With corresponding namespaces.

Each Placement MUST inherit from the `\core_ai\placement` abstract class.
They must also implement the following methods:

- `get_action_list(): array` This is the list of Actions that are supported by this Placement, for example the `aiplacement_editor` plugin defines this as:

```php
public function get_action_list(): array {
    return [
        \core_ai\aiactions\generate_text::class,
        \core_ai\aiactions\generate_image::class,
    ];
}
```

## Capabilities and Permissions

Placements are responsible for determining who and where a Placement (and by extension an Action can be used).
It is not the job of Actions or Providers to determine access.

## Action Processing

The following is the basic workflow in order for a placement to have an action processed for a user request:

- The Placement instantiates a new action object of type they wish to use.
- The action must be instantiated and passing it the required data. Each action will define what configuration it needs. As an example:

```php
// Prepare the action.
$action = new \core_ai\aiactions\generate_image(
    contextid: $contextid,
    userid: $USER->id,
    prompttext: $prompttext,
    quality: $quality,
    aspectratio: $aspectratio,
    numimages: $numimages,
    style: $style,
);
```

- The Placement then instantiates the Manager class and calls `process_action()`
- passing in the configured action object:

```php
// Send the action to the AI manager.
$manager = \core\di::get(\core_ai\manager::class);
$response = $manager->process_action($action);
```

- The process_action() method will then return a response object (instance of `responses\response_base`).
- It is up to the Placement to check for success (or not) of the response and pass the result back to the
  user or for further processing.

## Plugin Structure

Placement plugins reside in the `ai/placement` directory.

Each Placement is in a separate subdirectory and consists of a number of mandatory files and any other
files the developer is going to use.

The following is the typical structure of a Placement plugin, using the Editor Placement as an example:

```bash
.
├── classes
│   ├── external
│   │   ├── generate_image.php
│   │   └── generate_text.php
│   ├── placement.php
│   └── privacy
│       └── provider.php
├── db
│   ├── access.php
│   └── services.php
├── lang
│   └── en
│       └── aiplacement_editor.php
└── version.php

```

## Settings

Settings for the Placement should be defined in the `settings.php` file.
Each Placement plugin should create a new admin settings page using `core_ai\admin\admin_settingspage_provider` class.

This is the same as for Provider plugins, for example:

```php
use core_ai\admin\admin_settingspage_provider;

if ($hassiteconfig) {
    // Placement specific settings heading.
    $settings = new admin_settingspage_provider(
        'aiprovider_openai',
        new lang_string('pluginname', 'aiprovider_openai'),
        'moodle/site:config',
        true,
    );

...
```
