---
title: File Converters
tags:
  - File
  - core_file
  - file_converter
  - API
  - PDF
  - Conversion
  - Document
---

File converters are an important tool to support other plugins with file conversion supported between a wide range of file formats. File converters are accessed using the [File conversion API](../../subsystems/files/converter.md) and are typically consumed by other plugins rather than by the user directly.

## File structure

File converter plugins are located in the `/files/converter` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `fileconverter_unoconv` plugin.</summary>

```console
files/converter/unoconv
├── classes
│   ├── converter.php
│   └── privacy
│       └── provider.php
├── lang
│   └── en
│       └── fileconverter_unoconv.php
├── settings.php
└── version.php
```

</details>

Some of the important files for the fileconverter plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### Converter class

import Converter from './_files/converter';

<Converter
    pluginname={"example"}
    required
/>

#### are_requirements_met()

This function informs the File Converter API whether the system requirements of the plugin are met. That is whether appropriate API keys are present, and the API might be available.

It should be lightweight to call and cache where required.

```php title="Example implementation"
public static function are_requirements_met() {
    return extension_loaded('my_php_extension');
}
```

#### start_document_conversion() and poll_conversion_status()

The `start_document_conversion()` function starts a conversion, whilst `poll_conversion_status` should poll for any status update. The following apply:

- If any failures occur, it should set the conversion status to `\core_files\conversion::STATUS_FAILED` and immediately return.  There is no need to update the `$conversion` record in this situation.
- When the conversion process starts, the status should be set to `\core_files\conversion::STATUS_IN_PROGRESS` and the record **must** be updated. This ensures that, should the process take a long time, the current status is accurately reflected.
- Upon successful completion, the status should be updated to `\core_files\conversion::STATUS_COMPLETE` and the newly created `\stored_file` should be stored against the conversion using either the `store_destfile_from_string` or `store_destfile_from_path` function as appropriate.

#### supports()

This function allows the plugin to answer whether it supports conversion between two formats. It is typically only used internally by the File Conversion subsystem.

```php title="Example implementation"
class converter implements \core_files\converter_interface {
    // ...
    public static function supports($from, $to) {
        // This plugin supports conversion from doc and docx to pdf only.
        if ($from !== 'doc' && $from !== 'docx') {
            return false;
        }

        return $to === 'pdf';
    }
}
```

```php title="Example usage"
if (\fileconverter_example::supports('jpg', 'pdf')) {
    // ...
}
```

#### get_supported_conversion()

This function is used purely for information purposes to display possible conversions to an administrator.

## See also

- Using the [File Converter API](../../subsystems/files/converter.md)
