---
title: Files in Forms
tags:
  - Files
  - Repositories
---

Files and their metadata are stored within the [File API](../../files/index.md). Each file within the API is associated with:

- a context id;
- a component;
- a _file area_; and
- an optional item id.

This combination acts as a virtual bucket, within which any desired file structure may be used.

A common use case is to allow users to upload file content within a standard Moodle form.

Normally this works as follows:

1. User starts to create, or re-edit an existing item - this may be a forum post, resource, glossary entry, and so on.
1. User presses some sort of button to browse for new files to attach or embed
1. User sees our "Choose file..." dialog, which contains one or more repository instances.
1. User chooses a file, the corresponding [Repository plugin](../../../plugintypes/repository/index.md) takes care of copying the file into a "draft file area" within Moodle
1. File appears in the text or as an attachment in the form.
1. When the user hits save, the [File API](../../files/index.md) is invoked to move the file from the draft file area into a permanent file area associated with that data

This document shows you how to use Moodle forms to interact with users in a standard and secure way.

If you just want to write code to manipulate Moodle files internally (without user input) you can use the [File API](../../files/index.md) without involving form elements.

## Form elements

There are three file-related form elements for interacting with users:

1. `filepicker` - a way to specify one file for the case when you want to process the file and throw it away
1. `filemanager` - a way to attach one or more files as a collection, using the file picker interface
1. `editor` - a way to specify a textarea with a HTML editor, and all the handling of images and movies within that HTML

### File picker

The _File picker_ may be used directly to allow a user to upload _one_ file so that it can be processed, and then removed.

Example use-cases include allowing a single file to be uploaded for a purpose such as CSV import, or restoration of a backup.

:::note

A filepicker element does not typically support storing data within the File API.

If you want a file that remains part of the Moodle storage and will reappear when you reopen the form, then you should use a filemanager instead (and restrict it to a single file, if necessary).

:::

#### Using the filepicker element

```php
$mform->addElement(
    'filepicker',
    'userfile',
    get_string('file'),
    null,
    [
        'maxbytes' => $maxbytes,
        'accepted_types' => '*',
    ]
);
```

#### Working with an uploaded file

To get the contents of the uploaded file:

```php
$content = $mform->get_file_content('userfile');
```

To get the name of the uploaded file:

```php
$name = $mform->get_new_filename('userfile');
```

To save the uploaded file to the server filesystem:

```php
$success = $mform->save_file('userfile', $fullpath, $override);
```

:::note

Be wary of this approach if you need to use the file in multiple page requests.

A clustered server installation will need the file to be accessible on any server node.

:::

To store the chosen file in the Moodle file API:

```php
$storedfile = $mform->save_stored_file('userfile', ...);
```

### File manager

The File Manager element improves on file picker by allowing you to manage more than one file.  It is expected that the files will be stored permanently for future use.

Examples of the File manager can be found all over Moodle and include the Forum, and Glossary attachments, Course files, and more.

#### Add a file manager element

Example:

```php
$mform->addElement(
    'filemanager',
    'attachments',
    get_string('attachment', 'moodle'),
    null,
    [
        'subdirs' => 0,
        'maxbytes' => $maxbytes,
        'areamaxbytes' => 10485760,
        'maxfiles' => 50,
        'accepted_types' => ['document'],
        'return_types' => FILE_INTERNAL | FILE_EXTERNAL,
    ]
);
```

When a user uploads files, these are stored into a _draft_ file area for that user. It is the developers responsibility to then move those files within the File API.

#### Loading existing files into draft area

If you are presenting a form which has previously had data saved to it, for example when editing an existing piece of content, you will need to copy all of the existing files into the draft file area used in the form. This can be achieved using the `file_prepare_draft_area` function, for example:

