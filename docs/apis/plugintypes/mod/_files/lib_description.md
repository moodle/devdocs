<!-- markdownlint-disable first-line-heading -->
For an Activity, you _must_ define the following three functions, which are described below:

```php title="mod/[modname]/lib.php"
function [modname]_add_instance($instancedata, $mform = null): int;
function [modname]_update_instance($instancedata, $mform): bool;
function [modname]_delete_instance($id): bool;
```

- The `[modname]_add_instance()` function is called when the activity creation form is submitted. This function is only called when adding an activity and should contain any logic required to add the activity.
- The `[modname]_update_instance()` function is called when the activity editing form is submitted.
- The `[modname]_delete_instance()` function is called when the activity deletion is confirmed. It is responsible for removing all data associated with the instance.

:::note

The `lib.php` file is one of the older parts of Moodle and functionality is gradually being migrated to class-based function calls.

:::

:::tip

To have your Activity plugin classified in the right Activity category, you must define the function `[modname]_supports` and add the `FEATURE_MOD_PURPOSE` constant:

<details>
  <summary>View example</summary>
  <div>

```php
function [modname]_supports(string $feature) {
    switch ($feature) {
        [...]
        case FEATURE_MOD_PURPOSE:
            return MOD_PURPOSE_XXXXXX;

        default:
            return null;
    }
}
```

  </div>
</details>

The available activity purposes for this feature are:

- **Administration** (`MOD_PURPOSE_ADMINISTRATION`) <br/>
Tools for course administration, such as attendance tracking or appointment scheduling.
- **Assessment** (`MOD_PURPOSE_ASSESSMENT`)<br/>
Activities that allow the evaluation and measurement of student understanding and performance.<br/>
  - Core activities in this category: Assignment, Quiz, Workshop.
- **Collaboration** (`MOD_PURPOSE_COLLABORATION`)<br/>
Tools for collaborative learning that encourage knowledge sharing, discussions, and teamwork.<br/>
  - Core activities in this category: Database, Forum, Glossary, Wiki.
- **Communication** (`MOD_PURPOSE_COMMUNICATION`)<br/>
Activities that facilitate real-time communication, asynchronous interaction, and feedback collection.<br/>
  - Core activities in this category: BigBlueButton, Chat, Choice, Feedback, Survey.
- **Interactive content** (`MOD_PURPOSE_INTERACTIVECONTENT`)<br/>
Engaging interactive activities that encourage active learner participation.<br/>
  - Core activities in this category: H5P, IMS package, Lesson, SCORM package.
- **Resources** (`MOD_PURPOSE_CONTENT`)<br/>
Activities and tools to organise and display course materials like documents, web links, and multimedia.<br/>
  - Core activities in this category: Book, File, Folder, Page, URL, Text and media area.
- **Other** (`MOD_PURPOSE_OTHER`)<br/>
Other types of activities.

:::
