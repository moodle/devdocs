---
title: Commit cheat sheet
tags:
  - Git
---
You can consider this page as a list to check before you submit a patch for inclusion into Moodle.

## Split your work into a logical set of patches

Keep in mind that your commits will be reviewed before they are accepted. If the patch does one clear thing and does it well, the review process is fun. Git allows you to prepare patches on your branch into a sequence of logical steps. For example, when changing some API, divide the change into two steps. In the first commit, change the API. In the following commit, change all places that use the API. `git rebase -i` is one of the commands you can use to do this.

## Provide clear commit messages

Consider the commit message as an email for the developer who will explore the change in the future.

- We recommend following standard Git guidelines for formatting.
- The first line of the commit message is generally treated as the commit subject and should not exceed 72 characters.
- Include the `MDL` issue number and the area/component at the beginning of the subject line.
- Please note that `code area` refers to the code areas being affected by this commit - correct the MDL's components reported against if needed.
- If you are writing more than one line, the second line must be empty. All the lines should wrap before or at the 72nd-character mark. It may be hard to stick to the [50/72 rule](https://www.google.com/?q=git%2050/72%20rule) in Moodle, given the extra information expected at the first (subject) line.

<ValidExample title="An example format of a commit message">

```
MDL-xxxxx code area: A short description of the patch

An empty line follows the subject line, and then a paragraph or two of
a longer description, if necessary. This longer description is helpful
for issues with a more extended history of comments in the linked MDL,
as it summarises the patch without requiring a review of the entire
discussion.

Avoid messages like "as agreed in the chat," as these lack context and
clarity about the reasons behind the changes.
```

</ValidExample>

Most Git tools are optimised for this format, and they can display the log of commits best then.

:::info Tip
The command `git log --no-merges` will show you recent commit messages. Hopefully those are all good examples to copy.
:::

## Names in the commit message

Retain the authorship of the patch. If the patch was submitted by someone else - for example a community member who published it in the tracker or in a forum - use the `--author` parameter. Make sure that your *real* name and contact email are recorded in the patch. We use real names written in capital letters like "`John Smith`". Please do not use names like "`john smith`", "`John S`", or "`johnny7887`". If you use `--author` parameter, apply the same rules for the name of the author. See almost any Git tutorial on how to set your name and email in the global Git configuration.

### Creating a commit with multiple authors

If your work is the result of collaborative work, you can use [GitHub's guide](https://docs.github.com/en/github/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors) to credit other authors.

Rebase all the commits into a single commit, and add the mention `Co-authored-by: Firstname Lastname <email>` at the end of the commit message. You must credit only one author per line. You don't need to add yourself in the commit message.

Check out this commit from [MDL-64000](https://github.com/moodle/moodle/commit/fbb2196) as an example.

## Include AMOS script in the commit if needed

If you change the identifier of a string or split a string into two forks, provide a script for AMOS in the commit message. Since Moodle 2.0, the translations are kept on separated branches again. The AMOS plugin on the [Moodle Translation site](https://lang.moodle.org) tracks the changes in string files and automatically records modifications, additions and removals of strings. Therefore, strings can be re-worded freely on stable branches and should be removed from the main branch if they are not needed any more (do not remove strings from stable branches).

If you change the identifier of the string (that is the key in the $string array), move the string from one file to another, or you are introducing a new string as a copy of some current one, you should provide instructions for AMOS so that the action can be applied in all language packs. That will save valuable translators' time. Instructions for AMOS are being put into the commit message of a commit that modifies the original English string files. The commit message containing such a script may look like this:

<ValidExample title="An example commit message with an AMOS script">

```
MDL-xxxxx code area: A short description of the patch

It is recommended to leave a blank line between the commit message and
the script block.

AMOS BEGIN
 MOV [configfoobar,core_admin],[foobar_desc,core_admin]
 CPY [submission,mod_assignment],[submission,mod_workshop]
AMOS END
```

</ValidExample>

See [Automated Manipulation of Strings 2.0#AMOS script](/general/projects/api/amos#amos-script) for more details of the syntax. See [the log history](http://git.moodle.org/gw?p=moodle.git&a=search&h=HEAD&st=commit&s=AMOS+BEGIN) for actual usage examples.

## Main version changes

If your commit requires a change to the main version number in `version.php` (and corresponding upgrade in `lib/db/upgrade.php`), you should increment that version number by `.01`, and let merge reviewers deal with merge conflicts (for example, if multiple people that week submit several `.01` updates).

(Note there may be policies about avoiding the type of changes which require `version.php` updates, especially in stable branches.)
