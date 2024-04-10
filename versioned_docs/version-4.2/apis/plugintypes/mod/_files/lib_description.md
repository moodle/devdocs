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
