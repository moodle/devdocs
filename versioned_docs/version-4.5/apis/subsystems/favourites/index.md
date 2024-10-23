---
title: Favourites API
tags:
  - API
  - core_favourites
---

## Overview

### What is a favourite?

The favourites API allows you to mark items as favourites for a given user. Marking an item as a favourite is akin to adding a web page to your browser favourites (or bookmarks), or marking someone in your contacts as a favourite. The API provides a means to create, read and delete favourite items, allowing any component to favourite arbitrary items as they see fit.

### What can be marked as a favourite?

Almost any 'item' can be marked as a favourite, provided it is something which can be identified by a unique integer id.

### Identifying items

In order to store a favourite, and be able to uniquely identify it for later retrieval, 4 fields are required. These are: **component**, **itemtype**, **itemid** and **contextid**. You will see these in a range of API calls.

The **itemid** is a unique integer identifier of the item itself. This might be a course id, or conversation id, or the id of any entity in Moodle. In fact, it does not have to be the id of a record from the database either; it can be any arbitrary id, so long as the component storing the item knows what it represents.

The two fields **component** and **itemtype** make up a pairing representing the *type* of each favourite. Within this pair, the **component** must be a valid [frankenstyle](/general/development/policies/codingstyle/frankenstyle) component name and is the name of the component wishing to set/unset the item as a favourite. The **itemtype** can be any identifying string, provided it is unique within the respective component. The type pairing allows us to distinguish between favourites of different types (from different areas of Moodle), which may have identical itemid values.

The **contextid** is the id of the context in which the item is being marked as a favourite. For example, a user's course might be marked as a favourite at the course context, whereas a user's conversation with another user might be marked as a favourite at the user context. It's also possible that items of a certain *type* (remember, this is the `{component, itemtype}` pairing) will be marked as favourites in different contexts, based on the context of the item itself. For example, consider the case in messaging, in which we have a group conversation (one which is linked to a course group), and an individual conversation between two users. Setting the group conversation as a favourite would require the course context to be used, whereas doing the same for the individual conversation would require a user context. Which contextid to use is a decision that must be made by the component creating the favourite.

## Using the API

### Getting a service object

Favourites relies on a service layer to provide functionality to consumers. Getting a service object is as simple as using the service factory methods.

Assuming you have a user context, you can get a service scoped to a single user with:

```php
$ufservice = \core_favourites\service_factory::get_service_for_user_context($usercontext);
```

The returned `$ufservice` is an object of type \core_favourites\local\service\user_favourite_service.

### Creating a favourite

Let's say we want to set a course as a favourite. Note: In core, this is done by using the favourite *type* {'core_course', 'courses'}.

The service provides the method:

```php
public function create_favourite(
    string $component,
    string $itemtype,
    int $itemid,
    \context $context,
    int $ordering = null
): favourite;
```

So, assuming we have the course id and course context, we can create our favourite with:

```php
$favourite = $ufservice->create_favourite('core_course', 'courses', $course->id, $coursecontext);
```

The returned $favourite is an object of type \core_favourites\local\entity\favourite.

### Reading favourites

There are several read actions supported by the service object.

```php
public function count_favourites_by_type(string $component, string $itemtype, \context $context = null) : int;
public function find_favourites_by_type(string $component, string $itemtype, int $limitfrom = 0, int $limitnum = 0) : array;
public function favourite_exists(string $component, string $itemtype, int $itemid, \context $context) : bool;
public function get_favourite(string $component, string $itemtype, int $itemid, \context $context) : favourite;
```

### Deleting a favourite

The service provides the method:

```php
public function delete_favourite(string $component, string $itemtype, int $itemid, \context $context);
```

So, assuming we have the course id and course context, we can remove the favourite with:

```php
$ufservice = \core_favourites\service_factory::get_service_for_user_context($usercontext);
$ufservice->delete_favourite('core_course', 'courses', $course->id, $coursecontext);
```

### Including favourites in external queries

Most of the time, you should ask the service to find favourite items for you. Sometimes, however, rather than fetching the favourites from the service, you'll just want to include the relevant information in those records from an existing query. You might want to do this if dealing with performance sensitive code where additional queries are undesirable.

The service lets you do this too, by providing the method:

```php
public function get_join_sql_by_type(string $component, string $itemtype, string $tablealias, string $joinitemid) : array;
```

which can be used in such cases.

For example, and for simplicity, let's say we have a query returning the ids and names of all courses within a given course category:

```php
$sql = "SELECT c.id, c.name
          FROM {course} c
         WHERE c.category = :category";
$params = ['category' => 3];

$courses = $DB->get_records_sql($sql, $params);
```

we can then modify this using the get_join_sql_by_type() result to include favourite information.

```php
$ufservice = \core_favourites\service_factory::get_service_for_user_context($usercontext);
list($favsql, $favparams) = $ufservice->get_join_sql_by_type('core_course', 'courses', 'favalias', 'c.id');

$sql = "SELECT c.id, c.name, favalias.id as favouriteid
          FROM {course} c
       $favsql
         WHERE c.category = :category";
$params = ['category' => 3] + $favparams;

$courses = $DB->get_records_sql($sql, $params);
```

We've now included id of the favourite in the results via a LEFT JOIN, so as to preserve the original set of records.

If you wish to select ONLY favourites, adding `"AND favouriteid IS NOT NULL"` to the query will achieve this.
