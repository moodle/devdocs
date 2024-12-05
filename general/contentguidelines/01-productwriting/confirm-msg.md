---
title: Confirmation messages
sidebar_position: 3
tags:
- Content style guide
- UX Writing
---

Confirmation messages prompt people to confirm actions that have significant consequences or are difficult to undo. They can also help prevent errors or unexpected results by verifying user intent before proceeding with an action.

Clear and concise confirmation messages help people feel more confident and in control of their actions within the Moodle products.

## Related components

[HTML modal](https://componentlibrary.moodle.com/admin/tool/componentlibrary/docspage.php/moodle/components/dom-modal/)

## Basic guidelines

- Address a single task.
- Ask a clear, specific question.
- Provide clear options to either confirm or cancel the action.
- Explain the consequences of the action so people can make an informed decision.

## Content

### Title

The title or heading of a confirmation message should focus only on one task, and mention the specific action that the user wants to perform.

<ValidExample title="Do">

**Remove grade?**

</ValidExample>

<InvalidExample title="Don't">

**Confirm action?**

</InvalidExample>

Write your title as a clear, unambiguous question. This helps users understand that they're making a choice.

<ValidExample title="Do">

**Delete question?**

</ValidExample>

<InvalidExample title="Don't">

**Confirmation**

</InvalidExample>

<ValidExample title="Do">

**Send notification?**

</ValidExample>

<InvalidExample title="Don't">

**Warning**

</InvalidExample>

Don't include articles like 'a', 'an' or 'the', so that the question is short and easy to scan.

### Description

The description should explain the consequences of the action and share additional details that enable people to make a confident decision.

<ValidExample title="Do">

**Delete entry?**
This will delete the entry 'My first blog post'.

</ValidExample>

<InvalidExample title="Don't">

**Delete entry?**
Are you sure you want to delete the blog post?

</InvalidExample>

Don't repeat information from the title.

<ValidExample title="Do">

**Remove account 'Barbara Gardner'?**
This account and its data on the site [site name] will be removed from the app on this device.

</ValidExample>

<InvalidExample title="Don't">

**Remove account 'Barbara Gardner'?**
Are you sure you want to remove this account?

</InvalidExample>

Save "Are you sure?" for actions that have very serious consequences. For example, actions that could prevent a course or activity from working properly, or deleting something that can't be retrieved from the recycle bin.

<ValidExample title="Do">

**Delete tool?**
This tool is currently being used in at least one activity in your course. If you delete this tool, the activities that use it will no longer work. Are you sure you want to delete the tool?

</ValidExample>

<InvalidExample title="Don't">

**Delete activity?**
Are you sure you want to delete the activity?

</InvalidExample>

### Calls to action

Calls to action (CTAs) should be clear and simple, and offer a straightforward way out.

<ValidExample title="Do">

**Delete downloaded data?**
Cancel | **Delete**

</ValidExample>

<InvalidExample title="Don't">

**Delete downloaded data?**
Cancel | **Continue**

</InvalidExample>

<ValidExample title="Do">

**Log out from this device?**
Cancel | **Log out**

</ValidExample>

<InvalidExample title="Don't">

**Log out from this device?**
No | **Ok**

</InvalidExample>

Use the same verb in both the title and the confirmation button to make the content more scannable and summarise outcomes.

<ValidExample title="Do">

**Move** selected activities?
Cancel | **Move**

</ValidExample>

<InvalidExample title="Don't">

**Move** selected activities?
Cancel | **Continue**

</InvalidExample>

<ValidExample title="Don't">

**Delete** tool?
Cancel | **Delete**

</ValidExample>

<InvalidExample title="Don't">

**Delete** tool?
Cancel | **Remove**

</InvalidExample>

Avoid 'cancelling cancellations'

<ValidExample title="Do">

**Cancel booking?**
Keep my booking | Cancel booking

</ValidExample>

<InvalidExample title="Don't">

**Cancel subscription?**
Cancel | Confirm cancellation

</InvalidExample>
