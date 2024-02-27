---
title: Communication plugin
tags:
    - communication
    - provider
    - Communication provider
    - Communication room
    - Communication service
    - Chat
documentationDraft: true
---

Communication plugin allows you to create a communication provider plugin, which can be added as a part of course or any other instances.
For example, if you want to create a new communication room and add users to that room when a new course or instance is created, you can
create a new communication plugin and or use the existing ones and when a instance is created, updated or deleted, the communication api
will align those changes in the provider plugin asynchronously using a scheduled task.

import {
Lang,
} from '../../_files';

## File structure

Communication plugins are located in the /communication/provider directory. A plugin should not include any custom files outside its own
plugin folder.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

:::important

Some important files are described below. See the [common plugin files](../../commonfiles/index.mdx) documentation for details of other
files which may be useful in your plugin.

:::

<details>
  <summary>The directory layout for the `communication` plugin.</summary>

```console
communication/provider/example
├── classes
│   ├── communication_feature.php
│   └── privacy
│       └── provider.php
├── lang
│   └── en
│       └── communication_example.php
├── settings.php
└── version.php
```

</details>

:::info

You will notice that there are a couple of classes named as example as a prefix, these are feature classes and can be named however
you like. These are feature classes which will be defined from the communication_feature.php from the plugin.

:::

## Key files

There are a number of key files within the plugin, described below.

### communication_feature.php

Each plugin must implement this class and should have the exact class name. The core communication api will pick the features and actions from this class. There is no strict rule
on which interfaces should be implemented, plugins can choose which features they support and implement accordingly. Exception is the `communication_provider` interface which
is mandatory for all the plugins. Check below for more details on the interfaces.

```php
class communication_feature implements
    \core_communication\communication_provider,
    \core_communication\user_provider,
    \core_communication\room_chat_provider,
    \core_communication\room_user_provider {

    // All the methods from interfaces should live here.

}
```

## Interfaces

### communication_provider

This is the base communication provider interface. This interface should be used to declare the support for the instantiation method for communication providers.
Every provider plugin must implement this interface as a bare minimum. This interface will have the following methods.

#### load_for_instance()

This method will have the base communication processor(core_communication\processor) object which will allow loading the communication provider for the communication api.

### user_provider

This is the user provider interface. This interface should be used to declare the support for the for user creation for a provider. For example, Matrix allows creation of users
via API and the `communication_matrix` plugin can support the creation of users in Matrix, in that case, `communication_matrix` plugin should implement this interface. Some APIs might
not need to create user as they might have been created in a different way, in that case this interface can be excluded. This interface will have the following methods.

#### create_members()

All the necessary code and API calls to create members for the communication room should live here.

### room_chat_provider

This interface will define the features for creating a room. For example, if a communication provider allows creating a room via API, this interface should be implemented.
Let's look at the methods of this interface to get a better idea.

#### create_chat_room()

#### update_chat_room()

All the necessary actions to create/update a provider room should live here. It is highly recommended to add necessary checking to compare the
data passed and previous data to ensure something is changed and an update is required to make sure no unnecessary api calls are made. A bool
value should be returned to indicate if the room is created or updated or something went wrong.

#### delete_chat_room()

!!Danger zone!! Any deletion or related action for the communication room should live here. Please be-careful with your actions here. A bool
value should be returned to indicate if the room is deleted or something went wrong.

#### generate_room_url()

Generate a room url according to the room information, web client url or any other required information. This is an important one to allow users access the room from the UI.
Course has an icon to access the room if a room is created for the course, this method will be used to generate the url for the room.

### room_user_provider

This interface will define the features for adding/removing/updating members to the room. Room members should be added when a user is enrolled or a role changes. If a provider
allows addition of users to a room via API, this interface should be implemented. Let's look at the methods of this class to get a better idea.

#### add_members_to_room()

All the necessary actions to add members to a room should live here. The array of user ids must be passed here.

#### update_room_membership()

Updating the membership might be necessary in some cases where a user is capability changed, this method will come into play in those cases.

#### remove_members_from_room()

All the necessary actions to remove members from a room should live here. The array of user ids must be passed here.

### synchronise_provider

Communication API has a scheduled task `core_communication\task\synchronise_providers_task` which will synchronise the data from the communication provider to the current Moodle
instance. For example, it can compare the users in the communication room and users enrolled in a course and add/remove users accordingly. The scheduled task runs and adds an
ad-hoc task for each instance where the provider implements this interface. This feature will help keep the data on-sync between the provider and Moodle.

#### synchronise_room_members()

All the necessary code to synchronise the room members should live here.

:::info

For a real plugin example, please look at the [Matrix plugin](https://github.com/moodle/moodle/tree/master/communication/provider/matrix).

:::
