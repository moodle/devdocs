---
title: Moodle 4.3 developer update
tags:
- Core development
- Moodle 4.3
---

<!-- markdownlint-disable no-inline-html -->

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page highlights the important changes that are coming in Moodle 4.3 for developers.

## Database table and column names

Starting with Moodle 4.3 the limits for both table and column names have been raised. Now table names can be up to 53 characters long (from previous 28 characters limit) and column names can be up to 63 characters long (from previous 30 characters limit).

:::caution
In order to achieve the above, the maximum length for the database prefix (`$CFG->prefix`) is now 10 characters. Installation or upgrade won't be possible with longer prefixes.
:::

:::caution
If you are writing a plugin intended for older versions of Moodle then you must continue to use the lower limits of 28, and 30.
:::

## Activity badge

The new activity card design proposed for Moodle 4.3 differentiates badge information from other HTML content (displayed using the pre-existing `afterlink` feature).
A new `core_courseformat\output\activitybadge` class has been added to let modules extend it to display any content in a badge near the activity name.
Some considerations about its main features:

- The badge content is always plain text (no HTML).
- The badge style can be set (by default is initialized with badge-none, but it can be set by any module).
- An optional URL to redirect the user when the badge is clicked.
- An optional ID to add the element in case the module wants to add some JS to the badge events.
- Optionally, any other extra HTML attributes to the badge element (for example, data attributes).

:::danger `Afterlink` vs `ActivityBadge`

The content of the `afterlink` feature has been moved to the end of the activity card so modules using it should check this new feature which might fit better.

:::

Plugins can implement `mod_PLUGINNAME\output\courseformat\activitybadge` that extends from the original `core_courseformat\output\activitybadge` class that has been added from Moodle 4.3 onwards. This new class will delegate most data attributes to protected methods, so plugins will only need to implement the `update_content()` method, to set these attributes accordingly: `content`, `style`, `url`, `elementid` and `extrattributes`.

```php title="course/format/classes/output/activitybadge.php"
namespace core_courseformat\output;

abstract class activitybadge implements named_templatable, \renderable {

    /** @var array Badge defined styles. */
    public const STYLES = [
        'none' => 'badge-none',
        'dark' => 'badge-dark',
        'danger' => 'badge-danger',
        'warning' => 'badge-warning',
        'info' => 'badge-info',
    ];

    /** @var cm_info The course module information. */
    protected $cminfo = null;

    /** @var string The content to be displayed in the activity badge.  */
    protected $content = null;

    /** @var string The style for the activity badge.  */
    protected $style = self::STYLES['none'];

    /** @var \moodle_url An optional URL to redirect the user when the activity badge is clicked.  */
    protected $url = null;

    /** @var string An optional element id in case the module wants to add some code for the activity badge (events, CSS...). */
    protected $elementid = null;

    /**
     * @var array An optional array of extra HTML attributes to add to the badge element (for example, data attributes).
     * The format for this array is [['name' => 'attr1', 'value' => 'attrval1'], ['name' => 'attr2', 'value' => 'attrval2']].
     */
    protected $extraattributes = [];

    [...]

    abstract protected function update_content(): void;

}
```

As a proof of concept, this feature has been implemented by:

- **Forum**, to display the unread messages.

    ```php title="mod/forum/classes/output/courseformat/activitybadge.php"
    namespace mod_forum\output\courseformat;

    class activitybadge extends \core_courseformat\output\activitybadge {

        protected function update_content(): void {
            global $CFG;

            require_once($CFG->dirroot . '/mod/forum/lib.php');

            if (forum_tp_can_track_forums()) {
                if ($unread = forum_tp_count_forum_unread_posts($this->cminfo, $this->cminfo->get_course())) {
                    if ($unread == 1) {
                        $this->content = get_string('unreadpostsone', 'forum');
                    } else {
                        $this->content = get_string('unreadpostsnumber', 'forum', $unread);
                    }
                    $this->style = self::STYLES['dark'];
                }
            }
        }
    }
    ```

