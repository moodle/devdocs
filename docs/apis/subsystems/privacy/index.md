---
title: Privacy API
tags:
  - Privacy
  - GDPR
  - API
---

The [General Data Protection Regulation](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) (GDPR) is an EU directive that provides users with more control over their data and how it is processed. This regulation came into effect on 25th of May 2018 and covers any citizen or permanent resident of the European Union. The directive is respected by a number of other countries outside of the European Union.

<!-- cspell:ignore contextlist, subcontext, subcontexts, userlist -->

To help institutions become compliant with this new regulation we are adding functionality to Moodle. This includes a number of components, amongst others these include a user's right to:

- request information on the types of personal data held, the instances of that data, and the deletion policy for each;
- access all of their data; and
- be forgotten.

The compliance requirements also extend to installed plugins (including third party plugins). These need to also be able to report what information they store or process regarding users, and have the ability to provide and delete data for a user request.

This document describes the proposed API changes required for plugins which will allow a Moodle installation to become GDPR compliant.

Target Audience: The intended audience for this document is Moodle plugin developers, who are aiming to ensure their plugins are updated to comply with GDPR requirements coming into effect in the EU in May, 2018.

## Personal data in Moodle

From the GDPR Spec, Article 4:

> 'personal data' means any information relating to an identified or identifiable natural person ('data subject'); an identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person;

In Moodle, we need to consider two main types of personal data; information entered by the user and information stored about the user. The key difference being that information stored about the user will have come from a source other than the user themselves. Both types of data can be used to form a profile of the individual.

The most obvious clue to finding personal data entered by the user is the presence of a userid on a database field. Any data on the record (or linked records) pertaining to that user may be deemed personal data for that user, including things like timestamps and record identification numbers. Additionally, any free text field which allows the user to enter information must also be considered to be the personal data of that user.

Data stored about the user includes things like ratings and comments made on a student submission. These may have been made by an assessor or teacher, but are considered the personal data of the student, as they are considered a reflection of the user's competency in the subject matter and can be used to form a profile of that individual.

The sections that follow outline what you need to do as a plugin developer to ensure any personal data is advertised and can be accessed and deleted according to the GDPR requirements.

## Background

### Architecture overview

![UML diagram of the metadata part of the privacy subsystem](./_index/MoodlePrivacyMetadataUML.png)
![UML diagram of the request providers part of the privacy subsystem](./_index/MoodlePrivacyRequestUML.png)

A new system for Privacy has been created within Moodle. This is broken down into several main parts and forms the *core_privacy* subsystem:

- Some metadata providers - a set of PHP interfaces to be implemented by components for that component to describe the kind of data that it stores, and the purpose for its storage;
- Some request providers - a set of PHP interfaces to be implemented by components to allow that component to act upon user requests such as the Right to be Forgotten, and a Subject Access Request; and
- A manager - a concrete class used to bridge components which implement the providers with tools which request their data.

All plugins will implement one metadata provider, and zero, one or two request providers.

The 'request' providers are responsible for several separate areas:

1. Detecting in which Moodle contexts a specific user has any personal data;
1. Exporting all personal data from each of those contexts for that user;
1. Deleting all personal data from each of those contexts for that user;
1. Detecting which users have personal data in a specific Moodle context;
1. Deleting all personal data for each of those users in that context; and
1. Deleting all personal data for all users in a specific context.

The export and delete phases use data from the detection phase, which allows for the possibility to exclude all data from certain contexts, as required.

