---
title: File handling
tags:
  - Web Services
  - core_external
  - external
  - core_files
sidebar_position: 4
---

Moodle provides two ways to fetch and upload files:

1. A set of web service functions; and
2. A pair of dedicated endpoints.

## Web service functions

You can use the following functions to upload, and fetch, file content:

1. `core_files_get_files()`; and
1. `core_files_upload()`.

When using these functions, the file content is base64-encoded.

:::note

Many devices do not have enough memory to encode and decode requests containing large files. As such we recommend using the dedicated endpoints instead.

:::

## Dedicated endpoints

Moodle provides two dedicated endpoints which can be used, alongside the authentication token, to upload and fetch content. These are:

- to upload a file: `/webservice/upload.php`; and
- to fetch a file: `/webservice/pluginfile.php`.

### File upload

The recommended way to upload file content from an external service is by issue a `POST` request to the `/webservice/upload.php` endpoint, passing in a valid web service token for authentication.

Upon successful upload, any files passed will be saved in the user's draft file area.

The endpoint takes two optional arguments:

- An `itemid` to upload the files to, defaulting to `0`. If none is specified then a new id is generated for the current user's draft file area
- A `filepath` to store the file in, defaulting to `/`.

The endpoint will return a JSON-encoded summary of the uploaded file, including the `itemid` that it was stored in.

:::tip

It is typical that the `itemid` parameter will be used when the files are uploaded singularly in separate HTTP calls and the files are required to be in the same draft file area.

The client retrieves the `itemid` from the first uploaded file and uses it in subsequent uploads.

This allows multiple files to be uploaded to the same draft file area.

:::

On every successful upload, the file/s information are returned in JSON format. If an error occurs, an error message will be sent back in JSON format too.

:::note Example

To upload a file, `users.csv`, you could use curl as follows:

```bash
$ curl -X POST -F "file_1=@users.csv" https://SITENAME/webservice/upload.php?token=TOKEN \
| jq

[
  {
    "component": "user",
    "contextid": 567,
    "userid": "123",
    "filearea": "draft",
    "filename": "users.csv",
    "filepath": "/",
    "itemid": 880413555,
    "license": "allrightsreserved",
    "author": "User User",
    "source": "O:8:\"stdClass\":1:{s:6:\"source\";s:13:\"users.csv\";}"
  }
]
```

The returned JSON response includes the key parts of the file record, including the `itemid`.

:::

Once all the files are uploaded, you can call a webserivce function to process the files from the user drafts area, passing in the `itemid` of the draft area containing the list of files for the request. The service can identify the uploads and manipulate them as necessary.

An example of a webservice that accepts files is: `mod_assign_save_submission`.

To accept file uploads, the service must allow "files download" (*Administration > Plugins > Web services > Manage services > Edit service > Advanced button*)

## File download

We serve the files through `/webservice/pluginfile.php`. This script requires a web service token for authentication.

To support file downloads, the service must allow "files download".

:::note

The `/webservice/pluginfile.php` endpoint has the exact same structure as `/pluginfile.php` and `/tokenpluginfile.php`.

We don't serve the files through `/pluginfile.php` for web service clients because it requires the user's login session to work, however it is possible to use the `/tokenpluginfile.php` endpoint with an appropriate token.

:::

## Returning files in Web Services

Since Moodle 3.2, you can return a complete file area list via Web Services using the static `get_area_files` method, defined in `external_util`.

```php
$forum->introfiles = external_util::get_area_files($context->id, 'mod_forum', 'intro', false, false);
```

You can also use the `external_files` structure definition in combination with the method to return the most common file fields required by WS clients.

```php
public static function execute_returns(): external_multiple_structure {
    return new external_multiple_structure(
        new external_single_structure([
            'id' => new external_value(PARAM_INT, 'Forum id'),
            // ...
            'introfiles' => new external_files('Files in the introduction text', VALUE_OPTIONAL),
            // ...
        ])
    );
}
```

## See also

- [Web services developer documentation](./index.md)
- [Web services user documentation](https://docs.moodle.org/en/Web_services)
