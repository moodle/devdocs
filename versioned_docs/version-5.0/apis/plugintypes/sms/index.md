---
title: SMS gateway
tags:
    - SMS
    - Gateway
    - Notification
---

<Since version="4.5" issueNumber="MDL-83406" />

SMS gateway plugins allow you to create SMS gateway providers.
Providers are an interface between the [SMS API](/apis/subsystems/sms/index.md) and an external SMS provider (for example Amazon Web Services).
This allows for the sending of SMS notifications to users from your Moodle instance.

:::info Example

You can set up Multi-Factor Authentication (MFA)) in Moodle and choose 'AWS' as your SMS gateway provider.

This enables users to receive SMS notifications as part of the authentication process.

:::

## File structure

SMS gateway plugins are located in the `/sms/gateway` directory. A plugin should not include any custom files outside its own plugin folder.

Each plugin is placed in a separate subdirectory and consists of a number of mandatory files and any other files the developer is going to use. See the [common plugin files](/apis/commonfiles/index.mdx) documentation for other files which may be useful in your plugin.

<details>
  <summary>The directory layout for the `smsgateway` plugin.</summary>

```console
sms/gateway/example
├── classes
│   ├── gateway.php
│   ├── hook_listener.php
│   └── privacy
│       └── provider.php
├── db
│   └── hooks.php
├── lang
│   └── en
│       └── smsgateway_example.php
├── settings.php
└── version.php
```

</details>

## Key files

There are a number of key files within the SMS gateway plugin which will need to be configured for correct functionality.

- `gateway.php`
- `hook_listener.php`

### gateway.php

Each plugin must create a class called `gateway` which extends the `\core_sms\gateway` class.
The SMS API will use the extended methods from this class.

```php title="Implementing the base SMS gateway"
<?php
namespace smsgateway_aws;

use smsgateway_aws\local\service\aws_sns;

class gateway extends \core_sms\gateway {
    #[\Override]
    public function send(
        message $message,
    ): message {
        // Sample code to send an SMS message.
        $config = (object) json_decode(
            $awsconfig,
            true,
            512,
            JSON_THROW_ON_ERROR,
        );
        $class = $this->get_gateway_service($config);
        $recipientnumber = manager::format_number(
            phonenumber: $message->recipientnumber,
            countrycode: isset($config->countrycode) ?? null,
        );

        $status = call_user_func(
            [$class, 'send_sms_message'],
            $message->content,
            $recipientnumber,
            $config,
        );

        return $message->with(
            status: $status,
        );
    }

    private function get_gateway_service(\stdClass $config): string {
        return match ($config->gateway) {
            'aws_sns' => aws_sns::class,
            default => throw new moodle_exception("Unknown Message Handler {$config->gateway}"),
        };
    }

    #[\Override]
    public function get_send_priority(message $message): int {
        return 50;
    }
}

```

### hook_listener.php

[Hooks](/apis/core/hooks/index.md) can be dispatched from the SMS API which the plugin can then listened to.
It is necessary for plugins developers to assess these hooks and implement accordingly.

#### after_sms_gateway_form_hook

This hook will allow plugins to add required form fields to assist users in configuring their SMS gateway.

```php title="Listener method for after_sms_gateway_form_hook"
public static function set_form_definition_for_aws_sms_gateway(after_sms_gateway_form_hook $hook): void {
    if ($hook->plugin !== 'smsgateway_example') {
        return;
    }

    $gateways = [
        'smsgateway_example' => get_string('list', 'smsgateway_example'),
    ];
    $mform->addElement(
        'select',
        'gateway',
        get_string('gateway', 'smsgateway_example'),
        $gateways,
    );
}

```

:::info

For an example of a production plugin example, see the [AWS SMS Gateway plugin](https://github.com/moodle/moodle/tree/main/sms/gateway/aws).

:::
