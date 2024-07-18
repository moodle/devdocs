---
title: Cross-site request forgery
sidebar_position: 3
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

When you put a web application on the Internet, you are making it available so that anyone can send requests to it, and any request can be simply encoded as a URL.

Suppose that in Moodle, the way for an Administrator to delete a user was to click a **Delete** button in their user profile, and then click **Yes** on an confirmation page. Suppose that as a result of that, the Administrator's web browser sends a POST request to `http://example.com/moodle/user/delete.php`, with post data `?id=123\&confirm=1`.

Now suppose that Evil Hacker knows this, and wants to trick the administrator into deleting another user (If Evil Hacker makes this request themselves, they will see a permission denied error).

All the Hacker needs to do is to put the link `http://example.com/moodle/user/delete.php?id=123&confirm=1` somewhere where the administrator will click on it. For example, they could send the Administrator an email with a link saying _"Look at this cool YouTube video"_ but where the link actually goes to the delete URL. The Administrator may click on the link without checking where it goes, and when the Administrator clicks that link, user 123 really will be deleted.

Or, more seriously, the student could put a post in a forum that Administrators will read, and in the forum post, put an `<img src="http://example.com/moodle/user/delete.php?id=123&confirm=1" />`. That way, the moment the Administrator reads the forum, user 123 will be deleted.

It is also possible to fake POST requests, you can simple put the form on external site and post a link pointing to that site on your Moodle server.

It may be a bit surprising, but this type of attack may be used against servers behind firewall on private network. It is not important where is the exploiting code, you can attack any server users may access from their browsers.

## How Moodle avoids this problem

### Session key (CSRF token) {#session-key}

The most important protection is the concept CSRF token, which is for historic reasons called **`sesskey`** in Moodle.

When you log in, Moodle generates a random string and stores it in the session. Whenever it prints a link or a button to perform a significant action, it adds the sesskey value to the submitted data. Before performing the action, it checks the sesskey value in the request with the one in the session, and the action is only performed if the two match.

Therefore, the request to delete a user is actually something like below and there is no way for Evil Hacker to know what the sesskey is, so they cannot construct an URL that tricks the admin into deleting a user: `http://example.com/moodle/user/delete.php?id=123&confirm=1&sesskey=E8i5BCxLJR`

:::info

The `sesskey` should not be confused with Moodle Session ID, which a PHP session cookie responsible for session continuity (remaining logged in).

:::

### Use HTTP correctly

Web applications use HTTP to encode requests from the user. In HTTP, there are various types of request. The two most important are GET and POST.

- **GET** requests should be used for getting information. So, for example, viewing a user's profile should be a GET request.
- **POST** requests should be used for changing things in the application. For example, deleting a user should be a POST request.

When you click a link or load an image, it is always a GET request. When you submit a form, it is either a POST or a GET request, depending on the form.

Moodle should only process changes in response to a POST request. If that is the case, then it does Evil Hacker no good to trick a user into clicking on a link or viewing an embedded image. They have to trick a user into clicking a form submit button, which is harder.

## What you need to do in your code

Use the [Form API](/docs/apis/subsystems/form) whenever possible for handling HTML forms. This automatically checks the sesskey and request method for you.

There are valid cases when using forms is not appropriate and you need to perform an action based on a parameter submitted via GET request - such as various action links. In this case, you have to manually include the sesskey among submitted parameters, and then make sure the submitted sesskey value is valid.

Include the sesskey among the submitted parameters:

```php
$action = new moodle_url('/admin/tool/do/something.php', ['delete' => $id, 'sesskey' => sesskey()]);
echo html_writer::link($action, get_string('delete'));
```

And in the target script, make sure to check the submitted sesskey is correct before executing the operation:

```php
$delete = optional_param('delete', null, PARAM_INT);

if ($delete) {
    require_sesskey();
    // Do whatever you need to, like $DB->delete_records(...) etc.
}
```

Note that when using standard elements like `$OUTPUT->continue_button()` and other elements based on the `single_button widget` submitted via POST method, the sesskey can be implicitly added to submitted parameters. Still, it is your duty to explicitly check the submitted value is valid.

## Ensure your code does not expose the sesskey inadvertently

There are various ways that the sesskey could be leaked, and if this happens then it opens the door to types of risks that would be otherwise be mitigated by the sesskey: [https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

There are broadly two ways it could be leaked, in the frontend and in the backend.

### Backend leaking

This is things such as the sesskey appearing in various server logs. If your infrastructure is locked down well this should not be a major concern. Either way this generally cannot be addressed by a developer in the code of Moodle or your plugin, instead it is best addressed at the infrastructure level for example by stripping it out these params from urls before they are logged in your server configuration. A similar level of care needs to be taken when logging other things, for example logging the cookies in your access logs has a risk of allowing a session take over by anyone who has access to those logs.

### Frontend leaking

The frontend includes ever showing the sesskey in the browser URL bar or anywhere else visible to the end user in a way that could then leak to a third-party. An example might be accidentally disclosing it during a screen sharing session or even at a desktop being watched or filmed. Another important hole is leaking the sesskey as part of the url in the referrer header when linking or interacting from another domain.

### Guidelines for removing the sesskey from visible URLs

1. First don't remove the requirement for checking the sesskey if it is actually needed.
2. If the page doesn't change any state on the server, then the sesskey check can be removed along with the query param. For example, any URLs for `pluginfile.php` should not have a sesskey param.
3. If it does change state and is not a `GET` request, for example a post, then it's ok as is.
4. A sesskey param in a `GET` request it is ok as long as:
    1. It is not the primary HTTP call, that is, it is an AJAX call or a sub request like an iframe.
    2. This page doesn't load any sub resources on another domain and where the sesskey could leak through the referrer header.
    3. If the request will ALWAYS do something very quickly and then redirect away. But generally speaking these should be a HTTP post instead. If it takes a long time then it runs the risk of the URL being visible and lengthens the window of opportunity for a leak.

### Examples of sesskey fixed in core

Some examples to help guide how to fix these issues:

- [MDL-68292](https://tracker.moodle.org/browse/MDL-68292)
- [MDL-73295](https://tracker.moodle.org/browse/MDL-73295)

## What you need to do as an administrator

- This is really only a code issue, but try not to fall for Evil Hacker's tricks ;-).

## See also

- [Security](../security)
- [Coding](../../policies.md)
- [OWASP Cheat Sheet Series: Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
