---
title: Moodle 4.3 developer update
tags:
- Core development
---

<!-- markdownlint-disable no-inline-html -->

import { CodeBlock, CodeExample, InvalidExample, ValidExample } from '@site/src/components';

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
