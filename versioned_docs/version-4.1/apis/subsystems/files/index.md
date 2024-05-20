---
title: File API
tags:
  - File API
  - Files
---

<!-- cspell:ignore filestore -->

The File API is used to control, manage, and serve all files uploaded and stored within Moodle. This page covers the core File API, which is responsible for storage, retrieval, and serving of files stored in Moodle.

The following documentation is also related:

- The [Repository API](../../plugintypes/repository/index.md) is responsible for the code paths associated with uploading files to Moodle. This includes Repository plugins.
- [Using the File API in Moodle forms](https://docs.moodle.org/dev/Using_the_File_API_in_Moodle_forms)
- Additional detail of how this API works is discussed in the [File API internals](./internals.md)

## File areas

Files are conceptually stored in _file areas_. A file area is uniquely identified by:

- A `contextid`.
- A full component name (using the [Frankenstyle](/general/development/policies/codingstyle/frankenstyle)/frankenstyle) format), for example `course`, `mod_forum`, `mod_glossary`, `block_html`.
- A file area type, for example `intro` or `post`.
- A unique `itemid`. Typically if there is only one of a file area per context, then the `itemid` is `0`, whilst if there can be multiple instances of a file area within a context, then the id of the item it relates to is used. For example in the course introduction text area, there is only one course introduction per course, so the `itemid` is set to `0`, whilst in a forum each forum post is within the same context, and the `itemid` should be the id of the post that it relates to.

:::note

File areas are not listed separately anywhere, they are stored implicitly in the files table.

:::

:::important Accessing files belonging to another component

Please note that each plugin, or subsystem should only ever access its own file areas. Any other access should be made using that components own APIs. For example a file in the `mod_assign` plugin should only access files within the `mod_assign` component, and no other component should access its files.

:::

### Naming file areas

The names of the file areas are not strictly defined, but it is strongly recommended to use singulars and common names of areas where possible (for example: intro, post, attachment, description).

## Serving files to users

The serving of files to users is separated into two distinct areas:

1. Generating an appropriate URL to the file; and
2. Parsing the URL to serve the file correctly.

This allows Moodle to have a shared file serving mechanism which is common to all Moodle components.

When serving files you _must_ implement both parts together.

### Generating a URL to your files

You must refer to the file with a URL that includes a file-serving script, often `pluginfile.php`. This is usually generated with the `moodle_url::make_pluginfile_url()` function. For example:

```php title="Generating a pluginfile URL for a known file"
$url = moodle_url::make_pluginfile_url(
    $file->get_contextid(),
    $file->get_component(),
    $file->get_filearea(),
    $file->get_itemid(),
    $file->get_filepath(),
    $file->get_filename(),
    false                     // Do not force download of the file.
);
```

:::note

Note: If you do not need the `itemid`, then you _may_ pass a `null` value instead of the `itemid`.