```php
// Fetch the entry being edited, or create a placeholder.
if (empty($id)) {
    $entry = (object) [
        'id' => null,
    ];
} else {
    $entry = $DB->get_records('glossary_entries', ['id' => $id]);
}

// Get an unused draft itemid which will be used for this form.
$draftitemid = file_get_submitted_draft_itemid('attachments');

// Copy the existing files which were previously uploaded
// into the draft area used by this form.
file_prepare_draft_area(
    // The $draftitemid is the target location.
    $draftitemid,

    // The combination of contextid / component / filearea / itemid
    // form the virtual bucket that files are currently stored in
    // and will be copied from.
    $context->id,
    'mod_glossary',
    'attachment',
    $entry->id,
    [
        'subdirs' => 0,
        'maxbytes' => $maxbytes,
        'maxfiles' => 50,
    ]
);

// Set the itemid of draft area that the files have been moved to.
$entry->attachments = $draftitemid;
$mform->set_data($entry);
```

#### Store updated set of files

During the processing of the submitted data, the developer handling the form will need to handle storing the files in an appropriate part of the File API.

This can be accomplished using the `file_save_draft_area_files()` function, for example:

```php
if ($data = $mform->get_data()) {
    // ... store or update $entry.

    // Now save the files in correct part of the File API.
    file_save_draft_area_files(
        // The $data->attachments property contains the itemid of the draft file area.
        $data->attachments,

        // The combination of contextid / component / filearea / itemid
        // form the virtual bucket that file are stored in.
        $context->id,
        'mod_glossary',
        'attachment',
        $entry->id,

        [
            'subdirs' => 0,
            'maxbytes' => $maxbytes,
            'maxfiles' => 50,
        ]
    );
}
```

### Editors

Another common place to handle files is within an HTML editor, such as TinyMCE.

There are two ways of using the editor element in code, the first one is easier but expects some standardised fields. The second method is more low level.

All of the methods share key behaviours:

- When preparing the editor:
  - You must create a draft file area to store the files while the user is making changes.
- When using the editor:
  - Any files referenced use a full URL, for example `https://example.com/pluginfile.php/123/user/icon/456/filedir/filename.png`.
  - These files are stored in the draft file area.
- When processing the form submission:
  - You must process the content so that part of the URL is replaced with a placeholder - usually `@@PLUGINFILE@@`. For example the URL may become `@@PLUGINFILE@@/filedir/filename.png`.
  - You must pass it through a function to move the files from the draft file area into the correct file area for your code.
- When displaying the editor content:
  - You must pass it through `file_rewrite_pluginfile_urls()` to rewrite it back to a servable URL.
  - You must provide a `pluginfile` function to perform access control checks and serve the file.
- When fetching existing content for editing:
  - You must copy it into a new draft file area so that changes can be made.
  - You must rewrite the `@@PLUGINFILE@@` URL with the new draft file area.

#### Simple use

By creating a series of fields in the database, it is very easy to have standard functions fetch and store the data for this editor. For example, if you wanted to store data in a field called `textfield`, you would need to create fields in the database for:

- `textfield` - where the content is actually stored
- `textfieldformat` - to store the _format_ of the field
- `textfieldtrust` (optional) - to store whether the text is trusted

This is then paired with a set of options which are used when adding the Editor for the form, and processing the file content before displaying, and after saving the form, for example:

```php
$textfieldoptions = [
    'trusttext' => true,
    'subdirs' => true,
    'maxfiles' => $maxfiles,
    'maxbytes' => $maxbytes,
    'context' => $context,
];
```

To add the editor to the form, and process the form data:

1. Add editor `textfield_editor` to moodle form, pass options through custom data in form constructor.
You should set `$data->id` to null if data not exist yet.

 ```php
 $mform->addElement(
     'editor',
     'textfield_editor',
     get_string('fieldname', 'somemodule'),
     null,
     $textfieldoptions
 );
 ```

1. Prepare the data - this will ensure that any existing files will be copied to the draft file area, and any existing placeholder is replaced for use in the form.

 ```php
 $data = file_prepare_standard_editor(
     // The existing data.
     $data,

     // The field name in the database.
     'textfield',

     // The options.
     $textfieldoptions,

     // The combination of contextid, component, filearea, and itemid.
     $context,
     'mod_somemodule',
     'somearea',
     $data->id
 );
 ```

1. After the form is submitted, process the editor - this will move the files from the draft file area into the persistent storage, and rewrite the URLs to use the placeholder.

 ```php
 $data = file_postupdate_standard_editor(
     // The submitted data.
     $data,

     // The field name in the database.
     'textfield',

     // The options.
     $textfieldoptions,

     // The combination of contextid, component, filearea, and itemid.
     $context,
     'mod_somemodule',
     'somearea',
     $data->id
 );
 ```

