---
title: Communication API
tags:
    - communication
    - provider
    - Communication provider
    - Communication room
    - Communication service
    - Chat
---

Communication API provides access to the messaging system and other communication providers (such as Matrix).
This API the management of room and members to that room.

Communication API actions its tasks happens asynchronously using ad-hoc tasks. This means that the API functions will return immediately and the action will be
executed in the background. Communication API has multiple interfaces which acts like a feature of the API. Each of these interface/features have one or more associated
ad-hoc tasks. These tasks are responsible to action the requested feature from the provider plugin (such as Matrix) informed by the Communication API instance. For developers
to interact with the API, they must use the public API (`communication\api`).

Communication API allows to add ad-hoc tasks to the queue to perform actions on the communication providers. This API will not allow any immediate actions to be performed on the
communication providers. It will only add the tasks to the queue. The exception has been made for deletion of members in case of deleting the user. This is because the user will
not be available for any checks (capability, role etc.) after deleted.

:::info

This is an experimental feature. To use this feature, you must enable the experimental feature flag for Communication in the site administration.
Please follow the steps to enable the feature.

1. Navigate to `Site administration > Development > Experimental` settings.
2. Tick the checkbox to enable the following feature: Enable communication providers (`enablecommunicationsubsystem`).

:::

## Important features of the API

The below are the important methods/features of the API. These methods/features are the ones which can be used to interact with the communication API.

### Loading a communication instance

To load a communication instance, you must use the `communication\api::load_by_instance()` method. This method will return a communication instance which can be
used to interact with the communication API and its related methods. The below example shows how to load a communication instance for a course, where the
context is the actual course context object, component is the component name (`core_course`), instance type is the custom string which can change according to
the usage and instance id is the course id. The constructor of the public api is private and hence the only way to load an instance is through
the `load_by_instance()` method. The provider is the name of the provider plugin which is used to load the instance. It's optional, if not provided, it will load
the enabled provider for that instance.

```php
$communication = \core_communication\api::load_by_instance(
            context: $context,
            component: 'core_course',
            instancetype: 'coursecommunication',
            instanceid: $courseid,
            provider: 'communication_matrix',
        );
```

### Create and configure a room

`$communication->create_and_configure_room()` method is used to add an ad-hoc to create a room in the communication provider and configure it with the required settings.

```php
public function create_and_configure_room(
        string $communicationroomname,
        ?\stored_file $avatar = null,
        ?\stdClass $instance = null,
    )
```

This method takes the following parameters:

- The name of the room as a string to be created.
- The avatar of the room to be created, this is a stored file object.
- The instance object of the communication API.

For example, we want to create a room for a course with the course name as the room name and the course image as the avatar, we can use the below code.
There can be other cases where information from course instance will be used by a plugin, for example, the dynamic field from matrix plugin has a form
field named topic which sets the topic of the room, the instance object can be used to get the topic from the course instance and set it in the form field.
Please refer to [Communication plugin](../../plugintypes/communication/index.md) documentation for more details.

```php
// First initialize the communication instance, provided the context is already initialized and the selected provider is available
// though a form or other means.
$communication = \core_communication\api::load_by_instance(
            context: $context,
            component: 'core_course',
            instancetype: 'coursecommunication',
            instanceid: $course->id,
            provider: 'communication_matrix',
        );

// Now call the create_and_configure_room() method to add an ad-hoc to create a room in the communication provider and configure it
// with the required settings.
$communication->create_and_configure_room(
                communicationroomname: $course->fullname,
                avatar: $courseimage ?: null,
                instance: $course,
            );
```

### Update a room and its associated information

`$communication->update_room()` method is used to add an ad-hoc to update a room in the communication provider and configure it with the required settings.

```php
public function update_room(
        ?int $active = null,
        ?string $communicationroomname = null,
        ?\stored_file $avatar = null,
        ?\stdClass $instance = null,
    )
```

This method takes the following parameters:

- The active status of the room to be updated. Can be either 0 or 1.
- The name of the room as a string to be updated.
- The avatar of the room to be updated, this is a stored file object.
- The instance object of the communication API.

