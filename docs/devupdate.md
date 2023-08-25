---
title: Moodle 4.3 developer update
tags:
- Core development
---

<!-- markdownlint-disable no-inline-html -->

import { CodeBlock, CodeExample, InvalidExample, ValidExample, Since } from '@site/src/components';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page highlights the important changes that are coming in Moodle 4.3 for developers.

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

### Registration helper

<Since version="4.3" issueNumber="MDL-78306" />

Moodle 4.3 introduces a new `registerModalType` method on the Modal class to aid in registering a modal.

:::note Compatibility with Moodle 4.2 and older

If your code is intended to work with Moodle 4.2 and older, then you must continue to use the old method of registration. This legacy method will be maintained until Moodle 4.6.

:::

<Tabs groupId="beforeAfter">
<TabItem value="before" label="Before Moodle 4.3">

<InvalidExample
    title="A modal using the legacy registration approach"
>

The legacy registration will continue to work and should be used if your plugin will be used in Moodle 4.2, or earlier.

```js
var MyModal = function(root) {
    Modal.call(this, root);
};

MyModal.TYPE = 'mod_example/myModal';
MyModal.prototype = Object.create(Modal.prototype);
MyModal.prototype.constructor = MyModal;

let registered = false;
if (!registered) {
    ModalRegistry.register(MyModal.TYPE, MyModal, 'mod_example/my_modal');
    registered = true;
}

return MyModal;
```

</InvalidExample>
</TabItem>

<TabItem value="after" label="From Moodle 4.3 onwards" default>
<ValidExample
    title="A modal using the new shortcut helper"
>

The shortcut helper for Modal registration is suitable for Moodle 4.3 onwards.

```js
export default class MyModal extends Modal {
    static TYPE = 'mod_example/myModal';
    static TEMPLATE = 'mod_example/my_modal';
}

MyModal.registerModalType();
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

## Icons

### MIME

:::info

The MIME icons located in the `pix/f` directory, have undergone an update. These icons, previously available in various sizes, have now been replaced with SVG versions.

:::

To streamline the variety of icons associated with different MIME types, several specific MIME icons have been replaced. Instead, their corresponding generic icons have been integrated from the existing collection, leading to a more efficient representation:

- avi -> video
- base -> database
- bmp -> image
- html -> markup
- jpeg -> image
- mov -> video
- mp3 -> audio
- mpeg -> video
- png -> image
- quicktime -> video
- tiff -> image
- wav -> audio
- wmv -> video

The subsequent MIME icons have been entirely removed:

- clip-353
- edit
- env
- explore
- folder-open
- help
- move
- parent

:::warning

Files utilizing any of these removed icons will now be represented by the "unknown" icon.

:::
