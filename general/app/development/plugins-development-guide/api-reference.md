---
title: Moodle App Plugins API Reference
sidebar_label: API Reference
sidebar_position: 2
tags:
 - Moodle App
---

## Content responses

Methods defined in the `classes/output/mobile.php` class will be called through the `tool_mobile_get_content` Web Service, and should have the following structure in their response:

| Name               | Default     | Description |
|--------------------|-------------|-------------|
| `templates`        | -           | An array of templates used by the handler. <br /> <br /> For `method` responses, the first one will be used to render the page content and all of them will be available in JavaScript at `this.CONTENT_TEMPLATES`. <br /> <br /> For `init` responses, they will be available in JavaScript at `this.INIT_TEMPLATES`. <br /> <br /> You can learn more about this in [Rendering UI](./index.md#rendering-ui).|
| `templates[].id`   | Required    | ID of the template. |
| `templates[].html` | Required    | HTML code. This HTML will be rendered in the app, so you should use Ionic and custom app components rather than Bootstrap. |
| `javascript`       | -           | JavaScript code to execute immediately after the Web Service call returns. This may happen before the template is rendered in the DOM, if you need to make sure that it has been rendered you should put your code inside of a `setTimeout` callback. |
| `otherdata`        | -           | Object with arbitrary data to use in the template and JavaScript, supporting 2-way data-binding. <br /> <br /> For `method` responses, it will be available in JavaScript at `this.CONTENT_OTHERDATA`. <br /> <br /> For `init` responses, it will be available in JavaScript at `this.INIT_OTHERDATA`. <br /> <br /> Note that sending nested arrays will cause an error, you should serialize any complex values with `json_encode` (they'll still be available as proper arrays or objects in JavaScript). |
| `files`            | -           | A list of files that the app should be able to download (mostly for offline usage). |
| `restrict`         | -           | Object with conditions to restrict the handler depending on the context. <br /> <br /> This is only used in `init` responses. |
| `restrict.users`   | All users   | List of allowed user IDs. |
| `restrict.courses` | All courses | List of allowed course IDs. |
| `disabled`         | `false`     | Whether to disable the handler entirely. <br /> <br /> This is only used in `init` responses. |

### Functions

The JavaScript returned by content responses, as well as the JavaScript executed in Angular within templates, has access to the following functions:

- `openContent(...)`: Open a new page to display some new content. Takes the following arguments:
  - `title: string`: Title to display with the new content.
  - `args: Record<string, unknown>`: Arguments for the new content request.
  - `component?: string`: Component for the new content request. If not provided, the current component will be used.
  - `method?: string`: Method for the new content request. If not provided, the current method will be used.
  - `jsData?: Record<string, unknown> | boolean`: Variables to use in the JavaScript of the new content response. If true is supplied instead of an object, all initial variables from current page will be used.
  - `preSets?: CoreSiteWSPreSets`: Presets for the Web Service call of the new content request.
  - `ptrEnabled?: boolean`: Whether PTR (pull-to-refresh) should be enabled in the new page. Defaults to true.
- `refreshContent(showSpinner: boolean = true)`: Refresh the current content.
- `updateContent(...)`: Refresh the current page with new content. Takes the following arguments:
  - `args?: Record<string, unknown>`: Arguments for the new content request.
  - `component?: string`: Component for the new content request. If not provided, the current component will be used.
  - `method?: string`: Method for the new content request. If not provided, the current method will be used.
  - `jsData?: Record<string, unknown>`: Variables to use in the JavaScript of the new content response.
  - `preSets?: CoreSiteWSPreSets`: Presets for the Web Service call of the new content request.
- `updateModuleCourseContent(cmId: number, alreadyFetched?: boolean)`: Update the content for a module in the course page. Only works if that module is a site plugin using `coursepagemethod`.
- `updateCachedContent()`: Update cached content for the page without reloading the UI. This is useful to update subsequent views. Only available in 4.4+.

You can learn how to use these functions in the [Group Selector example](./examples/groups-selector.md#loading-new-content).

### Lifecycle

For content used to render pages, it is possible to hook into [Ionic Life Cycle Hooks](https://ionicframework.com/docs/api/router-outlet#life-cycle-hooks) in JavaScript.

Additionally, you can also define a `canLeave` method that will be used in the `canDeactive` guard of the [Angular route definition](https://angular.io/api/router/Route).

```js
this.ionViewWillLeave = function() {
    // ...
};

this.canLeave = function() {
    // ...
};
```

## Handlers

Handlers are configured under the `handlers` property in `mobile.php` using an associative array with the name of the handler and configuration options. The handler name should be an alphanumeric string.

These are the configuration options common to most handlers, you can find specific options depending on the delegate below.

| Name                        | Default     | Description |
|-----------------------------|-------------|-------------|
| `delegate`                  | -           | Name of the delegate to register the handler in. See the following sections for available delegates. |
| `method`                    | -           | Name of the PHP method used to retrieve the page content. |
| `init`                      | -           | Name of the PHP method used during [JavaScript initialisation](./index.md#javascript-initialisation). |
| `styles`                    | -           | An associative array with configuration options for CSS styles. |
| `styles.url`                | Required    | URL pointing to a CSS file, either using an absolute URL or a relative URL. The CSS will be downloaded and applied to the whole app, so it's recommended to include styles scoped to your plugin templates. |
| `styles.version`            | Required    | Version number used to determine if the file needs to be downloaded again. You should change the version number every time you change the contents of the CSS file. |
| `moodlecomponent`           | Plugin name | Name of the component implemented by the handler. <br /> <br /> Most of the time, this can be ignored because mobile support is usually included in the same plugin where custom components are defined, but it may be different in some cases. For example, imagine a local plugin called `local_myactivitymobile` is implementing mobile support for a `mod_myactivity` component. In that case, you would set this option to `"mod_myactivity"`. |
| `restricttocurrentuser`     | `false`     | Restricts the handler to appear only for the current user. For more advanced restrictions, you can use the `restrict` and `disabled` properties returned during [JavaScript initialisation](./index.md#javascript-initialisation). |
| `restricttoenrolledcourses` | `false`     | Restricts the handler to appear only for courses the user is enrolled in. For more advanced restrictions, you can use the `restrict` and `disabled` properties returned during [JavaScript initialisation](./index.md#javascript-initialisation). |

### CoreMainMenuDelegate

Adds a new item to the main menu. Main Menu handlers are always displayed in the More menu (the three dots), they cannot be displayed as tabs in the main navigation bar.

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                | Default  | Description |
|---------------------|----------|-------------|
| `displaydata`       | Required | An associative array with configuration options for the main menu item. |
| `displaydata.title` | Required | Language string identifier to use in the main menu item. See the [localisation](./index.md#localisation) documentation to learn more. |
| `displaydata.icon`  | Required | The icon to use in the main menu item. See the [ion-icon](#ion-icon) documentation for available values. |
| `displaydata.class` | -        | A CSS class to add in the main menu item. |
| `priority`          | `0`      | Priority of the handler, higher priority items are displayed first. |
| `ptrenabled`        | `true`   | Whether to enable the PTR (pull-to-refresh) gesture in the page. |

### CoreMainMenuHomeDelegate

Adds new tabs in the home page. By default, the app is displaying the "Dashboard" and "Site home" tabs.

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                | Default  | Description |
|---------------------|----------|-------------|
| `displaydata`       | Required | An associative array with configuration options for the tab. |
| `displaydata.title` | Required | Language string identifier to use in the tab. See the [localisation](./index.md#localisation) documentation to learn more. |
| `displaydata.class` | -        | A CSS class to add in the tab. |
| `priority`          | `0`      | Priority of the handler, higher priority tabs are displayed first. |
| `ptrenabled`        | `true`   | Whether to enable the PTR (pull-to-refresh) gesture in the page. |

### CoreCourseOptionsDelegate

Add new option in the course page, either as a tab or in the course summary. For example, the tab will appear alongside Participants and Grades. And the course summary can be opened using the info icon in the header.

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                | Default  | Description |
|---------------------|----------|-------------|
| `displaydata`       | Required | An associative array with configuration options for the tab. |
| `displaydata.title` | Required | Language string identifier to use in the tab. See the [localisation](./index.md#localisation) documentation to learn more. |
| `displaydata.class` | -        | A CSS class to add in the tab. |
| `priority`          | `0`      | Priority of the handler, higher priority tabs are displayed first. |
| `ismenuhandler`     | `false`  | Whether to show the option in the course summary. |
| `ptrenabled`        | `true`   | Whether to enable the PTR (pull-to-refresh) gesture in the page. |

### CoreCourseModuleDelegate

Add support for activity modules or resources.

The following functions can be declared in the object evaluated in the last statement of the [JavaScript initialisation](./index.md#javascript-initialisation) in order to implement additional functionality:

- `supportsFeature(feature: string): any`: Check whether the module supports a given feature.
- `manualCompletionAlwaysShown(module: CoreCourseModuleData): Promise<boolean>`: Check whether to show the manual completion regardless of the course's `showcompletionconditions` setting.

You can learn more about this in the [Course Modules example](./examples/course-modules).

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                   | Default  | Description |
|------------------------|----------|-------------|
| `method`               | -        | Name of the PHP method used to render the page content. <br /> <br /> When this option is missing, the module won't be clickable; regardless of `FEATURE_NO_VIEW_LINK` feature support. |
| `coursepagemethod`     | -        | Name of the PHP method used to render the module in the course page. The rendered HTML should not contain directives or components, only plain HTML. <br /> <br /> When this option is present, the module won't be clickable; regardless of `FEATURE_NO_VIEW_LINK` feature support. |
| `displaydata`          | -        | An associative array with configuration options for the module icon. |
| `displaydata.icon`     | -        | The icon to use for the module. See the [ion-icon](#ion-icon) documentation for available values. |
| `displaydata.class`    | -        | A CSS class to add in the module icon. |
| `offlinefunctions`     | `[]`     | Associative array where the keys are functions to call when prefetching the module, and the values are lists of parameters sent by the app. These functions can be either PHP method names from the `output/mobile.php` class, or Web Services. <br /> <br /> In case of using PHP method names, the parameters array will be ignored and the default parameters will be sent: `courseid`, `cmid`, and `userid`. With Web Services, an empty parameters array will indicate sending the default parameters; but using specific values it is possible to customize which are sent. This can include some additional parameters not present in the defaults, such as `courseids` (a list of the courses the user is enrolled in) and `{component}id` (for example, for `mod_certificate` this would be `certificateid`). <br /> <br /> Prefetching the module will also download all the files returned by the methods in these offline functions (in the `files` array). <br /> <br /> Note that if your functions use additional custom parameters using this option won't work. For example, if you implement multiple pages within a module's view function using a page parameter, the app won't know which page to send. In situations where you need to prefetch more complex data, you should use [Prefetch Handlers](./examples/prefetch-handlers.md) instead. <br /> <br /> You can find some [examples below](#example-updatesnames-values). |
| `downloadbutton`       | `true`   | Whether to display download button in the module. <br /> <br /> Only used if there is any offline function. |
| `isresource`           | `false`  | Whether the module is a resource. If the handler relies on the module contents, this should be `true`. <br /> <br /> Only used if there is any offline function. |
| `updatesnames`         | `/.*/`   | A regular expression to check which module updates are considered to mark it as outdated in the app. In particular, this regular expression will be matched against the field names returned by the `core_course_check_updates` Web Service. If none of the updated fields match the regular expression, they will be ignored and the module won't need to be prefetched again. <br /> <br /> Only used if there is any offline function. <br /> <br /> You can find some [examples below](#example-updatesnames-values). |
| `displayopeninbrowser` | `true`   | Whether the module should display the "Open in browser" option in the top-right menu (only for teachers). <br /> <br /> Before 4.4, this was displayed to everyone, not just teachers. <br /> <br /> This can also be configured in JavaScript with `this.displayOpenInBrowser = false;`. |
| `displaydescription`   | `true`   | Whether the module should display the "Description" option in the top-right menu. <br /> <br /> This can also be configured in JavaScript with `this.displayDescription = false;`. |
| `displayrefresh`       | `true`   | Whether the module should display the "Refresh" option in the top-right menu. <br /> <br /> This can also be configured in JavaScript with `this.displayRefresh = false;`. |
| `displayprefetch`      | `true`   | Whether the module should display the download option in the top-right menu. <br /> <br /> This can also be configured in JavaScript with `this.displayPrefetch = false;`. |
| `displaysize`          | `true`   | Whether the module should display the downloaded size in the top-right menu. <br /> <br /> This can also be configured in JavaScript with `this.displaySize = false;`. |
| `supportedfeatures`    | `[]`     | Associative array with configuration for the features supported in the plugin. If you need to calculate these dynamically, you can implement the `supportsFeature` function in the JavaScript. <br /> <br /> Some features are not available in the app and they will be ignored. The available features are `FEATURE_MOD_ARCHETYPE`, `FEATURE_MOD_PURPOSE`, `FEATURE_GRADE_HAS_GRADE`, `FEATURE_SHOW_DESCRIPTION`, and `FEATURE_NO_VIEW_LINK`. <br /> <br /> You can find some [examples below](#example-supportedfeatures-values). |
| `ptrenabled`           | `true`   | Whether to enable the PTR (pull-to-refresh) gesture in the page. |

#### Example `offlinefunctions` values

Using PHP method names:

```php
[
    'mobile_course_view' => [],
    'mobile_issues_view' => [],
]
```

Using Web Services:

```php
[
    'mod_certificate_view_course' => [], // Will receive default parameters: courseid, cmid, and userid.
    'mod_certificate_view_certificate' => ['courseid', 'certificateid'], // Will receive courseid and certificateid.
]
```

#### Example `updatesnames` values

The following regular expression would only consider the "grades" and "gradeitems" fields in module updates to consider a module outdated:

```php
'/^grades$|^gradeitems$/'
```

#### Example `supportedfeatures` values

```php
[
    FEATURE_NO_VIEW_LINK => true,
    FEATURE_MOD_PURPOSE => MOD_PURPOSE_ASSESSMENT,
]
```

#### Example `supportedFeatures()` JavaScript definition

```js
var result = {
    supportsFeature: function(feature) {
        if (feature === 'viewlink') {
            return true;
        }

        if (feature === 'mod_purpose') {
            return 'assessment';
        }
    },
};

result;
```

### CoreUserDelegate

Add new option in the user profile page.

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                | Default      | Description |
|---------------------|--------------|-------------|
| `displaydata`       | Required     | An associative array with configuration options for the option. |
| `displaydata.title` | Required     | Language string identifier to use in the option. See the [localisation](./index.md#localisation) documentation to learn more. |
| `displaydata.icon`  | Required     | The icon to use in the option. See the [ion-icon](#ion-icon) documentation for available values. |
| `displaydata.class` | -            | A CSS class to add in the option. |
| `type`              | `'listitem'` | Visual representation of the option, accepted values are `listitem` and `button`. <br /> <br /> Before 4.4, the accepted values were `newpage` and `communication` (`newpage` was the default). |
| `priority`          | `0`          | Priority of the handler, higher priority options are displayed first. |
| `ptrenabled`        | `true`       | Whether to enable the PTR (pull-to-refresh) gesture in the page. |

### CoreCourseFormatDelegate

Add support for a custom course format. The template returned by this handler also has access to the following properties:

- `coreCourseFormatComponent`: Course format component instance (see [CoreCourseFormatComponent component](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/course/components/course-format/course-format.ts) for details).
- `course`: Course data (see [CoreCourseAnyCourseData](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/courses/services/courses.ts#L1733) type for details).
- `sections`: Course sections array (see [CoreCourseSectionToDisplay](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/course/components/course-format/course-format.ts#L690..L692) for details).
- `initialSectionId`: Initial section ID.
- `initialSectionNumber`: Initial section number.
- `moduleId`: Module id.

You can learn more about this in the [Course Formats example](./examples/course-formats).

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                     | Default     | Description |
|--------------------------|-------------|-------------|
| `canviewallsections`     | `true`      | Whether the course format allows seeing all sections in a single page.|
| `displaycourseindex`     | `true`      | Whether the course index should be displayed. |

### CoreSettingsDelegate

Add new option in the settings page.

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                | Default     | Description |
|---------------------|-------------|-------------|
| `displaydata`       | Required    | An associative array with configuration options for the option. |
| `displaydata.title` | Required    | Language string identifier to use in the option. See the [localisation](./index.md#localisation) documentation to learn more. |
| `displaydata.icon`  | Required    | The icon to use in the option. See the [ion-icon](#ion-icon) documentation for available values. |
| `displaydata.class` | -           | A CSS class to add in the option. |
| `priority`          | `0`         | Priority of the handler, higher priority options are displayed first. |
| `ptrenabled`        | `true`      | Whether to enable the PTR (pull-to-refresh) gesture in the page. |

### AddonMessageOutputDelegate

Add support for custom user notification settings. This will add a new option in the actions menu of the user notifications page (User menu > Preferences > Notifications).

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                | Default     | Description |
|---------------------|-------------|-------------|
| `displaydata`       | Required    | An associative array with configuration options for the option. |
| `displaydata.title` | Required    | Language string identifier to use in the option. See the [localisation](./index.md#localisation) documentation to learn more. |
| `displaydata.icon`  | Required    | The icon to use in the option. See the [ion-icon](#ion-icon) documentation for available values. |
| `priority`          | `0`         | Priority of the handler, higher priority options are displayed first. |
| `ptrenabled`        | `true`      | Whether to enable the PTR (pull-to-refresh) gesture in the page. |

### CoreBlockDelegate

Add support for a custom block. Blocks can be displayed in Site Home, Dashboard and Course page.

**Template type:** [Dynamic](./index.md#dynamic-templates) <br />
**JavaScript overrides:** None <br />
**JavaScript component:** None

#### Options

| Name                | Default                | Description |
|---------------------|------------------------|-------------|
| `displaydata`       | -                      | An associative array with configuration options for the block. |
| `displaydata.title` | Required               | Language string identifier to use in the block. See the [localisation](./index.md#localisation) documentation to learn more. |
| `displaydata.class` | `'block_{block-name}'` | A CSS class to add in the block. |
| `displaydata.type`  | -                      | Predefined type of block to render, available options are `title` and `prerendered`. <br /> <br /> `title` blocks will render a single button with the name of the block, and they will open a page rendered using the `method`. <br /> <br /> `prerendered` blocks will use the pre-rendered content and footer returned by the Web Services (like `core_block_get_course_blocks`). <br /> <br /> When this option is missing, the block will be rendered using `method` or `fallback`. |
| `fallback`          | -                      | Name of another block to use in order to render the block in the app. This can be useful for custom blocks that have the same graphical interface as other block, even if they are technically different blocks. |

### CoreQuestionDelegate

Add support for a custom question type.

You can learn more about this in the [Question Types example](./examples/question-types.md).

**Template type:** [Static](index.md#static-templates) <br />
**JavaScript overrides:** [CoreQuestionHandler](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/question/services/question-delegate.ts#L26..L209) <br />
**JavaScript component:** [CoreSitePluginsQuestionComponent](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/siteplugins/components/question/question.ts)

*This handler does not have any specific options.*

### CoreQuestionBehaviourDelegate

Add support for a custom question behaviour.

**Template type:** [Static](index.md#static-templates) <br />
**JavaScript overrides:** [CoreQuestionBehaviourHandler](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/question/services/behaviour-delegate.ts#L26..L60) <br />
**JavaScript component:** [CoreSitePluginsQuestionBehaviourComponent](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/siteplugins/components/question-behaviour/question-behaviour.ts)

*This handler does not have any specific options.*

### CoreUserProfileFieldDelegate

Add support for a custom user profile field.

**Template type:** [Static](index.md#static-templates) <br />
**JavaScript overrides:** [CoreUserProfileFieldHandler](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/user/services/user-profile-field-delegate.ts#L26..L55) <br />
**JavaScript component:** [CoreSitePluginsUserProfileFieldComponent](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/siteplugins/components/user-profile-field/user-profile-field.ts)

*This handler does not have any specific options.*

### AddonModQuizAccessRuleDelegate

Add support for a custom quiz access rule.

**Template type:** [Static](index.md#static-templates) <br />
**JavaScript overrides:** [AddonModQuizAccessRuleHandler](https://github.com/moodlehq/moodleapp/blob/latest/src/addons/mod/quiz/services/access-rules-delegate.ts#L27..L122) <br />
**JavaScript component:** [CoreSitePluginsQuizAccessRuleComponent](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/siteplugins/components/quiz-access-rule/quiz-access-rule.ts)

*This handler does not have any specific options.*

### AddonModAssignSubmissionDelegate

Add support for a custom assign submission.

**Template type:** [Static](index.md#static-templates) <br />
**JavaScript overrides:** [AddonModAssignSubmissionHandler](https://github.com/moodlehq/moodleapp/blob/latest/src/addons/mod/assign/services/submission-delegate.ts#L30..L269) <br />
**JavaScript component:** [CoreSitePluginsAssignSubmissionComponent](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/siteplugins/components/assign-submission/assign-submission.ts)

*This handler does not have any specific options.*

### AddonModAssignFeedbackDelegate

Add support for a custom assign feedback.

**Template type:** [Static](index.md#static-templates) <br />
**JavaScript overrides:** [AddonModAssignFeedbackHandler](https://github.com/moodlehq/moodleapp/blob/latest/src/addons/mod/assign/services/feedback-delegate.ts#L30..L177) <br />
**JavaScript component:** [CoreSitePluginsAssignFeedbackComponent](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/siteplugins/components/assign-feedback/assign-feedback.ts)

*This handler does not have any specific options.*

### AddonWorkshopAssessmentStrategyDelegate

Add support for a custom workshop assessment strategy.

*This handler can only be registered using [JavaScript initialisation](./index.md#javascript-initialisation), you can find more about it in the [AddonWorkshopAssessmentStrategyHandler interface declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/addons/mod/workshop/services/assessment-strategy-delegate.ts#L26..L76).*

### CoreContentLinksDelegate

Allows you to intercept what happens when links are clicked. For example, you can open a plugin page when a link is clicked. The Moodle app automatically creates some link handlers for module plugins, you can learn more about this and how to use link handlers in the [Link Handlers example](./examples/link-handlers.md).

*This handler can only be registered using [JavaScript initialisation](./index.md#javascript-initialisation), you can find more about it in the [CoreContentLinksHandler interface declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/contentlinks/services/contentlinks-delegate.ts#L27..L95).*

### CorePushNotificationsDelegate

Allows you to intercept what happens when push notifications are clicked.

*This handler can only be registered using [JavaScript initialisation](./index.md#javascript-initialisation), you can find more about it in the [CorePushNotificationsClickHandler interface declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/pushnotifications/services/push-delegate.ts#L27..L59).*

### CoreCourseModulePrefetchDelegate

Allows you to implement custom logic to prefetch module content. You can learn more about this in the [Prefetch Handlers example](./examples/prefetch-handlers.md).

*This handler can only be registered using [JavaScript initialisation](./index.md#javascript-initialisation), you can find more about it in the [CoreCourseModulePrefetchHandler interface declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/course/services/module-prefetch-delegate.ts#L1410..L1568).*

### CoreFileUploaderDelegate

Add new option in the upload file picker.

*This handler can only be registered using [JavaScript initialisation](./index.md#javascript-initialisation), you can find more about it in the [CoreFileUploaderHandler interface declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/fileuploader/services/fileuploader-delegate.ts#L26..L46).*

### CorePluginFileDelegate

Perform operations with files such as listening to file events (download, deletion, etc.) or using a different URL when downloading.

*This handler can only be registered using [JavaScript initialisation](./index.md#javascript-initialisation), you can find more about it in the [CorePluginFileHandler interface declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/services/plugin-file-delegate.ts#L296..L389).*

### CoreFilterDelegate

Add support for a custom filter. Note that you'll only need this if you have to manipulate the content with JavaScript, PHP filters are applied in the content before sending the HTML to the app.

*This handler can only be registered using [JavaScript initialisation](./index.md#javascript-initialisation), you can find more about it in the [CoreFilterHandler interface declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/filter/services/filter-delegate.ts#L28..L76).*

### CoreEnrolDelegate `4.3+`

Add support for custom enrolment methods. You can see an example of customizing the default behaviour using JavaScript in the [Self Enrolment example](./examples/self-enrolment.md).

This delegate was introduced in version 4.3 of the app.

**Template type:** None <br />
**JavaScript overrides:** [CoreEnrolHandler](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/enrol/services/enrol-delegate.ts#L33..L59) (only when `enrolmentAction` is `self` or `guest`) <br />
**JavaScript component:** None

#### Options

| Name                    | Default     | Description |
|-------------------------|-------------|-------------|
| `enrolmentAction`       | `'browser'` | Action performed by the handler. Possible values are: `browser`, `self`, and `guest`. <br /> <br /> `browser` opens the browser to perform the enrolment in the LMS, outside of the app. <br /> <br /> `self` requires implementing the `enrol` function in JavaScript. Also, the PHP class extending `enrol_plugin` must return some data in the `get_enrol_info` method. <br /> <br /> `guest` allows users to enter the course as guests. It requires implementing the `canAccess` and `validateAccess` functions in the [JavaScript initialisation](./index.md#javascript-initialisation) JavaScript. Also, the PHP class extending `enrol_plugin` must return some data in the `get_enrol_info` method. |
| `infoIcons`             | `[]`        | Array of icons related to enrolment to display next to the course. These can also be calculated dynamically in JavaScript using course information. |
| `infoIcons[].icon`      | Required    | The icon to use. See the [ion-icon](#ion-icon) documentation for available values. |
| `infoIcons[].label`     | Required    | Language string identifier to use in the aria-label of the icon. See the [localisation](./index.md#localisation) documentation to learn more. |
| `infoIcons[].className` | -           | A CSS class to add in the icon. |

## Components

In addition to built-in Angular and [Ionic Components](https://ionicframework.com/docs/components), the following are also available in the Moodle App.

Please note that this list is not exhaustive, you can find all the components available in the app under [src/core/components](https://github.com/moodlehq/moodleapp/tree/latest/src/core/components).

### core-format-text

Formats the text and adds functionality specific for the app. For example, it adds [core-link](#core-link) to links, [core-external-content](#core-external-content) to embedded media, applies [filters](https://docs.moodle.org/en/Filters), etc.

#### Attributes

| Name                | Default         | Description |
|---------------------|-----------------|-------------|
| `text`              | Required        | Text to format. |
| `siteId`            | Current site ID | Site ID for contextual functionality, such as downloads. |
| `component`         | -               | Component for contextual functionality, such as downloads. |
| `componentId`       | -               | Component ID for contextual functionality, such as downloads. |
| `adaptImg`          | `true`          | Whether to adapt images to screen width. |
| `clean`             | `false`         | Whether to treat the contents as plain text and remove all the HTML tags. |
| `singleLine`        | `false`         | Whether to remove new lines and display the text in a single line. <br /> <br /> Only used if `clean` is `true`. |
| `highlight`         | -               | Text to highlight. |
| `filter`            | -               | Whether to apply filters text contents. If not defined, it will be `true` when `contextLevel` and `instanceId` are set. |
| `contextLevel`      | `'system'`      | Context level of the text. Possible values are `system`, `user`, `coursecat`, `course`, `module`, and `block`. |
| `contextInstanceId` | -               | Instance ID related to the context. |
| `courseId`          | -               | Course ID related to the context. It can be useful to improve performance with filters. |
| `wsNotFiltered`     | `false`         | Used to indicate that the Web Services didn't filter the text for some reason. |
| `captureLinks`      | `true`          | Whether links should be open inside the app if possible. |
| `openLinksInApp`    | `false`         | Whether links should be opened in InAppBrowser. |
| `hideIfEmpty`       | `false`         | Whether to hide the element when the text is empty. |
| `disabled`          | `false`         | Whether to disable elements with autoplay. |

#### Examples

```html ng2
<core-format-text text="<% cm.description %>" component="mod_certificate" componentId="<% cm.id %>">
</core-format-text>
```

### core-navbar-buttons

Adds buttons to the header of the current page.

#### Attributes

| Name      | Default | Description |
|-----------|---------|-------------|
| `slot`    | -       | When this attribute is present, buttons will only be added if the header has some buttons in that position. Otherwise, they will be added to the first `<ion-buttons>` found in the header. |
| `hidden`  | -       | When this attribute is present, with any value, all the buttons are hidden. |
| `prepend` | -       | When this attribute is present, with any value, the buttons will be added to the beginning. Otherwise, they are added at the end. |

#### Examples

```html ng2
<core-navbar-buttons slot="end">
    <ion-button (click)="action()">
        <ion-icon slot="icon-only" name="funnel"></ion-icon>
    </ion-button>
</core-navbar-buttons>
```

You can also use it to add options to the context menu:

```html ng2
<core-navbar-buttons>
    <core-context-menu>
        <core-context-menu-item
                [priority]="500" content="Nice boat" (action)="boatFunction()"
                iconAction="boat">
        </core-context-menu-item>
    </core-context-menu>
</core-navbar-buttons>
```

### core-file

Handles a remote file. It shows the file name, icon (depending on mime type), and a button to download or refresh it. Users can identify if the file is downloaded or not based on the button.

#### Attributes

| Name                | Default  | Description |
|---------------------|----------|-------------|
| `file`              | Required | Object with data about the file to download. |
| `file.filename`     | Required | Name of the file to download. |
| `file.url`          | -        | Url of the file to download. <br /> <br /> Required if `file.fileurl` is missing. |
| `file.fileurl`      | -        | Url of the file to download. <br /> <br /> Required if `file.url` is missing. |
| `file.timemodified` | -        | Time modified of the file, used to find out if the file needs to be downloaded again in the app. |
| `file.filesize`     | -        | File size, used to request confirmation before downloading large files. |
| `component`         | -        | Component related with the file. |
| `componentId`       | -        | ID to use in conjunction with the component. |
| `canDelete`         | `false`  | Whether the file can be deleted. |
| `alwaysDownload`    | `false`  | Whether it should always display the refresh button when the file is downloaded. Use it for files that you cannot determine if they're outdated or not. |
| `canDownload`       | `true`   | Whether file can be downloaded. |
| `showSize`          | `true`   | Whether show the file size. |
| `showTime`          | `true`   | Whether show the time modified. |
| `onDelete`          | -        | Listener for the file being deleted. |

#### Examples

```html ng2
<core-file
        [file]="{
            fileurl: '<% issue.url %>',
            filename: '<% issue.name %>',
            timemodified: '<% issue.timemodified %>',
            filesize: '<% issue.size %>'
        }"
        component="mod_certificate"
        componentId="<% cm.id %>">
</core-file>
```

### core-rich-text-editor

Text editor to write rich content including formatting text, inserting links and images, uploading files, etc.

Using this component may require setting up a `FormControl`, you can learn more about this in the [Forms example](./examples/forms.md#using-core-rich-text-editor).

#### Attributes

| Name                | Default                   | Description |
|---------------------|---------------------------|-------------|
| `placeholder`       | -                         | Placeholder to show when the editor content is empty. |
| `control`           | -                         | Form control. Learn more about this in the [Forms example](./examples/forms.md#using-core-rich-text-editor). |
| `name`              | `'core-rich-text-editor'` | Form input name. |
| `component`         | -                         | Component to link uploaded files. |
| `componentId`       | -                         | ID to use in conjunction with the component. |
| `autoSave`          | `true`                    | Whether to auto-save the contents in a draft. |
| `contextLevel`      | `'system'`                | Context level of the text. Possible values are `system`, `user`, `coursecat`, `course`, `module`, and `block`. |
| `contextInstanceId` | `0`                       | Instance ID related to the context. |
| `elementId`         | -                         | ID to set to the element. |
| `draftExtraParams`  | -                         | Extra parameters to identify the draft. |

### ion-icon

Even though [ion-icon](https://ionicframework.com/docs/api/icon) is a built-in Ionic component, it has additional functionality in the Moodle App. In particular, it's possible to use more icons besides [Ionicons](https://ionic.io/ionicons).

This can be achieved using different prefixes in the `name` attribute:

- `fas-` or `fa-` will use [Font Awesome 6.3 solid library](https://fontawesome.com/search?o=r&m=free&s=solid).
- `far-` will use [Font Awesome 6.3 regular library](https://fontawesome.com/search?o=r&m=free&s=regular).
- `fab-` will use [Font Awesome 6.3 brands library](https://fontawesome.com/search?o=r&m=free&f=brands). Note that only a few are supported, and their use is discouraged.
- `moodle-` will use svg icons [imported from Moodle LMS](https://github.com/moodlehq/moodleapp/tree/latest/src/assets/fonts/moodle/moodle).
- `fam-` will use [some custom icons only available in the app](https://github.com/moodlehq/moodleapp/tree/latest/src/assets/fonts/moodle/font-awesome).
- Otherwise, Ionicons icons will be used.

We encourage the use of Font Awesome icons to match the appearance of the LMS website.

#### Examples

Show the "pizza-slice" icon from Font Awesome regular library:

```html
<ion-icon name="fas-pizza-slice"></ion-icon>
```

## Directives

In addition to built-in [Angular Directives](https://angular.dev/guide/directives), the following are also available in the Moodle App.

Please note that this list is not exhaustive, you can find all the components available in the app under [src/core/directives](https://github.com/moodlehq/moodleapp/tree/latest/src/core/directives).

### collapsible-item

Makes an element collapsible.

This directive takes a single argument, which is optional, to indicate the max height to render the content box. The minimum accepted value is 56. Using the argument will force `display: block` to calculate the height better. If you want to avoid this, use `class="inline"` at the same time to use `display: inline-block`.

#### Examples

```html
<div collapsible-item>
    ...
</div>
```

### core-link

Performs several checks upon link navigation, like launching a browser instead of overriding the app.

This directive is applied automatically to all the links and media inside of [core-format-text](#core-format-text) components.

#### Attributes

| Name                 | Default   | Description |
|----------------------|-----------|-------------|
| `capture`            | `false`   | Whether the link should be captured by the app instead of opening a browser. See [CoreContentLinksDelegate](#corecontentlinksdelegate) to learn more. |
| `inApp`              | `false`   | Whether to open in an embedded browser rather than the system browser. |
| `autoLogin`          | `'check'` | Whether to open the link with auto-login. Possible values are `yes`, `no`, and `check` (Auto-login only if the link belongs to the current site) |
| `showBrowserWarning` | `true`    | Whether to show a warning before opening browser. |

#### Examples

```html ng2
<a href="<% cm.url %>" core-link>Open</a>
```

### core-external-content

Handle links to files and embedded files. This directive should be used in any link to a file or any embedded file that you want to have available when the app is offline.

If a file is downloaded, its URL will be replaced by the local file URL.

This directive is applied automatically to all the links and media inside of [core-format-text](#core-format-text) components.

#### Attributes

| Name          | Default         | Description |
|---------------|-----------------|-------------|
| `siteId`      | Current site ID | Site ID to use. |
| `component`   | -               | Component to use when downloading embedded files. |
| `componentId` | -               | ID to use in conjunction with the component. |

#### Examples

```html ng2
<img src="<% event.iconurl %>" core-external-content component="mod_certificate" componentId="<% event.id %>">
```

### core-user-link

Open user profile when clicked.

#### Attributes

| Name       | Default  | Description |
|------------|----------|-------------|
| `userId`   | Required | User ID to open the profile. |
| `courseId` | -        | Course id to show the user info related to that course. |

#### Examples

```html ng2
<a ion-item core-user-link userId="<% userid %>">Open user profile</a>
```

### core-download-file

Download and open a file when clicked.

For most cases, it is recommended to use the [core-file](#core-file) component instead because it will display some useful information about the file.

#### Attributes

| Name                              | Default  | Description |
|-----------------------------------|----------|-------------|
| `core-download-file`              | Required | Object with data about the file to download. |
| `core-download-file.url`          | -        | Url of the file to download. <br /> <br /> Required if `core-download-file.fileurl` is missing. |
| `core-download-file.fileurl`      | -        | Url of the file to download. <br /> <br /> Required if `core-download-file.url` is missing. |
| `core-download-file.timemodified` | -        | Time modified of the file, used to find out if the file needs to be downloaded again in the app. |
| `core-download-file.filesize`     | -        | File size, used to request confirmation before downloading large files. |
| `component`                       | -        | Component related with the file. |
| `componentId`                     | -        | ID to use in conjunction with the component. |

#### Examples

```html ng2
<ion-button
        [core-download-file]="{
            fileurl: <% issue.url %>,
            timemodified: <% issue.timemodified %>,
            filesize: <% issue.size %>
        }"
        component="mod_certificate"
        componentId="<% cm.id %>">
    {{ 'plugin.mod_certificate.download | translate }}
</ion-button>
```

### core-course-download-module-main-file

Download and open the main file of a module when clicked. This directive is intended for modules like `mod_resource`.

#### Attributes

| Name          | Default           | Description |
|---------------|-------------------|-------------|
| `module`      |                   | Module object. <br /> <br /> Required if `moduleId` is missing. |
| `moduleId`    |                   | ID of the module to open. <br /> <br /> Required if `module` is missing. |
| `courseId`    |                   | Course ID. |
| `component`   | -                 | Component related with the file. |
| `componentId` | -                 | ID to use in conjunction with the component. |
| `files`       | `module.contents` | List of files of the module. |

#### Examples

```html ng2
<ion-button expand="block" core-course-download-module-main-file moduleId="<% cmid %>"
        courseId="<% certificate.course %>" component="mod_certificate"
        [files]="[{
            fileurl: '<% issue.fileurl %>',
            filename: '<% issue.filename %>',
            timemodified: '<% issue.timemodified %>',
            mimetype: '<% issue.mimetype %>',
        }]">
    {{ 'plugin.mod_certificate.getcertificate' | translate }}
</ion-button>
```

### core-site-plugins-new-content

Open new content when clicked. This content can be displayed in a new page or in the current page, if the current page is already displaying plugin content. This directive is typically used to navigate through plugin pages.

#### Attributes

| Name           | Default  | Description |
|----------------|----------|-------------|
| `component`    | Required | Component for the new content. |
| `method`       | Required | Name of the PHP method for the new page request. |
| `args`         | -        | Parameters to include in the new page request. |
| `preSets`      | -        | Additional configuration for the Web Service request. You can find the available options in the [CoreSiteWSPreSets type declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/classes/sites/authenticated-site.ts#L1625..L1746). |
| `samePage`     | `false`  | Whether to display content in the same page instead of a new one. This will only work for pages already rendered by plugins, otherwise a new page will be open regardless of this value. |
| `title`        | -        | Language string identifier to use in the new page. See the [localisation](./index.md#localisation) documentation to learn more. <br /> <br /> Only used if `samePage` is `false`. |
| `useOtherData` | -        | Whether to include `otherdata` from the [content response](#content-responses) in the arguments for the new page request. If this attribute is undefined or not supplied, `otherdata` will not be included. If this attribute is an array of strings, it'll be used to include only the indicated properties. For any other value (including falsy values like `false`, `null`, or an empty string), the entire `otherdata` will be sent. Additionally, any nested arrays or object will be sent as a JSON-string. |
| `form`         | -        | ID or name to identify a form in the template, that will be obtained from `document.forms`. The form data will be included in the arguments for the new page request. <br /> <br /> You can learn more about forms in the [Forms example](./examples/forms.md). |
| `jsData`       | -        | JavaScript variables to pass to the new page so they can be used in the template or JavaScript. This attribute can also be set to `true`, in which case all initial variables from current page will be used. |
| `ptrEnabled`   | `true`   | Whether to enable PTR (pull-to-refresh) in the new page. |

#### Examples

A button that loads content in a new page:

```html ng2
<ion-button core-site-plugins-new-content
        title="<% certificate.name %>" component="mod_certificate"
        method="mobile_issues_view" [args]="{cmid: <% cmid %>, courseid: <% courseid %>}">
     {{ 'plugin.mod_certificate.viewissued' | translate }}
</ion-button>
```

A button that loads content in the current page, and includes `userid` from `otherdata` in the request:

```html ng2
<ion-button core-site-plugins-new-content
        component="mod_certificate" method="mobile_issues_view"
        [args]="{cmid: <% cmid %>, courseid: <% courseid %>}" samePage="true" [useOtherData]="['userid']">
    {{ 'plugin.mod_certificate.viewissued' | translate }}
</ion-button>
```

### core-site-plugins-call-ws

Calls a Web Service when clicked. Depending on the response, the current page will be refreshed, a message will be displayed, or the application will navigate back to the previous page.

If you'd rather load new content when the Web Service request is done, use [core-site-plugins-call-ws-new-content](#core-site-plugins-call-ws-new-content) instead.

You can see this directive in use in the [Forms example](./examples/forms.md).

#### Attributes

| Name                | Default  | Description |
|---------------------|----------|-------------|
| `name`              | Required | The name of the Web Service to call. |
| `params`            | -        | Parameters for the Web Service request. |
| `preSets`           | -        | Additional configuration for the Web Service request. You can find the available options in the [CoreSiteWSPreSets type declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/classes/sites/authenticated-site.ts#L1625..L1746). |
| `useOtherDataForWS` | -        | Whether to include `otherdata` from the [content response](#content-responses) in the arguments for the new page request. If this attribute is undefined or not supplied, `otherdata` will not be included. If this attribute is an array of strings, it'll be used to include only the indicated properties. For any other value (including falsy values like `false`, `null`, or an empty string), the entire `otherdata` will be sent. Additionally, any nested arrays or object will be sent as a JSON-string. |
| `form`              | -        | ID or name to identify a form in the template, that will be obtained from `document.forms`. The form data will be included in the arguments for the new page request. <br /> <br /> You can learn more about forms in the [Forms example](./examples/forms.md). |
| `confirmMessage`    | -        | Message to confirm the action when the user clicks the element. If this attribute is supplied with an empty string, "Are you sure?" will be used. |
| `showError`         | `true`   | Whether to show an error message if the WS call fails. |
| `successMessage`    | -        | Message to show on success. If not supplied, no message. If this attribute is supplied with an empty string, "Success" will be used. |
| `goBackOnSuccess`   | `false`  | Whether to go back if the Web Service call is successful. |
| `refreshOnSuccess`  | `false`  | Whether to refresh the current page if the Web Service call is successful. |
| `onSuccess`         | -        | A function to call when the Web Service call is successful (HTTP call successful and no exception returned). |
| `onError`           | -        | A function to call when the Web Service call fails (HTTP call fails or an exception is returned). |
| `onDone`            | -        | A function to call when the Web Service call finishes (either success or fail). |

#### Examples

A button to send some data to the server without using cache, displaying default messages and refreshing on success:

```html ng2
<ion-button core-site-plugins-call-ws
        name="mod_certificate_view_certificate" [params]="{certificateid: <% certificate.id %>}"
        [preSets]="{getFromCache: 0, saveToCache: 0}" confirmMessage successMessage
        refreshOnSuccess="true">
    {{ 'plugin.mod_certificate.senddata' | translate }}
</ion-button>
```

A button to send some data to the server using cache without confirming, going back on success and using `userid` from `otherdata`:

```html ng2
<ion-button core-site-plugins-call-ws
        name="mod_certificate_view_certificate" [params]="{certificateid: <% certificate.id %>}"
        goBackOnSuccess="true" [useOtherData]="['userid']">
     {{ 'plugin.mod_certificate.senddata' | translate }}
</ion-button>
```

Same as the previous example, but implementing custom JS code to run on success:

```html ng2 title="Template"
<ion-button core-site-plugins-call-ws
        name="mod_certificate_view_certificate" [params]="{certificateid: <% certificate.id %>}"
        [useOtherData]="['userid']" (onSuccess)="certificateViewed($event)">
     {{ 'plugin.mod_certificate.senddata' | translate }}
</ion-button>
```

```js title="JavaScript"
this.certificateViewed = function(result) {
    // Code to run when the WS call is successful.
};
```

### core-site-plugins-call-ws-new-content

Calls a Web Service when clicked and loads new content passing the Web Service result as arguments. This content can be displayed in a new page or in the current page, if the current page is already displaying plugin content.

If you don't need to load new content, use [core-site-plugins-call-ws](#core-site-plugins-call-ws) instead.

#### Attributes

| Name                | Default  | Description |
|---------------------|----------|-------------|
| `name`              | Required | The name of the Web Service to call. |
| `params`            | -        | Parameters for the Web Service request. |
| `preSets`           | -        | Additional configuration for the Web Service request. You can find the available options in the [CoreSiteWSPreSets type declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/classes/sites/authenticated-site.ts#L1625..L1746). |
| `useOtherDataForWS` | -        | Whether to include `otherdata` from the [content response](#content-responses) in the arguments for the new page request. If this attribute is undefined or not supplied, `otherdata` will not be included. If this attribute is an array of strings, it'll be used to include only the indicated properties. For any other value (including falsy values like `false`, `null`, or an empty string), the entire `otherdata` will be sent. Additionally, any nested arrays or object will be sent as a JSON-string. |
| `form`              | -        | ID or name to identify a form in the template, that will be obtained from `document.forms`. The form data will be included in the arguments for the new page request. <br /> <br /> You can learn more about forms in the [Forms example](./examples/forms.md). |
| `confirmMessage`    | -        | Message to confirm the action when the user clicks the element. If this attribute is supplied with an empty string, "Are you sure?" will be used. |
| `showError`         | `true`   | Whether to show an error message if the WS call fails. |
| `component`         | Required | Component for the new content. |
| `method`            | Required | Name of the PHP method for the new page request. |
| `args`              | -        | Parameters to include in the new page request. |
| `samePage`          | `false`  | Whether to display content in the same page instead of a new one. This will only work for pages already rendered by plugins, otherwise a new page will be open regardless of this value. |
| `title`             | -        | Language string identifier to use in the new page. See the [localisation](./index.md#localisation) documentation to learn more. <br /> <br /> Only used if `samePage` is `false`. |
| `useOtherData`      | -        | Whether to include `otherdata` from the [content response](#content-responses) in the arguments for the new page request. If this attribute is undefined or not supplied, `otherdata` will not be included. If this attribute is an array of strings, it'll be used to include only the indicated properties. For any other value (including falsy values like `false`, `null`, or an empty string), the entire `otherdata` will be sent. Additionally, any nested arrays or object will be sent as a JSON-string. |
| `jsData`            | -        | JavaScript variables to pass to the new page so they can be used in the template or JavaScript. This attribute can also be set to `true`, in which case all initial variables from current page will be used. |
| `newContentPreSets` | -        | Additional configuration for the Web Service request for the new page. You can find the available options in the [CoreSiteWSPreSets type declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/classes/sites/authenticated-site.ts#L1625..L1746). |
| `onSuccess`         | -        | A function to call when the Web Service call is successful (HTTP call successful and no exception returned). |
| `onError`           | -        | A function to call when the Web Service call fails (HTTP call fails or an exception is returned). |
| `onDone`            | -        | A function to call when the Web Service call finishes (either success or fail). |
| `ptrEnabled`        | `true`   | Whether to enable PTR (pull-to-refresh) in the new page. |

#### Examples

A button to get some data from the server without using cache, showing default confirm and displaying a new page:

```html ng2
<ion-button core-site-plugins-call-ws-new-content
        name="mod_certificate_get_issued_certificates" [params]="{certificateid: <% certificate.id %>}"
        [preSets]="{getFromCache: 0, saveToCache: 0}" confirmMessage
        title="<% certificate.name %>" component="mod_certificate"
        method="mobile_issues_view" [args]="{cmid: <% cmid %>, courseid: <% courseid %>}">
    {{ 'plugin.mod_certificate.getissued' | translate }}
</ion-button>
```

A button to get some data from the server using cache, without confirm, displaying new content in same page and using `userid` from `otherdata`:

```html ng2
<ion-button core-site-plugins-call-ws-new-content
        name="mod_certificate_get_issued_certificates" [params]="{certificateid: <% certificate.id %>}"
        component="mod_certificate" method="mobile_issues_view"
        [args]="{cmid: <% cmid %>, courseid: <% courseid %>}"
        samePage="true" [useOtherData]="['userid']">
    {{ 'plugin.mod_certificate.getissued' | translate }}
</ion-button>
```

Same as the previous example, but implementing a custom JavaScript code to run on success:

```html ng2 title="Template"
<ion-button core-site-plugins-call-ws-new-content
        name="mod_certificate_get_issued_certificates" [params]="{certificateid: <% certificate.id %>}"
        component="mod_certificate" method="mobile_issues_view"
        [args]="{cmid: <% cmid %>, courseid: <% courseid %>}"
        samePage="true" [useOtherData]="['userid']" (onSuccess)="callDone($event)">
    {{ 'plugin.mod_certificate.getissued' | translate }}
</ion-button>
```

```js title="JavaScript"
this.callDone = function(result) {
    // Code to run when the WS call is successful.
};
```

### core-site-plugins-call-ws-on-load

Call a Web Service as soon as the template is loaded. This directive is meant for actions to do in the background, like calling logging Web Services.

If you want to call a Web Service when the user clicks on a certain element, use [core-site-plugins-call-ws](#core-site-plugins-call-ws) instead.

#### Attributes

| Name              | Default  | Description |
|-------------------|----------|-------------|
| name              | Required | The name of the Web Service to call. |
| params            | -        | Parameters for the Web Service request. |
| preSets           | -        | Additional configuration for the Web Service request. You can find the available options in the [CoreSiteWSPreSets type declaration](https://github.com/moodlehq/moodleapp/blob/latest/src/core/classes/sites/authenticated-site.ts#L1625..L1746). |
| useOtherDataForWS | -        | Whether to include `otherdata` from the [content response](#content-responses) in the arguments for the new page request. If this attribute is undefined or not supplied, `otherdata` will not be included. If this attribute is an array of strings, it'll be used to include only the indicated properties. For any other value (including falsy values like `false`, `null`, or an empty string), the entire `otherdata` will be sent. Additionally, any nested arrays or object will be sent as a JSON-string. |
| form              | -        | ID or name to identify a form in the template, that will be obtained from `document.forms`. The form data will be included in the arguments for the new page request. <br /> <br /> You can learn more about forms in the [Forms example](./examples/forms.md). |
| onSuccess         | -        | A function to call when the Web Service call is successful (HTTP call successful and no exception returned). |
| onError           | -        | A function to call when the Web Service call fails (HTTP call fails or an exception is returned). |
| onDone            | -        | A function to call when the Web Service call finishes (either success or fail). |

#### Examples

```html ng2 title="Template"
<span core-site-plugins-call-ws-on-load
        name="mod_certificate_view_certificate" [params]="{certificateid: <% certificate.id %>}"
        [preSets]="{getFromCache: 0, saveToCache: 0}" (onSuccess)="callDone($event)">
</span>
```

```js title="JavaScript"
this.callDone = function(result) {
    // Code to run when the WS call is successful.
};
```

## Services

When writing JavaScript in plugins, many of the app services are available as well.

Given the magnitude of the codebase, we're not going to document all the services here. Instead, we suggest that you take a look at the source code directly. The application is written with TypeScript and has extensive documentation blocks, so it shouldn't be hard to navigate the APIs available. You can start looking where the services are injected to the plugins runtime, in [src/core/features/compile/services/compile.ts](https://github.com/moodlehq/moodleapp/blob/latest/src/core/features/compile/services/compile.ts#L338..L388).