Please refer to the inline phpdocs of the [core_privacy::manager class](https://github.com/moodle/moodle/blob/v3.5.0/privacy/classes/manager.php#L31) for detailed description of the interfaces, their hierarchy and meaning.

Please note that support for locating and removing multiple users in a single context was added in [MDL-62560](https://tracker.moodle.org/browse/MDL-62560) for Moodle 3.6, 3.5.3, and 3.4.6.
This functionality has been added to allow support for removal of user data for users subject to specific role criterion, and to support expiry of the same data by role too.

### Implementing a provider

All plugins will need to create a concrete class which implements the relevant metadata and request providers. The exact providers you need to implement will depend on what data you store, and the type of plugin. This is covered in more detail in the following sections of the document.

In order to do so:

1. You must create a class called *provider* within the namespace `\your_pluginname\privacy`.
1. This class must be created at `path/to/your/plugin/classes/privacy/provider.php`.
1. You must have your class implement the relevant metadata and request interfaces.

## Plugins which do not store personal data

Many Moodle plugins do not store any personal data. This is usually the case for plugins which just add functionality, or which display the data already stored elsewhere in Moodle.

Some examples of plugin types which might fit this criteria include themes, blocks, filters, editor plugins, etc.

Plugins which cause data to be stored elsewhere in Moodle (e.g. via a subsystem call) are considered to store data.

One examples of a plugin which does not store any data would be the Calendar month block which just displays a view of the user's calendar. It does not store any data itself.

An example of a plugin which must not use the null provider is the Comments block. The comments block is responsible for data subsequently being stored within Moodle. Although the block doesn't store anything itself, it interacts with the comments subsystem and is the only component which knows how that data maps to a user.

### Implementation requirements

In order to let Moodle know that you have audited your plugin, and that you do not store any personal user data, you must implement the `\core_privacy\local\metadata\null_provider` interface in your plugin's provider.

These null providers can only be implemented where a plugin has:

- no external links (e.g. sends data to an external service like an LTI provider, repository plugin which you can search on)
- no database tables which store user data (including IP addresses)
- no user preferences

The `null_provider` requires you to define one function `get_reason()` which returns the language string identifier within your component.

#### Example

```php title="blocks/calendar_month/classes/privacy/provider.php"
 <?php
// …

namespace block_calendar_month\privacy;

class provider implements
    // This plugin does not store any personal user data.
    \core_privacy\local\metadata\null_provider {

    /**
     * Get the language string identifier with the component's language
     * file to explain why this plugin stores no data.
     *
     * @return  string
     */
    public static function get_reason(): string {
        return 'privacy:metadata';
    }
}
```

```php title="blocks/calendar_month/lang/en/block_calendar_month.php"
<?php
// …

...
$string['privacy:metadata'] = 'The Calendar block only displays existing calendar data.';
...
```

That's it. Congratulations, your plugin now implements the Privacy API.

## Plugins which store personal data

Many Moodle plugins do store some form of personal data.

In some cases this will be stored within database tables in your plugin, and in other cases this will be in one of Moodle's core subsystems - for example your plugin may store files, ratings, comments, or tags.

Plugins which do store data will need to:

- Describe the type of data that they store;
- Provide a way to export that data; and
- Provide a way to delete that data.

Data is described via a *metadata* provider, and it is both exported and deleted via an implementation of a *request* provider.

These are both explained in the sections below.

### Describing the type of data you store

In order to describe the type of data that you store, you must implement the `\core_privacy\local\metadata\provider` interface.

This interfaces requires that you define one function: `get_metadata`.

There are several types of item to describe the data that you store. These are for:

- Items in the Moodle database;
- Items stored by you in a Moodle subsystem - for example files, and ratings; and
- User preferences stored site-wide within Moodle for your plugin

Note: All fields should include a description from a language string within your plugin.

#### Example

```php title="mod/forum/classes/privacy/provider.php"
<?php
// …

namespace mod_forum\privacy;
use core_privacy\local\metadata\collection;

class provider implements
        // This plugin does store personal user data.
        \core_privacy\local\metadata\provider {

    public static function get_metadata(collection $collection): collection {

        // Here you will add more items into the collection.

        return $collection;
    }
}
```

#### Indicating that you store content in a Moodle subsystem

Many plugins will use one of the core Moodle subsystems to store data.

As a plugin developer we do not expect you to describe those subsystems in detail, but we do need to know that you use them and to know what you use them for.

You can indicate this by calling the `add_subsystem_link()` method on the `collection`.

##### Relevant subsystems

You are likely to need to indicate use of the following subsystems that store user data:

- Ratings (if users are allowed to rate items within your plugin)
- Tags (if users can tag items within your plugin)
- Comments (if users can make comments on items in your plugin)
- Questions (if the plugin uses core question types)
- Filesystem (if users can attach files to items within your plugin)
- ...?

Some subsystems which store user data do not need to be listed:

- (TBC - how about global search? Nothing lists it that I could see.)

##### Example

```php title="mod/forum/classes/privacy/provider.php"
public static function get_metadata(collection $collection): collection {

    $collection->add_subsystem_link(
        'core_files',
        [],
        'privacy:metadata:core_files'
    );

    return $collection;
}
```

```php title="mod/forum/lang/en/forum.php"
<?php

$string['privacy:metadata:core_files'] = 'The forum stores files which have been uploaded by the user to form part of a forum post.';
```

#### Describing data stored in database tables

Most Moodle plugins will store some form of user data in their own database tables.

As a plugin developer you will need to describe each database table, and each field which includes user data.

It is a matter of judgement which fields contain user data and which don't. Anything entered by, or directly about, the user probably counts as user data but it may be useful to include additional fields that explain the context of the data.

##### Example

```php title="mod/forum/classes/privacy/provider.php"
public static function get_metadata(collection $collection): collection {

    $collection->add_database_table(
        'forum_discussion_subs',
         [
            'userid' => 'privacy:metadata:forum_discussion_subs:userid',
            'discussionid' => 'privacy:metadata:forum_discussion_subs:discussionid',
            'preference' => 'privacy:metadata:forum_discussion_subs:preference',

         ],
        'privacy:metadata:forum_discussion_subs'
    );

    return $collection;
}
```

```php title="mod/forum/lang/en/forum.php"
<?php

$string['privacy:metadata:forum_discussion_subs'] = 'Information about the subscriptions to individual forum discussions. This includes when a user has chosen to subscribe to a discussion, or to unsubscribe from one where they would otherwise be subscribed.';
$string['privacy:metadata:forum_discussion_subs:userid'] = 'The ID of the user with this subscription preference.';
$string['privacy:metadata:forum_discussion_subs:discussionid'] = 'The ID of the discussion that was subscribed to.';
$string['privacy:metadata:forum_discussion_subs:preference'] = 'The start time of the subscription.';
```

#### Indicating that you store site-wide user preferences

Many plugins will include one or more user preferences. Unfortunately this is one of Moodle's older components and many of the values stored are not pure user preferences. Each plugin should be aware of how it handles its own preferences and is best placed to determine whether they are site-wide preferences, or per-instance preferences.

Whilst most of these will have a fixed name (e.g. `filepicker_recentrepository`), some will include a variable of some kind (e.g. `tool_usertours_tour_completion_time_2`). Only the general name (in this case "tool_usertours_tour_completion_time_") needs to be indicated, rather than one copy for each possible value of the variable.

Also, these should only be *site-wide* user preferences which do not belong to a specific Moodle context.

In the above examples:

- Preference `filepicker_recentrepository` belongs to the file subsystem, and is a site-wide preference affecting the user anywhere that they view the filepicker.
- Preference `tool_usertours_tour_completion_time_2` belongs to user tours. User tours are a site-wide feature which can affect many parts of Moodle and cross multiple contexts.

In some cases a value may be stored in the preferences table but is known to belong to a specific context within Moodle. In these cases they should be stored as metadata against that context rather than as a site-wide user preference.

You can indicate this by calling the `add_user_preference()` method on the *collection*.

Any plugin providing user preferences must also implement the `\core_privacy\local\request\user_preference_provider`.

##### Example

```php title="admin/tool/usertours/classes/privacy/provider.php"
public static function get_metadata(collection $collection): collection {

    $collection->add_user_preference('tool_usertours_tour_completion_time',
        'privacy:metadata:preference:tool_usertours_tour_completion_time');

    return $collection;
}
```

```php title="admin/tool/usertours/lang/en/tool_usertours.php"
<?php

$string['privacy:metadata:tool_usertours_tour_completion_time'] = 'The time that a specific user tour was last completed by a user.';
```

#### Indicating that you export data to an external location

Many plugins will interact with external systems - for example cloud-based services. Often this external location is configurable within the plugin either at the site or the instance level.

As a plugin developer you will need to describe each *type* of target destination, alongside a list of each exported field which includes user data.
The *actual* destination does not need to be described as this can change based on configuration.

You can indicate this by calling the `add_external_location_link()` method on the collection.

##### Example

```php title="mod/lti/classes/privacy/provider.php"
public static function get_metadata(collection $collection): collection {
    $collection->add_external_location_link('lti_client', [
            'userid' => 'privacy:metadata:lti_client:userid',
            'fullname' => 'privacy:metadata:lti_client:fullname',
        ], 'privacy:metadata:lti_client');

    return $collection;
}
```

```php title="mod/lti/lang/en/lti.php"
<?php

$string['privacy:metadata:lti_client'] = 'In order to integrate with a remote LTI service, user data needs to be exchanged with that service.';
$string['privacy:metadata:lti_client:userid'] = 'The userid is sent from Moodle to allow you to access your data on the remote system.';
$string['privacy:metadata:lti_client:fullname'] = 'Your full name is sent to the remote system to allow a better user experience.';
```

### Providing a way to export user data

In order to export the user data that you store, you must implement the relevant request provider.

We have named these request providers because they are called in response to a specific request from a user to access their information, however they also deal with the removal of user data following it's expiry.

There are several different types of request provider, and you may need to implement several of these, depending on the type and nature of your plugin.

Broadly speaking plugins will fit into one of the following categories:

- Plugins which are a subplugin of another plugin. Examples include *assignsubmission*, *atto*, and *datafield*;
- Plugins which are typically called by a Moodle subsystem. Examples include *qtype*, and *profilefield*;
- All other plugins which store data.

Most plugins will fit into this final category, whilst other plugins may fall into several categories.
Plugins which *define* a subplugin will also be responsible for  collecting this data from their subplugins.

A final category exists - plugins which store user preferences. In some cases this may be the *only* provider implemented.

#### Standard plugins which store data

A majority of Moodle plugins will fit into this category and will be required to implement the `\core_privacy\local\request\plugin\provider` interface. This interface requires that you define four functions (the first two of which are dealt with in this section):

- `get_contexts_for_userid` - to explain where data is held within Moodle for your plugin; and
- `export_user_data` - to export a user's personal data from your plugin.
- `delete_data_for_all_users_in_context` - to delete all data for all users in the specified context.
- `delete_data_for_user` - to delete all user data for the specified user, in the specified contexts.

These APIs make use of the Moodle *context* system to hierarchically store this data.

In addition to these requirements, since Moodle 3.4.6, 3.5.3, any plugin which implements the plugin provider interface must also implement the `\core_privacy\local\request\core_userlist_provider` provider and implement functions:

- `get_users_in_context` - to locate the users who hold any personal data in a specific context; and
- `delete_data_for_users` - to delete data for multiple users in the specified context.

A polyfill has not been provided for this new interface, but we recognise that developers who are maintaining older versions (Moodle 3.3) will hit problems with this new interface not existing. We recommend doing something similar to the following example.

```php
<?php

namespace assignsubmission_example\privacy;

if (interface_exists('\core_privacy\local\request\userlist')) {
    interface my_userlist extends \core_privacy\local\request\userlist{}
} else {
    interface my_userlist {};
}


class provider implements my_userlist {

    /**
     * Get the list of users who have data within a context.
     *
     * @param   userlist    $userlist   The userlist containing the list of users who have data in this context/plugin combination.
     */
    public static function get_users_in_context(userlist $userlist) {

    }

    /**
     * Delete multiple users within a single context.
     *
     * @param   approved_userlist       $userlist The approved context and user information to delete information for.
     */
    public static function delete_data_for_users(approved_userlist $userlist) {

    }

}
```

##### Retrieving the list of contexts

You are required to return the list of contexts for which the plugin stores data about the user. These are the standard Moodle contexts - CONTEXT_COURSE, CONTEXT_USER, CONTEXT_MODULE and so on. In many cases the link between the module type and the context is self-evident (e.g. activity modules). In some cases it may be less so. For example, an enrolment plugin (that stores user data, which most don't) would link to course context (users enrol in courses). Other types of plugins may be less obvious but you need to pick something. One way might to consider what context you would use when checking role capabilities. Consider that this will be used to structure the exported data and define what data is deleted when a context is expired.

Contexts are retrieved using the `get_contexts_for_userid` function which takes the ID of the user being fetched, and returns a list of contexts in which the user has any data.

```php title="mod/forum/classes/privacy/provider.php"
/**
 * Get the list of contexts that contain user information for the specified user.
 *
 * @param   int           $userid       The user to search.
 * @return  contextlist   $contextlist  The list of contexts used in this plugin.
 */
public static function get_contexts_for_userid(int $userid): contextlist {}
```

The function returns a `\core_privacy\local\request\contextlist` which is used to keep a set of contexts together in a fixed fashion.

Because a Subject Access Request covers *every* piece of data that is held for a user within Moodle, efficiency and performance is highly important. As a result, contexts are added to the *contextlist* by defining one or more SQL queries which return just the contextid. Multiple SQL queries can be added as required.

Many plugins will interact with specific subsystems and store data within them.
These subsystems will also provide a way in which to link the data that you have stored with your own database tables.
At present these are still a work in progress and only the *core_ratings* subsystem includes this.

###### Basic example

The following example simply fetches the contextid for all forums where a user has a single discussion (note: this is an incomplete example):

```php title="mod/forum/classes/privacy/provider.php"
/**
 * Get the list of contexts that contain user information for the specified user.
 *
 * @param   int           $userid       The user to search.
 * @return  contextlist   $contextlist  The list of contexts used in this plugin.
 */
public static function get_contexts_for_userid(int $userid): contextlist {
    $contextlist = new \core_privacy\local\request\contextlist();

    $sql = "SELECT c.id
                FROM {context} c
        INNER JOIN {course_modules} cm ON cm.id = c.instanceid AND c.contextlevel = :contextlevel
        INNER JOIN {modules} m ON m.id = cm.module AND m.name = :modname
        INNER JOIN {forum} f ON f.id = cm.instance
        LEFT JOIN {forum_discussions} d ON d.forum = f.id
            WHERE (
            d.userid        = :discussionuserid
            )
    ";

    $params = [
        'modname'           => 'forum',
        'contextlevel'      => CONTEXT_MODULE,
        'discussionuserid'  => $userid,
    ];

    $contextlist->add_from_sql($sql, $params);

    return $contextlist;
}
```

###### More complete example

The following example includes a link to core_rating.
It will find any forum, forum discussion, or forum post where the user has any data, including:

- Per-forum digest preferences;
- Per-forum subscription preferences;
- Per-forum read tracking preferences;
- Per-discussion subscription preferences;
- Per-post read data (if a user has read a post or not); and
- Per-post rating data.

In the case of the rating data, this will include any post where the user has rated the post of another user.

```php title="mod/forum/classes/privacy/provider.php"
/**
 * Get the list of contexts that contain user information for the specified user.
 *
 * @param   int           $userid       The user to search.
 * @return  contextlist   $contextlist  The list of contexts used in this plugin.
 */
public static function get_contexts_for_userid(int $userid): contextlist {
    $ratingsql = \core_rating\privacy\provider::get_sql_join('rat', 'mod_forum', 'post', 'p.id', $userid);
    // Fetch all forum discussions, and forum posts.
    $sql = "SELECT c.id
                FROM {context} c
        INNER JOIN {course_modules} cm ON cm.id = c.instanceid AND c.contextlevel = :contextlevel
        INNER JOIN {modules} m ON m.id = cm.module AND m.name = :modname
        INNER JOIN {forum} f ON f.id = cm.instance
            LEFT JOIN {forum_discussions} d ON d.forum = f.id
            LEFT JOIN {forum_posts} p ON p.discussion = d.id
            LEFT JOIN {forum_digests} dig ON dig.forum = f.id
            LEFT JOIN {forum_subscriptions} sub ON sub.forum = f.id
            LEFT JOIN {forum_track_prefs} pref ON pref.forumid = f.id
            LEFT JOIN {forum_read} hasread ON hasread.forumid = f.id
            LEFT JOIN {forum_discussion_subs} dsub ON dsub.forum = f.id
            {$ratingsql->join}
                WHERE (
                p.userid        = :postuserid OR
                d.userid        = :discussionuserid OR
                dig.userid      = :digestuserid OR
                sub.userid      = :subuserid OR
                pref.userid     = :prefuserid OR
                hasread.userid  = :hasreaduserid OR
                dsub.userid     = :dsubuserid OR
                {$ratingsql->userwhere}
            )
    ";

    $params = [
        'modname'           => 'forum',
        'contextlevel'      => CONTEXT_MODULE,
        'postuserid'        => $userid,
        'discussionuserid'  => $userid,
        'digestuserid'      => $userid,
        'subuserid'         => $userid,
        'prefuserid'        => $userid,
        'hasreaduserid'     => $userid,
        'dsubuserid'        => $userid,
    ];
    $params += $ratingsql->params;

    $contextlist = new \core_privacy\local\request\contextlist();
    $contextlist->add_from_sql($sql, $params);

    return $contextlist;


}
```

##### Retrieving the users in a context

You are required to return the list of users holding personal data in a context for which the plugin stores data about the user. This should only be data from that one context. Do not include subcontexts.
This method is very similar to the `get_contexts_for_userid` function but has some important distinctions:

- It takes a `userlist` as an argument and does not require that you, as a developer, create it yourself;
- There is no need to return any value; and
- The argument for the `userlist::add_from_sql` are different to those for `contextlist::add_from_sql` (this is because we learnt some important lessons after the initial implementation).

```php
/**
 * Get the list of users who have data within a context.
 *
 * @param userlist $userlist The userlist containing the list of users who have data in this context/plugin combination.
 */
public static function get_users_in_context(userlist $userlist) {}
```

###### Basic example

The following example simply fetches the userid for all users in a given forum context, who created a discussion or a post in that forum (note: this is an incomplete example):

```php title="mod/forum/classes/privacy/provider.php"
/**
 * Get the list of users who have data within a context.
 *
 * @param userlist $userlist The userlist containing the list of users who have data in this context/plugin combination.
 */
public static function get_users_in_context(userlist $userlist) {

    $context = $userlist->get_context();

    if (!$context instanceof \context_module) {
        return;
    }

    $params = [
        'instanceid'    => $context->instanceid,
        'modulename'    => 'forum',
    ];

    // Discussion authors.
    $sql = "SELECT d.userid
              FROM {course_modules} cm
              JOIN {modules} m ON m.id = cm.module AND m.name = :modulename
              JOIN {forum} f ON f.id = cm.instance
              JOIN {forum_discussions} d ON d.forum = f.id
             WHERE cm.id = :instanceid";
    $userlist->add_from_sql('userid', $sql, $params);

     // Forum authors.
    $sql = "SELECT p.userid
              FROM {course_modules} cm
              JOIN {modules} m ON m.id = cm.module AND m.name = :modulename
              JOIN {forum} f ON f.id = cm.instance
              JOIN {forum_discussions} d ON d.forum = f.id
              JOIN {forum_posts} p ON d.id = p.discussion
             WHERE cm.id = :instanceid";
    $userlist->add_from_sql('userid', $sql, $params);

    // ...
}
```

##### Exporting user data

After determining where in Moodle your plugin holds data about a user, the `\core_privacy\manager` will then ask your plugin to export all user data for a subset of those locations.

This is achieved through use of the `export_user_data` function which takes the list of approved contexts in a `\core_privacy\local\request\approved_contextlist` object.

```php title="mod/forum/classes/privacy/provider.php"
/**
 * Export all user data for the specified user, in the specified contexts, using the supplied exporter instance.
 *
 * @param   approved_contextlist    $contextlist    The approved contexts to export information for.
 */
public static function export_user_data(approved_contextlist $contextlist) {}
```

The `approved_contextlist` includes both the user record, and a list of contexts, which can be retrieved by either processing it as an Iterator, or by calling `get_contextids()` or `get_contexts()` as required.

Data is exported using a `\core_privacy\local\request\content_writer`, which is described in further detail below.

#### Plugins which store user preferences

Many plugins store a variety of user preferences, and must therefore export them.

Since user preferences are a site-wide preference, these are exported separately to other user data.
In some cases the only data present is user preference data, whilst in others there is a combination of user-provided data, and user preferences.

Storing of user preferences is achieved through implementation of the `\core_privacy\local\request\user_preference_provider` interface which defines one required function -- `export_user_preferences`.

You need to provide a description of the value of the user preference. (This description is particularly useful in cases where the value might be, say, 3, but it actually means 'Alphabetical order'.) Most likely you can use an existing language string from your plugin.

##### Example

```php title="mod/forum/classes/privacy/provider.php"
/**
 * Export all user preferences for the plugin.
 *
 * @param   int         $userid The userid of the user whose data is to be exported.
 */
public static function export_user_preferences(int $userid) {
    $markasreadonnotification = get_user_preference('markasreadonnotification', null, $userid);
    if (null !== $markasreadonnotification) {
        switch ($markasreadonnotification) {
            case 0:
                $markasreadonnotificationdescription = get_string('markasreadonnotificationno', 'mod_forum');
                break;
            case 1:
            default:
                $markasreadonnotificationdescription = get_string('markasreadonnotificationyes', 'mod_forum');
                break;
        }
        writer::export_user_preference('mod_forum', 'markasreadonnotification', $markasreadonnotification, $markasreadonnotificationdescription);
    }
}
```

#### Plugins which can have own subplugins

Many plugin types are also able to define their own subplugins and will need to define a contract between themselves and their subplugins in order to fetch their data.

This is required as the parent plugin and the child subplugin should be separate entities and the parent plugin must be able to function if one or more of its subplugins are uninstalled.

The parent plugin is responsible for defining the contract,  and for interacting with its subplugins, though we intend to create helpers to make this easier.

The parent plugin should define a new interface for each type of subplugin that it defines. This interface should extend the `\core_privacy\local\request\plugin\subplugin_provider` interface.

##### When a parent plugin should and should not provide the interface for its subplugins

There can be cases when there is no point for a plugin to provide the "subplugin_provider" based interface, even if it has own subplugins. See the Atto or TinyMCE editors as real examples.

If the parent plugin has no data passed through to the subplugins, there is no benefit in defining a subplugin provider. For example, Atto subplugins are just used to enhance the functionality and they never receive anything like a context. Most of the time we need to define a subplugin provider, but in cases where there is no data passed from the plugin to its subplugins, there is no need to define the subplugin provider. If the subplugins still do store personal data that are not related to the parent plugin in any way, then subplugins should define their own standard provider.

Compare with something like mod_assign where the subplugins store data for the parent and that data is contextually relevant to the parent plugin. In those cases the subplugin stores data for the plugin and it only makes sense to do so in the context of its parent plugin.

##### Example

The following example defines the contract that assign submission subplugins may be required to implement.

The assignment module is responsible for returning the contexts of all assignments where a user has data, but in some cases it is unaware of all of those cases - for example if a Teacher comments on a student submission it may not be aware of these as the information about this interaction may not be stored within its own tables.

```php title="mod/assign/privacy/assignsubmission_provider.php"
<?php
// …

namespace mod_assign\privacy;
use \core_privacy\local\metadata\collection;


interface assignsubmission_provider extends
    // This Interface defines a subplugin.
    \core_privacy\local\request\plugin\subplugin_provider {

    /**
     * Get the SQL required to find all submission items where this user has had any involvements.
     *
     * @param   int           $userid       The user to search.
     * @return  \stdClass                   Object containing the join, params, and where used to select a these records from the database.
     */
    public static function get_items_with_user_interaction(int $userid): \stdClass ;

    /**
     * Export all relevant user submissions information which match the combination of userid and attemptid.
     *
     * @param   int           $userid       The user to search.
     * @param   \context      $context      The context to export this submission against.
     * @param   array         $subcontext   The subcontext within the context to export this information
     * @param   int           $attid        The id of the submission to export.
     */
    public static function export_user_submissions(int $userid, \context $context, array $subcontext, int $attid) ;

}
```

#### Plugins which are subplugins to another plugin

If you are developing a sub-plugin of another plugin, then you will have to look at the relevant plugin in order to determine the exact contract.

Each subplugin type should define a new interface which extends the `\core_privacy\local\request\plugin\subplugin_provider` interface and it is up to the parent plugin to define how they will interact with their children.

The principles remain the same, but the exact implementation will differ depending upon requirements.

```php title="mod/pluginname/classes/privacy/provider.php"
<?php
// …
namespace assignsubmission\onlinetext;

class provider implements
    // This plugin does store personal user data.
    \core_privacy\local\metadata\provider,

    // This plugin is a subplugin of assign and must meet that contract.
    \mod_assign\privacy\assignsubmission_provider {
}
```

#### Plugins which are typically called by a Moodle subsystem

There are a number of plugintypes in Moodle which are typically called by a specific Moodle subsystem.

Some of these are *only* called by that subsystem, for example plugins which are of the *plagiarism* plugintype should never be called directly, but are always invoked via the *core_plagiarism* subsystem.

Conversely, there maybe other plugintypes which can be called both via a subsystem, and in some other fashion. We are still determining whether any plugintypes currently fit this pattern.

If you are developing a plugin which belongs to a specific subsystem, then you will have to look at the relevant plugin in order to determine the exact contract.

Each subsystem will define a new interface which extends the `\core_privacy\local\request\plugin\subsystem_provider` interface and it is up to that subsystem to define how they will interact with those plugins.

The principles remain the same, but the exact implementation will differ depending upon requirements.

```php title="plagiarism/detectorator/classes/privacy/provider.php"
<?php
// …
namespace plagiarism_detectorator\privacy;

class provider implements
    // This plugin does export personal user data.
    \core_privacy\local\metadata\provider,

    // This plugin is always linked against another activity module via the Plagiarism API.
    \core_plagiarism\privacy\plugin_provider {
}
```

#### Exporting data

Any plugin which stores data must also export it.

To cater for this the privacy API includes a `\core_privacy\local\request\content_writer`, which defines a set of functions to store different types of data.

Broadly speaking data is broken into the following types:

- Data - this is the object being described. For example the post content in a forum post;
- Related data - this is data related to the object being stored. For example, ratings of a forum post;
- Metadata - This is metadata about the main object. For example whether you are subscribed to a forum discussion;
- User preferences - this is data about a site-wide preference;
- Files - Any files that you are stored within Moodle on behalf of this plugin; and
- Custom files - For custom file formats - e.g. a calendar feed for calendar data. These should be used sparingly.

Each piece of data is stored against a specific Moodle *context*, which will define how the data is structured within the exporter.
Data, and Related data only accept the *stdClass* object, whilst metadata should be stored as a set of key/value pairs which include a description.

In some cases the data being stored belongs within an implicit structure. For example, one forum has many forum discussions, which each have a number of forum posts. This structure is represented by an *array* referred to as a *subcontext*.

The *content_writer* must *always* be called with a specific context, and can be called as follows:

```php title="mod/forum/classes/privacy/provider.php"
<?php
// …
use \core_privacy\local\request\writer;

writer::with_context($context)
    ->export_data($subcontext, $post)
    ->export_area_files($subcontext, 'mod_forum', 'post', $post->id)
    ->export_metadata($subcontext, 'postread', (object) ['firstread' => $firstread], new \lang_string('privacy:export:post:postread'));
```

Any text field which supports Moodle files must also be rewritten:

```php title="mod/forum/classes/privacy/provider.php"
<?php
// …
use \core_privacy\local\request\writer;

$post->message = writer::with_context($context)
    ->rewrite_pluginfile_urls($subcontext, 'mod_forum', 'post', $post->id, $post->message);

```

### Providing a way to delete user data

Deleting user data is also implemented in the request interface. There are two methods that need to be created. The first one to remove all user data from a context, the other to remove user data for a specific user in a list of contexts.

#### Delete for a context

A context is given and all user data (for all users) is to be deleted from the plugin. This will be called when the retention period for the context has expired to adhere to the privacy by design requirement. Retention periods are set in the Data registry.

Note that this will be called for **any** context being expired, not only those the plugin holds data for (as returned by get_contexts_for_userid()), so you must carefully check the contexts given.

When expiring content for a high-level context such as a course context, the function will be called not only with the course context but also with each context within the course: each module context, each block context, etc. At each level you should only expire data specifically related to that exact context. For a module plugin, this generally means you should only take action for CONTEXT_MODULE contexts and only if they relate to an instance of your module, as shown in the following example. (In the rare case where your module also stores user data related to the course, and not just for a module instance, then you do need to implement CONTEXT_COURSE level contexts to expire that course-level data.)

```php
/**
 * Delete all personal data for all users in the specified context.
 *
 * @param context $context Context to delete data from.
 */
public static function delete_data_for_all_users_in_context(\context $context) {
    global $DB;

    if ($context->contextlevel != CONTEXT_MODULE) {
        return;
    }

    $cm = get_coursemodule_from_id('choice', $context->instanceid);
    if (!$cm) {
        return;
    }

    $DB->delete_records('choice_answers', ['choiceid' => $cm->instance]);
}
```

#### Delete personal information for a specific user and context(s)

An *approved_contextlist* is given and user data related to that user should either be completely deleted, or overwritten if a structure needs to be maintained. This will be called when a user has requested the right to be forgotten. All attempts should be made to delete this data where practical while still allowing the plugin to be used by other users.

```php title="mod/choice/classes/privacy/provider.php"
public static function delete_data_for_user(approved_contextlist $contextlist) {
    global $DB;

    if (empty($contextlist->count())) {
        return;
    }
    $userid = $contextlist->get_user()->id;
    foreach ($contextlist->get_contexts() as $context) {
        $instanceid = $DB->get_field('course_modules', 'instance', ['id' => $context->instanceid], MUST_EXIST);
        $DB->delete_records('choice_answers', ['choiceid' => $instanceid, 'userid' => $userid]);
    }
}
```

#### Delete personal information for several users in a specific context

An *approved_userlist* is given and user data related to all users in the specified context should either be completely deleted, or overwritten if a structure needs to be maintained. This will be called when a user has requested the right to be forgotten when per-role overrides exist, or when performing a per-role expiry of a context. All attempts should be made to delete this data where practical while still allowing the plugin to be used by other users.

```php title="mod/chat/classes/privacy/provider.php"
/**
 * Delete multiple users within a single context.
 *
 * @param approved_userlist $userlist The approved context and user information to delete information for.
 */
public static function delete_data_for_users(approved_userlist $userlist) {
    global $DB;

    $context = $userlist->get_context();
    $cm = $DB->get_record('course_modules', ['id' => $context->instanceid]);
    $chat = $DB->get_record('chat', ['id' => $cm->instance]);

    list($userinsql, $userinparams) = $DB->get_in_or_equal($userlist->get_userids(), SQL_PARAMS_NAMED);
    $params = array_merge(['chatid' => $chat->id], $userinparams);
    $sql = "chatid = :chatid AND userid {$userinsql}";

    $DB->delete_records_select('chat_messages', $sql, $params);
    $DB->delete_records_select('chat_messages_current', $sql, $params);
    $DB->delete_records_select('chat_users', $sql, $params);
}
```

## Difference between Moodle 3.3 and more recent versions

Moodle 3.3 has a minimum requirement of php 5.6 and so type hinting and return type declarations are not supported in this version.
Consequently the privacy API for this version does not have these features.

## Common Questions

### What to do if you have one plugin that supports multiple branches

This is something that we have considered and we have put in place a polyfill. This gets around the restrictions of one version having type hinting and return type declarations while another does not.

#### Example

To use the polyfill include the legacy polyfill trait and create the necessary static methods but with an underscore (shown below).

```php
class provider implements
    \core_privacy\local\metadata\provider,
    \core_privacy\local\request\plugin\provider {

    // This trait must be included.
    use \core_privacy\local\legacy_polyfill;

    // The required methods must be in this format starting with an underscore.
    public static function _get_metadata(collection $collection) {
        // Code for returning metadata goes here.
    }
```

### What to do if your plugin must implement a subplugin or subsystem plugin provider

For subplugins (e.g. assignsubmission, assignfeedback, quiz report, quiz access rules), or subsystems which have a plugintype relationship (portfolio, plagiarism, and others), they will also define their own legacy polyfill.

In this instance you will need to include the trait for both the core polyfill, and the provider polyfill as appropriate.

#### Example

```php
class provider implements
    // This plugin has data and must therefore define the metadata provider in order to describe it.
    \core_privacy\local\metadata\provider,

    // This is a plagiarism plugin. It interacts with the plagiarism subsystem rather than with core.
    \core_plagiarism\privacy\plagiarism_provider {

    // This trait must be included to provide the relevant polyfill for the metadata provider.
    use \core_privacy\local\legacy_polyfill;

    // This trait must be included to provide the relevant polyfill for the plagirism provider.
    use \core_plagiarism\privacy\plagiarism_provider\legacy_polyfill;

    // The required methods must be in this format starting with an underscore.
    public static function _get_metadata(collection $collection) {
        // Code for returning metadata goes here.
    }

    // This is one of the polyfilled methods from the plagiarism provider.
    public static function _export_plagiarism_user_data($userid, \context $context, array $subcontext, array $linkarray) {
        // ...
    }
```

### What to do with missing userlist interfaces in legacy versions

Interface core_userlist_provider does not exists is releases of Moodle pre 3.5.3, pre 3.4.6 and 3.3.*. If you want one plugin branch to support multiple Moodle branches, try next solution (proposed in https://moodle.org/mod/forum/discuss.php?d=379580#p1530295)

#### Example

```php
namespace plugin_example\privacy;

if (interface_exists('\core_privacy\local\request\core_userlist_provider')) {
    // Name can be same, as it is in other namespace
    interface core_userlist_provider extends \core_privacy\local\request\core_userlist_provider {}
} else {
    interface core_userlist_provider {}
}

class provider implements core_userlist_provider {
```

## Tips for development

- While implementing the privacy API into your plugin, there are CLI scripts that can help you to test things on the fly. Just don't forget these are not supposed to replace proper unit tests. See [Privacy API/Utilities](./utils.md) for details.
- Inherit Unit tests from the `core_privacy\tests\provider_testcase</syntaxhighlight>, not <syntaxhighlight lang="php">advanced_testcase`. Advanced test case doesn't reset the Privacy content_writer between tests!

## See also

- [Subject Access Request FAQ](./faq.md)
- [GDPR](https://docs.moodle.org/en/GDPR) in the user documentation
- [Privacy API/Utilities](./utils.md) provides CLI scripts that are helpful during development
