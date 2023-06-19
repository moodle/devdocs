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

When creating a new modal type, these **must** now be written as an ESM class. Prototypal modals are no longer supported.

These changes are backwards compatible with previous versions of Moodle. An ESM Modal definition can be used with Moodle 4.2 or earlier. A prototypal modal _cannot_ be used with Moodle 4.3 onwards.

<Tabs>
<TabItem value="before" label="Before Moodle 4.3">
<InvalidExample
    title="Prototypal modal definition"
>

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

```js
export default class MyModal extends Modal {
    static TYPE = 'mod_example/myModal';

    constructor(root) {
        super(root);

        this.myCustomMethod();
    }

    registerEventListeners() {
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
<Tabs>
<TabItem value="before" label="Before Moodle 4.3">

<InvalidExample
    title="A modal using the legacy registration approach"
>

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

A new method `add_sticky_action_buttons()` has been added to [Forms API](./apis/subsystems/form/index.md#add_sticky_action_buttons) to enable sticky footer.

```php
public function add_sticky_action_buttons(
    bool $cancel = true,
    ?string $submitlabel = null
);
```
