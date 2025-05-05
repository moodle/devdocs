---
title: Tag API
tags:
- API
- Sub System
- Tag
- Tags
---

The Tag API allows you to assign labels to information in Moodle. This makes finding this information easier and also facilitates the grouping of similar information. The Tag API allows you to create, modify, delete and search tags in the Moodle system. The main tag related functions can be found in the `tag/classes/tag.php file`. For a thorough overview of all of the functions available for working with Tags please see methods in `core_tag_tag`, `core_tag_collection` and `core_tag_area classes`, however, the following examples should give you a general understanding of how to get started with tags.

## Tag API usage

When a user tags something a **tag instance** is created in the database linking the item to the actual **tag**. If the tag did not exist before it is created automatically. Do not confuse these two entities - deleting the tag instance does not normally delete tag, however deleting tag deletes all tag instances associated with it.

Developers define **tag areas** the areas that can be tagged, examples are:

- blog posts
- courses
- users (tags represent user interests)
- activity modules
- questions
- wiki pages

Each tag area is identified by two attributes - component and itemtype. *Itemtype must be a name of a table in the database.* Component is the core component or plugin responsible for the tagging. This way the same DB table (for example 'user' or 'course') may be independently tagged by several components. Administrator or manager is able to manage the tag areas, collections and tags inside them on the [Managing tags](https://docs.moodle.org/en/Managing_tags) page. Users are able to search tags and view all items tagged with them that they have access to.

### Defining a tag area

First, developer must define the tag areas in the file **db/tag.php**. This will usually look like:

```php
$tagareas = [
    [
        // The name of the database table (without prefix).
        'itemtype' => 'wiki_pages',
        // The full frankenstyle name of the plugin.
        // Note: This can be omitted for plugins.
        'component' => 'mod_wiki',
        'callback' => 'mod_wiki_get_tagged_pages',
        'callbackfile' => '/mod/wiki/locallib.php',
    ],
];
```

You will also need to add language string, for the example above it will be `$string['tagarea_wiki_pages'] = 'Wiki pages';`

:::note
There are more options such as specifying the default value for "Standard tags", having a fixed collection or excluding from search. They can be found in comments in [Core library tag.php](../../commonfiles/tag.php/index.md)
:::

:::important
After making changes to `db/tag.php`, you must bump the plugin version in **version.php** and perform a Moodle upgrade.
:::

### Adding tags element to the editing form

After the tag area is defined it should appear on the "Manage tags" page. Now it is time to allow users to add/change tags when editing the item. Here is an example from Wiki module:

1. Add a 'tags' form element to the editing form:

 ```php
 $mform->addElement(
     'tags',
     'tags',
     get_string('tags'),
     [
         'itemtype' => 'wiki_pages',
         'component' => 'mod_wiki',
     ]
 );
 ```

 This element will automatically check if the tag area is disabled by the manager and will not display anything in this case. However if you want to add a header you need to check if tag area is enabled add this:

 ```php
 if (core_tag_tag::is_enabled('mod_wiki', 'wiki_pages')) {
     $mform->addElement('header', 'tagshdr', get_string('tags', 'tag'));
 }
 ```

 Given the above you can move to the next step.

1. Save the form data

 ```php
 if ($data = $form->get_data()) {
    // Do some other processing here,
    // if this is a new page (item) you need to insert it in the DB and obtain id.
    // $pageid = $data->id;
    core_tag_tag::set_item_tags(
        'mod_wiki',
        'wiki_pages',
        $pageid,
        $modulecontext,
        $data->tags
    );
 }
 ```

 It is important to specify the correct context in this function. Note that `$data->tags` will always be returned by the form, even if the area is disabled, however, `core_tag_tag::set_item_tags()` will not change or reset tags if the tag area is disabled.

1. Populate the form with existing tags before calling $form->set_data($data):

 ```php
 $data = $DB->get_record('wiki_pages', ['id' => $this->page->id]); // Well, it's more complicated than that of course....
 $data->tags = core_tag_tag::get_item_tags_array('mod_wiki', 'wiki_pages', $this->page->id);
 $form->set_data($data);
 ```

:::tip

Always test the code with tag area enabled and disabled.

:::

### Displaying tags next to the item

Example of displaying of the tags are user interests on the user profile page. User can see the list of interests, each of them is a link that leads to the page that shows all items tagged with this tag.

Here is the code used by Wiki module to display tags the page is tagged with:

```php
echo $OUTPUT->tag_list(
    core_tag_tag::get_item_tags(
        'mod_wiki',
        'wiki_pages',
        $page->id
    ),
    null,
    'wiki-tags'
);
```

:::important
To prevent an performance regression, Use `core_tag_tag::get_items_tags()` to fetch tags against multiple item ids.
:::

### Deleting and clearing tags

Cron will automatically remove tag instances that point to non existing items, however it is a good habit to delete tags when the record is deleted.

:::note
If you have created a course activity that uses tags you should also remember to delete the tags during a course reset by adding code to the reset course callbacks. First you want to add a checkbox that a user can check if they wish to delete the tags, then code that handles the case when the checkbox has been checked.
:::

#### Example

```php title="What does this example do, and why is it in the "Deleting and clearing tags" section?
/**
 * The elements to add the course reset form.
 *
 * @param moodleform $mform
 */
function book_reset_course_form_definition(&$mform) {
    $mform->addElement('header', 'bookheader', get_string('modulenameplural', 'book'));
    $mform->addElement('checkbox', 'reset_book_tags', get_string('removeallbooktags', 'book'));
}

/**
 * This function is used by the reset_course_userdata function in moodlelib.
 * @param $data the data submitted from the reset course.
 * @return array status array
 */
function book_reset_userdata($data) {
    global $DB;

    $status = [];

    if (!empty($data->reset_book_tags)) {
        // Loop through the books and remove the tags from the chapters.
        if ($books = $DB->get_records('book', ['course' => $data->courseid])) {
            foreach ($books as $book) {
                if (!$cm = get_coursemodule_from_instance('book', $book->id)) {
                    continue;
                }

                $context = context_module::instance($cm->id);
                core_tag_tag::delete_instances('mod_book', null, $context->id);
            }
        }

        $status[] = [
            'component' => get_string('modulenameplural', 'book'),
            'item' => get_string('tagsdeleted', 'book'),
            'error' => false
        ];
    }

    return $status;
}
```

The functions used to delete the tags are:

```php
// Removes all tag instances associated with an item.
core_tag_tag::remove_all_item_tags($component, $itemtype, $itemid, $tiuserid = 0);
 // Removes tag instances in bulk. Here $component is mandatory in this method,
 // either itemtype or contextid or neither or both can be specified.
core_tag_tag::delete_instances($component, $itemtype = null, $contextid = null);
```

### Backup and restore

When you tag contents inside the course the plugin has to hook into backup and restore and process necessary tags. This is especially important for the contents inside activity modules, such as wiki pages or forum posts. Questions in the course question bank also backup and restore their tags.

You can choose to backup and restore tags for each item individually (as it is done in mod_wiki) OR backup all tags in the context at once (as it is done in mod_glossary or mod_forum). Second option is preferable for performance reasons. Make sure to take into account `$userinfo` (whether user information is backed up / restored), for example wiki pages is not user information but glossary entries are, tags on them follow the same rule.

```php title="mod/glossary/backup_glossary_stepslib.php"
protected function define_structure() {
    // ...
    $tags = new backup_nested_element('entriestags');
    $tag = new backup_nested_element('tag', ['id'], ['itemid', 'rawname']);
    // ...
    // Note that parent node is the glossary, not glossary entry, however the individual entries are tagged.
    $glossary->add_child($tags);
    $tags->add_child($tag);
    // ...
    if ($userinfo && core_tag_tag::is_enabled('mod_glossary', 'glossary_entries')) {
        $tag->set_source_sql('SELECT t.id, ti.itemid, t.rawname
                                FROM {tag} t
                                JOIN {tag_instance} ti ON ti.tagid = t.id
                               WHERE ti.itemtype = ?
                                 AND ti.component = ?
                                 AND ti.contextid = ?', [
            backup_helper::is_sqlparam('glossary_entries'),
            backup_helper::is_sqlparam('mod_glossary'),
            backup::VAR_CONTEXTID]);
    }
    // ...
}
```

```php title="mod/glossary/restore_glossary_stepslib.php"
protected function define_structure() {
    // ...
    if ($userinfo) {
        $paths[] = new restore_path_element('glossary_entry_tag', '/activity/glossary/entriestags/tag');
    }
    // ...
}

protected function process_glossary_entry_tag($data) {
    $data = (object)$data;

    if (!core_tag_tag::is_enabled('mod_glossary', 'glossary_entries')) { // Tags disabled on this site, nothing to process.
        return;
    }

    $tag = $data->rawname;
    if (!$itemid = $this->get_mappingid('glossary_entry', $data->itemid)) {
        // Orphaned tag, we could not find the glossary entry for it - ignore.
        return;
    }

    $context = context_module::instance($this->task->get_moduleid());
    core_tag_tag::add_item_tag('mod_glossary', 'glossary_entries', $itemid, $context, $tag);
}
```

### Search callback

Given a user searches for any items tagged with a specified tag, only the items that the user has access to must be returned.

To limit the performance impact of checking user access against items the following class ``core_tag_index_builder()`` can assist with the retrieval and caching of records, especially within both course and activity modules.

```php
function mod_wiki_get_tagged_pages($tag, $exclusivemode = false, $fromctx = 0, $ctx = 0, $rec = 1, $page = 0) {
    // Find items.
    // Please refer to existing callbacks in core for examples.

    // ...

    // Use core_tag_index_builder to build and filter the list of items.
    // Notice how we search for 6 items when we need to display 5 - this way we will know that we need to display a link to the next page.
    $builder = new core_tag_index_builder('mod_wiki', 'wiki_pages', $query, $params, $page * $perpage, $perpage + 1);

    // ...

    $items = $builder->get_items();
    if (count($items) > $perpage) {
        // We don't need exact page count, just indicate that the next page exists.
        $totalpages = $page + 2;
        array_pop($items);
    }

    // Build the display contents.
    if ($items) {
        $tagfeed = new core_tag\output\tagfeed();
        foreach ($items as $item) {
            $tagfeed->add(...);
        }

        $content = $OUTPUT->render_from_template('core_tag/tagfeed', $tagfeed->export_for_template($OUTPUT));

        return new core_tag\output\tagindex($tag, 'mod_wiki', 'wiki_pages', $content,
                $exclusivemode, $fromctx, $ctx, $rec, $page, $totalpages);
    }
}
```

### User-specific tags

It is possible that each tagged item can be tagged by each user independently. Before Moodle 3.0 this was how courses were tagged however from 3.0 tagging courses became more standard. The functionality remains in the API (argument `$tiuser` to the tagging functions).  In this case both tag list and tag cloud will display all tag instances added by all users but each user will be able to edit only their own.

If developer chooses to implement it in the plugin, they need to also implement the UI when admin or other privileged user can remove or edit the instances of another user. Otherwise if teacher has tagged the course and later resigned there will be no way to change their tags. Also such tag instances need special treatment during backup and restore - they are now considered "user data" and user id mapping should be performed.

### Advanced usages

Custom plugins may go beyond the standard tags handling and use them without mixing with regular course/user/wiki/blogs tags, hide them from the "Tag search" page and "Tags" block but instead have their own interface to search/categorise using tags. This can be achieved by defining tag collection, make it not searchable and specify a custom URL to link to when the tag is actually displayed. This all can be defined in db/tag.php, see the comments in [Core library tag.php](../../commonfiles/tag.php/index.md)

- **tag_area::get_collection($component, $itemtype)** - will return you the collection that your tag area is in
- **tag_collection::get_tag_cloud()** - will return all tags in the collection. There are no API methods to get the tags used in the tag area - this is actually the purpose of tag collections.

## See also

- [Core APIs](../../../apis.md)
- [Core library tag.php](../../commonfiles/tag.php/index.md)
- [Tag API before 3.1](https://docs.moodle.org/dev/Tag_API_before_3.1)
- [Managing tags](https://docs.moodle.org/en/Managing_tags)
