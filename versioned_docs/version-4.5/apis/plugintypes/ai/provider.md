---
title: Providers
tags:
  - AI
  - LLM
  - Provider
---

Providers are the interface between the [AI subsystem](/apis/subsystems/ai/index.md) and external AI.
Their focus should be on converting the data requested into the format needed
by the external AI, and then correctly providing the response back.

Incoming data to the Provider plugin arrives via the Manager `core_ai\manager`.
The Manager is the connective tissue between the Provider and the [Placement](/apis/plugintypes/ai/placement.md) plugins.
Likewise, all responses from the Provider plugin are handed back to the Manager before being passed to the Placement plugin.

:::warning The Golden Rule:

Placements **do not** know about Providers, and Providers **do not** know about Placements.
Everything should go via the Manager.

:::

## Class implementation

Providers are defined as classes in their own namespace according to their plugin name.
The naming convention for a Provider class is `aiprovider_<plugin name>`.
For example: `aiprovider_openai`, or `aiprovider_azureai` (with a corresponding namespace).

Each Provider **must** inherit from the `\core_ai\provider` abstract class.
They must also implement the following methods:

**`get_action_list(): array`**

This is the list of Actions that are supported by this Provider, for example the `aiprovider_openai` plugin defines this as:

```php
public function get_action_list(): array {
    return [
        \core_ai\aiactions\generate_text::class,
        \core_ai\aiactions\generate_image::class,
        \core_ai\aiactions\summarise_text::class,
    ];
}
```

**`is_provider_configured(): bool`**

Each provider will need to specify what it takes to be considered as configured.
It is likely that each provider will have a set of keys necessary to access the external AI API.

The `is_provider_configured()` must return `true` for UI component visibility and functionality. If not overridden, it will
return `false` by default.

For example, the `aiprovider_azureai` provider checks values are set for `$this->apikey` and `$this->apiendpoint` and returns
the result.

```php
public function is_provider_configured(): bool {
    return !empty($this->apikey) && !empty($this->apiendpoint);
}
```

## Process classes

For each action supported by the provider, the provider plugin **must** implement a `process_<action>` class,
where `<action>` is the name of the action. For example: `process_generate_image`.

Every process action class **must** inherit from the `\core_ai\process_base` abstract class.

The process action class **must** implement a `process()` method. This method is responsible for
converting the data requested by an Action into the format needed by the external AI services API,
and then correctly providing the response back from the AI in an Action Response object.

The process action classes and process method are expected by the manager to exist and be callable.

As most provider plugins will support more than one action, it is recommended to create an
`abstract_processor` class that inherits from the `\core_ai\process_base` class and then have each
process action class inherit from this abstract class.

For example, the `aiprovider_openai` plugin defines an `abstract_processor` class that inherits from
the `\core_ai\process_base` class and then the `process_generate_image`, `process_generate_text` and
`process_summarise_text` classes inherit from this abstract class.

This can be visualised as follows:

```mermaid
graph TD;
    A[process_base] --> B[abstract_processor]
    B[abstract_processor] --> C[process_generate_image]
    B --> D[process_generate_text]
    B --> E[process_summarise_text]
 ```

Apart from this, Providers are free to define their own structure. It should be kept in mind that Providers
are designed to be a 'thin wrapper' around the external AI systems API. They shouldn't store data,
or have their own UI elements (beyond what is required for configuration).

## Plugin structure

Provider plugins reside in the `ai/provider` directory.

Each Provider is in a separate subdirectory and consists of a number of mandatory files and any other
files the developer is going to use.

<details>
  <summary>The typical directory layout for the Provider plugin, using OpenAI Provider as an example:</summary>

```console
.
├── classes
│   ├── abstract_processor.php
│   ├── privacy
│   │   └── provider.php
│   ├── process_generate_image.php
│   ├── process_generate_text.php
│   ├── process_summarise_text.php
│   └── provider.php
├── lang
│   └── en
│       └── aiprovider_openai.php
├── settings.php
├── tests
│   ├── fixtures
│   │   ├── image_request_success.json
│   │   ├── test.jpg
│   │   └── text_request_success.json
│   ├── process_generate_image_test.php
│   ├── process_generate_text_test.php
│   ├── process_summarise_text_test.php
│   └── provider_test.php
└── version.php

```