- **Resource**, to show the file type (extension). The rest of the resource information (size and creation date) has been kept in the `afterlink` section.

    ```php title="mod/resource/classes/output/courseformat/activitybadge.php"
    namespace mod_resource\output\courseformat;

    class activitybadge extends \core_courseformat\output\activitybadge {

        protected function update_content(): void {
            $options = (object) ['displayoptions' => $this->cminfo->customdata['displayoptions']];
            $this->content = resource_get_optional_filetype($options, $this->cminfo);
        }
    }
    ```

A new `core_courseformat/local/content/cm/activitybadge` template has been also created to display this activity badge data. As usual, it can be overridden by any format plugin.

## JavaScript String fetchers

<Since version="4.3" issueNumber="MDL-79064" />

New string fetchers were introduced in MDL-79064:

- `getString` - fetch a single string, resolving in a Native Promise
- `getStrings` - fetch a set of strings, resolving in an array of Native Promises

Note: These new fetchers will return a _native_ Promise rather than a jQuery Promise.

The `get_string` and `get_strings` methods have _not_ been deprecated at this time but work is underway to allow for their future deprecation.

:::caution Native Promises vs jQuery Promises

The use of jQuery Promises is discouraged in Moodle as they have a different behaviour in some cases:

- native Promises do not have the `done` method. Please use `then` instead
- native Promises do not have the `fail` method. Please use `catch` instead

Please note that the behaviour of `catch` differs from the jQuery `fail`. The `catch` method will return a resolved Promise, whist the `fail` method will not.

You are **strongly** advised to convert all uses  of `.done`, and `.fail` in your code to `.then`, and `.catch` as appropriate.

:::

## Modal Dialogues

Moodle 4.3 brings a number of improvements to Modal dialogues. These improvements focus on:

- the declaration of new Modal types
- the instantiation of new Modal instances
- the use of instantiated Modals

### Conversion of Modal to ESM Class

<Since version="4.3" issueNumber="MDL-78306" />

If using a prototypal class, you will see an error message such as the following:

```js title="Errors shown when trying to instantiate a prototypal modal"
test.js:4 Uncaught TypeError: Class constructor Modal cannot be invoked without 'new'
    at new MyModal (test.js:4:11)
    at <anonymous>:1:1
```

All modal types **must** now be written as an ESM class. Prototypal modals are no longer supported.

These changes are backwards compatible with previous versions of Moodle. An ESM Modal definition can be used with Moodle 4.2 or earlier. A prototypal modal _cannot_ be used with Moodle 4.3 onwards.

<Tabs groupId="beforeAfter">
<TabItem value="before" label="Before Moodle 4.3">

<InvalidExample
    title="Prototypal modal definition"
>

A Prototypal modal _cannot_ extend an ESM class.

```js
var MyModal = function(root) {
    Modal.call(this, root);
    this.myCustomMethod();
};

MyModal.TYPE = 'mod_example/myModal';
MyModal.prototype = Object.create(Modal.prototype);
MyModal.prototype.constructor = MyModal;

MyModal.prototype.registerEventListeners = function() {
    // Apply parent event listeners.
    Modal.prototype.registerEventListeners.call(this);

    this.getModal().on(CustomEvents.events.activate, function(e) {
        // ...
    }.bind(this));
};

MyModal.prototype.myCustomMethod = function() {
    // ...
};

return MyModal;
```

</InvalidExample>
</TabItem>

<TabItem value="after" label="From Moodle 4.3 onwards" default>
<ValidExample
    title="The same content converted to an ESM class"
>

An ESM class can extend either another ESM class, or a prototypal method.

```js
export default class MyModal extends Modal {
    static TYPE = 'mod_example/myModal';

    constructor(root) {
        // We can override the constructor to call additional setup.
        super(root);

        this.myCustomMethod();
    }

    registerEventListeners() {
        // Call the registerEventListeners method on the parent class.
        super.registerEventListeners();

        this.getModal().on(CustomEvents.events.activate, function(e) {
            // ...
        });
    }

    myCustomMethod() {
        // ...
    }
}
```

