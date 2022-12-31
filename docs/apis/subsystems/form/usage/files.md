---
title: Using the File API in Moodle forms
tags:
  - Files
  - Repositories
---
{{Moodle 2.0}}

## Overview

In Moodle 2.0 all files are stored in a central database accessible via the [File API](../../files/index.md), and every file is associated with a component and a "file area" in Moodle, such as a particular module.

A common use case is to provide a form (using Moodle's [Forms API](https://docs.moodle.org/dev/lib/formslib.php)) which allows users to upload or import files as attachments or media embedded into HTML.

Normally this works like this:

1. User starts creation or re-edits an existing item in Moodle (eg forum post, resource, glossary entry etc)
1. User presses some sort of button to browse for new files to attach or embed
1. User sees our "Choose file..." dialog, which contains one or more repository instances.
1. User chooses a file, the corresponding [Repository plugin](../../../plugintypes/repository/index.md) takes care of copying the file into a "draft file area" within Moodle
1. File appears in the text or as an attachment in the form.
1. When the user hits save, the [File API](../../files/index.md) is invoked to move the file from the draft file area into a permanent file area associated with that data

This document shows you exactly how to use Moodle forms to interact with users in a standard and secure way.

If you just want to write code to manipulate Moodle files internally (without user input) then see [File API](../../files/index.md).

## Form elements

In Moodle 2.0 there are three file-related form elements for interacting with users:

1. filemanager - the way to attach one or more files as a set
1. editor - the way to specify a textarea with a HTML editor, and all the handling of images and movies within that HTML
1. filepicker - a way to specify one file for the case when you want to process the file and throw it away

In Moodle 1.9 there were two other types which are now **deprecated** (they work, but please do not use these anymore)

1. file - used to just allow a normal file upload from the desktop only.
1. htmleditor - this old method of embedding a HTML editor in a textarea is not able to support repositories etc.

### filepicker

File picker (*filepicker*) is a direct replacement of the older *file* formslib element.

It is intended for situations when you want the user to upload **one** file so you can process it and delete it, such as when you are importing data from a CSV file.
If you want a file that remains part of the Moodle storage and will reappear when you reopen the form, then you should use a filemanager instead (and restrict it to a single file, if necessary).

#### Using the filepicker element

```php
$mform->addElement('filepicker', 'userfile', get_string('file'), null,
                   array('maxbytes' => $maxbytes, 'accepted_types' => '*'));
```

#### Obtain the chosen file

To get the contents of the file:

```php
$content = $mform->get_file_content('userfile');
```

To get the name of the chosen file:

```php
$name = $mform->get_new_filename('userfile');
```

To save the chosen file to the server filesystem (such as to moodledata folder):

```php
$success = $mform->save_file('userfile', $fullpath, $override);
```

To store the chosen file in the Moodle files pool:

```php
$storedfile = $mform->save_stored_file('userfile', ...);
```

### filemanager

The File Manager element improves on file picker by allowing you to manage more than one file.  It is expected that the files will be stored permanently for future use (such as forum and glossary attachments).

#### Add file manager element

Example:

```php
$mform->addElement('filemanager', 'attachments', get_string('attachment', 'moodle'), null,
                    array('subdirs' => 0, 'maxbytes' => $maxbytes, 'areamaxbytes' => 10485760, 'maxfiles' => 50,
                          'accepted_types' => array('document'), 'return_types'=> FILE_INTERNAL | FILE_EXTERNAL));
```

Here are the fields for filemanager:

;'filemanager':This is a filemanager element :)
;elementname:The unique name of the element in the form
;elementlabel:The label string that users see
;attributes:(leave it as null)
;options: an array of further options for the filepicker (see below)

The options array can contain:

