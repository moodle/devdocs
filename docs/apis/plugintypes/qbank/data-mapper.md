---
title: Data mapper API for export and import
tags:
  - Plugins
  - Question
  - qbank
description: The data mapper API allows you to export and import additional question data stored by your plugin.
documentationDraft: true
---

If your question bank plugin stores additional data about a question, you can export and import that data along
with the question by implementing the data mapper API. This is currently only supported by the Moodle XML export format.

To implement a data mapper for your plugin, create a new class that extends `\core_question\local\bank\data_mapper_base`,
and return an instance from `get_data_mapper` in your `plugin_feature` class:

```php title="question/bank/example/classes/data_mapper.php"
namespace qbank_example;

class data_mapper extends \core_question\local\bank\data_mapper_base {

}
```

```php title="question/bank/example/classes/plugin_feature.php"
namespace qbank_example;

class plugin_feature extends plugin_features_base {
    #[\Override]
    public function get_data_mapper(): data_mapper_base {
        return new data_mapper();
    }
}
```

The data mapper API provides two methods, `get_question_data` to return the additional data related to each question
for export, and `save_question_data` to take imported data and save it against an imported question.

## get_question_data

`get_question_data` must return an multi-dimensional array, keyed by the ID of the question that data belongs to.
Even if the plugin has no data to export for a given question, it should return that key with an empty array. Starting
your `get_question_data` with `$questiondata = parent::get_question_data($questionids);` will give you an empty array
for each question ID.

The resulting array should be in the format `$questiondata[$questionid][$itemidentifier] = [$key => $value]`, where
`$itemidentifier` is some human-readable identifier for the data item you are exporting (such as shortname or idnumber),
and the `[$key => $value]` array is a list of arbitrary data fields and values you want to export for that item.

```php title="question/bank/example/classes/data_mapper.php"
    #[\Override]
    public function get_question_data(array $questionids): array {
        global $DB;
        $questiondata = parent::get_question_data($questionids);
        foreach ($questionids as $questionid) {
            $exampleitem = $DB->get_record('qbank_example', ['questionid' => $questionid]);
            $questiondata[$questionid][$exampleitem->idnumber] = [
                'field1' => $exampleitem->field1,
                'field2' => $exampleitem->field2,
           ];
        }
        return $questiondata;
    }
```

## save_question_data

`save_question_data` will recieve the ID of the question that has been imported, and an array of additional data
for this plugin in from the imported data. This will match the format of the `$questiondata[$questionid]` array
from `get_question_data`. You can then do whatever processing is required to store this data against the newly
imported question.

This function should return an array like `['error' => 'error messages', 'notice' => 'notice messages']` containing
any messages that need to be reported from the import process, such as invalid data or non-existant fields.
Starting your method with `$return = parent::save_question_data($questionid, $data);` will generate this array
for you.

```php title="question/bank/example/classes/data_mapper.php"
    #[\Override]
    public function save_question_data(int $questionid, array $data): array {
        global $DB;
        $return = parent::save_question_data($questionid, $data);
        try {
            $validfields = ['field1', 'field2'];
            foreach ($data as $itemid => $itemdata) {
                $example = [
                    'questionid' => $questionid,
                    'idnumber' => $itemid,
                ];
                foreach ($itemdata as $field => $value) {
                    if (!in_array($field, $validfields)) {
                        $return['notice'] .= "Skipped invalid field '{$field}' for question ID '{$questionid}'. ";
                        continue;
                    }
                    $example[$field] = $value;
                }
                $DB->insert_record('qbank_example', $example);
            }
        } catch (\Throwable $e) {
            $return['error'] = $e->getMessage();
        }
        
        return $questiondata;
    }
```