</ValidExample>
</TabItem>
</Tabs>

### Instantiation and deprecation of `core/modal_factory`

<Since version="4.3" issueNumber="MDL-78324" />

Moodle 4.3 introduces a new way to instantiate modals which is significantly simpler than earlier versions. Rather than calling the `create` method on the `modal_factory`, it can now be called on the class that you are instantiating.

In addition, a new `configure` method is introduced which allows you to override configuration options, provide your own, and more.

Modals which are instantiated using the new method *do not* need to be registered if they are not consumed using the modal factory.

This change will increase encapsulation and allow modals to handle common actions such as showing on creation, and removing on close much more easily.

:::note Compatibility with Moodle 4.2 and older

If your code is intended to work with Moodle 4.2 and older, then you must continue to use the existing `core/modal_factory`, and you must continue to register your modal. This legacy method will be maintained until Moodle 4.6.

:::

<Tabs groupId="beforeAfter">
<TabItem value="before" label="Before Moodle 4.3">
<InvalidExample
    title="A modal created and instantiated using the legacy approach"
>

The legacy registration will continue to work and should be used if your plugin will be used in Moodle 4.2, or earlier.

```js title="mod/example/amd/src/mymodal.js"
export default class MyModal extends Modal {
    static TYPE = 'mod_example/myModal';
    static TEMPLATE = 'mod_example/my_modal';

    myCustomSetter(value) {
        this.value = value;
    }
}
let registered = false;
if (!registered) {
    ModalRegistry.register(MyModal.TYPE, MyModal, 'mod_example/my_modal');
    registered = true;
}
```

```js title="mod/example/amd/src/consumer.js"
import MyModal from './mymodal';
import ModalFactory from 'core/modal_factory';

// ...
ModalFactory.create({
    TYPE: MyModal.TYPE,
}).then((modal) => {
    modal.show();
    modal.myCustomSetter('someValue');

    return modal;
})
```

</InvalidExample>
</TabItem>

<TabItem value="after" label="From Moodle 4.3 onwards" default>
<ValidExample
    title="A modal using the new approach"
>

```js title="mod/example/amd/src/mymodal.js"
export default class MyModal extends Modal {
    static TYPE = 'mod_example/myModal';
    static TEMPLATE = 'mod_example/my_modal';

    configure(modalConfig) {
        // Specify any defaults you like here.
        modalConfig.show = true;
        super.configure(modalConfig);

        this.myCustomSetter(modalConfig.myCustomValue);
    }

    myCustomSetter(value) {
        this.value = value;
    }
}
```

```js title="mod/example/amd/src/consumer.js"
import MyModal from './mymodal';

// ...
MyModal.create({
    myCustomValue: 'someValue',
    show: true,
});
```

</ValidExample>
</TabItem>
</Tabs>

## Forms API

### add_sticky_action_buttons

