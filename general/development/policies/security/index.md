---
title: Security
tags:
  - Coding guidelines
  - Developer processes
  - Policies
  - Security
---
This page describes how to write secure Moodle code that is not vulnerable to anything that evil people may try to throw at it.

:::info Page organisation

The page is organised around the [common types of security vulnerability](#common-types-of-security-vulnerability). For each one, it explains:

1. what the danger is,
2. how Moodle is designed to avoid the problem,
3. what you need to do as a Moodle developer to keep your code secure, and
4. what you can do as an administrator, to make your Moodle more secure.

The explanation of each vulnerability is on a separate page, linked to in the list below.

:::

This page also summarises all the key guidelines.

## Security of web applications

### Secure web app requirements

Some companies require the maximum level of security for web applications. You can often see similar general recommendations:

- separate administration backend
- no sensitive information stored in web application
- communication has to be encrypted using SSL
- log all user actions
- server applications have to be completely separated
- no files uploaded by users on server
- no rich text entered by users on server (limited plain text only)
- validate user identity and actions via separate channel
- always keep every software up-to-date
- no 3rd party browser extensions recommended
- use only one web page, do not open multiple windows with different sites, close/open browser before and after using the secure app

:::info

**Web-based banking systems** are the best examples of these secure web applications. Security is the top-most priority here, security incidents may cost money - either the customer, bank or insurance company, the public image of the institution may be damaged too. Limiting factors may be the cost of application development, maintenance and usability but also the cost of communication via the alternative channels.

:::

### Balanced security

As you can see, many web applications today violate the security design rules. For example, web-based mail systems have to accept rich text messages with file attachments, mail messages often contain very sensitive information. In fact, the Web 2.0 idea goes directly against the security design rules, everybody is submitting content - only app designer/administrator should be adding trusted content.

When designing web applications we have to find out what our users are supposed to be doing and then find some reasonable balance between features and security.

## Moodle security design

The security of web application depends on the intended use and features available for each type of user.

### Types of users

#### Administrators

Administrators have following privileges:

- Change all settings
- Create courses
- Access all courses
- Modify language packs
- Modify all users

Indirectly administrators are allowed to execute shell and PHP code. Moodle administrators may be partially restricted by hardcoding settings in config.php.
Low level server administrators can not be restricted because they can read content of PHP files and may modify them.

:::info

All administrators have to be fully trusted.

:::

#### Teachers

Teachers are usually creating course content, enrolling students and teaching. They usually need following privileges:

- Upload files and submit html texts
- Create and manage activities
- Access student grades and other personal information

Uploading of files with JavaScript, flash and other scripted is often considered to be a security risk. Unfortunately we can not remove these risks from teacher roles because even basic SCORM packages consist of HTML and JavaScript which needs to use user session.

Browser trusts everything coming from one server, it does not know anything about our courses or origin of data. Once the file is uploaded to server it becomes part of the server application. It is not possible to differentiate between wanted and unwanted code stored on the server.

:::info

All teachers with risky capabilities have to be trusted, it is not possible to give teacher access to students. In theory teachers may use XSS attacks to gain administrator access.

Technically it would be possible to create a system where teachers can not attack other users but it would prevent all JavaScript, Flash, SCORM, Java, HTML forms, SVG, etc.

:::

#### Students

Students are participating in courses, they are not trusted. Students need following privileges:

- Post formatted text with inline images and attachments
- Upload binary documents

Uploaded files must not be opened directly in browser from the same server. Instead the files need to be served from different domain, or server has to force download of all files to local hard drive before opening them.

:::info

All student submitted text has to be sanitised before printing the text on any page, this prevent XSS attacks on other users but at the same time prevents Flash, JavaScript, SVG and all other HTML scripting. Moodle uses HTML Purifier library for this purpose.

:::

#### Guests

For security reasons unregistered users can not be allowed to upload any files or submit any text that is stored in database. Guests could try to spam other users, exploit problems in HTML cleaning routines, abuse other vulnerabilities or try social engineering based attacks.

Sites with enabled user sign-up via email have to take extra care in order to prevent spamming and other types of attacks.

### Capability risks

Moodle is very flexible system, administrators may define multiple roles. Each role is a set of capabilities defined at system level, roles may be modified via overrides at lower context levels. Risks are part of description of each capability, administrators have to make sure only trusted users get potentially dangerous capabilities.

## Common types of security vulnerability

- [Unauthenticated access](./security/unauthenticated-access)
- [Unauthorised access](./security/unauthorised-access)
- [Cross-site request forgery (XSRF)](./security/crosssite-request-forgery)
- [Cross-site scripting (XSS)](./security/crosssite-scripting)
- [SQL injection](./security/sql-injection)
- [Command-line injection](./security/commandline-injection)
- [Data-loss](./security/dataloss)
- [Confidential information leakage](./security/info-leakage)
- [Configuration information leakage](./security/configinfo-leakage)
- [Session fixation](./security/session-fixation)
- [Denial of service (DOS)](./security/dos)
- [Brute-forcing login](./security/bruteforcing-login)
- [Insecure configuration management](./security/insecure-config)
- [Buffer overruns and other platform weaknesses](./security/bufferoverruns)
- [Social engineering](./security/socialengineering)

## Summary of the guidelines

### Authenticate the user

- With very few exceptions, every script should call [`require_login`](/docs/apis/subsystems/access#require_login) or [`require_course_login`](/docs/apis/subsystems/access#require_course_login) as near the start as possible.

### Verify course and module access

- All course areas have to be protected by `require_login` or `require_course_login` with correct `$course` parameter.
- All module areas have to be protected by `require_login` or `require_course_login` with correct `$course` and `$cm` parameter

### Check permissions

- Before allowing the user to see anything or do anything, call to [`has_capability`](/docs/apis/subsystems/access#has_capability) or [`require_capability`](/docs/apis/subsystems/access#require_capability).
- Capabilities should be annotated with the appropriate **[risks](/docs/apis/subsystems/roles#risk-bitmask-in-capabilities)**.
- If appropriate, restrict what people can see according to **groups**.

### Don't trust any input from users

- Use **[moodleforms](/docs/apis/subsystems/form)** whenever possible, with an appropriate `setType` method call for each field.
- Before performing actions, use `data_submitted() && confirm_sesskey()` to check sesskey and that you are handling a POST request.
- Before destroying large amounts of data, add a confirmation step.
- If not using a moodleform, clean input using `optional_param` or `required_param` with an appropriate `PARAM_...` type.
    ** Do not access `$_GET`, `$_POST` or `$_REQUEST` directly.
    ** Group optional_param and required_param calls together at the top of the script, to make them easy to find.

Similarly, clean data from other external resources like RSS feeds before use.

### Clean and escape data before output

- Use `s` or `p` to output plain text content.
- Use `format_string` to output content with minimal HTML like multi-lang spans (for example, course and activity names).
- Use `format_text` to output all other content.
  - Only use `$options->noclean` if it requires a capability with `RISK_XSS` to input that content (for example web page resources).
- Data destined for JavaScript should be escaped using `$PAGE->requires->data_for_js` (Moodle 2.0 onwards) or `addslashes_js` (Moodle 1.9).

:::info More info

We recommend that you follow the [Output functions](/docs/apis/subsystems/output#output-functions) to get a better understanding of how dynamic data should be sent from Moodle to the browser.

:::

### Escape data before storing it in the database

- Use the [XMLDB](../../tools/xmldb.md) library. This takes care of most escaping issues for you.
- When you must use custom SQL code, **use place-holders** to insert values into the queries.
  - Before Moodle 2.0, you had to build SQL by concatenating strings. Take particular care, especially with quoting values, to avoid SQL injection vulnerabilities.
- The `addslashes` method should no longer be use anywhere in Moodle 2.0 onwards.
- Variables must be passed to database queries through bound parameters.

### Escape data before using it in shell commands

- Avoid shell commands if at all possible.
  - Look to see if there is a PHP library instead.
- If you can't avoid shell commands, use `escapeshellcmd` and `escapeshellarg`.

### Log every request

- Every script should log an [event](https://docs.moodle.org/dev/Events_API)

### Other good practice

... that helps with security:

- Structure your code nicely, minimising the use of global variables. This makes the flow of data, and hence security, easier to verify.
- Initialise objects (for instance, `$x = new stdClass;`) and arrays (`$x = array()`) before you first use them.
- Test every input field with tricky input to ensure that it is escaped and un-escaped the right number of times everywhere, and that Unicode characters are not corrupted. One standard test you can use is:

```
< > & &lt; &gt; &amp; ' \' 碁 \ \\
```

## See also

- [Security issue process](../process#security-issues)
- [Coding](../../policies.md)
- The [2010 CWE/SANS Top 25 Most Dangerous Programming Errors](http://cwe.mitre.org/top25/) - this is a generic list of common security mistakes, produced by a group of security experts. The above Moodle-specific guidelines cover most of these general points.
- [PHP Security Cheat Sheet](https://www.owasp.org/index.php/PHP_Security_Cheat_Sheet)
<!--cspell:ignore OWASP -->
- [The Open Web Application Security Project (OWASP)](https://www.owasp.org/index.php/Main_Page) - Large collection of documentation and code samples about preventing security issues while using web technologies.
