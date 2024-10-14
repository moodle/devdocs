---
title: SMS gateway plugin
tags:
    - SMS
    - Gateway
    - SMS gateway
    - Notification
---

<Since version="4.5" issueNumber="MDL-83406" />

SMS gateway plugins allows you to create SMS gateway provider, which can be used to send SMS notification to users from your Moodle instance.
For example, you use MFA (Multi-Factor Authentication) to user authentication in Moodle and you use AWS as your SMS gateway provider. You can
now build more SMS Gateway providers to allow sending SMS to your users.

## File structure

SMS gateway plugins are located in the /sms/gateway directory. A plugin should not include any custom files outside its own
plugin folder.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

:::important

Some important files are described below. See the [common plugin files](../../commonfiles/index.mdx) documentation for details of other
files which may be useful in your plugin.

:::

<details>
  <summary>The directory layout for the `smsgateway` plugin.</summary>

```console
sms/gateway/example
├── classes
│   ├── gateway.php
│   ├── hook_listener.php
│   └── privacy
│       └── provider.php
├── lang
│   └── en
│       └── smsgateway_example.php
├── settings.php
└── version.php
```

</details>

## Key files

There are a number of key files within the plugin, described below.

### gateway.php

Each plugin must implement this class and should have the exact class name. The core_sms api will pick the extended methods from this class.

```php title="Implementing the base SMS gateway"

class gateway extends \core_sms\gateway {

    #[\Override]
    public function send(
        message $message,
    ): message {
        // Sample code to send an SMS message.
        $config = (object)json_decode($awsconfig, true, 512, JSON_THROW_ON_ERROR);
        $class = '\smsgateway_aws\local\service\\' . $config->gateway;
        $recipientnumber = manager::format_number(
            phonenumber: $message->recipientnumber,
            countrycode: isset($config->countrycode) ?? null,
        );
        if (class_exists($class)) {
            $status = call_user_func(
                $class . '::send_sms_message',
                $message->content,
                $recipientnumber,
                $config,
            );
        }
        return $message->with(
            status: $status,
        );
    }

    #[\Override]
    public function get_send_priority(message $message): int {
        return 50;
    }
}

```

### hook_listener.php

There a couple of hooks dispatched from the core_sms API which can be listened by the plugin. It is necessary for plugins developers to assess
these hooks and implement accordingly.

#### after_sms_gateway_form_hook

This hook will allow plugins to add their relevant form field from the plugin to allow users to add required configs for the SMS gateway.

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

For a real plugin example, please look at the [AWS SMS Gateway plugin](https://github.com/moodle/moodle/tree/main/sms/gateway/aws).

:::