</details>

## Settings

Settings for the Provider should be defined in the `settings.php` file.
Each Provider plugin should create a new admin settings page using `core_ai\admin\admin_settingspage_provider` class.

For example, the `aiprovider_openai` plugin defines this:

```php
use core_ai\admin\admin_settingspage_provider;

if ($hassiteconfig) {
    // Provider specific settings heading.
    $settings = new admin_settingspage_provider(
        'aiprovider_openai',
        new lang_string('pluginname', 'aiprovider_openai'),
        'moodle/site:config',
        true,
    );
...
```

## Rate limiting

It is recommended that Providers implement rate limiting to prevent abuse of the external AI services.

To assist with this, the AI subsystem provides a `core_ai\rate_limiter` class that can be used to implement rate limiting.
This class supports both user and system level rate limiting.

This should be implemented in a `is_request_allowed()` method in the Provider class. For example, from the
`aiprovider_openai` plugin:

```php
/**
 * Check if the request is allowed by the rate limiter.
 *
 * @param aiactions\base $action The action to check.
 * @return array|bool True on success, array of error details on failure.
 */
public function is_request_allowed(aiactions\base $action): array|bool {
    $ratelimiter = \core\di::get(rate_limiter::class);
    $component = \core\component::get_component_from_classname(get_class($this));

    // Check the user rate limit.
    if ($this->enableuserratelimit) {
        if (!$ratelimiter->check_user_rate_limit(
            component: $component,
            ratelimit: $this->userratelimit,
            userid: $action->get_configuration('userid')
        )) {
            return [
                'success' => false,
                'errorcode' => 429,
                'errormessage' => 'User rate limit exceeded',
            ];
        }
    }

    // Check the global rate limit.
    if ($this->enableglobalratelimit) {
        if (!$ratelimiter->check_global_rate_limit(
            component: $component,
            ratelimit: $this->globalratelimit
        )) {
            return [
                'success' => false,
                'errorcode' => 429,
                'errormessage' => 'Global rate limit exceeded',
            ];
        }
    }

    return true;
    }
```

If implementing rate limiting, settings for the rate limits should be provided in the plugin settings.

For example, the `aiprovider_openai` plugin provides settings for the user and global rate limits:

```php
// Setting to enable/disable global rate limiting.
$settings->add(new admin_setting_configcheckbox(
    'aiprovider_openai/enableglobalratelimit',
    new lang_string('enableglobalratelimit', 'aiprovider_openai'),
    new lang_string('enableglobalratelimit_desc', 'aiprovider_openai'),
    0,
));

// Setting to set how many requests per hour are allowed for the global rate limit.
// Should only be enabled when global rate limiting is enabled.
$settings->add(new admin_setting_configtext(
    'aiprovider_openai/globalratelimit',
    new lang_string('globalratelimit', 'aiprovider_openai'),
    new lang_string('globalratelimit_desc', 'aiprovider_openai'),
    100,
    PARAM_INT,
));
$settings->hide_if('aiprovider_openai/globalratelimit', 'aiprovider_openai/enableglobalratelimit', 'eq', 0);

// Setting to enable/disable user rate limiting.
$settings->add(new admin_setting_configcheckbox(
    'aiprovider_openai/enableuserratelimit',
    new lang_string('enableuserratelimit', 'aiprovider_openai'),
    new lang_string('enableuserratelimit_desc', 'aiprovider_openai'),
    0,
));

// Setting to set how many requests per hour are allowed for the user rate limit.
// Should only be enabled when user rate limiting is enabled.
$settings->add(new admin_setting_configtext(
    'aiprovider_openai/userratelimit',
    new lang_string('userratelimit', 'aiprovider_openai'),
    new lang_string('userratelimit_desc', 'aiprovider_openai'),
    10,
    PARAM_INT,
));
$settings->hide_if('aiprovider_openai/userratelimit', 'aiprovider_openai/enableuserratelimit', 'eq', 0);
```
