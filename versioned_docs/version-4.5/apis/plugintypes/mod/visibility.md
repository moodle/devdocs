---
title: Module visibility and display
tags:
- API
- Module
- Activity
- mod
---

## Summary

A new API allows you to customise how your module displays on the main course page:

- You can display custom HTML below the link to your module.
- If your module does not have a link (like Label, where it is only for display on the main page) then you can remove the link from the main page and from all navigation etc.
- You can display HTML next to the link to your module that indicates dynamic information (like Forum, where it displays information about unread messages).
- You can display additional icons next to the other module editing icons when the user is editing the page.

In addition, existing things you could already do (like change the icon on the main page) are still available when using the new API.

The `get_fast_modinfo` function now returns specific classes which are documented and which you can use to obtain new information about modules.

## Backward compatibility

All modules and code written for Moodle 2.0 should continue to behave in exactly the same manner. There is no need to change existing modules for this API unless you want to use the new features.

## Removing your link

If your module should not appear in navigation and in other lists of modules to visit or get information for, like Label, the easiest way to remove that link is to return true for `FEATURE_NO_VIEW_LINK` in your module's `_supports` function.

## Customising module display, in cache

The first place you can customise your module display is in the existing `_get_coursemodule_info` API function. This function obtains information about the module which will be stored in the course cache (the `modinfo` field of the course table).

The course cache is only updated when somebody edits a module, so it can't be used for dynamic information - but it's okay if it takes a few database queries to calculate the data because it will be cached for future use.

The function should return a value of class `cached_cm_info`. For example:

```php
function mod_frog_get_coursemodule_info($cm) {
    $info = new cached_cm_info();
    $info->content = '<p>This will display below the module.</p>';
    return $info;
}
```

You can change several properties which are documented in that class definition. If you don't change a property, its value remains default.

- `name` - name of activity (text of the link on course page).
- `icon`, `iconcomponent` - name and component name of icon to display by the link.
- `content` - extra HTML content to display below the module link on course page (not shown in navigation etc).
- `customdata` - arbitrary extra PHP data to store in modinfo cache; useful if, for performance reasons, your module needs to store data that should be accessible very quickly from other parts of the course. Warning: Do not store complex objects here because when they are serialized (together with all other data) they may contain \0 byte and it causes fatal error on Postgres.
- `extraclasses` - extra CSS class or classes that will be added to the activity on the main page, so that you can alter the styling.
- `onclick` - already-escaped HTML that will be inserted as the value of the onclick attribute.

If you don't need the information to be cached (it can be retrieved very quickly without making any database queries) then you might consider using one of the functions below instead, in order to avoid unnecessarily increasing the size of the course cache. Although the headings mention the current user, you can of course use those functions in a way that doesn't depend on the current user.

Don't use renderers in this function (see MDL-41074). If you have data you would like to render onto the course page, put it into the custom data property and render it in the MODNAME_cm_info_view() function (see below). For an example, see mod_folder.

## Customising module display, for current user

You can customise module display dynamically (when the page loads). For example you might want to alter it based on the permissions of the current user.

```php
function mod_frog_cm_info_dynamic(cm_info $cm) {
    $context = get_context_instance(CONTEXT_MODULE, $cm->id);
    if (!has_capability('some/capability', $context)) {
        $cm->set_user_visible(false);
    }
}
```

This code can affect the navigation, and whether users are permitted to access the module (as above). It runs on all pages within the course, so it's very important that you do not put slow code in this function: it should not make any database queries.

In addition to the `set_user_visible` function shown, you can also set many other things such as additional editing icons which will appear if editing mode is enabled. See the cm_info class documentation for more information.

Most things are set using functions (as above; another example would be `set_content` which sets the same content data as mentioned in the previous section) while other things can be set directly using public variables.

## Customising module display, for current user, on course page only

Sometimes you need to display custom information for the current user that appears only on the course view page. For example, the forum module displays unread information on the view page. This information doesn't show on other pages (it isn't included in the navigation, for instance).

```php
function mod_frog_cm_info_view(cm_info $cm) {
    $cm->set_after_link('Last tadpole: 22:17');
}
```

Because this function only runs when looking at the course page:

- It is OK to do tasks which may require some database queries (such as checking for unread forum messages), although obviously this should be kept to a minimum. In particular, care should be taken so that if there are 20 instances of the activity on the course page, it doesn't make 20 separate queries to obtain the information.

- Inside this function you cannot set options which affect the appearance or access to the activity on other pages; for example, you cannot turn off the `uservisible` flag as shown in the previous example. This is because these options are required on other pages (e.g. to display navigation) so it does not make sense to set them only for the course page. If you try, you'll get a `coding_exception`.

## get_fast_modinfo data

The function `get_fast_modinfo` now returns an object of class course_modinfo, which itself contains cm_info objects about each activity. (These are entirely backward-compatible with the previous return value.)

In addition to the old methods for obtaining data from $modinfo, there are some new functions. For example, here is how to get a single cm_info from $modinfo:

```php
$modinfo = get_fast_modinfo($course);
$cm = $modinfo->get_cm($cmid);
```

The cm_info objects contain additional information that is not present in the course_modules database row, such as the module's name, and the icon and associated content mentioned above. In order to distinguish these from the plain database objects, you can specify the cm_info class in a function definition:

```php
function my_clever_function(cm_info $cm) {
    if (!$cm->uservisible) {
        // The module is not visible or available to current user,
        // so do something clever instead.
    }
}
```

By specifying cm_info in the parameter list, you'll cause PHP to give an error if anyone tries to call that function with a $cm object that just came from the database row, instead of from `get_fast_modinfo`. (It is good practice to always get $cm from get_fast_modinfo, but there might be exceptions.)

Of course, this is only necessary if your function relies on a feature that is specific to cm_info, such as the `uservisible` field above. If your function only uses fields which are present in the database row, then there's no need to require cm_info.

## More documentation

All three classes for this API are in the core file `lib/modinfolib.php` and contain complete PHPdoc information for all fields and functions.

- [`course_modinfo` PHPdocs](http://phpdocs.moodle.org/HEAD/core/lib/course_modinfo.html)
- [`cminfo` PHPdocs](http://phpdocs.moodle.org/HEAD/core/lib/cm_info.html)
- [`cached_cm_info` PHPdocs](http://phpdocs.moodle.org/HEAD/core/lib/cached_cm_info.html)
