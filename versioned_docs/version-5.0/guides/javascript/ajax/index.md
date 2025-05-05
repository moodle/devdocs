---
title: AJAX
tags:
  - Javascript
  - AJAX
---

The preferred way to write new ajax interactions in Moodle is to use the JavaScript module `core/ajax` which directly calls web service functions built using the Moodle Web Service API.

Some benefits of this system are:

1. No new ajax scripts need auditing for security vulnerabilities
1. Multiple requests can be chained in a single http request
1. Strict type checking for all parameters and return types
1. New webservice functions benefit Ajax interfaces and web service clients

The steps required to create an ajax interaction are:

1. Write or find an existing web service function to handle the ajax interaction: See [Web services](https://docs.moodle.org/dev/_Web_services_)
1. Mark the service as available for ajax. To do this, you can define `'ajax' => true` in the function's definition, in `db/services.php`. Only functions that are marked for AJAX using this mechanism will be available to the ajax script.
1. Call the web service from JavaScript in response to a user action.

### Common design patterns

In modern JavaScript in Moodle, it is common to place all code which uses the `core/ajax` module into a single `repository.js` file, for example the following fictitious example may be placed into a new repository module for the Assignment plugin:

```js title="mod/assign/amd/src/repository.js"
import {call as fetchMany} from 'core/ajax';

export const submitGradingForm = (
    assignmentid,
    userid,
    data,
) => fetchMany([{
    methodname: 'mod_assign_submit_grading_form',
    args: {
        assignmentid,
        userid,
        jsonformdata: JSON.stringify(data),
    },
}])[0];
```

It may then be called in code as follows:

```js title="mod/assign/amd/src/example.js"
import {submitGradingForm} from './repository';

export const doSomething = async() => {
    // ...
    const assignmentId = getAssigmentId();
    const getUserId = getUserId();
    const data = getData();

    const response = await submitGradingForm(assignmentId, userId, data);
    window.console.log(response);
}
```

Placing all AJAX interactions into a single module has a number of benefits:

- it becomes easier to refactor code in the future
- it is easier to identify which calls may be chained
- it is easier to find places which call web services to aid in debugging and development
- each individual web service call can has a meaningful response

### Chained calls

It is also possible to make multiple web service calls from a single transaction, for example:

```js title="mod/assign/amd/src/example.js"
import {call as fetchMany} from 'core/ajax';

const getGradingFormRequest = (assignmentid, userid, data) => ({
    methodname: 'mod_assign_submit_grading_form',
    args: {
        assignmentid,
        userid,
        jsonformdata: JSON.stringify(data),
    },
});

const getNextGraderRequest = (assignmentid, userid) => ({
    methodname: 'mod_assign_get_grading_form',
    args: {
        assignmentid,
        userid,
    },
});

export const submitGradingFormAndFetchNext = (
    assignmentId,
    currentUserId,
    currentUserData,
    nextUserId
) => {
    const responses = fetchMany([
        getGradingFormRequest(assignmentId, usecurrentUserIdrId, currentUserData),
        getNextGraderRequest(assignmentId, nextUserId),
    ]);

    return {
        submittedGradingForm: responses[0],
        nextGradingForm: responses[1],
    };
};
```

The above example may then be called more meaningfully as:

```js title="mod/assign/example.js"
import {submitGradingFormAndFetchNext} from './repository';

export const doSomething = async() => {
    // ...
    const assignmentId = getAssigmentId();
    const getUserId = getUserId();
    const data = getData();

    const {
        submittedGradingForm,
        nextGradingForm,
    } = submitGradingFormAndFetchNext(assignmentId, userId, data, getNextuserId);
    window.console.log(await submittedGradingForm);
    window.console.log(await nextGradingForm);
}
```

### Key considerations

To update parts of the UI in response to Ajax changes, consider using [Templates](https://docs.moodle.org/dev/_Templates_)

Important considerations when using webservices with ajax calls:

1. Any call to `$PAGE->get_renderer()` requires the correct theme be set. If this is done in a webservice - it is likely that the theme needs to be a parameter to the webservice.
1. Text returned from a webservice must be properly filtered. This means it must go through `external_format_text` or `external_format_string` (since 3.0 - see [MDL-51213](https://tracker.moodle.org/browse/MDL-51213)) with the correct context.
1. The correct context for 2 is the most specific context relating to the thing being output - for example, for a user's profile description the context is the user context.
1. After adding any dynamic content to a page, Moodle's filters need to be notified via `M.core.event.FILTER_CONTENT_UPDATED`
1. After adding or changing any webservice definition in `db/services.php` - you must bump the version number for either the plugin or Moodle and run the upgrade. This will install the webservice in the DB tables so it can be found by ajax.

In some very rare cases - you can mark webservices as safe to call without a session. These should only be used for webservices that return 100% public information and do not consume many resources. A current example is `core_get_string`. To mark a webservice as safe to call without a session you need to do 2 things.

1. Add `'loginrequired' => false` to the service definition in `db/services.php`
1. Pass `false` as the 3rd argument to the ajax "call" method when calling the webservice.
The benefit to marking these safe webservice is that (a) they can be called from the login page before we have a session and (b) they will perform faster because they will bypass Moodle's session code when responding to the webservice call.

## See also

- [Templates](../../templates/index.md)
- [JavaScript Modules](../modules.md)
