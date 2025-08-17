---
title: Comment API
tags:
  - API
---
import { Since } from '@site/src/components';

<Since versions={["2.0"]} />

## Objectives

The goals of Comment API:

- Manage comments centrally
- Use a consistent approach for all comments throughout Moodle
- Easily integrate Comment API with existing modules
- Works no matter JavaScript is enabled or not

## Overview

Comment API provides following functionalities:

1. Add comments
1. Manage comments
1. Delete comments

And provides a fancy ajax interface to add/delete comments without reloading page.

## Comment API database table

| Field | Type | Default | Info |
| --- | --- | --- | --- |
| id | int(10) | auto-incrementing | The unique ID for this comment. |
| userid | int(10) |  | who wrote this comment |
| contextid | int(10) |  | The context id defined in context table - identifies the instance of plugin owning the comment. |
| itemid | int(10) |  | Some plugin specific item id (eg. forum post, blog entry or assignment submission) |
| commentarea | int(10) |  | for example, in user profile, you can comment user's description or interests, but they share the same itemid(==userid), we need comment_area to separate them |
| timecreated | int(10) |  |  |
| timemodified | int(10) |  |  |
| content | text |  | content of comment |

## Use Comment API

### Add an option to format_text function

Using this `format_text` function will add a comment icon automatically at the end of the text:

For example, using the following code in the forum module will add a comment icon to every post:

```php
$cmt = new stdclass;
$cmt->contextid = $modcontext->id;
$cmt->area      = 'format_post';
$cmt->itemid    = $post->id;
$options->comments = $cmt;
echo format_text($post->message, $post->messageformat, $options, $course->id)."<hr />";
```

### Use comment class

To use Comment API elsewhere, using following code:

```php
$options->area    = 'database_entry';
$options->context = $context;
$options->itemid  = $record->id;
$options->component = 'mod_data';
$options->showcount = true;
$comment = new comment($options);
$comment->output(false);
```

## Comment API overview

Generally speaking, only two functions you need to know to get comment API worked:

1. Use `comment::init` to initialize Comment API
1. Use `$comment->output` to display comments

The comment class has been implemented in `comment/lib.php`.

### class comment()

#### __construct($contextid, $comment_area, $itemid))

Initialize class members.

#### init()

It is a static function used to initialize comments, setting up languages, which must be called before html head printed.

#### output($return = false)

Will print the html snippet for commenting interface, if set `$return` as true, it will return html string instead of printing out.

#### print_comments($params = array())

Used by non-JavaScript comment interface, will print a list of comments.

#### add($content)

Public instance funciton, add a comment to database, used in `comment/comment_ajax.php`.

#### count()

Counting the number of comments.

#### delete($id)

Delete a comment from database, used in `comment/comment_ajax.php`

#### delete_comments

Delete all comments in a specific contexts (like all comments belonging to a forum post).

## JavaScript API

Comment API implemented a YUI3 module M.core_comment to deal with the communication between browsers and moodle.
It can be found in `comment/comment.js`.

Call `M.core_comment.init` will create an instance of CommentHelper class. You don't need to make any calls to this instance, it simply works out of box.

## Moodle modules callback

Comment API allows `modules/blocks/blog` to decide how comments display.

### Data validation

This callback method is required, it must be implemented. Otherwise, new comment will be rejected by default.
Plugins must implement `pluginname_comment_validate` callback to validate comments parameters, it must return true to pass validation.

### Permission control

Modules must implement function `pluginname_comment_permissions` to return post and view permission.

Blocks need to overwrite `blockname_comment_permissions` function of block_base.

Blog need to implement `blog_comment_permissions` function.

This function will return an array: `array('post'=>true, 'view'=>true)`.

### Check new added comment

The callback function allows you to change the comment content before inserting into database or reject this comment.

It takes two arguments, the comment object which contains comment details, and $params which contains context and course information.

Modules can implement a function named `modname_comment_add`.

Blocks need to overwrite `blockname_comment_add` function.

Blog need to implement `blog_comment_add` function.

This function should return a boolean value.

### Filter/format comments

This callback allows modules check/format comments when user request to display comments.

It takes the same arguments as `pluginname_comment_add`.

Modules can implement a function named `pluginname_comment_display`.

Blocks need to overwrite `blockname_comment_display` function.

Blog need to implement `blog_comment_display` function.

It will return the comment object.

### Define a comment template

Modules can implement a function named `pluginname_comment_template`, which allow modules define a comment template.
The template must have 4 embedding variables, `___id___`, `___content___`, `___time___`, `___name___`, they will be replaced with html id, comments content, comment time and commenter name

## Backup and Restore

Comments will automatically be included in the activity/course backups and restored provided the itemids can be updated during the restore process. To do this either:

- do not use item ids and rely just on the context
- make the commentarea the same as one of the mappings in the restore (set_mapping); or
- override the function `get_comment_mapping_itemname` in the restore activity class

If you do not do one of these the comments will be silently ignored on restore.

## See also

- [Core APIs](../../../apis.md)
- [MDL-19118](https://tracker.moodle.org/browse/MDL-19118) - Comment API issue
- [コメントAPI](https://docs.moodle.org/ja/コメントAPI)
