---
title: Message API
tags:
  - API
  - Tutorial
  - Plugins
  - Messaging
---

## What is this document?

This document describes how to make use of the Moodle Messaging API to send messages to Moodle users.

If you are after a general introduction on using the Moodle Messaging system go to [messaging user documentation](https://docs.moodle.org/en/Messaging).

If you are looking for details of how the Messaging system's internal structure was implemented, go to [Messaging 2.0](https://docs.moodle.org/dev/Messaging_2.0).

If you are looking for instructions on the implementation of a custom message processor (a component that receives messages sent to a user), go to [Messaging custom components](https://docs.moodle.org/dev/Messaging_custom_components).

If you are looking for instructions on sending messages programmatically within Moodle then read on...

## Overview

Moodle components have the ability to send messages to users via the Moodle messaging system. Any type of component, for example a plugin or block, can register as a message producer then send messages to users.

## File locations

The Message API code is contained within `lib/messagelib.php` and is automatically included for you during page setup.

## Functions

`message_send()` is the primary point of contact for the message API. Call it to send a message to a user. See the php documentation for a full description of the arguments that must be supplied. There is also an example below.

## Message pop-up

<Since versions={["2.9"]} />

A JavaScript pop-up can be displayed through a link to invite a user to message another. In order to use this feature, you need to require the JavaScript libraries using `message_messenger_requirejs()` and create a link with the attributes returned by `message_messenger_sendmessage_link_params()`. More in the examples.

## Examples

### How to register as a message producer

The messages produced by a message provider is defined in the `/db/messages.php` file of a component. Below is code from the quiz module's `messages.php` file, shown as an example.

```php title="mod/quiz/db/messages.php"
defined('MOODLE_INTERNAL') || die();
$messageproviders = [
    // Notify teacher that a student has submitted a quiz attempt
    'submission' => [
        'capability' => 'mod/quiz:emailnotifysubmission'
    ],
    // Confirm a student's quiz attempt
    'confirmation' => [
        'capability' => 'mod/quiz:emailconfirmsubmission'
    ],
];
```

The quiz can send two kinds of messages, quiz "submission" and "confirmation" notifications. Each message type is only available to users with the appropriate capability. Please note that the capability is checked at the system level context. Users who have this capability will have this message listed in their messaging preferences. You can omit the capability section if your message should be visible for all users. For example forum post notifications are available to all users.

```php
$messageproviders = [
    // Ordinary single forum posts
    'posts' => [],
];
```

When displaying your message types in a user's messaging preferences it will use a string from your component's language file called `messageprovider:messagename`. For example here are the relevant strings from the quiz's language file.

```php
$string['messageprovider:confirmation'] = 'Confirmation of your own quiz submissions';
$string['messageprovider:submission'] = 'Notification of quiz submissions';
```

Once your `messages.php` is complete you need to increase the version number of your component in its `version.php`. That will cause Moodle to check `messages.php` looking for new or changed message definitions. Log in as an admin and go to `/admin/index.php` (the Notifications page) to start the upgrade process.

### Setting defaults

```php title="The default processor can be set using an element of the array"
'mynotification' => [
    'defaults' => [
        'pop-up' => MESSAGE_PERMITTED + MESSAGE_DEFAULT_LOGGEDIN + MESSAGE_DEFAULT_LOGGEDOFF,
        'email' => MESSAGE_PERMITTED,
    ],
],
```

With that setting email will be permitted but disabled for each user by default. It  can be turned on by each user through the `preferences/notification` preferences options (`/message/notificationpreferences.php?userid=X`)
The possible values are recorded in the lib.php file of messaging

```php
/**
 * Define contants for messaging default settings population. For unambiguity of
 * plugin developer intentions we use 4-bit value (LSB numbering):
 * bit 0 - whether to send message when user is loggedin (MESSAGE_DEFAULT_LOGGEDIN)
 * bit 1 - whether to send message when user is loggedoff (MESSAGE_DEFAULT_LOGGEDOFF)
 * bit 2..3 - messaging permission (MESSAGE_DISALLOWED|MESSAGE_PERMITTED|MESSAGE_FORCED)
 *
 * MESSAGE_PERMITTED_MASK contains the mask we use to distinguish permission setting
 */
```

Note that if you change the values in message.php and then upgrade the plugin the values will not automatically be changed in the `config_plugins` table where they are stored.

### How to send a message

<Since versions={["2.9"]} />

Here is example code showing you how to actually send a notification message. The example shows the construction of a object with specific properties, which is then passed to the `message_send()` function that uses the information to send a message.

```php title="Sending a message"
$message = new \core\message\message();
$message->component = 'mod_yourmodule'; // Your plugin's name
$message->name = 'mynotification'; // Your notification name from message.php
$message->userfrom = core_user::get_noreply_user(); // If the message is 'from' a specific user you can set them here
$message->userto = $user;
$message->subject = 'message subject 1';
$message->fullmessage = 'message body';
$message->fullmessageformat = FORMAT_MARKDOWN;
$message->fullmessagehtml = '<p>message body</p>';
$message->smallmessage = 'small message';
$message->notification = 1; // Because this is a notification generated from Moodle, not a user-to-user message
$message->contexturl = (new \moodle_url('/course/'))->out(false); // A relevant URL for the notification
$message->contexturlname = 'Course list'; // Link title explaining where users get to for the contexturl
// Extra content for specific processor
$content = [
    '*' => [
        'header' => ' test ',
        'footer' => ' test ',
    ],
];
$message->set_additional_content('email', $content);

// You probably don't need attachments but if you do, here is how to add one
$usercontext = context_user::instance($user->id);
$file = new stdClass();
$file->contextid = $usercontext->id;
$file->component = 'user';
$file->filearea = 'private';
$file->itemid = 0;
$file->filepath = '/';
$file->filename = '1.txt';
$file->source = 'test';

$fs = get_file_storage();
$file = $fs->create_file_from_string($file, 'file1 content');
$message->attachment = $file;

// Actually send the message
$messageid = message_send($message);
```

```php title="Before 2.9 message data used to be a stdClass object as shown below (This formation of a message will no longer work as of Moodle 3.6. Only a message object will be accepted):"

$message = new stdClass();
$message->component = 'mod_quiz'; //your component name
$message->name = 'submission'; //this is the message name from messages.php
$message->userfrom = $USER;
$message->userto = $touser;
$message->subject = $subject;
$message->fullmessage = $message;
$message->fullmessageformat = FORMAT_PLAIN;
$message->fullmessagehtml = '';
$message->smallmessage = '';
$message->notification = 1; //this is only set to 0 for personal messages between users
message_send($message);
```

### How to set-up the message pop-up

Here is example code showing you how to set-up the JavaScript pop-up link.

```php
require_once('message/lib.php');
$userid = 2;
$userto = $DB->get_record('user', ['id' => $userid]);

message_messenger_requirejs();
$url = new moodle_url('message/index.php', ['id' => $userto->id]);
$attributes = message_messenger_sendmessage_link_params($userto);
echo html_writer::link($url, 'Send a message', $attributes);
```

## Changes in Moodle 3.5

<Since versions={["3.5"]} />

In Moodle 3.5, there were some moderately big changes. The only docs I have been able to find about them are in [upgrade.txt](https://github.com/moodle/moodle/blob/33a388eff737c049786ee42d7430db549568471c/message/upgrade.txt#L56) file. However, that is the details, here is an overview:

The main `message_send()` API to send a message has not changed, so if your code is just sending messages, you don't need to do anything.

Similarly, message_output plugins don't need to change, so no worries there.

If you are doing things with messages, then you need to understand how the internals have changed.

The database tables have changed. Messages from Moodle components to a user (e.g. mod_quiz), telling them that something has happened (e.g. an attempt was submitted) have always been 'Notifications'. In the past, this was just a column in the `mdl_message` table. Now, messages and notifications are stored in completely separate tables. Notifications are in `mdl_notifications`. The structure of this table is very similar to the old `mdl_message` table which is now not used at all. Messages are in `mdl_messages`, and related tables, that now exist to support group messaging. Those tables join together like this:

```sql
   SELECT *
     FROM mdl_messages m
     JOIN mdl_message_conversations con ON con.id = m.conversationid
     JOIN mdl_message_conversation_members mem ON mem.conversationid = con.id
LEFT JOIN mdl_message_user_actions act ON act.userid = mem.userid AND act.messageid = m.id
 ORDER BY m.timecreated, m.id, mem.userid, act.id
```
