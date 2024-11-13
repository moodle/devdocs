---
title: "A better contribution: Comments in code"
sidebar_label: Comments in code
description: The better contribution guide to writing comments in code
tags:
  - Getting started
  - Contributing
  - Best practices
---

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
- Going further, if all the words in the comment just part of the name, what is the point? You can do better than that!
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
 * @param string $component Frankenstyle component name, e.g. 'mod_forum'
 */
```

This comment is better because it describes the format of the parameter, and gives an example.

</ValidExample>

Similar principles apply when writing inline comments in code, to explain what is going on. The most
value is added, not by writing out in English words things that are obvious from reading the code,
but by noting things that are not immediately obvious, but which help to understand the code. For example:

<InvalidExample>

```php title="Another poor example"
$runinsert = function (int $lastslot, array $tagstrings) use ($DB) {
    $conditiondata = $DB->get_field('question_set_references', 'filtercondition',
        ['itemid' => $lastslot, 'component' => 'mod_quiz', 'questionarea' => 'slot']);
    // If there is any invalid slot data found, ignore that data.
    if (!empty($conditiondata)) {
        $condition = json_decode($conditiondata);
        $condition->tags = $tagstrings;
        $DB->set_field('question_set_references', 'filtercondition', json_encode($condition),
                ['itemid' => $lastslot, 'component' => 'mod_quiz', 'questionarea' => 'slot']);
    }
};
```

Yes! I can see you are ignoring the data, rather than saving it, if `$conditiondata` is empty. What I am wondering is:
Is that the right thing to do? Isn't this a data-loss bug?

</InvalidExample>

<ValidExample>

```php title="A better version of the previous example"
$runinsert = function (int $lastslot, array $tagstrings) use ($DB) {
    $conditiondata = $DB->get_field('question_set_references', 'filtercondition',
        ['itemid' => $lastslot, 'component' => 'mod_quiz', 'questionarea' => 'slot']);
    // It is possible to have junk tags left in the database, without a corresponding
    // slot, because of an old bugs (e.g. MDL-76193). Therefore, if the slot is not found,
    // we can safely discard these tags.
    if (!empty($conditiondata)) {
        $condition = json_decode($conditiondata);
        $condition->tags = $tagstrings;
        $DB->set_field('question_set_references', 'filtercondition', json_encode($condition),
                ['itemid' => $lastslot, 'component' => 'mod_quiz', 'questionarea' => 'slot']);
    }
};
```

This comment is better because it describes why discarding this data is the right thing to do here.

</ValidExample>
