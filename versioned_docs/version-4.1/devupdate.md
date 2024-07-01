---
title: Moodle 4.0 developer update
tags:
- Moodle 4.0
- Core development
---
This page highlights the important changes that are coming in Moodle 4.0 for developers. Including how the UX improvements impact custom themes, relevant API changes, and what you can do as developer to prepare for the 4.0 release.

<AcademyLink
  subject="Updating your Plugins for Moodle 4.0"
  courseName="updatePlugin400"
/>

See [Question bank plugins](./apis/plugintypes/qbank/index.md).

<!-- cspell:ignore settingsnav -->

## Navigation changes

The core Navigation API has been left mostly untouched. The callbacks to all navigation callbacks remain unchanged and will be called as part of the regular `navigation` and `settingsnav` initialisation. Some new core classes have been created and exist within a new namespace `core/navigation` and serve as conduit to rearrange, cherry-pick existing navigation nodes from the navigation/settingsnav trees and display within the respective navigation type. As such, it is highly recommended to provide unique keys for custom navigation nodes as this helps in the cherry-picking / rearranging process within the new classes.

### Primary navigation

:::note

The menus have been transitioned to be rendered via templates. Refer to [`user_menu.mustache`](https://github.com/moodle/moodle/blob/v4.0.0/lib/templates/user_menu.mustache) for more information. The lang menu has been moved to reside within the user menu.

:::

The primary navigation (the navbar) apart from the existing content will now display links to the Dashboard, My Courses, Site Admin and Course search, by default. You can still add items to the navbar via the `custom menu` option. This will be displayed within the **'More'** menu.

:::caution Customising the primary navigation

Not yet implemented but we are looking at allowing the full addition and removal of any of the primary navigation tabs in the boost theme config file.

:::

### Secondary navigation

The main content area shows tabs for secondary navigation with a maximum of 5 items being rendered in this **'more'** menu. A new UI component has been created to render menus like this. More information can be found in: [`/lib/templates/moremenu.mustache`](https://github.com/moodle/moodle/blob/v4.0.0/lib/templates/moremenu.mustache)

#### Adding items to the navigation

The secondary navigation pulls information mainly from the settings navigation node from each context. Any plugin that implements the existing navigation hooks will have their items added to the secondary navigation.
Existing navigation hooks:

- `{module}_extend_navigation`
- `{local}_extend_navigation`
- `{report}_report_extend_navigation`
- `{plugin}_extend_navigation_course`
- `{plugin}_extend_navigation_category_settings`

#### Changing the order of tabs

Apart from the previously mentioned functions, you can also create a custom secondary class as mentioned earlier. This will automatically be picked by getter and used to render the secondary nav within the activity. For example, `mod_assign/local/views/secondary`.

:::note

This is currently only possible on an activity and block level.

:::

### Tertiary navigation

Action buttons have been moved to the top of the page and we would encourage you to do the same.
If you have any buttons on an activity page that go to another page, or open a form (or similar), then we encourage you to move them from the body of your activity page to the top. All of the core activities have been updated to follow this pattern. Please take a look to see how you can format your activity in a similar fashion. There is no API here. You are welcome to create the buttons and display them as you wish in this top area.

### New API functions

#### Page API

- Magic getters to fetch the primary and secondary navigation and the primary output.
- The `secondarynav` magic getter also checks whether a custom secondary class has been defined within the module's local\views directory. Use this if you want to deviate from the standard secondary nav structure/order.
- `set_secondarynav` - Force override the secondary navigation class
- `set_secondary_navigation` - Sets the `_hassecondarynavigation` and optionally the `_hastablistsecondarynavigation` to indicate whether a page should render the secondary navigation, and if the secondary navigation should be rendered and behave with a tablist ARIA role (as opposed to its default which is being rendered with a menubar ARIA role).

#### Navigation library

- `set_show_in_secondary_navigation` - whether or not a node should be displayed in the secondary nav. Accepts a single boolean argument
- `set_force_into_more_menu` - whether or not to force a node into the **'More'** menu. Accepts a single boolean argument

<!-- cspell:ignore togglable -->

#### The activity header class

There is a new activity header class that handles the display of information common to activities. Third party activities are not required to explicitly output this information as part of rendering individual pages.

The common information that are currently handled by the class are:

- title
- description
- completion information

As part of the update it was required that the initial information to be displayed by the class be togglable at a theme and layout level. Taking this into account the following theme level configurable exists:

- `activityheaderconfig` - An array that currently only enforces `notitle` but can be expanded in the future.

:::note

Boost has this set as true by default `options`.

:::

The following layout level options that can be defined:

- `noactivityheader` - to remove the header in this specific layout.
- `activityheader` - An array that enforces the following options:
  - `notitle`
  - `nocompletion`
  - `nodescription`

The class has a page level getter which you can use to fetch the current version of the class. The base state is initialised within the constructor with the completion information only fetched when data is exported for the template.

<!-- cspell:ignore hidecompletion -->

The class has setters for the following variables which can be leveraged to modify the header for a particular page in the format `set_{variable_name}`:

- hidecompletion
- description
- title

Alternately, bulk operations can also be done by passing the above variables in an array to `set_attrs` which in turn calls the setters.

:::caution Note

Any updates to the `activityheader` needs to be performed before the call to `$OUTPUT->header`

:::

<!-- cspell:ignore flatnav -->
<!-- cspell:ignore templatecontext -->
<!-- cspell:ignore firstcollectionlabel -->
<!-- cspell:ignore hasblocks -->

##### Theme updates

With the changes in boost to incorporate the primary and secondary navigation, third party themes would need to account for the following in their templates:

- To leverage the activity_header, it's data needs to be exported and included into the base template :
  - `headercontent` being the array element that contains the exported activity_header data

  ```html
  {{#headercontent}}
     {{> core/activity_header}}
  {{#headercontent}}
  ```

- It is recommended to transition towards the secondary/tertiary navigation hierarchy to reduce user cognitive load and with a logical separation of components
  - Secondary navigation can be added to the templates by following the example https://github.com/moodle/moodle/blob/main/theme/boost/templates/columns2.mustache#L64-L68 This leverages the secondary navigation class to generate it's content.
- Flat navigation classes have been marked for deprecation. Themes that leverage the flat_navigation will need to make the following changes in their plugins in order to use it
  - Account for the additional changes [theme changes](#theme-changes)
  - Indicate that they do not implement secondary navigation via the page's `set_secondary_navigation` function. It is recommended to set this within the root layout file, for example, columns2
  - Initialise the flat navigation by introducing the following in the root layout file (if not existent)

   ```php
   $nav = $PAGE->flatnav;
   $templatecontext['firstcollectionlabel'] = $nav->get_collectionlabel();
   ```

- In order to reintroduce the settings cog in the templates, you can introduce the following:

  ```html
  <div id="region-main-settings-menu" class="d-print-none {{#hasblocks}}has-blocks{{/hasblocks}}">
     <div> {{{ output.region_main_settings_menu }}} </div>
  </div>
  ```

:::info Accessibility notes

The jump to `maincontent` div is now rendered within the activity header when within an activity context.

:::

## Component library

Each Moodle installation now ships with a Moodle User Interface (UI) Component library, a documentation system used to describe all the Bootstrap components and the custom Moodle components. The component Library is a helper tool for developers when creating user interfaces, a testing tool for theme developers and a documentation tool for core developers. The ultimate goal of having a component library is to encourage developers to create consistent user interfaces to improve Moodle's overall user experience.

The library contains pages with documentation about User Interface components. It contains details on how to use the component, what variations are available and the JavaScript events / options are associated with the component.

When writing on these pages it is possible to render core mustache templates using some custom syntax like this:

```handlebars
 {{< mustache template="core/notification_error" >}}
 {{< /mustache >}}
```

You can also call core JavaScript or use HTML examples where the HTML code and the rendered result are visible in the Component Library. For more info visit the [Moodle templates](http://componentlibrary.moodle.com/admin/tool/componentlibrary/docspage.php/library/moodle-templates/) page or the [Moodle JavaScript](http://componentlibrary.moodle.com/admin/tool/componentlibrary/docspage.php/library/moodle-javascript/) page.

Each page in the library uses the current CSS from the default theme in your Moodle installation, if you have multiple themes installed and enabled the setting "Allow theme changes on url", the component library will have a theme selector option.

:::tip

A hosted version of the Component Library can be found at [http://componentlibrary.moodle.com](http://componentlibrary.moodle.com).

:::

### Enabling the Component Library

Component library pages are written in the markdown language. These pages need to be compiled to HTML pages before the Component Library is visible. To compile the pages the server running Moodle needs to have [nodeJS and Grunt tools](/general/development/tools/nodejs).

If your server meets all requirements you can enable the library running

```sh
 $ npm install
 $ grunt componentlibrary
```

Further installation instructions can be found in the Component Library itself.

### Documenting new UI Components

There are no set rules for adding new pages in the component library yet. These rules will need to be written and adopted in the integration process for Moodle code.

As a guideline for making this rules consideration are:

- The component library is not about single use components, for example the Moodle grade book (a huge component with many custom features). Or about very common components like buttons, these are already covered by the Bootstrap section of the component library.
- New features should be build keeping in mind the UI part needs to be customisable and if possible (and making sense) reusable. And example would be the new page drawers that we are introducing for the Navigation project. Or the custom primary navigation menus where overflowing items are pushed into a More section.

## Theme changes

<!-- cspell:ignore haseditswitch -->

### Edit switch

On theme boost the "Turn editing on" and "Customise this page" buttons have been replaced by an edit switch in the top navbar. Theme Classic will keep using the old buttons. Child themes can choose to use the edit switch if the theme config.php is using this variable

```php
$THEME->haseditswitch = true;
```

The language menu, which used to be rendered in place of the custom menu has moved to the user dropdown when the user is logged in. If not logged in it will be placed next to the search / notification / messaging icon in the top navbar.

### Login page

The login page has been redesigned and allows the admin to configure a background image for the login page only in the theme settings page. This change is available in both Boost and Classic. The login page still has all the features with an improved layout.

### The page footer

In large screens, the page footer button is only visible when clicking a help button at the bottom right of the screen.

### User initials as profile picture placeholder

If users do not upload a profile picture the user initials are displayed on a rounded gray background as a placeholder picture in the top navbar or any other page using a placeholder image. This change will be available in both Boost and Classic.

With the introduction of this placeholder image the full username will no longer be displayed in the top navbar.

### Removal of back to top link

The "back to top" link will be removed for theme boost since the new course index reduced the dependence on page scrolling. Also, the new footer is positioned where this component used to be.

### Styling changes

By default rounded edges will be used for UI components, for the page header and main content area the borders will be removed.

### New layout page

Theme boost now uses the `drawers.php` layout for the course index and blocks.

## Question bank changes

There was a big project to deliver [Question bank improvements for Moodle 4.0](https://docs.moodle.org/dev/Question_bank_improvements_for_Moodle_4.0) which added a new plugin type for adding features to the question banks, tracking the version history for each question as it is edited (question table has been split into `question`, `question_versions` and `question_bank_entries`), and tracking where each question is going to be used, with new tables `question_references` and `question_set_references`. This work was done in Epic [MDL-70329](https://tracker.moodle.org/browse/MDL-70329) if you want to track down the details of any of the core changes.

### Question type plugins

Amazingly, we (Safat and colleagues at Catalyst AU) managed to implement this without breaking most question type plugins, with one important exception if your questions do shuffling like multiple choice does. See [MDL-74752](https://tracker.moodle.org/browse/MDL-74752). There is a new method called `update_attempt_state_date_from_old_version` which you may need to implement.

However, the changes to the question bank, and the other Moodle 4.0 changes, probably broke the Behat tests for your plugin. To help with fixing that, [MDL-74130](https://tracker.moodle.org/browse/MDL-74130) adds navigation to key question type pages (Preview and Edit for a question, and standard question bank pages like the bank itself, import and export) which should let you fix your test efficiently, and in a way that will work in all Moodle versions since 3.9.

The 'most' in the first paragraph here is because more advance question types may require more effort to fix. For example `qtype_combined` which creates multi-part questions like the core `qtype_multianswer`; or `qtype_pmatch` or `qtype_stack`, which store additional data - questions tests - alongside the question itself. How should that work with versioning?) But, if you have not done weird things like that, you are probably safe. If you find anything else that causes problems, please list it here.

The same thing should apply to question behaviour and question import/export format plugins: no significant changes required (probably just fixing the Behat tests because of the navigation changes).

### New plugin type: qbank plugins

This is not something that will cause problems for people upgrading from 3.x. Rather, it is an exciting possibility you can explore once you have survived process of upgrading to 4.0. There is a whole new plugin type which you can create to add new features to the question bank. For example extra columns, new actions and bulk actions, and so on. See [Question bank plugins](./apis/plugintypes/qbank/index.md).

### Activities that use questions

The probable bad news is if you have an activity module which uses questions. So far, the only activity which has been fixed is `mod_quiz` in Moodle core, so we don't yet have a good picture of what fixes will be necessary in other activities. Work is about to start fixing [`mod_studentquiz`](https://github.com/studentquiz/moodle-mod_studentquiz), so watching that should give more clues. As we do that, we will try to update this section of this page. Other help writing the information required here would also be greatly appreciated.

## The course format system

Most of the logic for rendering and editing a course has been moved to a new subsystem called courseformat. The subsystem is located in "course/format" folder so it includes all the format plugins inside. The methods and modules which are distributed between the course and the course/format folders are now rearranged or refactored to be aligned with the current Moodle coding style.

### Mandatory renderer in course formats

Now format plugins renderer is not optional anymore. Legacy formats without a renderer will get a deprecation message but it will continue working however, they should create a new renderer as soon as possible. The section-based format can do it by extending the provided `core_courseformat\output\section_renderer` class which includes all the necessary methods.

### New format base class

The old `base_format` class (which all plugins extend) is now renamed as `core_courseformat\base`. The new class provides all the functionally of the previous `base_format` but it has been refactored to be used as a centralized source of truth for the course rendering. Legacy formats should extend the new class to avoid the deprecation message.

Now, the plugin format class provides information such as:

- If the page is displaying a single or multiple section
- Give access to other related format objects like the modinfo, the course record, maximum number of sections...
- If the format is compatible with features like course index, reactive components, AJAX...
- Other format specifics like the page title, the default section name, default blocks...

The format instance is now the main object output components will use to render a course (see next section for more information).

<!-- cspell:ignore displaysection -->
<!-- cspell:ignore outputclass -->

### New course output classes and mustache files

Traditionally, section-based course formats uses `print_single_section_page` and `print_multiple_section_page` to render the course content. In Moodle 4.0 most of the course rendering methods are migrated to output components and mustache templates. The old methods will get deprecation messages if they use the old renderer methods.

This is an example of a format rendering a course:

```php
// Get the course format instance.
$format = course_get_format($course);

// Get the specific format renderer.
$renderer = $format->get_renderer($PAGE);

if (!empty($displaysection)) {
    // Setup the format instance to display a single section.
    $format->set_section_number($displaysection);
}

// Create the output instance and render it.
$outputclass = $format->get_output_classname('content');
$widget = new $outputclass($format);

echo $renderer->render($widget);
```

Another important update on course rendering is that now all course structure is rendered using mustache templates instead of the original `html_writer` methods. Now themes are able to override the course format by providing alternative versions of the mustache files. All core course templates are located in `course/format/templates`.

All course format output classes implements the new `named_templatable` interface, which allows the class to define its own template path using the `get_template_name` method. This new interface in combination with [mustache blocks](./guides/templates/index.md#blocks) allows the format plugins to provide alternative templates to render the course.

:::tip Migrating 3.11 course formats doc

All the new output classes and a guide on how to migrate the current third-party plugins can be found in the [Migrating 3.11 formats](./apis/plugintypes/format/migration.md) page.

:::

### Course editor JavaScript modules and frontend components

The majority of the JavaScript logic related to the course editing is replaced by AMD modules. Because this is a major change in the way courses are edited and rendered, by default format plugins will continue using the previous YUI modules for now. However, formats can start using the new libraries overriding the `$format->supports_components()` method.

Some Moodle 4.0 new features are only available for courses using the new editor library:

- Edit the course via the course index
- Creating sections without reloading the course page
- The new move section/activity modal
- Native browser drag&drop implementation

The new course editor uses a component-based reactive pattern to keep track of the course changes. The pattern highlights are:

- The main AMD module `core_crouseformat\courseeditor` maintains a data structure called state.
- Each UI element is implemented as a Component that observes the course state data and reacts to any data change
- When any reactive component needs to modify the course, it asks the course editor to execute a mutation. Mutations encapsulate all web services calls and alter the course state data.

:::tip Reactive library doc

The reactive library documentation, as well as the format plugin migration guide, can be found in the [Moodle 3.11 vs 4.0 course editor architecture](./guides/javascript/reactive/index.md) page.

:::

### Other course related 4.0 changes

Two new web services have been added:

- `core_courseformat_get_state`: user by the new JavaScript course editor to get the current course state data (containing the list of sections, activities, and other course-related data)
- `core_courseformat_update_course`: to alter the current course content. Each call returns the parts of the course state altered by the action

## Behat changes

<!-- cspell:ignore entitytype -->

### New steps

Moodle 4.0 introduces some new behat steps.

Sometimes you want to create a bulk number of activities. In that case you can use:

```
:count :entitytype exist with the following data:
```

For example:

```gherkin
Given 100 "mod_lti > tool types" exist with the following data:
  |name        |Test tool [](count)                  |
  |description |Example description [](count)        |
  |baseurl     |https://www.example.com/tool[](count)|
```

Dynamic (AJAX) tabs is a new feature contributed to Moodle 4.0 by the Workplace team ([MDL-71943](https://tracker.moodle.org/browse/MDL-71943)). You can use the following step to navigate between the tabs.

```gherkin
And I click on the "tab title" dynamic tab
```

To make sure that edit mode is (or is not) available on the current page, the following steps can be used.

```gherkin
And edit mode should be available on the current page
And edit mode should not be available on the current page
```

There are new aliases for the existing steps `I turn editing mode on` and `I turn editing mode off`.

```gherkin
And I switch editing mode on
And I switch editing mode off
```

In addition to the existing step to go to a course with editing mode on, we now have the following step to do the same but with editing mode being off.

```gherkin
And I am on "course full name" course homepage with editing mode off
```

The following step is similar to the old `following "link string" should download between "min bytes" and "max bytes" bytes` step, with more flexibility.

```gherkin
And following "element string" "element type" in the "container string" "container type" should download between "min bytes" and "max bytes" bytes
```

For example:

```gherkin
And following "Download" "link" in the "Starter" "table_row" should download between "0" and "5000" bytes
```

The following step can be used to hover the mouse over the trigger area.

```gherkin
And I hover over the "element string" "element type" in the "container string" "container type"
```

The following step enables an installed plugin.

```gherkin
And I enable "plugin name" "plugin type" plugin
```

:::info For example:

```gherkin
And I enable "course_summary" "block" plugin
```

::::

The following is a special variation of `I click on "<page name>" "link" in the "page" "region"`. It first checks to see if we are on the given page via the breadcrumb. If not we then attempt to follow the link name given.

```gherkin
And I follow the breadcrumb "page name"
```

You can use the following step to ensure a node is active in the navbar.

```gherkin
And I should see "Node" is active in navigation
```

:::info For example:

```gherkin
And I should see "My courses" is active in navigation
```

:::

The following step can be used to navigate to a given node in the primary navigation.

```gherkin
And I select "Node" from primary navigation
```

The following steps are to check whether an item exists in the user menu or not.

```gherkin
And "item text" "selector type" should exist in the user menu
And "item text" "selector type" should not exist in the user menu
```

:::info For example:

```gherkin
And "Language" "link" should exist in the user menu
```

:::

The following steps are to check if a submenu of the user menu is shown, and if an item exists or does not exist in a given user submenu.

```gherkin
And I should see "submenu name" user submenu
And "item text" "selector type" should exist in the "submenu name" user submenu
And "item text" "selector type" should not exist in the "submenu name" user submenu
```

:::info For example:

```gherkin
When I follow "Language" in the user menu
Then I should see "Language selector" user submenu
And "English &lrm;(en)&lrm;" "link" should exist in the "Language selector" user submenu
And "English (pirate) &lrm;(en_ar)&lrm;" "link" should not exist in the "Language selector" user submenu
```

:::

To add enrolment methods to courses you can use the following new step. The data that you provide in the next lines are used to fill the enrolment method form.

```gherkin
And I add "enrolment method" in "course identifier" with:
```

:::info For example:

```gherkin
When I add "Self enrolment" enrolment method in "Course 1" with:
  | Custom instance name     | Test student enrolment |
  | Enrolment key            | moodle_rules           |
  | Use group enrolment keys | Yes                    |
```

:::

There are 3 new steps specific to the calendar component. These steps can be used to hover over a day in the mini-calendar or the full calendar.

```gherkin
And I hover over day "day of month" of this month in the full calendar page
And I hover over day "day of month" of this month in the mini-calendar block
And I hover over today in the mini-calendar block
```

Some new steps are added to question bank to be able to add comment to questions, verify the existence of a comment, and deleting comments form questions. Please note that the steps for adding comments only write the comment text in the comment field. You still need to click on the "Add comment" button to save the comment.

```gherkin
And I add "comment text" comment to question
And I add "comment text" comment to question preview
And I delete "comment text" comment from question
And I delete "comment text" comment from question preview
And I should see "number of comments" on the comments column
And I click "number of comments" on the row on the comments column
```

:::info For example:

```gherkin
And I navigate to "Question bank" in current page administration
And I should see "0" on the comments column
And I click "0" on the row on the comments column
And I add "test comment 01" comment to question
And I click on "Add comment" "button" in the ".modal-dialog" "css_element"
And I click on "Close" "button" in the ".modal-dialog" "css_element"
And I should see "1" on the comments column
And I click "1" on the row on the comments column
And I delete "test comment 01" comment from question
```

:::

Similar to the steps for comments, the following steps are to verify the number of a question's usage and to click on it in order to open the question usage modal.

```gherkin
And I should see "usage count" on the usage column
And I click "usage count" on the usage column
```

The following new steps are related to bulk actions in the question bank UI.

```gherkin
And I click on question bulk action "action"
And I should see question bulk action "action"
And I should not see question bulk action "action"
```
<!-- cspell:ignore deleteselected -->

:::info For example:

```gherkin
And I click on "First question" "checkbox"
And I click on "Second question" "checkbox"
And I click on "With selected" "button"
And I should see question bulk action "deleteselected"
And I click on question bulk action "deleteselected"
And I click on "Delete" "button" in the "Confirm" "dialogue"
```

:::

[Report builder](https://docs.moodle.org/en/Report_builder) is a new feature contributed to Moodle 4.0 by the Workplace team. The following new step is added to Moodle 4.0 to select an action from the action menu in the list of custom reports table.

```gherkin
And I press "action" action in the "report name" report row
```

There's another step related to the report builder to set a column's aggregation in the report editor.

```gherkin
And I set the "column title" column aggregation to "aggregation method"
```

:::info For example:

```gherkin
And I set the "First name" column aggregation to "Comma separated values"
```

:::

The following step needs to be used in scenarios that involve testing BigBlueButton. For this to work, you need to have a [BigBlueButton Mock API Server](https://github.com/moodlehq/bigbluebutton_mock) and set `TEST_MOD_BIGBLUEBUTTONBN_MOCK_SERVER` to point to that in config.php.

```gherkin
And a BigBlueButton mock server is configured
```

The following step replicates receiving a callback from the BigBlueButton server indicating the recordings for meetings are ready for viewing.

```gherkin
And the BigBlueButtonBN server has sent recording ready notifications
```

The following steps are specific to the lesson activity.

:::note

In 4.0, some links (such as the "edit" and the "grade essays" links) are replaced by buttons, so you need to update your old steps with the new ones.

:::

```gherkin
And I edit the lesson
```

A new step is added to be used in lesson activities to edit them. This step navigates the user to the lesson edit page.

```gherkin
And I grade lesson essays
```

It's a new step to go to the "Grade essays" page of the lesson we are currently in.

```gherkin
And I select edit type "edit type"
```

Select the lesson edit type when we are in the the lesson's edit page. "edit type" can either be "Collapsed" or "Expanded".

The following new step can be used to navigate to the exports page in the course gradebook and select the specified export type from the grade exports navigation selector.

```gherkin
And I navigate to "export option" export page in the course gradebook
```

:::info For example:

```gherkin
And I navigate to "XML file" export page in the course gradebook
```

:::

Similarly, there's a new step to navigate to the imports page in the course gradebook and select the specified import type from the grade imports navigation selector.

```gherkin
And I navigate to "import option" import page in the course gradebook
```

### Boost steps

In addition to the steps listed in the previous section, there are also some Boost specific steps coming with Moodle 4.0. These steps only work in Boost or Boost child themes, so you need to make sure they are not used in scenarios that may be run by non-Boost themes.

The following step checks whether a node is active in the secondary navigation.

```gherkin
And I should see :name is active in secondary navigation
```

The Boost theme shows the language selector menu in the primary navigation when not logged in, and within the user menu when logged in. The following steps are to check if the primary navigation includes the language selector menu.

```gherkin
And language selector menu should exist in the navbar
And language selector menu should not exist in the navbar
```

And the following steps can be used to check whether an item exists in the language selector menu in the Boost theme.

```gherkin
And "item text" "selector type" should exist in the language selector menu
And "item text" "selector type" should not exist in the language selector menu
```

:::info For example:

```gherkin
And "English &lrm;(en)&lrm;" "link" should exist in the language selector menu
```

:::

### Modified steps

The step `I change the (window|viewport) size to "size"` now supports 2 new values for the size argument. The size argument now accepts `mobile` and `tablet` values in addition to `small`, `medium` and `large`.

### Removed steps

Some behat steps are removed or replaced with new steps.

As a result of some design changes, hidden or restricted activities are no longer dimmed. Therefore the step

```gherkin
And "Activity or resource name" activity should be dimmed
```

is now removed. Depending on what you were using that step for, you may be able to use these steps:

```gherkin
And "Label name" label should be hidden
```

```gherkin
And "Activity or resource name" activity should be hidden
```

```gherkin
And I should see "Activity or resource name"
And "Activity or resource name" "link" should not exist in the "region-main" "region"
```

### Other things to consider

To make behat tests more readable and easy to maintain, it is recommended to use the most direct steps to get what the test needs. It is highly recommended to use

```gherkin
 I am on the "Activity name" "[modname] activity" page
```

or

```gherkin
 I am on the "Activity name" "[modname] activity" page logged in as "user"
instead of navigating to the activity via
 I am on "Course" course homepage
 I follow "Activity name"
```

Now that course index is integrated these behat steps will fail using Boost theme:

```gherkin
 I am on "Course" course homepage
 I follow "Activity name"
```

The reason for it is that the drawer used in Boost is hiding the course index. So when the test is trying to follow an "Activity name" link, it finds two different links:

- one in the course index
- another one in the course main content.

But the first one, the one in the course index, is hidden by the drawer, and the test fails.

However the recommended behat steps

```gherkin
 I am on the "Activity name" "[modname] activity" page
```

or

```gherkin
 I am on the "Activity name" "[modname] activity" page logged in as "user"
```

Old behat steps that may now fail can be updated to the new steps. For example:

```gherkin
 And I am on the "Test assignment name" "assign activity" page logged in as teacher1
```

instead of:

```gherkin
 When I log in as "teacher1"
 And I am on "Course" course homepage
 And I follow "Test assignment name"
```

Or for settings, instead of:

```gherkin
And I follow "Test choice name"
And I navigate to "Edit settings" in current page administration
```

Use:

```gherkin
And I am on the "Test choice name" "choice activity editing" page
```

There are also similar stream-lined navigation steps for accessing question bank pages. See [MDL-74130](https://tracker.moodle.org/browse/MDL-74130).

## Other

### Core plugins review

A few plugins from core Moodle LMS which are no longer or hardly used have been removed and, if appropriate, added to the Moodle plugins directory.

:::info

More information about this project, the list of plugins to be removed and the process to follow for keeping them before upgrading to 4.0 can be found in the [Core plugins review](https://docs.moodle.org/dev/Core_plugins_review) project page.

:::

### Core blocks cleanup

In the "Add a block" menu, the list of blocks was really long. A few changes have been done to reduce this list.

:::info

More information about this project can be found in the [Add a block cleanup](/general/projects/code/block-cleanup) project page.

:::

<!-- cspell:ignore Pimenko -->

### Site admin presets plugin

The third-party plugin [Admin presets](https://moodle.org/plugins/block_admin_presets), created by David Monllaó and maintained by developers from [Pimenko](https://pimenko.com/) has been adapted and integrated into Moodle 4.0. It stores settings and plugins status (enabled/disabled) in what's called "presets" to let admins quickly switch between different configurations.

:::info

More information about this project can be found in the [Site admin presets](https://docs.moodle.org/dev/Site_admin_presets) project page.

:::

### JavaScript browser support changes

From Moodle 4.0, Internet Explorer is no longer supported. See [MDL-73915](https://tracker.moodle.org/browse/MDL-73915) and [MDLSITE-6109](https://tracker.moodle.org/browse/MDLSITE-6109) for further information on this change.

This change means that changes built on 4.0 onwards (including the main branch) will be different to older versions of Moodle.

For plugin developers supporting multiple versions of Moodle using a single plugin version, the compiled JavaScript files are backwards compatible and will _work_ on all supported versions, however if you run the `grunt` command on multiple versions you will see unbuilt changes. Running grunt on all versions of Moodle is not necessary and this check can be safely disabled for Moodle versions 3.9 - 4.0, as long as only at least you run `grunt` against at least one version of Moodle.

If you need to support Internet Explorer and do not wish to fork your plugin for Moodle 4.0 onwards, then it is recommended that you run `grunt` on an older version of Moodle.

### The course index element

The new course index feature can be themed using a set of scss variables. Use them to change the look and feel instead of adding custom CSS

```
 /theme/boost/scss/moodle/courseindex.scss
```

With the introduction of the course index component, the previous and next links shown underneath each activity are no longer needed and they will be removed.

### Activity icons

The icons used for activities have been redesigned and updated for all core moodle activities.

When viewing the new icons in a file manager, for example for the quiz activity, you will see a simple black monochrome icon with a transparent background.

On the course page, or in the activity chooser, the icon will display as a white icon on a coloured background. Styling of the icons on the course page is controlled by the CSS in `theme/boost/scss/moodle/icons.scss`.

The background colour for activity icons is set using a new variable in function `[modname]_supports()`. The quiz activity is of type assessment, so in function `quiz_supports()` there is a new line defining the purpose:

```php
 case FEATURE_MOD_PURPOSE: return MOD_PURPOSE_ASSESSMENT;
```

Available purposes are:

- MOD_PURPOSE_COMMUNICATION: e.g. chat, choice, feedback, survey
- MOD_PURPOSE_ASSESSMENT: e.g. assign, quiz, workshop
- MOD_PURPOSE_COLLABORATION: e.g. data, forum, glossary, wiki
- MOD_PURPOSE_CONTENT: e.g. book, folder, lesson, label, page
- MOD_PURPOSE_ADMINISTRATION: e.g. attendance
- MOD_PURPOSE_INTERFACE

The background colours linked to these purposes are set in `theme/boost/scss/moodle/variables.scss`

```scss
 $activity-icon-colors: map-merge(
     (
         "administration": #5d63f6,
         "assessment": #eb66a2,
         "collaboration": #f7634d,
         "communication": #11a676,
         "content": #399be2,
         "interface": #a378ff
     ),
     $activity-icon-colors
 );
```

If activity plugins do not define `FEATURE_MOD_PURPOSE` the activity icon will be rendered against a light grey background. There is no requirement to define the purpose of activity plugins, it will only affect the icon styling.

Plugins implementing the variable `FEATURE_MOD_PURPOSE` are only supported on Moodle 4.0 and newer.

Customising the activity icon can be done in an alternative way. For example using the `styles.css` in `mod/[pluginname/styles.css`

In the example below the activity plugin developer chooses to keep the coloured icon for the activity and render it as large as the coloured background on the core activities

<!-- cspell:ignore activityiconcontainer -->

```css
 .modicon_subcourse.activityiconcontainer {
     background-color: transparent;
     padding: 0;
 }

 .modicon_subcourse.activityiconcontainer img {
     width: 50px;
     height: 50px;
 }
```

To customize all icon colours use this scss array and add it to the 'Raw initial SCSS' in the theme Boost advanced settings page. The complete array of icon background colours can be overridden using the 'Raw initial SCSS' in the theme settings page. The example below changes the colours of each activity type.

```scss
 $activity-icon-colors: (
     "administration": #5D63F6,
     "assessment": #11A676,
     "collaboration": #EB66A2,
     "communication": #F7634D,
     "content": #399BE2,
     "interface": #A378FF
 );
```

## I'm a developer, what do I need to know?

This section is a quick checklist of the areas in this document that you should consult when updating your plugin.

### Modules

If you are a module developer (activity / resources) then you need to review the following updates and changes:

- If using settings, reformat to work with the secondary navigation. We have significantly changed the way that settings are shown. Settings added to the course and activity administration branch of the navigation are now by default shown in the secondary navigation. You will most likely find them in the more section of the secondary navigation. Please avoid creating settings in containers (a parent navigation node with children). These settings will still be shown, but this goes against the pattern that we are trying to establish for navigation around the site. If you have a lot of settings, consider creating a specific page to handle your additional settings.
  - The order of the items in the secondary navigation may not be to your liking. This can be changed. See [changing the order of tabs](#changing-the-order-of-tabs).
- Update my behat tests to use new steps for site navigation. See [new behat steps](#behat-changes).
- Update my module to use the new activity_header API. See [the activity header](#the-activity-header-class).
- Update my pages to make it work with the general format of the tertiary navigation. See [the tertiary navigation](#tertiary-navigation).
- Update my activity icon to use the API and set a purpose. See [activity icons](#activity-icons).

### Themes

If you are a theme developer then you may want to consider the following:

- Take a look at the [new navigation](#navigation-changes) and decide if you want to incorporate this into your theme.
  - A new layout ([drawers](#new-layout-page))
  - An [edit switch](#edit-switch)
  - The [course index](#the-course-index-element)
- Use of the flat nav
- New Site administration page and layout
- Course settings and how they are displayed

### Course format

There have been a lot of changes made to the course format. Most in the process of moving the course format away from using the old rendering system and towards templates.
We recommend the following sections be read carefully:

1. [The course format](#the-course-format-system). There have been a lot of deprecations and reading this section is critical in understanding the changes made.
1. Consider moving the rendering of your content over to the [template system](./guides/templates/index.md).

### Other plugins

1. Are you adding settings? See the [secondary nav](#adding-items-to-the-navigation) for adding items to this navigation bar.
1. Have a look at [secondary](#secondary-navigation) and [tertiary](#tertiary-navigation) navigation changes in general if you have a plugin that has multiple pages to navigate around.
1. Do you have behat tests? Check the new [behat changes](#behat-changes).
