---
title: Shortlinks
tags:
 - Short link
 - Routing
---

<!-- cspell:ignore shortlink -->
<!-- cspell:ignore shortlinks -->
<!-- cspell:ignore ALPHANUMEXT -->

Shortlinks are concise URLs that route to a fully-qualified URL in Moodle. Comprising of a smaller set of characters, their use is suitable for SMS, convenience, or where a longer URL would not be suitable.

## Requirements

Shortlinks require Moodle's routing system to be enabled and fully functioning as they have been fully integrated into the existing routing subsystem. Ensure routing is configured by following this [routing guide](https://docs.moodle.org/500/en/Configuring_the_Router).

## URL structure

A shortlink URL will be comprised of the following:

- Base domain
- Route group of `s` or `p`
- Shortcode (e.g. `X8fG56aa`)

A complete shortlink will look something like this: `http://yourmoodle.com/s/X8fG56aa`.

## Short codes

Short codes are unique identifiers at the end of a shortlink. The characters available for building short codes is limited to the extended alpha-numeric set (ALPHANUMEXT) with the the omission of ambiguous characters (i.e. upper case 'i' and lower case 'L').

## Generating shortlinks

Before a shortlink can be used, a shortlink will need to be generated. Shortlink generation is random and length can be specified when calling the relevant method.

There are two types of shortlinks:

- Public shortlinks
- Private shortlinks

### Public

Public shortlinks can be accessed by anyone. Their use will be designated with a `/p/` in the URL.

```php
$public = \core\di::get(\core\shortlink::class)->create_shortlink(
    component: $component,
    linktype: $linktype,
    identifier: $identifier,
    userid: 0,
    minlength: 4,
    maxlength: 4,
);
```

### Private

Private shortlinks are tied to a specific user or set of users. Their use will be designated with a `/s/` in the URL.

```php
$private = \core\di::get(\core\shortlink::class)->create_shortlink_for_users(
    component: $component,
    linktype: $linktype,
    identifier: $identifier,
    userids: $userids,
    minlength: 4,
    maxlength: 4,
);
```

## Using shortlinks

Each component using shortlinks will need to have a `shortlink_handler` class. There are two methods that the implemented interface requires:

- `get_valid_linktypes()`
- `process_shortlink()`

```php
class shortlink_handler implements shortlink_handler_interface {
    #[\Override]
    public function get_valid_linktypes(): array {
        return [
            'view',
        ];
    }

    #[\Override]
    public function process_shortlink(
        string $type,
        string $identifier,
    ): ?\core\url {
        return match ($type) {
            'view' => new \core\url('/mod/assign/view.php', [
                'id' => $identifier,
            ]),
            default => null,
        };
    }
}
```

Assuming the shortlink has been generated, the above example would allow a shortlink URL of `http://yourmoodle.com/s/SHORTCODE` to map to `http://yourmoodle.com/mod/assign/view.php?id=IDENTIFIER`

## See also

- [Routing](../routing/index.md)
