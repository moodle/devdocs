---
title: Question type plugins
tags:
  - Plugins
  - Question
  - qtype
description: Question type plugins implement the different types of question that the core Question subsystem can handle.
---

Question types are one of the plugins used by the question subsystem. To see how they fit in, please read [this overview of the question subsystems](../subsystems/question/).

Question types have to do many things:

1. `edit_..._form.php` - Provide an editing form so that teachers can create and edit questions of this type.
2. `questiontypes.php` - Define a class to handle loading and saving data from this form.
3. ... and related methods providing metadata about this question types.
4. ... and import and export in any Question formats that the type wants to support.
5. `question.php` - this class represents one instance of this question type, while it is being attempted by a user. It must do many things
6. ... Start a new attempt (e.g. in a multiple choice question, this is where we randomly shuffle the choices).
7. ... or if we are continuing an existing attempt, re-initialise the question to the same state, using the data from the DB.
8. ... Tell the question engine what data this question type is expecting to be submitted.
9. ... Analyse those submitted responses: e.g. has it changed? is it complete.
10. ... Automatically grade the response to give a 'fraction' (mark between 0 and 1) and a state (correct / partially correct / incorrect).
11. ... check access to files for the file API.
12. `renderer.php` - to display the key bits of this question types for the `core_question_renderer` to combine into the overall question display.
13. Implements Backup and restore, and all the other standard parts of a Moodle plugin like DB tables.
14. Track [users preferences for the settings used for newly created questions](./qtype/newquestiondefaults).
