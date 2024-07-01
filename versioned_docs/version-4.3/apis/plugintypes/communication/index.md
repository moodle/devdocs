---
title: Communication
tags:
- communication
- provider
- Communication provider
- Communication room
- Communication service
- Chat
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

Each plugin must implement this class and should have the exact class name. This part is important for the core communication api.
The core communication api will pick the features and actions from this class. This class should implement the interfaces it supports.

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
Every provider plugin must implement this interface. This interface will have the following methods.

#### load_for_instance()

This method will have the base communication processor object which will allow loading the communication provider for the communication api.

### user_provider

This is the base user provider interface. This interface should be used to declare the support for the for user provider creation and management.
Every provider plugin must implement this interface if user creation is required. This interface will have the following methods.

#### create_members()

All the necessary actions to create members for the room should live here. Some APIs might not need to create user as they might have been created in a different way.

### room_chat_provider

This interface will define the features for creating a room. Let's look at the methods of this interface to get a better idea.

#### create_chat_room()

#### update_chat_room()

All the necessary actions to create/update a provider room should live here. It is highly recommended to add necessary checking to compare the
data passed and previous data to ensure something is changed and an update is required to make sure no unnecessary api calls are made. A bool
value should be returned to indicate if the room is created or updated or something went wrong.

#### delete_chat_room()

!!Danger zone!! Any deletion or related action for the communication room should live here. Please be-careful with your actions here. A bool
value should be returned to indicate if the room is deleted or something went wrong.

#### generate_room_url()

Generate a room url according to the room information, web client url or any other required information.

### room_user_provider

This interface will define the features for adding members to the room or removing members from the room. Let's look at the methods of this class to get a better idea.

#### add_members_to_room()

All the necessary actions to add members to a room should live here. The array of user ids must be passed here.

#### remove_members_from_room()

All the necessary actions to remove members from a room should live here. The array of user ids must be passed here.

:::info

For a real plugin example, please look at the [Matrix plugin](https://github.com/moodle/moodle/tree/main/communication/provider/matrix).

:::
