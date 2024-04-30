---
title: Defaults for new questions
tags:
  - Plugins
  - Question
  - qtype
description: A way for question types to remember a user's preferred settings for creating questions of a given type.
documentationDraft: true
---

## Introduction

Many question types are quite flexible, and so have a lot of options on their editing form. Quite often, when a teacher is creating a number of questions, it is likely they will want to keep using the same values for some options. Therefore, the question system has a way for question types to save some settings as user-preferences, and then use them as the default when creating a new question.

Note, this is only done when a teacher creates and saves a new question. We don't save the preferences when a teacher edits an existing question (which might have been created by someone else with different preferences).

## How to implement this feature

### Decide which settings should be saved

It is not appropriate to save all the settings. For example, name and question text are what uniquely define a particular question. It would be unhelpful to remember and re-use these since they need to be different each time.

The kind of settings we want to save are the ones like do you want the choices in your multiple-choice question numbered 'a, b, c, ...' or '1, 2, 3, ...' or not numbered at all? As you think about this, looking through what other question types do is probably a good way to get a feel for what sorts of things it makes sense to remember. That will also promote consistency. Search for implementations of `save_defaults_for_new_questions`.

### In the form class - use any previously saved defaults

Before implementing this feature, your form class is likely to have code like

```php
$mform->setDefault('shuffleanswers', 1);
```

For all the settings where you want to implement this feature, need to change the hard-coded default (`1` here) to instead fetch the default from the user's preferences using the `get_default_value` method:

```php
$mform->setDefault('shuffleanswers', $this->get_default_value('shuffleanswers', 1));
```

### In the question-type class

Here we need to override the method `save_defaults_for_new_questions` to save the values these settings. For example:

```php
    public function save_defaults_for_new_questions(stdClass $fromform): void {
        parent::save_defaults_for_new_questions($fromform);
        $this->set_default_value('shuffleanswers', $fromform->shuffleanswers);
    }
```

All the settings save here should match the ones fetched by `get_default_value` in the form. You need to call `parent` because Moodle core saves some settings that apply to all question types.

### Privacy provider

Because this feature works using user preferences, you need to declare that in your privacy provider.

This is boring but necessary. Easiest way to see what to do is to [copy another question type](https://github.com/moodle/moodle/blob/main/question/type/match/classes/privacy/provider.php).

Note, it is necessary for your provider to declare the ones saved by core. (I suppose, ideally, someone would make a helpful base class, or trait, to make it easier to implement this.)

### Automated tests

Always a good idea. You are likely to need:

1. [Unit tests for the privacy provider](https://github.com/moodle/moodle/blob/main/question/type/match/tests/privacy/provider_test.php).
2. Behat test to show that the saved settings are re-used. Many question types have [a `behat/add.feature` file where it is easy to add coverage for this](https://github.com/moodle/moodle/blob/main/question/type/match/tests/behat/add.feature).

The links in that list go to examples of how these are implemented in `qtype_match`.
