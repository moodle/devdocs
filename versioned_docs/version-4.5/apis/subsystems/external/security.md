---
title: Security
tags:
  - Web Services
  - core_external
  - external
  - API
sidebar_position: 3
---

Before operating on any data in an external function, you must ensure that the user:

- has access to context that the data is located in
- has permission to perform the relevant action

## Validating function parameters

Before working with any data provided by a user you **must** validate the parameters against the definitions you have defined.

To do so you should call the `validate_parameters()` function, passing in the reference to your `execute_parameters()` function, and the complete list of parameters for the function. The function will return the validated and cleaned parameters.

The `validate_parameters()` function is defined on the `\core_external\external_api` class, and can be called as follows:

```php title="local/groupmanager/classes/external/create_groups.php"
public static function execute(array $groups): array {
    [
        'groups' => $groups,
    ] = self::validate_parameters(self::execute_parameters(), [
        'groups' => $groups,
    ]);
    // ...
}
```

## Validating access to the Moodle context

Whenever fetching or updating any data within Moodle using an External function definition, you **must** validate the context that the data exists within.

To do so you should call the `validate_context()` function, passing the _most specific_ context for the data.

For example, if you are working with data belonging to a specific activity, you should use the _activity_ context. If you are working with data belonging to a course, you should use the _course_ context.

If your function operates on multiple contexts (like a list of courses), you must validate each context right before generating any response data related to that context.

The `validate_context()` function is defined on the `\core_external\external_api` class, and can be called as follows:

```php title="local/groupmanager/classes/external/create_groups.php"
public static function execute(array $groups): array {
    // ...
    foreach ($groups as $group) {
        $coursecontext = \context_course::instance($group['courseid']);
        self::validate_context($coursecontext);
        // ...
    }
}
```

:::tip

The `validate_context()` function will also configure the correct theme, language, and filters required to render content for the current user.

:::

:::caution

You should not:

- use the `require_login` function from an external function - this function is reserved for php scripts returning a web page.
- call `$PAGE->set_context()` manually - this will generate warning notices.

The `validate_context()` function is the only correct way to write external functions.

:::

## Ensuring that a user has the appropriate rights

Once you have confirmed that the provided data is of the correct type, and configured Moodle for the specific context, you should also ensure that all capabilities are checked correctly.

You can use the standard capability functions, including:

- `has_capability()` - to check that a user has a single capability
- `has_any_capability()` - to check that a user has any capability in a set
- `has_all_capability()` - to check that a user has all capabilities in a set
- `require_capability()` - to require a single capability
- `require_all_capabilities()` - to require that a user has all capabilities in a set
