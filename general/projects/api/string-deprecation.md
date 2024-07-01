---
title: String deprecation
tags:
  - Language
  - Deprecation
---

import { ProjectSummary } from '@site/src';

<ProjectSummary
    projectName="api/string-deprecation"
/>

## Removing strings which are no longer used

From Moodle 2.8 onwards, strings can be deprecated in a way very similar to how functions are  deprecated. This feature allows us to safely remove strings once we are reasonably sure they are no longer used. The process should help to remove unnecessary strings from the language packs, so translators do not waste valuable time  translating them, while protecting us from accidentally removing a string that is still being used somewhere.

## How it works

There is a file with the list of deprecated strings. When a deprecated string is used (typically via the `get_string()` call), a warning message is displayed, such as:

```
String [identifier,component] is deprecated. Either you should no longer be using that string,
or the string has been incorrectly deprecated, in which case you should report this as a bug.
Please refer to String deprecation developer docs.
```

Note that this warning is displayed at the `DEBUG_DEVELOPER` level only (which is what Moodle developers should have selected). See below for info on what to do if you see this message.

### Why and when should a string be deprecated?

The most common case is that you realize that a string is not used any more in standard Moodle code. You will probably search the whole moodle.git for the string identifier and the only relevant place found is the string definition itself. Even if it seems that the given string is not used any more in the standard Moodle code, it's possible that some additional (contributed) plugins still rely on it. This is typical for semantically general strings provided by the `moodle.php` (core) component such as "Yes", "Continue", "Hidden" etc.

Beware that searching for the string identifier only may sometimes lead to false negatives. Imagine you have a suspicion that a hypothetical string `actionloginremote` is no longer used any more as there is no code that would actually use this `stringid`. However, there can be places like this:

```php
$action = optional_param('action', 'loginremote', PARAM_ALPHA);
print_string('action'.$action);
```

that are harder to detect. So, instead of simply removing the string `actionloginremote` you would put it to the list of deprecated strings.

Another scenario may be that a semantically identical string was defined twice or it was put into the wrong component. If you think there may be places that rely on the wrong location (component), you should deprecate it. Copy the string to a new location (do not forget to use [CPY instruction for AMOS](./amos.md) to replay the change in all existing translations) and deprecate the old one.

Also, it may turn out that some strings are only vaguely defined and do not have a clear and unique context / semantics. Ideally, Moodle code should use context-sensitive strings rather than rely on one general string covering all cases. Things like [grammatical gender](http://en.wikipedia.org/wiki/Grammatical_gender) play an important role in many languages. For example, in Czech, "a role" or "a question" are of feminine gender and the correct translation of "hidden" in this case is `skrytá`, while "a badge" is of masculine gender and the correct translation is `skrytý`. So it would be better to have separate strings like `hiddenrole`, `hiddenquestion` and `hiddenbadge` even if they all read just "Hidden" in the English language pack. When you are about to split existing string into a couple of specific ones, you may wish to deprecate the general one at the end too (also, do not forget to use the [CPY](./amos.md) again).

### When should a string be removed?

There are situations where deprecation does not make sense. For example when a whole functionality is being removed, or a very specific string (such as error message) is no longer used by the code. If it is very unlikely that the string is used by any other code, it can simply be removed without the full deprecation process.

The same logic applies to cases when a very specific string is to be moved or renamed. In this situation, it is valid to just move it (together with the matching [MOV instruction in the AMOScript](./amos.md)).

## How to deprecate a string

:::note

When deprecating a core string from `lang/en/xxxx.php` the `fullcomponentname` should be `core_xxxx`, except for `lang/en/moodle.php` which has `fullcomponentname` set to `core`

:::

- Strings can be deprecated and removed on the `main` branch only.
- Locate or create a file `deprecated.txt` either in `lang/en/` or `componentfullpath/lang/en/`
- Add a line `identifier,fullcomponentname` to the end of this file
- Move the string inside the existing language file to the end of the file under the comment `// Deprecated since Moodle X.Y.` (this comment will help removing deprecated strings later).
- For final deprecation (4 major versions later), delete the string from both `deprecated.txt` and respective lang file.

:::info

Before Moodle 3.0, final deprecation was 2 major versions later. With 3.0 the policy switched to 4 major releases later.

:::

Take care when deprecating a string within a few weeks of `en_fix` being merged with `en`, as it can result in a conflict (as happened in [MDL-52315](https://tracker.moodle.org/browse/MDL-52315)).

## What to do if you get a debugging message

There are two possibilities. Either the code that uses the deprecated string must be fixed, or the string should not have been deprecated and must be removed from the list.

Use the `git-blame` tool on the corresponding `lang/en/deprecated.txt` and find the commit/issue that deprecated the string. It should give you enough information to decide on the most appropriate action.

- If you think the string was deprecated by mistake, create a new issue in the tracker to remove it from the list (on all supported branches, not only on main).
- If the string was renamed or moved, you will probably want to fix the caller to use the new name/location of the string.
- You may as well copy the string to your own plugin scope and make it context-specific.

:::info Git blame

[git blame lang/en/deprecated.txt](https://github.com/moodle/moodle/blame/main/lang/en/deprecated.txt)<br/>
[git blame mod/quiz/lang/en/deprecated.txt](https://github.com/moodle/moodle/blame/main/mod/quiz/lang/en/deprecated.txt)

:::

## See also

- [MDL-64905](https://tracker.moodle.org/browse/MDL-64905) comments regarding introducing a new string and deprecating the old one