```php
// First initialize the instance.
$communication = \core_communication\api::load_by_instance(
            context: $context,
            component: 'core_course',
            instancetype: 'coursecommunication',
            instanceid: $course->id,
            provider: 'communication_matrix',
        );

// Now update the room with the required settings. The instance will be used by dynamic fields feature of the plugin to allow the plugin
// to get the required information from the instance.
$communication->update_room(
                active: $active,
                communicationroomname: $communicationroomname,
                avatar: $courseimage ?: null,
                instance: $course,
            );
```

### Delete a room

`$communication->delete_room()` method is used to add an ad-hoc to delete a room in the communication provider. The associated task for this also removes all the members from
the room before deleting the room.

:::danger

This is destructive and might remove all the messages and other data associated with the room. Usage of this should be done with caution.

:::

### Add members to a room

`$communication->add_members_to_room()` method is used to add an ad-hoc to add members to a room in the communication provider. The user id of each user to be added to
the provider room is also stored in the communication_user table for user mapping with the provider.

```php
public function add_members_to_room(
        array $userids,
        bool $queue = true,
    )
```

This method accepts the following parameters:

- An array of user ids to be added to the provider room.
- A boolean value to indicate if the task should be added to the queue or run immediately. This is false by default. This is added to ensure the cases where the mapping should be created but the task might not be needed at this point.

```php
// First initialize the instance, provider is not required here, it will initialize the enabled instance.
$communication = \core_communication\api::load_by_instance(
            context: $context,
            component: 'core_course',
            instancetype: 'coursecommunication',
            instanceid: $course->id,
        );

// Now add the members.
$communication->add_members_to_room(
                userids: $enrolledusers,
            );
```

### Update the membership of a room

`$communication->update_room_membership()` method is used to add an ad-hoc to update the membership of a room in the communication provider.
The user mapping for each of the users are also reset to allow task to update the users from the task.

```php
public function update_room_membership(
        array $userids,
        bool $queue = true,
    )
```

This method accepts the same parameters as the `add_members_to_room()` method and the usage is also the same.

### Remove members from a room

`$communication->remove_members_from_room()` method is used to add an ad-hoc to remove members from a room in the communication provider.
The users are flagged as deleted in the communication_user table to allow the task to remove the users from the provider room.

```php
public function remove_members_from_room(
        array $userids,
        bool $queue = true
    )
```

This method accepts the same parameters as the `add_members_to_room()` method and the usage is also the same.

### Show the communication room creation status notification

`$communication->show_communication_room_status_notification()` is a special method to have a UI element to show the status of the room creation. If the room is ready, it will
return the notification as a string. If the room is not ready, it will return pending status. Course have this implemented and shows the status after the communication instance
is configured. Please note, the status notification relies on the creation of room, not the memberships of the room.

### Communication instance setup using form/configuration page

The communication API allows to have settings to configure the basic information like room name, selection of provider etc. `$communication->form_definition()` method
is used to get the form definition for the settings form. If the form elements are used in another form to include the communication form elements, `form_definition()` method
will be useful. There is a configuration page (`communication/configure.php`) which can be used to configure the communication instance. Course currently uses this page to set up
communication and its associated information.
It will also be required to use `set_data()` method in order to set the data to the form elements while saving the data.

```php
public function form_definition(
        \MoodleQuickForm $mform,
        string $selectdefaultcommunication = processor::PROVIDER_NONE,
    )
```

This method accepts the following parameters:

- The moodle quick form object to add the form elements to.
- The default provider to be selected in the form. This is set to none by default.

For example, we have a form where we want to have the communication settings, we can use the below code to add the form elements to the form.

```php
class configure_form extends \moodleform {
    public function definition() {
        $mform = $this->_form;
        $communication = \core_communication\api::load_by_instance(
            context: $context,
            component: 'core_course',
            instancetype: 'coursecommunication',
            instanceid: $course->id,
        );
        $communication->form_definition(mform: $mform);
        $this->communication->set_data(instance: $course);
    }
}
```

## Building a communication plugin

Communication API also provides a bunch of interfaces for a communication plugin to consume. Every plugin should implement these interfaces according to the features they
support.

:::info

Please refer to [Communication plugin](../../plugintypes/communication/index.md) documentation for more details about building a plugin.

:::