;subdirs:(Default 1) Are subdirectories allowed?  (true or false)
;maxbytes:(Default 0) Restricts the size of each individual file.
;areamaxbytes:(Default 0) Restricts the total size of all the files.
;maxfiles:(Default -1) Restricts the total number of files.
;accepted_types:(Default *) You can specify what file types are accepted by filemanager.  All current file types are listed in `get_mimetypes_array()` in [lib/classes/filetypes.php](https://github.com/moodle/moodle/blob/master/lib/classes/filetypes.php).

Example usage:  **array('audio', 'video', 'document')**, you can include file extensions as well, for example: **array('.txt', '.jpg', 'audio')**.

#### Load existing files into draft area

```php
if (empty($entry->id)) {
    $entry = new stdClass;
    $entry->id = null;
}

$draftitemid = file_get_submitted_draft_itemid('attachments');

file_prepare_draft_area($draftitemid, $context->id, 'mod_glossary', 'attachment', $entry->id,
                        array('subdirs' => 0, 'maxbytes' => $maxbytes, 'maxfiles' => 50));

$entry->attachments = $draftitemid;

$mform->set_data($entry);

```

#### Store updated set of files

```php
if ($data = $mform->get_data()) {
    // ... store or update $entry
    file_save_draft_area_files($data->attachments, $context->id, 'mod_glossary', 'attachment',
                   $entry->id, array('subdirs' => 0, 'maxbytes' => $maxbytes, 'maxfiles' => 50));
}
```

### editor

There are two ways of using the editor element in code, the first one is easier but expects some standardized fields. The second method is more low level.

#### Simple use

1. name database fields: *textfield*, *textfieldformat* (and *textfieldtrust* if required)
1. create options array.  note that context is the best, most local context you have available.
1. :`$textfieldoptions = array('trusttext'=>true, 'subdirs'=>true, 'maxfiles'=>$maxfiles, 'maxbytes'=>$maxbytes, 'context'=>$context);`
1. add editor *textfield_editor* to moodle form, pass options through custom data in form constructor, set $data->id to null if data not exist yet
1. :`$mform->addElement('editor', 'textfield_editor', get_string('fieldname', 'somemodule'), null, $textfieldoptions);`
1. prepare data
1. :`$data = file_prepare_standard_editor($data, 'textfield', $textfieldoptions, $context, 'mod_somemodule', 'somearea', $data->id);`
1. get submitted data and after inserting/updating of data
1. :`$data = file_postupdate_standard_editor($data, 'textfield', $textfieldoptions, $context, 'mod_somemodule', 'somearea', $data->id);`

Real world examples are in mod/glossary/edit.php and mod/glossary/comment.php

#### Low level use

When using editor element you  need to preprocess and postprocess the data:

1. detect if form was already submitted (usually means draft is area already exists) - *file_get_submitted_draft_itemid()*
1. prepare draft file area, temporary storage of all files attached to the text - *file_prepare_draft_area()*
1. convert encoded relative links to absolute links - *file_prepare_draft_area()*
1. create form and set current data
1. after submission the changed files must be merged back into original area - *file_save_draft_area_files()*
1. absolute links have to be replaced by relative links - *file_save_draft_area_files()*

##### Replace old htmleditor with editor

The file picker has been integrated with with TinyMCE to make the editor element. This new element should support all types on editors and should be able to switch them on-the-fly. Instances of the old htmleditor element in your forms should be replaced by the new editor element, this may need adding of new format and trusttext columns. For example:

```php
$mform->addElement('editor', 'entry', get_string('definition', 'glossary'), null,
        array('maxfiles' => EDITOR_UNLIMITED_FILES));
```

The editor element can take following options: maxfiles, maxbytes, subdirs and changeformat. Please note that the embedded files is optional feature and is not expected be used everywhere.

**Note**: the editor element now includes text format option. You should no longer use the separate format element type.

##### Prepare current data - text and files

```php
if (empty($entry->id)) {
  $entry = new object();
  $entry->id = null;
  $entry->definition = '';
  $entry->format = FORMAT_HTML;
}

$draftid_editor = file_get_submitted_draft_itemid('entry');
$currenttext = file_prepare_draft_area($draftid_editor, $context->id, 'mod_glossary', 'entry',
                                       $entry->id, array('subdirs'=>true), $entry->definition);
$entry->entry = array('text'=>$currenttext, 'format'=>$entry->format, 'itemid'=>$draftid_editor);

$mform->set_data($entry);
```

If there are multiple files, they will share the same itemid.

##### Obtain text, format and save draft files

To retrieve editor content, you need to use following code:

```php
if ($fromform = $mform->get_data()) {
    // content of editor
    $messagetext = $fromform->entry['text'];
    // format of content
    $messageformat  = $fromform->entry['format'];
}
```

When a user selects a file using the file picker, the file is initially stored in a draft file area, and a URL is inserted into the HTML in the editor that lets the person editing the content (but no one else) see the file.

When the user submits the form, we then need to save the draft files to the correct place in permanent storage. (Just like you have to call $DB->update_record('tablename', $data); to have the other parts of the form submission stored correctly.)

The save_files_from_draft_area function and replace absolute links with internal relative links do:

```php
$messagetext = file_save_draft_area_files($draftid_editor, $context->id, 'mod_glossary', 'entry',
                                          $entry->id, array('subdirs'=>true), $messagetext);
```

; $context->id, 'component', 'proper_file_area' and $entry->id : correspond to the contextid, filearea and itemid columns in the [files table](https://docs.moodle.org/File_API#Table/_files).
; $messagetext : this is the message text. As the files are saved to the real file area, the URLs in this content are rewritten.

All URLs in content that point to files managed to the File API are converted to a form that starts '@@PLUGINFILE@@/' before the content is stored in the database. That is what we mean by rewriting.

## File serving

### Convert internal relative links to absolute links

Before text content is displayed to the user, any URLs in the '@@PLUGINFILE@@/' form in the content need to be rewritten to the real URL where the user can access the files.

```php
$messagetext = file_rewrite_pluginfile_urls($messagetext, 'pluginfile.php',
        $context->id, 'mod_mymodule', 'proper_file_area', $itemid);
```

; $messagetext : is the content containing the @@PLUGINFILE@@ URLs from the database.
; 'pluginfile.php' : there are a number of different scripts that can serve files with different permissions checks. You need to specify which one to use.
; $context->id, 'mod_mymodule', 'proper_file_area', $itemid : uniquely identifies the file area, as before.

### Implement file serving access control

Attachments and embedded images should have the same access control like the text itself, in majority of cases these files are served using pluginfile.php. Access control is defined in *module/lib.php* file in function *module_pluginfile()*.

## File browsing support

Only owner of each file area is allowed to use low level File API function to access files, other parts of Moodle should use file browsing API.

Activities may specify browsing support in own module/lib.php file by implementing functions module_get_file_areas() and module_get_file_info().

## Upgrading your code

Here I will attempt to describe some simple steps you can take to upgrade your file-handling form elements from pre-2.0 code to 2.0. We will use the example of glossary, since it has been used above.

### Preparing your options

Unless you are happy with the defaults, you will need to define an array of options for each file-handling form element. You could define it at different places, but it's best to put it in one place and make the array(s) available to other files if they need it. In the majority of cases, this will be in a file like edit.php

Previous code in mod/glossary/edit.php:

```php
$mform =& new mod_glossary_entry_form(null, compact('cm', 'glossary', 'hook', 'mode', 'e', 'context'));
```

New code:

```php
$maxbytes = $course->maxbytes;
// Could also use $CFG->maxbytes if you are not coding within a course context

$definitionoptions = array('subdirs'=>false, 'maxfiles'=>99, 'maxbytes'=>$maxbytes, 'trusttext'=>true,
                           'context'=>$context);
$attachmentoptions = array('subdirs'=>false, 'maxfiles'=>99, 'maxbytes'=>$maxbytes);
$mform = new mod_glossary_entry_form(null, array('current'=>$entry, 'cm'=>$cm, 'glossary'=>$glossary,
                                                 'definitionoptions'=>$definitionoptions, 
                                                 'attachmentoptions'=>$attachmentoptions));
```

Note that the data being passed to the form constructor have changed also, but this is not part of the file API changes, I just include them to avoid confusion.

These options are for the htmleditor (definition field) and the filemanager (attachment field). They are used by a file called edit_form.php.

### Element preparation

Before we look at this, however, we need to "prepare" the elements so that they can correctly display existing embedded images and attached files when you are editing a record instead of just creating one. So, let's take the code we've got so far in edit.php and add to it:

Currently upgraded code in edit.php:

```php
$mform = new mod_glossary_entry_form(null, array(
        'current'=>$entry, 
        'cm'=>$cm, 
        'glossary'=>$glossary,
        'definitionoptions'=>$definitionoptions, 
        'attachmentoptions'=>$attachmentoptions));
```

New code with element preparation:

```php
$entry = new stdClass();
$entry->id = 0; \\ See notes!
$entry = file_prepare_standard_editor($entry, 'definition', $definitionoptions, $context,
                                      'mod_glossary', 'entry', $entry->id);
$entry = file_prepare_standard_filemanager($entry, 'attachment', $attachmentoptions, $context,
                                           'mod_glossary', 'attachment', $entry->id);
$mform = new mod_glossary_entry_form(null, array('current'=>$entry, 'cm'=>$cm, 'glossary'=>$glossary,
                                                 'definitionoptions'=>$definitionoptions, 
                                                 'attachmentoptions'=>$attachmentoptions));
$mform->set_data($entry);
```

Things to note:

- $entry in this case is simply a stdClass object which may either represent a new glossary entry or an existing one.
- $entry->id must be the unique identifier for the current object. If we are creating a new entry, it will be null, but in all cases it must be defined.
- These two functions (file_prepare_standard_editor and file_prepare_standard_filemanager) are shortcuts functions that take care of some of the tedious setting up for you, but they make a couple of assumptions:

- # You **must** name the form element as {element}_editor or {element}_filemanager (see next section)

- # You **must** have at least the following fields in the database: {element} and {element}summary, as described earlier in this documentation

- # $entry will be populated with a field (in this case) 'definition_filemanager' having the draftfileid of your files. This needs to get passed to the 'value' of the filemanager control in the form. If you get this wrong, existing file will not appear in the control when it is reloaded.

We can now look at the upgrades needed in the form definition file.

### Form definition

Previous code in mod/glossary/edit_form.php:

```php
$mform->addElement('htmleditor', 'definition', get_string('definition', 'glossary'),
                    array('rows'=>20));
$mform->setType('definition', PARAM_RAW);
$mform->addRule('definition', null, 'required', null, 'client');
$mform->setHelpButton('definition', array('writing', 'richtext'), false, 'editorhelpbutton');
$mform->addElement('format');
// a bit further...
$this->set_upload_manager(new upload_manager('attachment', true, false, $COURSE, false, 0,
                                             true, true, false));
$mform->addElement('file', 'attachment', get_string('attachment', 'forum'));
$mform->setHelpButton('attachment', array('attachment', get_string('attachment', 'glossary'),
                      'glossary'));
```

New code:

```php
$definitionoptions = $this->_customdata['definitionoptions'];
$attachmentoptions = $this->_customdata['attachmentoptions'];
// a bit further...
$mform->addElement('editor', 'definition_editor', get_string('definition', 'glossary'), null,
                   $definitionoptions);
$mform->setType('definition_editor', PARAM_RAW);
$mform->addRule('definition_editor', get_string('required'), 'required', null, 'client');
// a bit further...
$mform->addElement('filemanager', 'attachment_filemanager', get_string('attachment', 'glossary'),
                   null, $attachmentoptions);
$mform->setHelpButton('attachment_filemanager', array('attachment2',
                      get_string('attachment', 'glossary'), 'glossary'));
```

Note the following:

- The format element and the help button are no longer required for the HTML editor element
- The name of the form element needs to be changed by adding '_editor' or '_filemanager' to the original name. This is a naming convention that is used by a couple of functions we will look at shortly
- Make sure $definitionoptions has context parameter, else system context is used and editor will not respect filter settings.

### Handling submitted data

The final step is to handle the submitted data properly, i.e. retrieve the files and save them to disk, associating them with the record we have just created (a glossary entry in our example). This happens in edit.php:

Previous code in edit.php:

```php
// Section that updates an entry:
$todb->id = $e;
$dir = glossary_file_area_name($todb);
if ($mform->save_files($dir) and $newfilename = $mform->get_new_filename()) {
    $todb->attachment = $newfilename;
}

// Section that adds an entry:
if ($todb->id = insert_record("glossary_entries", $todb)) {
    $e = $todb->id;
    $dir = glossary_file_area_name($todb);
    if ($mform->save_files($dir) and $newfilename = $mform->get_new_filename()) {
        set_field("glossary_entries", "attachment", $newfilename, "id", $todb->id);
    }
}
```

New code:

```php
// $todb was renamed to $entry, and the code was refactored 
// so that the file-handling code is only used once for either an add or an update action.
// If an entry is being added, $DB->insert() has already been called, so we have a valid $entry->id
$entry = file_postupdate_standard_editor($entry, 'definition', $definitionoptions, $context,
                                         'mod_glossary', 'entry', $entry->id);
$entry = file_postupdate_standard_filemanager($entry, 'attachment', $attachmentoptions, $context,
                                              'mod_glossary', 'attachment', $entry->id);
// store the updated value values
$DB->update_record('glossary_entries', $entry);
```

Things to note:

- If you are adding a new record, you will still need to call update_record after calling the file_postupdate* functions

### Gotchas

A few things to keep in mind:

- Make sure that you instantiate the moodle form before any call to $OUTPUT->header()

## See also

- [File API](../../files/index.md)
- [Using the file API](https://docs.moodle.org/dev/Using_the_file_API)
- [Repository plugins](../../../plugintypes/repository/index.md)
- [Portfolio API](https://docs.moodle.org/dev/Portfolio_API)
- [MDL-14589](https://tracker.moodle.org/browse/MDL-14589) - File API Meta issue
- [Adding a text editor to a Moodle form](https://moodle.org/mod/forum/discuss.php?d=207748)
- [Button actions in Moodle form](https://moodle.org/mod/forum/discuss.php?d=157953#p692822)
- [File Picker](https://moodle.org/mod/forum/discuss.php?d=351013#p1416554)
- [Example of filemanager in an activity module](https://github.com/CARLOSEDUARDOVIEIRA/moodle-uploadfile)