A new method `add_sticky_action_buttons()` has been added to [Forms API](./apis/subsystems/form/index.md#add_sticky_action_buttons) to enable sticky footer.

```php
public function add_sticky_action_buttons(
    bool $cancel = true,
    ?string $submitlabel = null,
);
```

### filter_shown_headers

A new method `filter_shown_headers()` has been added to to [Forms API](./apis/subsystems/form/index.md#filter_shown_headers) to show some expanded headers only and hide the rest.

This method adds values to `_shownonlyelements` array to decide whether a header should be shown or hidden.
Only header names would be accepted and added to `_shownonlyelements` array.
Headers included in `_shownonlyelements` will be shown expanded in the form. The rest of the headers will be hidden.

```php
public function filter_shown_headers(array $shownonly): void {
    $this->_shownonlyelements = [];
    if (empty($shownonly)) {
        return;
    }
    foreach ($shownonly as $headername) {
        $element = $this->getElement($headername);
        if ($element->getType() == 'header') {
            $this->_shownonlyelements[] = $headername;
            $this->setExpanded($headername);
        }
    }
}
```

Empty `_shownonlyelements` array doesn't affect header's status or visibility.

```php title="/course/editsection.php"
$showonly = optional_param('showonly', 0, PARAM_TAGLIST);

[...]

$mform = $courseformat->editsection_form($PAGE->url, $customdata);

$initialdata = convert_to_array($sectioninfo);
if (!empty($CFG->enableavailability)) {
    $initialdata['availabilityconditionsjson'] = $sectioninfo->availability;
}
$mform->set_data($initialdata);
if (!empty($showonly)) {
    $mform->filter_shown_headers(explode(',', $showonly));
}
```

## Activity completion

### Append a suffix to the completion rules

As part of [MDL-78516](https://tracker.moodle.org/browse/MDL-78516), the [Default completion form](https://docs.moodle.org/en/Activity_completion_settings#Changing_activity_completion_settings_in_bulk) has undergone a significant rebuild to enhance code reusability and maintainability. To prevent duplicate IDs, a suffix has been introduced to the form elements related to completion rules.

For third-party plugins, an adjustment is needed to incorporate this new suffix, following the approach already taken by [core modules](https://github.com/sarjona/moodle/commit/8f57f0fdaca027c7099bc6966467077aecbc0862).

The primary modification entails editing `mod/yourplugin/mod_form.php` and applying the suffix to the completion rule elements within all relevant methods. As an example, here are the changes made to the `mod/choice` module:

```php
    public function add_completion_rules() {
        $mform = $this->_form;

        $completionsubmitel = $this->get_suffixed_name('completionsubmit');
        $mform->addElement('checkbox', $completionsubmitel, '', get_string('completionsubmit', 'choice'));
        // Enable this completion rule by default.
        $mform->setDefault($completionsubmitel, 1);
        return [$completionsubmitel];
    }

    public function completion_rule_enabled($data) {
        return !empty($data[$this->get_suffixed_name('completionsubmit')]);
    }

    public function data_postprocessing($data) {
        parent::data_postprocessing($data);
        // Set up completion section even if checkbox is not ticked.
        if (!empty($data->completionunlocked)) {
            if (empty($data->{$this->get_suffixed_name('completionsubmit')})) {
                $data->{$this->get_suffixed_name('completionsubmit')} = 0;
            }
        }
    }

    protected function get_suffixed_name(string $fieldname): string {
        return $fieldname . $this->get_suffix();
    }
```

:::caution

Starting from Moodle 4.3, completion rules without the suffix will be phased out from the [Default completion form](https://docs.moodle.org/en/Activity_completion_settings#Changing_activity_completion_settings_in_bulk) until they are updated to incorporate the required suffix

:::

## User preferences in JavaScript modules

As part of [MDL-62859](https://tracker.moodle.org/browse/MDL-62859) and [MDL-76974](https://tracker.moodle.org/browse/MDL-76974), new methods for the reading and writing of user preferences in JavaScript modules have been created.

The `core_user/repository` module exports new methods `getUserPreference`, `getUserPreferences`, `setUserPreference` and `setUserPreferences`. Examples of which are below:

```js title="Get user preferences"

import Notification from 'core/notification';
import {getUserPreference, getUserPreferences} from 'core_user/repository';

// Get single preference.
getUserPreference('mod_example_foo')
    .then(window.console.log)
    .catch(Notification.exception);

// Get multiple preferences.
getUserPreferences()
    .then(window.console.log)
    .catch(Notification.exception);
```

```js title="Set user preferences"

import Notification from 'core/notification';
import {setUserPreference, setUserPreferences} from 'core_user/repository';

// Set single preference.
setUserPreference('mod_example_foo', 42)
    .catch(Notification.exception);

// Set multiple preferences.
setUserPreferences([
    {name: 'mod_example_foo', value: 42},
    {name: 'mod_example_bar', value: 43},
]).catch(Notification.exception);
```

## Icons

### MIME

:::info

The MIME icons located in the `pix/f` directory, have undergone an update. These icons, previously available in various sizes, have now been replaced with SVG versions.

:::

To streamline the variety of icons associated with different MIME types, several specific MIME icons have been replaced. Instead, their corresponding generic icons have been integrated from the existing collection, leading to a more efficient representation:

- `avi` -> `video`
- `base` -> `database`
- `bmp` -> `image`
- `html` -> `markup`
- `jpeg` -> `image`
- `mov` -> `video`
- `mp3` -> `audio`
- `mpeg` -> `video`
- `png` -> `image`
- `quicktime` -> `video`
- `tiff` -> `image`
- `wav` -> `audio`
- `wmv` -> `video`

The subsequent MIME icons have been entirely removed:

- `clip-353`
- `edit`
- `env`
- `explore`
- `folder-open`
- `help`
- `move`
- `parent`

:::warning

Files utilizing any of these removed icons will now be represented by the "unknown" icon.

:::

### SVG icons

- The `$CFG->svgicons` parameter has been deprecated and removed. It was initially introduced in Moodle 2.4 as a response to incomplete SVG support in some web browsers, as documented in MDL-22955. However, the web landscape has evolved considerably since that time, and all modern browsers now fully support SVG files, as confirmed by this compatibility chart: https://caniuse.com/svg.
- A new PHPUnit test has been introduced to verify the presence of SVG files for all system icons in Moodle LMS. Any missing SVG files have been rectified within Moodle LMS.

:::tip

Third-party plugins are strongly encouraged to follow suit, adding missing SVG files too, to avoid PHPUnit test failures.

The SVG icons in Moodle LMS were sourced from https://fontawesome.com/search?m=free&o=r, which offers free icons under the Creative Commons Attribution 4.0 International license, consistent with the Moodle icon set.

:::

:::note
When adding SVG files from [FontAwesome](https://fontawesome.com/icons), please make sure to use the `Free` icon set by generating the file from the `SVG` code, rather than downloading it. This approach ensures the correct licensing of the icon, as the downloaded version may have a different license at times.
:::

## Cron and Tasks API

### Legacy Cron

<Since version="4.3" issueNumber="MDL-61165" />

Support for the `cron.php` and `modname_cron` legacy cron system has been removed.

:::caution

All legacy cron tasks must now be converted to Tasks

:::

<!-- cspell:ignore goutte,browserkit -->
## Behat

### Removal of Goutte and Goutte Mink Driver

The [goutte behat mink driver](https://packagist.org/packages/behat/mink-goutte-driver) has been replaced by the [browserkit](https://packagist.org/packages/behat/mink-browserkit-driver) one because the former has been abandoned.

The change should be completely transparent for (near) everybody. Only **if you are using some custom-generated `behat.yml`** file or other configuration alternatives different from the Moodle default one, then, **any `goutte` browser occurrence needs to be changed to `browserkit_http`** when configuring the behat mink extension.

See MDL-78934 for more details and changes applied.

### Removal of the `--skip-passed` option

The legacy (and custom) Behat `--skip-passed` option has been removed completely. Please, use the standard `--rerun` option that provides exactly the same (execution of failed scenarios only).

## Enrolment methods support in CSV course upload

As part of [MDL-78855](https://tracker.moodle.org/browse/MDL-78855) new methods have been created for `enrol_plugin` to explicitly mark those enrolment methods that are supported in CSV course upload

Example below for method to be supported:

```php title="CSV supported"
public function is_csv_upload_supported(): bool {
    return true;
}
```

Also a new method has been created for `enrol_plugin` to create enrolment instance with custom settings

```php title="Add custom instance"
public function add_custom_instance(stdClass $course, ?array $fields = null): ?int {
    return $this->add_instance($course, $fields);
}
```

In [MDL-73839](https://tracker.moodle.org/browse/MDL-73839) cohort enrolment method has been updated to support CSV course upload.

## Addition of comboboxsearch component

<Since version="4.3" issueNumber="MDL-77991" />

As part of [MDL-77991](https://tracker.moodle.org/browse/MDL-77991) multiple gradebook report searching functionalities were migrated into a centralised core component.

Details on its use can be found via [Combobox searching](./guides/javascript/comboboxsearch)
