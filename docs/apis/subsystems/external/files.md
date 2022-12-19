---
title: File handling
tags:
  - Web_Services
  - core_external
  - external
  - core_files
---

## Summary

Since Moodle 2.0, we provide web service functions to upload and download files. They are:

1. moodle_file_get_files (Deprecated, use core_files_get_files since moodle 2.2 onward)
1. moodle_file_upload (Deprecated, use core_files_upload since moodle 2.2 onward)

File contents are encoded in base64, and for web service transmission, it's not efficient. Mobile devices don't have enough memory to decode/encode web service request/response containing large files.

So we developed some alternative solutions to upload/download files.

## File upload

The entry point is */webservice/upload.php*, simply use HTTP POST method to upload files, it requires a web service token for authentication. If the upload is successfully, the files will be saved, prior to at least Moodle 2.9 in the user private file area but since in the user draft area.  Previously you could force the files to be saved in the draft area by specifying the then  optional parameter: *filearea=draft*.  Since at least Moodle 2.9, only two optional parameters are used, *itemid* to specify the draft area id – default 0 which is a new draft area - and *filepath* default  \'/\' to specify the file's path.

It is envisaged the *itemid* parameter will be used when the files are uploaded singularly in separate HTTP calls and the files are required to be in the same draft file area.  The client retrieves the *itemid* of the first uploaded file and uses it in subsequent uploads to specify the files must be saved in the same draft file area.

On every successful upload, the file/s information are returned in JSON format. If an error occurs, an error message will be sent back in JSON format too.

Say, we want to upload <tt>users.csv</tt> from current directory using <tt>curl</tt>:

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

Once all the files are uploaded, you can call the webservice that accepts files and pass it the *itemid* of the draft area containing the list of files for the request. The service can identify the uploads and manipulate them as necessary.  An example of a webservice that accepts files is: *mod_assign_save_submission*.

To accept file uploads, the the service must allow "files download" (*Administration > Plugins > Web services > Manage services > Edit service > Advanced button*)

There is an oldish code example on [code example on Github](https://github.com/moodlehq/sample-ws-clients/tree/master/PHP-HTTP-filehandling).

## File download

We serve the files through */webservice/pluginfile.php*. This script requires a web service token for authentication.

Look at the [code example on Github](https://github.com/moodlehq/sample-ws-clients/tree/master/PHP-HTTP-filehandling).

In case of issue, think to check that:

1. the service associated with the token allow "*files download*"  (*Administration > Plugins > Web services > Manage services > Edit service > Advanced button*)
1. the web service is valid

Note: you could notice that */webservice/pluginfile.php* has the exact same stucture than */pluginfile.php*. We don't serve the files through */pluginfile.php* for web service clients because this script requires user's login session to work. It's why it might not be an option for web service client.

## Returning files in Web Services

Since Moodle 3.2, you can return a complete file area list via Web Services using the static get_area_files method in external_util.

```php
    $forum->introfiles = external_util::get_area_files($context->id, 'mod_forum', 'intro', false, false);
```

You can also use the external_files structure definition in combination with the method to return the most common file fields required by WS clientes.

```php
     public static function get_forums_by_courses_returns() {
        return new external_multiple_structure(
            new external_single_structure(
                array(
                    'id' => new external_value(PARAM_INT, 'Forum id'),
                     ....
                    'introfiles' => new external_files('Files in the introduction text', VALUE_OPTIONAL),
```

## See also

- [Web services developer documentation](./index.md)
- [Web services user documentation](https://docs.moodle.org/en/Web_services)
