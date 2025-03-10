---
title: Question type plugin restore code
tags:
  - Plugins
  - Question
  - qtype
description: Question type plugins must implement special restore code to avoid duplicated questions
---

<Since
version="4.4.6"
issueNumber="MDL-83541"
/>

## What has changed?

The backup and restore process has a long history of issues with shared questions, resulting in duplicates of questions being
created, or errors upon restore. [MDL-83541](https://tracker.moodle.org/browse/MDL-83541) put in place a mechanism to resolve this by accurately matching questions being
restored with those already in the target context, but it requires additional information from the question type plugins to ensure
this matching works.

## How does the matching work?

When a question is restored, a SHA1 hash of the question data is generated, and compared against a SHA1 hash of each question in
the category it is being restored to. If it finds a matching hash, the question is not restored, and any references to that
question in the backup will point to the existing question instead. If no match is found, a new question will be created from
the backup data.

This process uses the [`questiondata`](https://docs.moodle.org/dev/Question_data_structures#Representation_1:_%24questiondata) structure as the common format for comparing the question from the backup with the
question in the database. For this to work, it must first convert the XML data structure into the `questiondata` structure,
which may require help from the plugin. It must also remove any data from the structure which will not be consistent, such as
database IDs.

Once this structure has been produced, it is flattened and concatenated into a string, which is then hashed.

## How can I tell if this affects my plugin?

`mod/quiz/tests/backup/repeated_restore_test.php` contains a set of unit tests that will run against all installed `qtypes`, to
ensure that existing questions are correctly matched with restored questions. If you run this test class on a development site with
your qtype plugin installed, it will fail if your plugin is missing the required information.

### These tests say my plugin was skipped!

In order to test a plugin, you must have a test question defined in your `tests/helper.php` file that has a `form_data` method, so
that it can be generated with the `create_question()` data generator.

If your question type supports multiple tries, include a hint in your test question to ensure this is covered.

If your question type does not use the standard `question_answers` table, some tests may still be skipped. This is OK as this cannot
be tested by the standard test, although you may wish to add your own test to check that a question where the question type's
custom data has been edited results in different hashes.

## What is the impact if I don't do anything?

If your plugin does not provide the information, then each time a question is restored from a backup, a new copy will be created.
This means that duplicating quizzes that use questions from a shared question bank will result in that question bank containing
lots of copies of the same questions.

## How do I tell what changes I need to make?

If your plugin just uses the standard question tables, there is a chance you don't need to do anything. Running the unit test
mentioned above will confirm this.

Check your plugin's `restore_qtype_<name>_plugin` class in `backup/moodle2/restore_qtype_<name>_plugin.class.php`. If the
`define_question_plugin_structure()` method only calls `$this->add_question_*()` functions, these fields will be handled
automatically so there is nothing more needed here. If it is adding additional paths to the `$paths[]` array, you will need to
account for these.

Add an override of the `convert_backup_to_questiondata` method, which starts by calling

```php
$questiondata = parent::convert_backup_to_questiondata($backupdata);
```

Now, find the plugin-specific paths in `$backupdata`, and add them to the `$questiondata` object at the appropriate points.
The result should match that returned by the `qtype_<name>::get_question_options()` method in your plugin's `questiontype.php` file.

Now review your plugin's `db/install.xml` file. If your plugin defines any additional tables, you will need to define the primary
and foreign key fields (any field that contains an ID) to be excluded from the data before hashing.

In your  `restore_qtype_<name>_plugin`  class, add an override of the `define_excluded_identity_hash_fields()` method, which returns
an array of fields to  remove from the `$questiondata` structure. For example, if you have a table of `qtype_name_extradata`
records with the fields `id`, `questionid`  and `data`, you might need to define the following:

```php title="question/type/example/backup/moodle2/restore_qtype_example_plugin.class.php"
protected function define_excluded_identity_hash_fields(): array {
    return [
        '/options/extradata/id',
        '/options/extradata/questionid',
    ];
}
```

The exact paths required depend on where these extra records are added in the plugin's `get_question_options()` and
`convert_backup_to_questiondata($backupdata)` methods.

Finally, check through your `get_question_options()` method to see if there is any other data attached to the `$questiondata`
structure that is not included in the backup, it will need to be removed before hashing takes place.

In your  `restore_qtype_<name>_plugin`  class, add an override of the `remove_excluded_question_data()` method, which removes this
additional data, then passes `$questiondata` on to the parent method. For example, if `get_question_options()` adds a config
setting at `$questiondata->options->pluginconfig`, you might need to define the following:

```php title="question/type/example/backup/moodle2/restore_qtype_example_plugin.class.php"
public static function remove_excluded_question_data(stdClass $questiondata, array $excludefields = []): stdClass {
    if (isset($questiondata->options->pluginconfig)) {
        unset($questiondata->options->pluginconfig);
    }
    return parent::remove_excluded_question_data($questiondata, $excludefields);
}
```

### I did all that and the tests still fail!

If something is still failing and you can't tell why, the best option is to run the unit test with XDebug, and put a breakpoint on
the `return` line of `restore_questions_parser_processor::generate_question_identity_hash()`. Most tests will hit this 3 times for
each question: Once when reading the backup the first time and creating a restored question, again when reading it the second time,
and finally when hashing the restored question for comparison. Comparing the contents of  `$questiondata` between those last two
samples should help you find why they are matching incorrectly, or not matching correctly, depending on the test.

## Where can I see some examples?

- `qtype_calculated` has an example of overriding `restore_qtype_plugin::convert_backup_to_questiondata()`, to add additional
  fields from the backup to the `$questiondata` structure, to add plugin-specific options and answer fields.
- `qtype_truefalse` has an example of overriding `restore_qtype_plugin::define_excluded_identity_hash_fields()` to remove the
  ID fields used to reference the `trueanswer` and `falseanswer` answer records.
- `qtype_multianswer` has an example of overriding `restore_qtype_plugin::remove_excluded_question_data()` to remove the array
  of `subquestions`, which are defined and restored separately in the backup so will not be part of the backup data for the question.
