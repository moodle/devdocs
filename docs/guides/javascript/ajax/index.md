---
title: AJAX
tags:
  - Javascript
  - AJAX
---
**AJAX (Asynchronous JavaScript and XML)** is a modern web design technique that allows for more interactivity by making webpages that fetch data in the background and alter themselves without reloading the entire page. This helps to make a page feel much more like an application than a web page. AJAX is a new way of working with existing technologies (including HTML, [JavaScript](https://docs.moodle.org/dev/Javascript), [CSS](https://docs.moodle.org/dev/CSS) and the *XMLHttpRequest object* amongst others) rather than a new piece of technology in itself.

Although AJAX indicates that XML is used, the term really relates to the group of technologies and in Moodle we tend to favour use of JSON rather than XML as the syntax is lighter and leads to a smaller output. It is also easier to construct from php data structures.

## Ajax in Moodle

{{ Moodle 2.9 }}

The preferred way to write new ajax interactions in Moodle is to use the JavaScript module "core/ajax" which can directly call existing web service functions.   If you do not need to call web service functions, then the standard JQuery function can be used by $.ajax().

Some benefits of this system are:

1. No new ajax scripts need auditing for security vulnerabilities
1. Multiple requests can be chained in a single http request
1. Strict type checking for all parameters and return types
1. New webservice functions benefit Ajax interfaces and web service clients

So the steps required to create an ajax interaction are:

1. Write or find an existing web service function to handle the ajax interaction: See [Web services](https://docs.moodle.org/dev/_Web_services_)
1. White list the web service for ajax. To do this, you can define 'ajax' => true in your function's definition, in db/services.php. Only functions that are whitelisted using this mechanism will be available to the ajax script.
1. Call the web service from JavaScript in response to a user action:

Example calling core_get_string:

```javascript
require(['core/ajax'], function(ajax) {
    var promises = ajax.call([
        { methodname: 'core_get_string', args: { component: 'mod_wiki', stringid: 'pluginname' } },
        { methodname: 'core_get_string', args: { component: 'mod_wiki', stringid: 'changerate' } }
    ]);

   promises[0].done(function(response) {
       console.log('mod_wiki/pluginname is' + response);
   }).fail(function(ex) {
       // do something with the exception
   });

   promises[1].done(function(response) {
       console.log('mod_wiki/changerate is' + response);
   }).fail(function(ex) {
       // do something with the exception
   });
});
```

Note: This example chains two separate calls to the 'core_get_string' webservice in one http request

Note: Don't actually fetch strings like this, it is just an example, use the 'core/str' module instead.

If there is only a single action, a simpler form is possible (example from Assignment):

```php
        ajax.call([{
            methodname: 'mod_assign_submit_grading_form',
            args: {assignmentid: assignmentid, userid: this._lastUserId, jsonformdata: JSON.stringify(data)},
            done: this._handleFormSubmissionResponse.bind(this, data, nextUserId),
            fail: notification.exception
        }]);
```

('notifcation' comes from the 'core/notification' JavaScript module and provides a useful popup error message if the call fails)

To update parts of the UI in response to Ajax changes, consider using [Templates](https://docs.moodle.org/dev/_Templates_)

For information on writing AJAX scripts for Moodle before Moodle 2.9 see: [AJAX pre 2.9](https://docs.moodle.org/dev/_AJAX_pre_2.9_)

Watch a video about using templates with webservices and AJAX in Moodle: https://www.youtube.com/watch?v=UTePjRZqAg8

Tricky things to know about using webservices with ajax calls:

1. Any call to $PAGE->get_renderer() requires the correct theme be set. If this is done in a webservice - it is likely that the theme needs to be a parameter to the webservice.
1. Text returned from a webservice must be properly filtered. This means it must go through external_format_text or external_format_string (since 3.0 - see [MDL-51213](https://tracker.moodle.org/browse/MDL-51213)) with the correct context.
1. The correct context for 2 is the most specific context relating to the thing being output e.g. for a user's profile desciption the context is the user context.
1. After adding any dynamic content to a page, Moodle's filters need to be notified via M.core.event.FILTER_CONTENT_UPDATED ([MDL-51222](https://tracker.moodle.org/browse/MDL-51222) makes this easier)
1. After adding or changing any webservice definition in db/services.php - you must bump the version number for either the plugin or Moodle and run the upgrade. This will install the webservice in the DB tables so it can be found by ajax.

In some very rare cases - you can mark webservices as safe to call without a session. These should only be used for webservices that return 100% public information and do not consume many resources. A current example is core_get_string. To mark a webservice as safe to call without a session you need to do 2 things.

1. Add 'loginrequired' => false to the service definition in db/services.php
1. Pass "false" as the 3rd argument to the ajax "call" method when calling the webservice.
The benefit to marking these safe webservice is that (a) they can be called from the login page before we have a session and (b) they will perform faster because they will bypass moodles session code when responding to the webservice call.

## See also

- [AJAX pre 2.9](https://docs.moodle.org/dev/_AJAX_pre_2.9_)
- [Templates](../../templates/index.md)
- [JavaScript Modules](https://docs.moodle.org/dev/Javascript_Modules)
- [JavaScript FAQ](https://docs.moodle.org/dev/Javascript_FAQ)
- [JavaScript](https://docs.moodle.org/dev/Javascript)
- [Debugging AJAX with Firebug](https://docs.moodle.org/dev/Firebug#Debugging_AJAX_with_Firebug)

- [*Ajax: A New Approach to Web Applications*, the original Ajax article by Adaptive Path](https://adaptivepath.org/ideas/ajax-new-approach-web-applications) (This article is also preserved on the  [Internet Archive](https://web.archive.org/web/20070225140912/http://www.adaptivepath.com/publications/essays/archives/000385.php))
- [*AJAX: Getting Started* article on developer.mozilla.org](http://developer.mozilla.org/en/docs/AJAX:Getting_Started)
- [*10 places you must use AJAX* by Adam Bosworth](http://www.sourcelabs.com/blogs/ajb/2005/12/10_places_you_must_use_ajax.html) (This link is now dead, but the article is preserved on the [Internet Archive copy](https://web.archive.org/web/20060127015713/http://www.sourcelabs.com/blogs/ajb/2005/12/10_places_you_must_use_ajax.html))
- [*Considering Ajax, Part 1: Cut through the hype* from IBM developerworks](http://www-128.ibm.com/developerworks/web/library/wa-ajaxtop1/?ca=dgr-lnxw01AjaxHype) (Also a dead link... [Internet Archive copy](https://web.archive.org/web/20080602101238/http://www-128.ibm.com/developerworks/web/library/wa-ajaxtop1/?ca=dgr-lnxw01AjaxHype))
- [Wikipedia article on *AJAX*](http://en.wikipedia.org/wiki/Ajax_%28programming%29)
- [How to Make Your AJAX Applications Accessible: 40 Tutorials and Articles](http://www.maxkiesler.com/index.php/weblog/comments/how_to_make_your_ajax_applications_accessible/) (Also a dead link... [Internet Archive copy](https://web.archive.org/web/20090225094656/http://www.maxkiesler.com/index.php/weblog/comments/how_to_make_your_ajax_applications_accessible/))
- [AJAX loading icon generator](http://www.ajaxload.info/)
