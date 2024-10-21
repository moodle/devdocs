---
title: File API internals
tags:
  - Architecture
  - File API
  - Files
  - Internals
---

The goals of the File API are to:

- allow files to be stored within Moodle, as part of the content
- use a consistent and flexible approach for all file handling throughout Moodle
- give components control over which users can access a file, using capabilities and other local rules
- make it easy to determine which parts of Moodle use which files, to simplify operations like backup and restore
- track where files originally came from
- avoid redundant storage, when the same file is used twice
- fully support Unicode file names, irrespective of the capabilities of the underlying file system
- support alternative file systems, including cloud-based APIs

## Overview

The File API is a set of core interfaces to allow the rest of Moodle to store, serve, and manage files. It applies to all files that are part of the Moodle site's content. It is not used for internal files, such as those in the following subdirectories:

- `dataroot`
- `temp`
- `lang`
- `cache`
- `environment`
- `filter`
- `search`
- `sessions`
- `upgradelogs`

See the [File API](./index.md) documentation for information on using the File API.

The API can be subdivided into the following parts:

- [*File system*](#file-system) - Low level storage of file content, without access control
- [*File storage*](#file-storage) - Storage of file metadata
- [*File serving*](#file-serving) - Handle the retrieval and serving of files from the File storage API, including:
  - serving the files on request
  - performing appropriate access checks
- *File related user interfaces* - Provides the interface for uploading files, including:
  - Form elements allowing users to select a file using the file picker, and have it stored within Moodle.
  - UI for users to manage their files, replacing the old course files UI
- *File browsing API* - Allow code to browse and optionally manipulate the file areas, including:
  - find information about available files in each area
  - print links to files
  - optionally move, rename, copy, delete, and perform other user-facing operations.

## File API internals

### File System

The File System API allows for files to be stored in alternative underlying file systems, for example in an cloud-based API such as [Amazon S3](https://aws.amazon.com/s3). Each file is stored and retrieved using a `contenthash`.

The file content hash is calculated by taking a SHA1 hash of the content of the file. This should be unique enough so as to allow any number of files to be uploaded to the File API without any natural collisions occurring, and allows the File system to store a single copy of a file, no matter how many times that file content is used within user-generated content.

This means Moodle can not store two files with _different_ content and the _same_ SHA1 hash, luckily it is extremely unlikely that this would ever happen. Technically it is also possible to implement reliable collision tests (with some performance cost), though Moodle currently checks for this case using a simple file length check in addition to SHA1 hash.

:::info

The default file system shipped with Moodle stores all files on disk within the `moodledata` sub-directory of `$CFG->dataroot`.

Suppose a file has a content hash of `081371cb102fa559e81993fddc230c79205232ce`, then it will be stored in on disk as `moodledata/filedir/08/13/081371cb102fa559e81993fddc230c79205232ce`.

:::

:::tip Validation of files

As files in the standard disk-based file storage API are named using their SHA1 hash, there is a simple way of validating files have not become corrupted using the 'sha1sum' command available in most GNU/Linux distributions.

Where a file is correct then the filename will match the `sha1sum` of the file. for example:

```console
  $ cd /moodlepath/moodledata/filedir/1d/df/
  $ sha1sum 1ddf5b375fcb74929cdd7efda4f47efc61414edf
  1ddf5b375fcb74929cdd7efda4f47efc61414edf  1ddf5b375fcb74929cdd7efda4f47efc61414edf
```

Where a file has become corrupted, these will differ:

```console
  $ cd /moodlepath/moodledata/filedir/42/32/
  $ sha1sum 42327aac8ce5741f51f42be298fa63686fe81b7a
  9442188152c02f65267103d78167d122c87002cd  42327aac8ce5741f51f42be298fa63686fe81b7a
```

:::

### File Storage

The File Storage API is provided by the `\file_storage` class, and stores all metadata relating to a file. It interacts with the File System API and the `\stored_file` class to provide all low-level storage functionality.

### Files table

The File system API stores all file records in the `files` database table. This table contains one entry for each usage of a file. Enough information is kept here so that the file can be fully identified and retrieved again if necessary.

If, for example, the same image is used in a user's profile, and a forum post, then there will be two rows in this table, one for each use of the file, and Moodle will treat the two as separate files, even though the file is only stored once on disc.

Entries with a file name of `.`represent directories. Directory entries like this are created automatically when a file is added within them.

:::note

The name `files` is used in the plural form, even though it goes against the [coding guidelines](https://docs.moodle.org/dev/Database) because `file` is a reserved word in some SQL dialects.

:::

## Implementation of basic operations

The low level access API is defined in the `\file_storage` class, which can be obtained using the `get_file_storage()` function, for example:

```php
$fs = get_file_storage();
```

Details of common operations are documented in the [File System API](./index.md) documentation

## File serving

The File serving component of the File API deals with serving files to the user. This is typically in the form of browser requests. Moodle has several main files to handle serving of files. These include:

- `draftfile.php` - the script used to serve files in a user's `draft` file area.
- `pluginfile.php` - the script typically used by a plugin to access content.
- `tokenpluginfile.php` - the script typically used by a plugin to access content when a user is not logged in. This is usually in situations where a file is referred to in an e-mail or other similar scenario.

It is the plugins responsibility to handle:

- access control
- optional XSS protection - student submitted files must not be served with normal headers, we have to force download instead; ideally there should be second wwwroot for serving of untrusted files
- links to these files are constructed on the fly from the relative links stored in database (see [Generating a URL to your files](./index.md#generating-a-url-to-your-files) for further information).

:::important

Each plugin should only ever use the File Storage API to access its __own files__.

:::

## File related user interfaces

Files are typically selected by users and uploaded to Moodle using the File manager, and the file picker.

- The **file manager** is an interface used to view, and delete existing files, and to add new files.
- The **file picker** is an interface, often accessed using the _file manager_, to select files for upload to Moodle. The file picker makes use of [file repositories](../../plugintypes/repository/index.md).

### Form fields

Moodle defines two form field types as part of the `formslib` integration, these are:

- The `filepicker`; and
- the `filemanager`.

### Integration with the HTML editor

Each instance of an HTML editor can be told to store related files in a particular file area.

During editing, files are stored in a draft files area in the `user` component. Then when the form is submitted they are moved into the real file area.

## Other issues

### Unicode support in zip format

Zip format is an old standard for compressing files. It was created long before Unicode existed, and Unicode support was only recently added. There are several ways used for encoding of non-ASCII characters in path names, but unfortunately it is not very standardised. Most Windows packers use DOS encoding.

#### Client software

- Windows built-in compression - bundled with Windows, non-standard DOS encoding only
- WinZip - shareware, Unicode option (since v11.2)
- TotalCommander - shareware, single byte(DOS) encoding only
- 7-Zip - free, Unicode or DOS encoding depending on characters used in file name (since v4.58beta)
- Info-ZIP - free, uses some weird character set conversions

#### PHP extraction

- Info-ZIP binary execution - no Unicode support at all, mangles character sets in file names (depends on OS, see docs), files must be copied to temp directory before compression and after extraction
- PclZip PHP library - reads single byte encoded names only, problems with random problems and higher memory usage.
- Zip PHP extension - kind of works in latest PHP versions

#### Large file support

- PHP running under 32bit operating systems does not support files >2GB. This might be a potential problem for larger backups.

#### Tar Alternative

- tar with gzip compression - easy to implement in PHP + zlib extension (PclTar, Tar from PEAR or custom code)
- no problem with unicode in *nix, Windows again expects DOS encoding :-(
- seems suitable for backup/restore - yay!

#### Summary

1. added zip processing class that fully hides the underlying library
1. using single byte encoding "garbage in/garbage out" approach for encoding of files in zip archives; add new `zipencoding` string into lang packs (for example `cp852` DOS charset for Czech locale) and use it during extraction (we might support true unicode later when PHP Zip extension does that)

### Tar packer

In addition to the zip packer, a tar packer is also available. This creates
archives in a compressed tar format (similar to the file created by `tar -czf example.tar.gz mycontent`).

The packer is currently limited to ASCII filenames and individual files are limited to 8GB each, but unlike zip there is no limit on the total filesize. It uses the old POSIX format and is compatible with GNU tar using default options.

## See also

- [Repository API](../../plugintypes/repository/index.md)
- [Portfolio API](https://docs.moodle.org/dev/Portfolio_API)
- [Resource module file API migration](https://docs.moodle.org/dev/Resource_module_file_API_migration)
- [MDL-14589](https://tracker.moodle.org/browse/MDL-14589) - File API Meta issue
