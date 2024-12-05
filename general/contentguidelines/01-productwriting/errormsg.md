---
title: Error messages
sidebar_position: 5
tags:
- Content style guide
- UX Writing
---

Error messages describe issues that stop users from finishing a task, or the system from functioning properly. A good error message explains what happened, the reason why it happened, and what the user can do to move forward. They may even provide a way forward in the call to action.

## Related components

[HTML modal](https://componentlibrary.moodle.com/admin/tool/componentlibrary/docspage.php/moodle/components/dom-modal/)

[Notification](https://componentlibrary.moodle.com/admin/tool/componentlibrary/docspage.php/moodle/components/notifications/)

## Basic guidelines

- Keep language clear and concise, and avoid jargon and technical terms.
- Explain what happened and the reason it happened, but focus on how users can move forward.
- Give users an error code only in cases where the error needs to be solved by a developer.

## Content

The structure and content of error messages will depend on the component you choose.

### Title

The title of your error message should be understandable on its own.

Keep it short and concise.

<ValidExample title="Do">

Your email is missing the '@' symbol.

</ValidExample>

<InvalidExample title="Don't">

The email address doesn't match the required format. Please use a standard email format including the '@' symbol.

</InvalidExample>

Be specific.

<ValidExample title="Do">

The file is too large.

</ValidExample>

<InvalidExample title="Don't">

Couldn't upload file.

</InvalidExample>

<ValidExample title="Do">

Your storage is full.

</ValidExample>

<InvalidExample title="Don't">

Something went wrong.

</InvalidExample>

<ValidExample title="Do">

Your username and password don't match. Please try again.

</ValidExample>

<InvalidExample title="Don't">

Login failed.

</InvalidExample>

Explain what happened clearly.

<ValidExample title="Do">

Your file was not saved.

</ValidExample>

<InvalidExample title="Don't">

There was a problem saving your file.

</InvalidExample>

Avoid jargon and technical terms.

<ValidExample title="Do">

Unable to log in.

</ValidExample>

<InvalidExample title="Don't">

Authentication error.

</InvalidExample>

### Description

The description gives users additional information about the error and, when possible, lets them know what they can do to move forward.

- Add details about the cause of the error if they can help users understand how they can avoid a similar problem in the future.

- Provide a link to supporting content only when it truly helps solve the problem.

- If you don't know the reason for an error, avoid making things up. Simply state that something went wrong.

- If users can't solve the problem themselves, let them know what next step they should take, such as contacting their site admin.

- If trying again later is a likely solution, let people know how much later: a few minutes, a few hours, etc.

- When a solution can't be offered to the user, such as in cases where the error is caused by a third party, it's important to clearly explain what happened. This will help the user understand the issue and may enable them to troubleshoot the problem on their own.

Use clear language, add details that can help users avoid the error in the future, and provide a solution:

<ValidExample title="Do">

Grade can't be negative. Adjust it to be 0 or higher.

</ValidExample>

<InvalidExample title="Don't">

Grade must be greater than or equal to zero.

</InvalidExample>

Don't blame the user for user-generated errors:

<ValidExample title="Do">

Password can't be blank.

</ValidExample>

<InvalidExample title="Don't">

You didn't type a password.

</InvalidExample>

### Call to action

Having a call to action depends on the component you choose.

When possible, provide users with a contextually relevant action that can help them solve the problem, for example 'Go to settings' or 'Contact support'.

If you use an HTML modal to display an error message, always provide an option to dismiss the modal.

Use CTA to provide users with a possible solution:

<ValidExample title="Do">

**Your device is offline**
Download failed because you're not connected to the internet.
Ok | **Go to settings**

</ValidExample>

<InvalidExample title="Don't">

**Your device is offline**
Download failed because you're not connected to the internet.
Ok | **Cancel**

</InvalidExample>