This will remove the `itemid` from the URL entirely - this must be considered when [serving your file to the user](#serving-your-file-to-the-user).

:::

The final parameter (`false` here) is `forcedownload`.

### Serving your file to the user

File serving is performed by a small number of file serving scripts which include:

- `pluginfile.php`; and
- `tokenpluginfile`.php.

These file serving scripts are responsible for authenticating the user, parsing the URL, and then passing the parameters provided in the URL to the relevant component, via a _callback_, which will then serve the file.

The relevant component is then responsible for finding the file, performing relevant security checks, and finally serving the file to the user.

The component callback _must_ be located in your plugin's `lib.php` file, and _must_ be named `[component]_pluginfile()`. It is passed the following values:

- the context id;
- the component name;
- the name of the file area;
- any item id, if specified in the URL; and
- the file path and file name.

:::info

The complete function signature for this callback is as follows:

```php
/**
 * Serve the requested file for the [component_name] plugin.
 *
 * @param stdClass $course the course object
 * @param stdClass $cm the course module object
 * @param stdClass $context the context
 * @param string $filearea the name of the file area
 * @param array $args extra arguments (itemid, path)
 * @param bool $forcedownload whether or not force download
 * @param array $options additional options affecting the file serving
 * @return bool false if the file not found, just send the file otherwise and do not return anything
 */
function [component_name]_pluginfile(
    $course,
    $cm,
    $context.
    string $filearea,
    array $args,
    bool $forcedownload,
    array $options
): bool;
```

<details>
  <summary>See an example implementation of this callback for an activity module.</summary>

```php title="mod/myplugin/lib.php"
/**
 * Serve the files from the myplugin file areas.
 *
 * @param stdClass $course the course object
 * @param stdClass $cm the course module object
 * @param stdClass $context the context
 * @param string $filearea the name of the file area
 * @param array $args extra arguments (itemid, path)
 * @param bool $forcedownload whether or not force download
 * @param array $options additional options affecting the file serving
 * @return bool false if the file not found, just send the file otherwise and do not return anything
 */
function mod_myplugin_pluginfile(
    $course,
    $cm,
    $context,
    string $filearea,
    array $args,
    bool $forcedownload,
    array $options = []
): bool {
    global $DB;

    // Check the contextlevel is as expected - if your plugin is a block, this becomes CONTEXT_BLOCK, etc.
    if ($context->contextlevel != CONTEXT_MODULE) {
        return false;
    }

    // Make sure the filearea is one of those used by the plugin.
    if ($filearea !== 'expectedfilearea' && $filearea !== 'anotherexpectedfilearea') {
        return false;
    }

    // Make sure the user is logged in and has access to the module (plugins that are not course modules should leave out the 'cm' part).
    require_login($course, true, $cm);

    // Check the relevant capabilities - these may vary depending on the filearea being accessed.
    if (!has_capability('mod/myplugin:view', $context)) {
        return false;
    }

    // The args is an array containing [itemid, path].
    // Fetch the itemid from the path.
    $itemid = array_shift($args);

    // The itemid can be used to check access to a record, and ensure that the
    // record belongs to the specifeid context. For example:
    if ($filearea === 'expectedfilearea') {
        $post = $DB->get_record('myplugin_posts', ['id' => $itemid]);
        if ($post->myplugin !== $context->instanceid) {
            // This post does not belong to the requested context.
            return false;
        }

        // You may want to perform additional checks here, for example:
        // - ensure that if the record relates to a grouped activity, that this
        //   user has access to it
        // - check whether the record is hidden
        // - check whether the user is allowed to see the record for some other
        //   reason.

        // If, for any reason, the user does not hve access, you can return
        // false here.
    }

    // For a plugin which does not specify the itemid, you may want to use the following to keep your code consistent:
    // $itemid = null;

    // Extract the filename / filepath from the $args array.
    $filename = array_pop($args); // The last item in the $args array.
    if (empty($args)) {
        // $args is empty => the path is '/'.
        $filepath = '/';
    } else {
        // $args contains the remaining elements of the filepath.
        $filepath = '/' . implode('/', $args) . '/';
    }

    // Retrieve the file from the Files API.
    $fs = get_file_storage();
    $file = $fs->get_file($context->id, 'mod_myplugin', $filearea, $itemid, $filepath, $filename);
    if (!$file) {
        // The file does not exist.
        return false;
    }

    // We can now send the file back to the browser - in this case with a cache lifetime of 1 day and no filtering.
    send_stored_file($file, DAY_SECS, 0, $forcedownload, $options);
}
```

</details>

:::

## Getting files from the user

You will typically use the [Forms API](https://docs.moodle.org/dev/Forms_API) to accept files from users. This topic is detailed in more detail in the [Using the File API in Moodle forms](https://docs.moodle.org/dev/Using_the_File_API_in_Moodle_forms) documentation.

## Common uses of the file API

Although you will usually interact with the File API from other related APIs including the Form, and Repository APIs, you may find that you need to interact with files directly for a range of purposes.

### Create files

There are several ways to created files in the Moodle file store. Each of them
requires a `fileinfo` record, which is a `stdClass` object containing all of the
relevant information that cannot be calculated automatically. A file info record
may look like the following example:

```php title="A sample file info record"
$fileinfo = [
    'contextid' => $context->id,   // ID of the context.
    'component' => 'mod_mymodule', // Your component name.
    'filearea'  => 'myarea',       // Usually = table name.
    'itemid'    => 0,              // Usually = ID of row in table.
    'filepath'  => '/',            // Any path beginning and ending in /.
    'filename'  => 'myfile.txt',   // Any filename.
];
```

#### From a file on disk

If you need to create a file from another file elsewhere on disk, for example a file you have downloaded into a temporary folder, you can use `create_file_from_pathname`.

```php title="Create a file from a file on disk"
$fs = get_file_storage();

// Create a new file containing the text 'hello world'.
$fs->create_file_from_pathname($fileinfo, $requestdir . '/helloworld.txt');
```

#### From a URL

If you need to fetch a file from a downloadable resource and store it straight into the Moodle filestore, you can use the `create_file_from_url()` function:

```php title="Create a file from a file on disk"
$fs = get_file_storage();

// Create a new file containing the text 'hello world'.
$fs->create_file_from_url($fileinfo, 'https://example.com/helloworld.txt');
```

#### From a string

In some cases you may need to create a file from a string that you have generated, or retrieved in some other manner. For example, a string created from a Template, or image data which has been automatically generated.

```php title="Create a file from a string"
$fs = get_file_storage();

// Create a new file containing the text 'hello world'.
$fs->create_file_from_string($fileinfo, 'hello world');
```

#### From another `stored_file`

In some situations you may need to create a new file entry based on an existing file entry. You may need to do this when copying a file between users in a group activity.

```php title="Create a file from an existing file"
$fs = get_file_storage();

// Create a new file containing the text 'hello world'.
$fs->create_file_from_storedfile($fileinfo, $existingfile);
```

### List all files in a particular file area

You may need to fetch a list of all files in a specific file area. You can do this using the `file_storage::get_area_files()` API, which will return array of `stored_file` objects, for example:

```php title="Fetch a list of all files in the file area"
$fs = get_file_storage();

// Returns an array of `stored_file` instances.
$files = $fs->get_area_files($contextid, 'mod_myplugin', 'post', $post->id);
foreach ($files as $file) {
    // ...
}
```

### Access the content of a file

In some rare situations you may need to use the content of a file stored in the file storage API. The easiest way of doing so is using the `get_content(): string` API call:

```php title="Fetch the content of a file"
// Get file
$fs = get_file_storage();
$file = $fs->get_file(...);

// Read contents
$contents = $file->get_content();
```

In some situations you may instead need a standard PHP file _handle_ to the file. You can retrieve a file handle resource using the  `get_content_file_handle(): resource` API call, for example:

```php title="Fetch a file handle for a file"
// Get file
$fs = get_file_storage();
$file = $fs->get_file(...);

// Read contents
$fh = $file->get_content_file_handle();

while($line = fgets($fh)) {
    // ...
}

fclose($fh);
```

:::important

You *cannot* write to a file handle fetched using the `get_content_file_handle()` function and you _must_ call `fclose()` on the returned handle when you have finished using it.

:::

### Copy a file in the File Storage API to elsewhere on disk

As the Moodle File Storage API prevents direct access to files on the disk, if you need a local copy of the file on disk, you must copy the file to a different location. You can use the `\stored_file::copy_content_to(string $destination);` function to achieved this, for example:

```php title="Copy a file to disk"
// Get file
$fs = get_file_storage();
$file = $fs->get_file(...);

$requestdir = make_request_directory();
$file->copy_content_to("{$requestdir}/helloworld.txt");
```

### Delete file

You can easily remove a file from the File Storage API using the `\stored_file::delete()` function, for example:

```php
$fs = get_file_storage();

$file = $fs->get_file(...);
$file->delete();
```

### Moving and renaming files around

In some instances you may need to move, or copy, files to other parts of the file structure.

If a file is moving within the same context, file area, and item id, then you can use the `rename(string $path, string $filename)` function, for example:

```php title="Move a file within the same file area"
$file->rename('/newpath/', '/newname.txt');
```

If a file is to be moved to a different context, file area, or item id then you will need to create a new file from the old record, and then remove the original file, for example:

```php title="Move a file to a different file area"
$fs = get_file_storage();
$filerecord = [
  'contextid'    => $file->get_contextid(),
  'component'    => $file->get_component(),
  'filearea'     => 'newfilearea',
  'itemid'       => 0,
  'filepath'     => '/newpath/',
  'filename'     => $file->get_filename(),
  'timecreated'  => time(),
  'timemodified' => time(),
];
$fs->create_file_from_storedfile($filerecord, $file);

// Now delete the original file.
$file->delete();
```

### Convert between file formats (office documents)

This functionality requires `unoconv` to be installed and configured on the site - so it is not available on all installations.

```php
$fs = get_file_storage();

// Prepare file record object
$fileinfo = [
    'component' => 'mod_mymodule', // Your component name.
    'filearea'  => 'myarea',       // Usually = table name.
    'itemid'    => 0,              // Usually = ID of row in table.
    'contextid' => $context->id,   // ID of context.
    'filepath'  => '/',            // Any path beginning and ending in /.
    'filename'  => 'myfile.txt',   // Any filename.
  ];

// Fetch the file from the database.
$file = $fs->get_file(
    $fileinfo['contextid'],
    $fileinfo['component'],
    $fileinfo['filearea'],
    $fileinfo['itemid'],
    $fileinfo['filepath'],
    $fileinfo['filename']
);

// Try and convert it if it exists
if ($file) {
    $convertedfile = $fs->get_converted_document($file, 'pdf');
}
```

## See also

- [Core APIs](../../../apis.md)
- [File API internals](./internals.md) how the File API works internally.
- [Using the File API in Moodle forms](https://docs.moodle.org/dev/Using_the_File_API_in_Moodle_forms)
- [Repository API](../../plugintypes/repository/index.md)
