---
title: BigBlueButton activity extensions
tags:
  - mod_bigbluebuttonbn
  - bbbext
  - plugintype
  - subplugin
---

<Since version="4.3" issueNumber="MDL-76710" />

The [BigBlueButton activity](https://docs.moodle.org/en/BigBlueButton) supports a subplugin type, `bbbext`, which lets third-party code extend or override the behaviour of the activity without patching `mod_bigbluebuttonbn` itself. This is the supported way to add features to BigBlueButton activities, and it keeps your customisations upgrade-safe.

A `bbbext` subplugin can, for example:

- Add extra fields to the activity settings form, persist them in its own tables, and validate them.
- Contribute custom activity completion rules.
- Add parameters to the URLs used to create meetings and join sessions.
- React to meeting lifecycle events reported back by BigBlueButton.
- Add entries to, or completely replace, the activity's settings navigation.
- Override what is rendered on the activity view page.

The reference implementation of this subplugin type is `bbbext_bnx`, which ships in the `extension/bnx` directory of `mod_bigbluebuttonbn`.

## How extensions are discovered {/* #discovery */}

Each hook point is backed by a base class or interface in the `mod_bigbluebuttonbn\local\extension` namespace. To participate in a hook, a subplugin provides a class that extends the relevant base class (or implements the relevant interface) and lives at a fixed, predictable location:

```
\bbbext_<name>\bigbluebuttonbn\<basename>
```

where `<name>` is the subplugin name and `<basename>` is the short class name of the base class (for example `mod_form_addons` or `navigation_append_addon`). `mod_bigbluebuttonbn` scans all installed, enabled `bbbext` subplugins, and for each hook it instantiates every class it finds at that path that is a subclass of the corresponding base class. There is no registration file: matching the name and location _is_ the contract.

A subplugin only needs to provide classes for the hooks it actually uses; every hook is optional.

The order in which extensions are invoked follows the sort order configured on the **Manage BigBlueButton extensions** admin page. This matters for hooks that _append_ (every matching extension is called in order) and for hooks that _override_ (only the first matching extension is used). See each hook's reference below.

## File structure {/* #file-structure */}

import { ComponentFileSummary } from '../../../_utils';

`bbbext` subplugins are located in the `mod/bigbluebuttonbn/extension` directory. Each subplugin is in its own subdirectory, whose name is the subplugin's `<name>`, giving a component name of `bbbext_<name>`.

A subplugin consists of a small number of _mandatory files_, one class per hook it implements, and any other files it needs.

<details>
  <summary>View an example directory layout for a minimal `bbbext_example` subplugin.</summary>

```console
mod/bigbluebuttonbn/extension/example
├── classes
│   ├── bigbluebuttonbn
│   │   ├── action_url_addons.php
│   │   ├── custom_completion_addons.php
│   │   ├── mod_form_addons.php
│   │   ├── mod_instance_helper.php
│   │   ├── navigation_append_addon.php
│   │   ├── navigation_override_addon.php
│   │   └── view_page_addons.php
│   └── privacy
│       └── provider.php
├── db
│   └── install.xml
├── lang
│   └── en
│       └── bbbext_example.php
├── settings.php
└── version.php
```

</details>

All the hook classes live under `classes/bigbluebuttonbn/`, so that they autoload as `\bbbext_<name>\bigbluebuttonbn\<basename>`. See the [common plugin files](../../commonfiles/index.mdx) documentation for details of other files (such as `db/access.php`, `db/events.php`, backup classes, or a privacy provider) that may be useful in your plugin.

### version.php {/* #versionphp */}

<ComponentFileSummary
    filepath="/version.php"
    required
    summary="Version and dependency metadata for the subplugin"
/>

As with any Moodle plugin, `version.php` declares the component and its version metadata. The component name must be `bbbext_<name>`:

```php title="version.php"
<?php
defined('MOODLE_INTERNAL') || die();

$plugin->component = 'bbbext_example';
$plugin->version   = 2025010100;
$plugin->requires  = 2024100700; // Requires a Moodle version that ships the bbbext hooks you use.
$plugin->maturity  = MATURITY_STABLE;
$plugin->release   = '1.0';
```

### Language file {/* #language-file */}

<ComponentFileSummary
    filepath="/lang/en/bbbext_example.php"
    required
    summary="Language strings for the subplugin"
/>

At minimum the language file must define `pluginname`, which is used by the admin **Manage BigBlueButton extensions** page and elsewhere:

```php title="lang/en/bbbext_example.php"
<?php
defined('MOODLE_INTERNAL') || die();

$string['pluginname'] = 'Example BigBlueButton extension';
```

The human-readable name of the subplugin _type_ itself (`subplugintype_bbbext` and `subplugintype_bbbext_plural`) is defined by the parent `mod_bigbluebuttonbn` plugin, not by individual subplugins.

### settings.php {/* #settingsphp */}

<ComponentFileSummary
    filepath="/settings.php"
    summary="Admin settings for the subplugin (optional)"
/>

If present, `settings.php` is loaded into the admin tree by the `bbbext` plugininfo class under the BigBlueButton extensions category. Use the standard `$settings` object provided to the file, exactly as for any other plugin type.

## Hook reference {/* #hooks */}

Each of the following hooks is optional. To use one, add a class at the path shown that extends the given base class (or implements the given interface).

### Activity settings form {/* #mod-form-addons */}

Extend `\mod_bigbluebuttonbn\local\extension\mod_form_addons` in `classes/bigbluebuttonbn/mod_form_addons.php` to add fields to the activity settings form, validate them, and post-process the submitted data. The parent form calls every matching extension when the form is built.

The base class receives the `MoodleQuickForm`, the current instance data (if any), and the form field suffix through its constructor, exposed as `$this->mform`, `$this->bigbluebuttonbndata`, and `$this->suffix`. You must implement `add_fields()`, `validation()`, `data_postprocessing()`, and `add_completion_rules()`; `completion_rule_enabled()` and `definition_after_data()` may be overridden as needed.

```php title="classes/bigbluebuttonbn/mod_form_addons.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

use stdClass;

class mod_form_addons extends \mod_bigbluebuttonbn\local\extension\mod_form_addons {
    public function add_fields(): void {
        $this->mform->addElement('advcheckbox', 'example_enable', get_string('example_enable', 'bbbext_example'));
        $this->mform->setType('example_enable', PARAM_BOOL);
    }

    public function validation(array $data, array $files): array {
        return [];
    }

    public function data_postprocessing(stdClass &$data): void {
        // Normalise or derive values on $data before it is persisted.
    }

    public function add_completion_rules(): array {
        return [];
    }
}
```

Any fields you add here should be persisted through the [instance lifecycle hook](#mod-instance-helper).

### Instance lifecycle and additional tables {/* #mod-instance-helper */}

Extend `\mod_bigbluebuttonbn\local\extension\mod_instance_helper` in `classes/bigbluebuttonbn/mod_instance_helper.php` to persist extension data when a BigBlueButton activity is created, updated, or deleted, and to declare any additional database tables your subplugin joins to an instance.

Every table returned by `get_join_tables()` must contain a `bigbluebuttonbnid` column that references the BigBlueButton instance; tables without it are ignored (with a debugging message). These tables are used by core to build the full instance record.

```php title="classes/bigbluebuttonbn/mod_instance_helper.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

use stdClass;

class mod_instance_helper extends \mod_bigbluebuttonbn\local\extension\mod_instance_helper {
    public function add_instance(stdClass $bigbluebuttonbn) {
        global $DB;
        $DB->insert_record('bbbext_example', (object) [
            'bigbluebuttonbnid' => $bigbluebuttonbn->id,
            'enable' => $bigbluebuttonbn->example_enable ?? 0,
        ]);
    }

    public function update_instance(stdClass $bigbluebuttonbn): void {
        // Update your extension's records for $bigbluebuttonbn->id.
    }

    public function delete_instance(int $cmid): void {
        // Clean up your extension's records.
    }

    public function get_join_tables(): array {
        return ['bbbext_example'];
    }
}
```

### Custom completion rules {/* #custom-completion-addons */}

<Since version="4.4" issueNumber="MDL-77660" />

Extend `\mod_bigbluebuttonbn\local\extension\custom_completion_addons` in `classes/bigbluebuttonbn/custom_completion_addons.php` to contribute activity completion rules. This works together with the completion rules you register on the settings form via `mod_form_addons::add_completion_rules()`.

You must implement `get_state()`, the static `get_defined_custom_rules()`, `get_custom_rule_descriptions()`, and `get_sort_order()`. The base class constructor provides `$this->cm`, `$this->userid`, and `$this->completionstate`.

```php title="classes/bigbluebuttonbn/custom_completion_addons.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

use core_completion\activity_custom_completion;

class custom_completion_addons extends \mod_bigbluebuttonbn\local\extension\custom_completion_addons {
    public static function get_defined_custom_rules(): array {
        return ['completionexample'];
    }

    public function get_state(string $rule): int {
        // Return COMPLETION_COMPLETE or COMPLETION_INCOMPLETE for $rule.
        return COMPLETION_INCOMPLETE;
    }

    public function get_custom_rule_descriptions(): array {
        return ['completionexample' => get_string('completionexample', 'bbbext_example')];
    }

    public function get_sort_order(): array {
        return ['completionexample'];
    }
}
```

### Meeting action URLs {/* #action-url-addons */}

Extend `\mod_bigbluebuttonbn\local\extension\action_url_addons` in `classes/bigbluebuttonbn/action_url_addons.php` to add parameters to the URLs that `mod_bigbluebuttonbn` sends to BigBlueButton (for example when creating a meeting or building a join URL).

Every matching extension's `execute()` is called and the results are merged, so by contract an extension must return **only** the parameters it wants to add, under the `data` and `metadata` keys — never the input it received. This keeps extensions independent and prevents one extension from clobbering another's contribution.

```php title="classes/bigbluebuttonbn/action_url_addons.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

class action_url_addons extends \mod_bigbluebuttonbn\local\extension\action_url_addons {
    public function execute(string $action = '', array $data = [], array $metadata = [], ?int $instanceid = null): array {
        // Return only what this extension adds.
        return [
            'data' => ['meta_example' => 'value'],
            'metadata' => [],
        ];
    }
}
```

### Meeting events {/* #broker-meeting-events-addons */}

Extend `\mod_bigbluebuttonbn\local\extension\broker_meeting_events_addons` in `classes/bigbluebuttonbn/broker_meeting_events_addons.php` to react to meeting lifecycle events that BigBlueButton reports back to Moodle. Every matching extension is instantiated with the `instance` and the raw event payload and has its `process_action()` method called.

```php title="classes/bigbluebuttonbn/broker_meeting_events_addons.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

class broker_meeting_events_addons extends \mod_bigbluebuttonbn\local\extension\broker_meeting_events_addons {
    public function process_action() {
        // $this->instance and $this->data are available here.
    }
}
```

### Settings navigation (append) {/* #navigation-append-addon */}

<Since version="5.3" issueNumber="MDL-84799" />

Implement `\mod_bigbluebuttonbn\local\extension\navigation_append_addon` in `classes/bigbluebuttonbn/navigation_append_addon.php` to add nodes to the activity's settings navigation. All extensions implementing this interface are called, in admin-configured order, _after_ the core navigation has been built — unless an [override](#navigation-override-addon) is present, in which case appenders are not called.

```php title="classes/bigbluebuttonbn/navigation_append_addon.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

class navigation_append_addon implements \mod_bigbluebuttonbn\local\extension\navigation_append_addon {
    public function append_settings_navigation(\settings_navigation $settingsnav, \navigation_node $nodenav): void {
        $nodenav->add(
            get_string('example_nav', 'bbbext_example'),
            new \moodle_url('/mod/bigbluebuttonbn/extension/example/index.php'),
            \navigation_node::TYPE_SETTING
        );
    }
}
```

### Settings navigation (override) {/* #navigation-override-addon */}

<Since version="5.3" issueNumber="MDL-84799" />

Implement `\mod_bigbluebuttonbn\local\extension\navigation_override_addon` in `classes/bigbluebuttonbn/navigation_override_addon.php` to replace the settings navigation entirely. Only the **first** matching extension (by admin-configured order) is used; when an override is present, the core navigation logic and all appenders are skipped.

```php title="classes/bigbluebuttonbn/navigation_override_addon.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

class navigation_override_addon implements \mod_bigbluebuttonbn\local\extension\navigation_override_addon {
    public function override_settings_navigation(\settings_navigation $settingsnav, \navigation_node $nodenav): void {
        // Build the settings navigation from scratch.
    }
}
```

### Activity view page {/* #view-page-addons */}

<Since version="5.3" issueNumber="MDL-84903" />

Extend `\mod_bigbluebuttonbn\local\extension\view_page_addons` in `classes/bigbluebuttonbn/view_page_addons.php` to override what is rendered on the activity's view page. The base class extends the core `mod_bigbluebuttonbn\output\view_page` renderable, so your class is a drop-in replacement rendered in its place.

Only the **first** matching extension is used. When present, it fully replaces the default view page rendering; if no extension provides this class, the default view page is used.

```php title="classes/bigbluebuttonbn/view_page_addons.php"
<?php
namespace bbbext_example\bigbluebuttonbn;

use mod_bigbluebuttonbn\instance;
use renderer_base;
use stdClass;

class view_page_addons extends \mod_bigbluebuttonbn\local\extension\view_page_addons {
    /** @var instance */
    protected $instance;

    public function __construct(instance $instance) {
        $this->instance = $instance;
    }

    public function export_for_template(renderer_base $output): stdClass {
        // Return the template context for your overridden view.
        return (object) [];
    }
}
```

## Language strings {/* #language-strings */}

The only string a subplugin is strictly required to define is `pluginname`, in `lang/en/bbbext_<name>.php`. Beyond that, define strings for anything your subplugin surfaces to users, following the usual conventions:

- form field labels and their `_help` strings for fields added in `mod_form_addons`;
- completion rule labels used by `custom_completion_addons::get_custom_rule_descriptions()`;
- navigation node labels;
- setting labels and descriptions for `settings.php`;
- capability descriptions (`<component>:<capability>`) if you declare capabilities in `db/access.php`.

The `subplugintype_bbbext` and `subplugintype_bbbext_plural` strings that name the subplugin type as a whole are owned by `mod_bigbluebuttonbn`.

## Reference implementation {/* #reference-implementation */}

For a complete, working example that exercises most of the hooks above — including the settings form, instance persistence with additional tables, action URL parameters, settings navigation, and a view page override — see the `bbbext_bnx` subplugin, which ships in the `extension/bnx` directory of [mod_bigbluebuttonbn](https://github.com/blindsidenetworks/moodle-mod_bigbluebuttonbn).

Minimal, single-purpose examples used to test the subplugin type — useful when you want to see one hook in isolation — can be found in the test subplugins developed alongside it, such as [moodle-bbbext_simple](https://github.com/blindsidenetworks/moodle-bbbext_simple).
