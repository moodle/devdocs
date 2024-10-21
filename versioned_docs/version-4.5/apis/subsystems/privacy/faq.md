---
title: FAQs
tags:
  - GDPR
  - Privacy API
  - FAQ
---

## My plugin sends notifications or messages to the user - do I need to return this user data?

No - messages and notifications do not need to be declared or exported.

Messages within the Moodle UI are only shown within the messages component, and are not viewed from within the sending component. Messages are designed to be read in isolation and to make sense outside of the component which generated them.

It would be unexpected for a plugin to fetch the messages that it has previously sent out, and when a plugin is uninstalled and its data removed, the messages and notifications it has previously sent are left in place.

Therefore the *core_messages* subsystem is considered to own the data once it has been sent.

Plugins which send messages and notifications do not need to declare the subsystem link, or to export these messages.

## My plugin is a repository - does that mean it is responsible for the files fetched?

No.

The repository does not store data itself. It's part of the channel between the requesting component (e.g. the Assignment module) and the file that is stored.

The repository may integrate with an external system, and this information needs to be declared, but the repository itself does not store the data, and is not responsible for how it is stored in the file system.

Unless the repository keeps a track of user credentials, user preferences, or some other kind of user information, you likely do not store any user data.

## My plugin stores data in the session - do I need to declare it?

No.

Data stored in the user session is not stored permanently, and cannot be reported (the export process runs in a different thread).

Although the data is stored, and can be set, updated, and retrieved, it is time limited and the export process does not have access to return it.

## My plugin only sends data to an external location, but doesn't store it locally in Moodle - what should I do?

You need to describe the data exported in the metadata provider and implement the request plugin provider.

Your plugin must still report that it processes data via the metadata provider. More specifically, it should do this by linking the external location using link_external_location().

In most cases, plugins of this nature won't be able to retrieve the data sent externally, so should implement a request/plugin/provider with empty methods. They must do this for compliance reasons; they must implement a request provider, but cannot not return any data, so should just return nothing. If your plugin can return data from external sources, then you may choose to do so.

## My plugin stores user preferences for a specific context. What should I do?

You need to implement the *user_preference_provider* provider, and the *plugin/provider* provider.

Any system-wide preference should be exported from within the *export_user_preference* function.

Any context-specific preference should:

- Have the context it resides in identified in the *get_contexts_for_userid* function
- Be exported from within the *export_user_data* function; and
- be deleted in both the *delete_data_for_all_users_in_context* and *delete_data_for_user* functions for those contexts specified.

## Why almost all the enrol_xxx plugins implements the null provider instead linking to the core_enrol subsystem?

The core_enrol subsystem just uses the enrol_xxx components to display the UI to manage the enrolments. The process as a whole is managed by core_enrol, and enrol_xxx are just a way of bringing two concepts together. The data is stored consistently within core_enrol and the enrol_xxx components are essentially a conduit to store the data en the core_enrol subsystem.

You can ultimately work out which enrol plugin a user is enrolled with, but the UI is largely provided by core_enrol, and the calling code is actually core_enrol. Besides, you don't create an enrolment plugin instance in isolation: core_enrol is central to the experience.

## My plugin does not store any personal data itself, but does send personal data into the Moodle logs or another subsystem. What should I do?

You need to implement `\core_privacy\local\metadata\provider` so that you can describe the sub-systems used by your plugin in the `get_metadata()` method of your provider.

The exporting and deleting of the user data in the subsystem will be handled by that subsystem and the plugins inside it, so you do not need to implement any of the request interfaces which are used to export data from the plugin.
