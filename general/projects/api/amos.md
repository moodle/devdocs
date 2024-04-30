---
title: Automated Manipulation of Strings (AMOS)
sidebar_label: AMOS
tags:
  - Language
---

import { ProjectSummary } from '@site/src';

<ProjectSummary
    projectName="api/amos"
/>

<!-- cspell:ignore stringid -->
<!-- cspell:ignore timemodified -->
<!-- cspell:ignore commitmsg -->
<!-- cspell:ignore commithash -->
<!-- cspell:ignore userid -->
<!-- cspell:ignore userinfo -->

**AMOS** stands for Automated Manipulation of Strings. AMOS is a central repository of Moodle strings and their history. It tracks the addition of English strings into Moodle code, gathers translations, handles common translation tasks and generates language packages to be deployed on Moodle servers.

:::info

The name was chosen in honour of [John Amos Comenius](http://en.wikipedia.org/wiki/John_Amos_Comenius), the author of `Janua linguarum reserata` (Gate to Languages Unlocked), who may be considered the father of modern education.

:::

## AMOS design

This part of the document was the original specification used for development.

### Overall picture

![AMOS workflow](./_files/lang20amosflow.png)

1. Developers add a new string by adding them into appropriate English $strings array definition file (for example, `/mod/workshop/lang/en/workshop.php`). This file is committed into Moodle main CVS repository as a part of the code.
1. CVS repository is mirrored automatically on the fly in a git repository. This git repository is used for further processing because parsing the strings file and tracking their history is much simpler in this system. The whole history is present in the git clone so there is no need to ask CVS server for anything once it is fetched.
1. The Git repository is regularly checked for any changes in string definition files. If any modification is detected then the file is parsed and any addition, modification, or removal of a string is recorded in an English strings database, together with a meta-information about the author of the change, timestamp, branch, commit identification (git commit hash) and so on.
1. So called translation stage (or cache) is used during the translation. This is similar to the session cache when working with [XMLDB](https://docs.moodle.org/dev/XMLDB). Once the translator is happy with the work, they submit the translation into the database of the translated strings.
1. The non-English strings database contains the history of the translation of all Moodle strings in all supported languages. This database is used as a source to generate the up-to-date language package in various formats (ZIP to be deployed at the servers, XML to be used by an external translation tools, etc).
1. Moodle site administrators update their installed language packs by downloading the ZIP files generated from the database (or, in the future, they can fetch the pack in other format)

### AMOS processes

![AMOS workflow](./_files/lang20amosflow2.png)

- **Tracking CVS commits**. Run as a cron job. Looks for new/modified/removed strings in Moodle source code (core and contrib) and registers these changes in the AMOS database.
- **Uploading strings**. Both English and translated strings may be registered from uploaded files. This way, 3rd modules not tracked by AMOS automatically (because they are not in our contrib) can be processed in AMOS.
- **Translating strings via web**. AMOS provides an interface for translating stored strings ([MDL-21691](https://tracker.moodle.org/browse/MDL-21691)).
- **Staging**. Strings from various sources end in a [staging area](http://en.wikipedia.org/wiki/Staging_(data)). They are stored here temporarily before they are committed into the main strings table.
- **Committing**. A set of strings in the stage is committed into the main strings table.

Thanks to this design, we have a single interface to get data from stage into the main strings repository. For every supported format/way to get strings, just a class implementing 'stageable' interface is needed to convert the input format into the staging area.

Hierarchy of classes is expected to be available for input processing. For example, the process that tracks commits history in CVS prepares a PHP file with the checkout. So we have a class that is able to convert `array $string[]()` defined in PHP file into staging area. Once we have such class, it can be used to process PHP files uploaded by developers/translators, too.

### Implementation plan

The implementation proposal evolved from the idea by Petr Skoda [discussed at moodle.org](http://moodle.org/mod/forum/discuss.php?d=118707#p542197). The key point is that translators do not have direct access to the source code repository (CVS) any more. There is a central tool (known as AMOS nowadays) that looks after proper branching and keeping history of the language packs. The current proposal follows.

1. There is a separate Moodle site at http://lang.moodle.org MNet'ed with http://moodle.org. This site is intended for our developers, translators and other community members interested in the translation process. Current Languages forum at Using Moodle can be eventually moved into this new languages portal.
1. AMOS is implemented as a local plugin `/local/amos` installed at http://lang.moodle.org. Because this is the only Moodle site with this plugin, using /local plugin mechanism is a natural way to implement, develop and maintain it.
1. There is a course "Moodle Translation" in this portal containing (among other useful things) a clear link to the `/local/amos/view.php` page.
1. During Moodle 2.0 beta period, translator used AMOS portal to prepare the translations of the new Moodle release.
1. AMOS installation at http://lang.moodle.org uses its own git clone of our official git mirror to have access to the English strings. Keeping the git mirror up-to-date and synced is a prerequisition for the proper AMOS functionality.

### Use cases

1. **Developers** write the code and commits it into CVS. They can create or modify English strings as needed in the current way of direct modification of the strings definition file.
1. **Translators** come to http://lang.moodle.org to translate Moodle. No other way is possible yet.
   1. Translators can choose the Moodle version (1.8, 1.9 or 2.0) to translate
   1. Translators can display the list of missing strings to translate
   1. Translators can display the list of English strings that were modified since their last translation so they should be re-checked
   1. Translators can display the history of string wording, authors of the change, commit messages explaining the change
   1. Other useful tools and filters are available, like displaying all strings containing a given phrase etc. See [MDL-18797](https://tracker.moodle.org/browse/MDL-18797) for details
   1. After providing new or modified translations, translators "commit" their changes through the web interface, providing a commit message
1. **Administrators** can download language packages as ZIP files from http://download.moodle.org or let them update automatically from the Moodle
   1. Packages are regenerated automatically as they are at the moment, with the only difference that the database and not CVS is used as their source
1. **Contributors** [must think about this yet] - their plugins in `CONTRIB` can be mirrored into git (one day this will happen anyway ;-)) and then AMOS can process them easily. Or we could add a feature that the contributor can upload the file with English strings definition manually and "register" the strings this way.

## Database structure

The core of the whole AMOS system is a single table containing the history of all changes of all strings from all components in all languages. This one is called amos_repository. All other operations, like committing a translation, getting the current snapshot etc., are based on this table. After an initial import of CVS history, the table contains around 3.6 millions of records.

There is yet another table where the permissions to translate a language are stored, which is not so important and is trivial (therefore not documented here).

### amos_repository

Contains all Moodle strings and their history

| Field | Type | Description |
| --- | --- | --- |
| id | int (10) unsigned not null seq |  |
| branch | int (10) unsigned not null | The code of the branch this string is valid for |
| lang | char (20) not null | The code of the language this string belongs to. Like en, cs or es |
| component | char (255) not null | The name of the component this string belongs to. Like `moodle` or `workshopform_accumulative` |
| stringid | char (255) not null | The code of the string |
| text | text (big) not null | The localized string text |
| timemodified | int (10) unsigned not null | The timestamp of the commit |
| commitmsg | text (big) | Commit message |
| commithash | char (40) | The git commit hash that introduced this string |
| source | char (255) | The source of this string - git, email etc. |
| deleted | int (2) unsigned default 0 | Is the string deleted? If not, it will be generated into the lang packs |
| userid | int (10) unsigned | If the author is known in the local user table, store their id here |
| userinfo | char (255) | Helps to identify the author of the change, for example a name from CVS commit |

#### Keys

| Name | Type | Field(s) | Reference |
| --- | --- | --- | --- |
| primary | primary | id |  |
| fk_user | foreign | userid | user (id) |

#### Indexes

| Name | Type | Field(s) | Description |
| --- | --- | --- | --- |
| ix_snapshot | Not unique | component, lang, branch | Optimised for getting a snapshot of all current strings in one component |
| ix_lang | Not unique | lang | For getting a list of all known components. In some cases, we need to filter English records only |
| ix_timemodified | Not unique | timemodified | This index allows to search for the recent records in the log output |

## Features

### Tracking the changes in the English strings

**Implemented in**: `/local/amos/cli/parse-core.php`

AMOS uses its own git clone of Moodle repository. It runs `git whatchanged` to see what files were affected by every single commit ever. Once it detects a change in a valid English string file, it checks out that revision of the file and compares its content with the current snapshot of the strings database. New record is added into the strings table for every new, modified or removed string in the checked out file. The commit hash of the last fully processed commit is stored in `$CFG->dataroot/amos/var/MOODLE_xx.startat` so that next time AMOS analyzes just new commits.

### AMOS script

AMOS script allows us to propagate changes in the English language pack into other languages.

Sometimes we want to reorganize the English language pack - for example split a component into subcomponents (as happened with auth.php), rename string identifiers, fork a string according the meaning (for example, `fullname` may be different when talking about a human and about a course) etc. Such a change can be easily done in English by direct editing and committing the `lang/en/*.php` files. But the translation would get lost and our poor translators would have to translate such strings again.

There is a way to instruct AMOS to propagate a change in the English lang pack into all other languages at the given branch. We call that AMOS script (or `amosbler` for the syntax similarity with the assembly language - assembler). Such a script can be uploaded or pasted into a page at AMOS portal and it will just follow the instructions provided. Or - which is more interesting - such a script can be put directly into the commit message of the commit that does the change in the English language pack. In that case, AMOS will automatically run the script right after it process the commit.

Here is an example of a script that instruct AMOS to process a set of bulk operations over language packages:

```
AMOS BEGIN
 MOV [description,mod_workshop],[intro,mod_workshop]
 CPY [submission,mod_assignment],[submission,mod_workshop]
 HLP forum/forumtype.html,[forumtype_hlp,mod_forum]
AMOS END
```

In this example, there are three instuctions to be done. The line with `MOV` ('move') command instructs AMOS to rename the string 'description' defined in workshop to the new identifier 'intro'. The second command `CPY` ('copy') orders to create new string in the workshop module with the identifier 'submission' and the value of that string shall be taken from the `$string['submission']` in the module assignment. If such string already exists in any language, `CPY` will not replace it. The third command is used for migrating legacy HTML help files into ordinary strings. It tells AMOS to add `new $string['forumtype_hlp']` in every language, using the content of the help file `forum/forumtype.html` as the initial value.

The script syntax is defined as follows. Note that amosbler keywords are case sensitive so must be upper-case. In pseudo-regexp, the valid AMOS script is defined as:

```
^[:blank:]*AMOS BEGIN[:blank:]*$
^[:blank:]*[A-Z]{3}[:blank:]+(param1),[:blank:]*(param2), ...,[:blank:]*(paramn)[:blank:]$
...
^[:blank:]*AMOS END[:blank:]*$
```

In human language, this roughly means: the script is a block of lines starting with `AMOS BEGIN` or `AMOS START` and ending with `AMOS END` lines. Every instruction is on its own line. Instruction has its name (three capital letters like `MOV`, `CPY`, `HLP`, `RPL`, `SMS` or `GRR`) followed by comma-separated parameters.

:::caution Beware

Every string is referenced as `[stringid,component]` **but the component is different from what we use in get_string()**. All components use fully normalized `plugintype_pluginname` syntax (see `normalize_component()` function in `moodlelib`). If `plugintype === core` and `pluginname is empty (component 'core')`, the strings are stored in `moodle.php`.

:::

| String identification in get_string() | String identification in AMOS |
| --- | --- |
| get_string('edit', 'moodle') | [edit,core] |
| get_string('submit', 'assignment') | [submit,mod_assignment] |
| get_string('grade_help', 'grades') | [grade_help,core_grades] |
| get_string('send', 'message') | [send,core_message] |
| get_string('hello', 'block_greetings') | [hello,block_greetings] |

Currently planned/implemented AMOS script instructions are:

- **MOV [source],[target]**. Move the string. If the source `stringid` is already defined in the target component, it is not replaced.
- **CPY [source],[target]**. Copy the string. Works as `MOV` but the source string is not touched.
- **HLP component/helpfile.html,[string]**. Convert legacy HTML help file to the string
- **REM text**. Allows to put a remark (comment), for example to describe a required operation that can't be achieved by current instruction set.

:::tip

Ideas for other future instructions: `RPL` for replace (forced MOV), `SMS` for sending a message, `GRR` for something unknown yet but such instruction just must be there ;-)

:::

:::note

There are no instructions `DEL` or `ADD`. AMOS automatically recognized new strings as well as their removal from the commit diffs.

:::

**Summary of using AMOS script in commit messages:**

:::note

Strings can be removed on the main branch easily by removing them from the strings file. No AMOS command is needed. Just make sure the string is not use elsewhere and do not remove the string from stable branches.

:::

1. The commit must modify some string file, AMOS would ignore the commit completely otherwise
1. The script must be properly formatted as block of lines
1. The strings must be identified in normalized syntax - the main difference is using core for `moodle.php` and `core_*` prefix for components in `lang/en/*.php`
1. Note that it may take up to an hour that your commit is mirrored into git and then processed by AMOS

:::tip

More information about commit message format: https://docs.moodle.org/dev/Commit_cheat_sheet#Include_AMOS_script_in_the_commit_if_needed

:::

### Generating installer files

Implemented, not automated yet

See `cli/export-installer.php`.

## Deployment settings

```bash
# crontab -l
0,30 01-23 * * * /usr/local/bin/amos-update > /tmp/amos-update.log
0    0     * * * /usr/bin/php /var/www/htdocs/moodle-amos/local/amos/cli/rev-clean.php --full > /tmp/amos-full-rev-clean.log
```

```bash
#!/bin/bash

# /usr/local/bin/amos-update
# Updates AMOS working repositories and registers changes
# To be run regularly after git sync

AMOSCLIDIR=/var/www/htdocs/moodle-amos/local/amos/cli
AMOSREPOCORE=/var/www/data/moodle-amos/amos/repos/moodle
AMOSREPOLANG=/var/www/data/moodle-amos/amos/repos/moodle-lang
PHP=/usr/bin/php

cd $AMOSREPOCORE && /usr/local/bin/git pull --quiet
cd $AMOSREPOLANG && /usr/local/bin/git pull --quiet

$PHP $AMOSCLIDIR/parse-core.php && $PHP $AMOSCLIDIR/parse-lang.php && $PHP $AMOSCLIDIR/rev-clean.php
```