Real world examples can be found in `mod/glossary/edit.php` and `mod/glossary/comment.php`.

#### Low-level use

If you prefer, you can call the various underlying functions yourself. This is not typically required.

:::caution Important

You must call both the pre-processing, and post-processing, functions to ensure the correct behaviour.

:::

1. detect if the form was already submitted (this usually means that the draft area already exists) - `file_get_submitted_draft_itemid()`
1. prepare a draft file area for temporary storage of all files attached to the text - `file_prepare_draft_area()`
1. convert encoded relative links to absolute links - `file_prepare_draft_area()`
1. create the form and set current data
1. after submission the changed files must be merged back into original area - `file_save_draft_area_files()`
1. absolute links have to be replaced by relative links - `file_save_draft_area_files()`

##### Prepare current data - text and files

```php
if (empty($entry->id)) {
    $entry = (object) [
        'id' => null,
        'definition' => '',
        'format' => FORMAT_HTML,
    ];
}

$draftid_editor = file_get_submitted_draft_itemid('entry');
$currenttext = file_prepare_draft_area(
    $draftid_editor,
    $context->id,
    'mod_glossary',
    'entry',
    $entry->id,
    [
        'subdirs' => true),
        $entry->definition,
    ]
);
$entry->entry = [
    'text' => $currenttext,
    'format' => $entry->format,
    'itemid' => $draftid_editor,
];

$mform->set_data($entry);
```

:::note

Multiple files can be stored in the same virtual bucket. They will have different file names and/or file paths within the same item id.

:::

##### Obtain text, format and save draft files

To retrieve editor content, you need to use following code:

```php
if ($fromform = $mform->get_data()) {
    // Content of the editor field.
    $messagetext = $fromform->entry['text'];
    // Format of the content.
    $messageformat  = $fromform->entry['format'];
}
```

When a user selects a file using the file picker, the file is initially stored in a draft file area, and a URL is inserted into the HTML in the editor that lets the person editing the content (but no one else) see the file.

When the user submits the form, we then need to save the draft files to the correct place in permanent storage. (Just like you have to call `$DB->update_record('tablename', $data);` to have the other parts of the form submission stored correctly.)

The `save_files_from_draft_area` function and replace absolute links with internal relative links do:

```php
$messagetext = file_save_draft_area_files(
    // The id of the draft file area.
    $draftideditor,

    // The combination of contextid / component / filearea / itemid
    // form the virtual bucket that file are stored in.
    $context->id,
    'mod_glossary',
    'entry',
    $entry->id,

    // The options to pass.
    [
        'subdirs' => true,
    ],

    // The text received from the form.
    $messagetext
);
```

All URLs in content that point to files managed to the File API are converted to a form that starts `@@PLUGINFILE@@/` before the content is stored in the database. That is what we mean by rewriting.

## File serving

### Convert internal relative links to absolute links

Before text content is displayed to the user, any URLs in the `@@PLUGINFILE@@/` form in the content need to be rewritten to the real URL where the user can access the files.

```php
$messagetext = file_rewrite_pluginfile_urls(
    // The content of the text stored in the database.
    $messagetext,
    // The pluginfile URL which will serve the request.
    'pluginfile.php',

    // The combination of contextid / component / filearea / itemid
    // form the virtual bucket that file are stored in.
    $context->id,
    'frankenstyle_component',
    'filearea',
    $itemid
);
```

### Implement file serving access control

Attachments and embedded images should have the same access control as the text itself. In a majority of cases these files are served using `pluginfile.php`. Access control is defined in the `[componentpath]/lib.php` file, using a function named `[componentname]_pluginfile()`.

## File browsing support

Only owner of each file area is allowed to use low level File API function to access files, other parts of Moodle should use file browsing API.

Activities may specify browsing support in own `module/lib.php` file by implementing functions `module_get_file_areas()` and `module_get_file_info()`.

## See also

- [File API](../../files/index.md)
- [Using the file API](../../files/index.md)
- [Repository plugins](../../../plugintypes/repository/index.md)
