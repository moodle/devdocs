---
title: SQL injection
sidebar_position: 5
tags:
  - Coding guidelines
  - Policies
  - Security
---

:::note

This page forms part of the [Moodle security guidelines](../security).

:::

## What is the danger?

Suppose your code in `/course/view.php?id=123` does something like:

```sql
SELECT FROM mdl_course WHERE id = $id;
```

where the `$id = 123` has come from the URL. Suppose that your code does not bother to clean that parameter properly.

Along comes Evil Hacker, and edits the URL to be `/course/view.php?id=123;DELETE+FROM+mdl_user`
I will let you work out why that is a very, very bad thing.

Of course, depending on exactly what the database query is, the malicious input needs to be constructed appropriately, but that is just a matter of trial and error for Evil Hacker.

## How Moodle avoids this problem

Once again, it is a case of being very suspicious of any input that came from outside Moodle. In the example above, `$id` should clearly have been cleaned by passing `PARAM_INT` to `required_param`.

It is more tricky with a query like

```sql
UPDATE mdl_user SET lastname = '$lastname' WHERE id = $id;
```

What happens when `$lastname` is `O'Brian`? Well, you have to escape the ' like this: `O\\'Brian`.

- In Moodle 1.9, `addslashes` is applied automatically to all input you get via `required_param` or `optional_param`.
- Moodle 2.0 onwards, completely avoid the dangerous process of building SQL by concatenating strings. In Moodle 2.0 the SQL would look like

```sql
UPDATE mdl_user SET lastname = ? WHERE id = ?;
```

and then we would pass an array of values `[$lastname, $id]` to the database along with the SQL.

## What you need to do in your code

- Use higher level `dmllib` methods, like `get_record`, whenever possible, so you do not have to create SQL yourself.
- When you have to insert values into SQL statements, **use place-holders** to insert the values safely.
- Test your code by using a tool like [sqlmap](https://sqlmap.org/), or by manually trying tricky inputs like:<br/>
`< > & \&lt; \&gt; \&amp; ' \\' 碁 \ \\`

In Moodle 1.9 or earlier:

- Data from `required_param` and `optional_param` have already had `addslashes` applied, ready to be used in database queries, but make sure you put single quotes round each value.
- If you have loaded some data from the database, and then want to re-insert it, then apply `addslashes` or `addslashes_object` to it first.

## What you need to do as an administrator

- This is not something that administrators can do anything about (other than keeping your Moodle up-to-date).

## See also

- [Security](../security)
- [Coding](../../policies.md)
- [https://sqlmap.org](https://sqlmap.org) - A tool for automatically finding SQL injection vulnerabilities.
