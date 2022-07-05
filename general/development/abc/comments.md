---
title: "A better contribution: Comments in code"
sidebar_label: Comments in code
description: The better contribution guide to writing comments in code
tags:
  - Getting started
  - Contributing
  - Best practices
---

import { CodeBlock, ValidExample, InvalidExample } from '@site/src/components';

Moodle coding style rules tell us to write comments for pretty much everything we create,
and this can seem like a chore. However, there is no point creating the world's most useful
class if no-one can understand how to use it. So, if we have to write comments, how can we make them
useful?

- Take a moment to imagine sitting down with another intelligent developer who does not
  yet know about the thing you are working on. What would you want to say to them?
  Distill down the essence of that into text. In the post-pandemic world, you may prefer
  to imagine a call, but the psychological trick of imagining a specific human being as
  the audience is worth playing on yourself.
- Any time you find you used a word that is part of the name of the thing in the comment, be suspicious.
  That word is probably not adding any value. (Sometimes it is unavoidable.)
- Going further, if essentially all the words in the comment are part of the name, you are
  just wasting everyone's time. You can do better than that!
- If in doubt, think about adding value: what is not already obvious from the name (and type)?
  That is what really needs to be explained. For example, if something is being passed as a string,
  what formats will work?
- An example can be worth a dozen words, as you can see in the good example below :-)

<InvalidExample>

```php title="This is what we don't want to do"
/**
 * @param string $value The grade value.
 */
```

This comment just repeats the name of the variable, but doesn't give any more detail on what you should pass. Does it, for example, expect a raw value, or a letter representation of the grade?

</InvalidExample>

<ValidExample>

```php title="Here is a better example"
/**
 * @param $component Frankenstyle component name, e.g. 'mod_forum'
 */
```

This comment is better because it describes the format of the parameter, and gives an example.

</ValidExample>
