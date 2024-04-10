---
title: Questions API
tags:
  - API
  - Subsystem
  - Question
documentationDraft: true
---

The question subsystem in Moodle manages the creation, editing and management of interactive questions, and then enables those questions to be presented to users so they can be attempted. It is useful to consider these as separate subcomponents.

## The question engine

This is the part that makes questions work when users attempt or otherwise interact with questions as part of a learning experience.

The main user of this in the standard Moodle package is mod_quiz, but there is also qbank_previewquestion, and numerous plugins, including [`filter_embedquestion`](https://moodle.org/plugins/filter_embedquestion).

The goal of this part of the system is to allow the widest ranges of interactive learning experiences to be created, therefore the question engine supports two types of plugin:

### Question types (qtype_)

[Question types](../../plugintypes/qtype/index.md) define what the question is. For example a multiple choice or drag-drop question question, or a text input question graded as with a string (e.g. shortanswer or [pattern-match](https://moodle.org/plugins/qtype_pmatch)) or as a number. It might be something much more complex, like a [crossword](https://moodle.org/plugins/qtype_crossword), or a [coding exercise](https://moodle.org/plugins/qtype_coderunner).

### Question behaviours (qbehaviour_)

Question behaviours let Moodle support different ways for a student to interact with questions. For example it might be like a classic exams, where initially the student just inputs their answers to all the questions, which are only graded, and feedback given later (`qbehaviour_deferredfeedback`). Or it the student might have a 'Check' button in each question so their work can be graded immediately (`qbahviour_immediatefeedback`). It might even be that after their first try, if that is not right, the students can immediately Try again, to see if they can correct their mistake based on the initial feedback (`qbehaviour_interactive`).

### Core question engine

So, when a particular question is attempted with a particular behaviour, the core question engine needs to orchestrate the behaviour and the question type plug plugin to work together to present the experience to the user. The question engine also handles the storing the progress in the database (so that can be done efficiently, and in bulk) and it presents a uniform API for this to whatever is using the questions (e.g. a quiz attempt). Some key classes here are:

1. `question_engine` - this class is the main entry point into this part of the API.
2. `question_attempt` - this represents a users attempt at on question. Since most of the time user's attempt a group of related questions together, and even more important class is `question_usage_by_activity`.
3. `question state` - as stated above, question types and behaviours should have as much freedom as possible to present interesting educational interactions to users. But, on the other hand, parts of the system that use questions (e.g. the quiz) need to have some idea what is going on with each question. The various question states try to find an appropriate compromise, so the state of each question can be tracked, but without restricting the freedom of the question behaviours to work how they want.
4. `question_display_options` - when questions are used, e.g. in a quiz, there may be limitations one what the user can see. For example, perhaps the student is only allowed to see the grade and feedback on their attempt after all students have finished. The display options class is how the quiz can control which bits should be visible when a question is rendered. In addition, depending on what state we are in with the question behaviour might also affect what is visible right now, so qbehaviour_plugins can modify the display options based on the current state of the question_attempt, as part of the rendering process.
5. `core_question_renderer` - renders the overall layout of the questions. It works with the applicable qtype_ and qbehaviour_ renderer to render the details of the current attempt.

## Question bank

The question bank provides the UI where teachers create, edit and manage questions. It also works with several plugin types:

### Question bank plugins (qbank_)

[Question bank plugins (qbank_)](../../plugintypes/qbank/index.md) add features to the question bank. The core question bank code mainly just ties all these features together.

### Question import/export plugins (qformat_)

Question import/export plugins questions to be exported and imported in a variety of formats. Use by plugins like `qbank_exportquestions`, `qbank_importquestions` and `qbank_exporttoxml`.

### Question types (qtype_)

[Question types](../../plugintypes/qtype/index.md) were already considered above, when thinking about the the question engine. They also need to work with the question bank, so that teachers can create and edit questions of that type.
