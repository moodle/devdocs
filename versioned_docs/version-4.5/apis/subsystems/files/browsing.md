---
title: File Browser API
tags:
  - File API
  - Files
---

The File Browser API is a supplemental API which can be used to fetch information relating to Files stored in the [Moodle File API](./index.md).

### Fetch a series of breadcrumbs to the requested file

This example demonstrates using the `filebrowser` API to fetch the parent folders of a file.

```php
public function get_file_breadcrumbs(\stored_file $file): ?array {
    $browser = get_file_browser();
    $context = get_system_context();

    $fileinfo = $browser->get_file_info(
        \context::instance_by_id($file->get_contextid()),
        $file->get_component(),
        $file->get_filearea(),
        $file->get_itemid(),
        $file->get_filepath(),
        $file->get_filename()
    )

    if ($fileinfo) {
        // Build a Breadcrumb trail
        $level = $fileinfo->get_parent();
        while ($level) {
            $path[] = [
                'name' => $level->get_visible_name(),
            ];
            $level = $level->get_parent();
        }

        $path = array_reverse($path);

        return $path;
    }

    return null;
}
```
