---
title: Comment API
tags:
  - comment
---

The Comment API provides a standardized way to manage comments within Moodle. It allows developers to create, retrieve, update, and delete comments associated with various Moodle entities, such as courses, activities, and user submissions.

## Usage

The `\core_comment\manager` is responsible for handling all comment-related operations within Moodle. This includes rendering and managing comment data.

The instantiation of the comment class is done by a single arguments object that defines the context and other relevant information for the comment being created or managed.

The basic attributes for the argument object are:

- `context`: the `core\context` object the comment is associated with.
- `component`: the name of the component the comment is related to.
- `itemid`: optional, the ID of the item the comment is associated with.
- `area`: optional, the area the comment is associated with.
- `cm`: optional, the `core_course\cm_info` object.
- `course`: optional, course object (will be loaded from context if not provided).

Optional attributes related to the comment area rendering:

- `client_id`: a unique id to identify the comment area (it will be auto-generated if not provided).
- `autostart`: a boolean indicating whether the comment area should be automatically expanded.
- `showcount`: a boolean indicating whether to show the comment count.
- `displaycancel`: a boolean indicating whether to display a cancel button.
- `notoggle`: a boolean indicating whether to disable toggling of the comment area.
- `linktext`: a string to indicate alternative text for the show/hide link.

Once instantiated, the class provides simple methods to handle comment-related operations.

## Rendering a comment area

The manager class has an `output` method to get the comment area HTML. Here is a simple example of how to use it:

```php
$args = (object) [
    'context' => \core\context\module::instance($cm->id),
    'component' => 'mod_data',
    'area' => 'database_entry',
    'itemid' => $entry->id,
    'cm' => $cm,
];
$comment = new \core_comment\manager($args);
echo $comment->output();
```

Additionally, the manager class offers methods to customize the default options for the comment area:

- `set_view_permission(bool $newvalue)`: Set the view permissions for the comment area.
- `set_post_permission(bool $newvalue)`: Set the post permissions for the comment area.
- `set_notoggle(bool $newvalue)`: Set the toggle option for the comment area.
- `set_autostart(bool $newvalue)`: Set the autostart option for the comment area.
- `set_displaycancel(bool $newvalue)`: Set the display cancel option for the comment area.
- `set_displaytotalcount(bool $newvalue)`: Set the display total count option for the comment area.

## Retrieving comments

You can use the `get_comments()` method to fetch all comments associated with the defined context. The method has the following parameters:

- `int $page`: The page number to retrieve.
- `int $sortdirection` (default `DESC`): The sorting for the comments.

The number of comments displayed per page is defined by the `$CFG->commentsperpage` configuration setting. The default value is 15.

There is also a `count` method to get the total number of comments for the defined context.

```php
$comment = new \core_comment\manager($args);

$count = $comment->count();
echo get_string('totalcomments', 'mod_myplugin', $count);

$comments = $comment->get_comments();
foreach ($comments as $comment) {
    echo $comment->content;
}
```

## Add plugin control

Similar to files, when a plugin wants to use comments it must provide a callback method to validate the comment area is correct. To do so, they must implement a callback in their `lib.php` file, specifically in the `PLUGINNAME_comment_display` function.

This is an example of a possible callback for plugin `mod_myplugin`:

```php
/**
 * Validate comment data before displaying comments
 *
 * @param stdClass $comment
 * @param stdClass $args
 * @return boolean
 */
function mod_myplugin_comment_display(stdClass $comments, stdClass $args): stdClass {
    if ($args->commentarea != 'entry_comments') {
        throw new comment_exception('invalidcommentarea');
    }
    if ($args->itemid != 0) {
        throw new comment_exception('invalidcommentitemid');
    }
    return $comments;
}
```

## Add and remove comments

The manager class provides several methods to add and remove comments:

- `add(string $content, int $format = FORMAT_MOODLE): stdClass`: Add a new comment with the given content and format.
- `delete(int|stdClass $comment): bool`: Delete a specific comment.
- `static delete_comments(stdClass $args): bool`: Delete all comments for the specified `context`, `itemid`, and `commentarea`.
