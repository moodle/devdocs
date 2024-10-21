---
title: Course format
tags:
  - Plugins
  - Format
---

<!-- cspell:ignore pluginskel -->
<!-- cspell:ignore navigationlib -->
<!-- cspell:ignore cmitem -->
<!-- cspell:ignore controlmenu -->

import { getExample } from '@site/src/moodleBridge';
import { ComponentFileSummary } from '../../../_utils';
import {
    Lang,
    Lib,
    VersionPHP,
} from '../../_files';

Course formats are plugins that determine the layout of course resources.

Course formats determine how the course main page looks like (/course/view.php) in both view and editing mode. They are also responsible for building a navigation tree inside the course (displayed to users in the navigation block, course index, and breadcrumb). They can organize the course content in sections. The course creator or teacher can specify the course format for the course in the course edit form.

Course formats also can add their own options fields to the course edit form. They can add course-dependent content to the header/footer of any page inside the course, not only /course/view.php

## File structure

All course format files must be located inside the **course/format/pluginname** folder.

<details>
  <summary>View an example directory layout for the `format_pluginname` plugin.</summary>

```console
 course/format/pluginname/
 |-- classes
 |   `-- output
 |       `-- courseformat
 |           `-- (Overridden outputs)
 |       `-- renderer.php
 |-- db
 |   `-- access.php
 |-- lang
 |   `-- en
 |       `-- format_pluginname.php
 |-- format.php
 |-- lib.php
 `-- version.php
```

</details>

Some of the important files for the format plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### format.php

import Format from '!!raw-loader!./_examples/format.php';

<ComponentFileSummary
    required={true}
    filepath="/format.php"
    summary="Format file course rendering"
    plugintype="format"
    pluginname="pluginname"
    example={Format}
    description="This file the layout itself. It is included from course/view.php when a user accesses the course."
/>

As it can be seen in the example, once the format base instance is created (the return object of `core_courseformat\base::instance` function), the plugin must define any necessary setting (in the example is just set_section_number but any plugin can define its own extra methods). Once this is done, the get_output_classname will return the correct class name for the content output and the format renderer will be responsible for rendering the full course. See [Rendering a course](#rendering-a-course) for more information.

### lib.php

import LibExample from '!!raw-loader!./_examples/lib.php';

<Lib
    plugintype="format"
    pluginname="pluginname"
    example={LibExample}
    legacy={false}
    required
>
The main library of the format. It should contain a class `format_pluginname` extending `core_courseformat\base`, this class is known as the format base class. Also, it may contain callbacks for other core and contributed APIs if necessary.
</Lib>

The format base class is the most important part of the course format as it defines how the format interacts with both frontend and backend. Depending on the methods a format plugin overrides the course will behave in different ways.

### lang/en/format_pluginname.php

import langExample from '!!raw-loader!./_examples/format_lang.php';

<Lang
    plugintype="format"
    pluginname="pluginname"
    example={langExample}
/>

### classes/output/renderer.php

import Renderer from '!!raw-loader!./_examples/renderer.php';

<ComponentFileSummary
    required={true}
    filepath="/format.php"
    summary="Format file course rendering"
    plugintype="format"
    pluginname="pluginname"
    example={Renderer}
    required
    description="Unlike the rest of the Moodle plugins, all course format plugins must provide a renderer."
/>

This class should:

- use the namespace `format_pluginname\output` (all files in the classes folder should be namespaced)
- be called renderer (all files in the classes folder match the name of the file)
- extend `core_courseformat\output\section_renderer`. See Output renderers for more information.
- Use the namespace `format_pluginname\output` (all files in the classes folder should be namespaced)
- The class should be called renderer (all files in the classes folder match the name of the file)
- Should extend `core_courseformat\output\section_renderer`. See Output renderers for more information.

Renderer methods are powerful enough to override all the rendering logic of the course. However, by default, the way to render a course should be based on output classes and templates (see the [output structure section](#format-output-classes-and-templates) for more information).

Since the course format is all about the display it is very important to separate HTML and PHP. All HTML code should be in your `format_pluginname_renderer` class in renderer.php. Ideally, format.php will only call one function from the renderer. Use of renderer is required if you want to output content header and footer.

### version.php

<VersionPHP
    plugintype="format"
/>

### classes/output/courseformat/

<Since
  version="4.0"
  issueNumber="MDL-65974"
/>

The course rendering is based on output classes and templates. Course format plugins can override specific output classes to provide alternative data to the templates. All output classes inside output/courseformat folder will override the default ones automatically. See the output structure section below for more information

### templates/ and templates/local/

<Since
  version="4.0"
  issueNumber="MDL-65974"
/>

The course rendering is based on output classes and templates. This folder will contain the specific mustache templates of your plugin. See the [override mustache blocks section](#override-mustache-blocks) section for more information.

## Creating a new format

### Using tool_pluginskel

The easiest way to create a new course format using the latest version of tool_pluginskel. You can use the following yaml file to generate a basic course format skeleton. It is important to note that the "requires" attributes should be at least 4.0 in order to generate a Moodle 4.0+ version of the plugin, otherwise the resulting plugin will use a deprecated structure.

<details>
  <summary>View pluginskel recipe</summary>
  <div>

import PluginskelRecipe from '!!raw-loader!./_examples/pluginskel_recipe.yaml';

<CodeBlock language="yaml">{PluginskelRecipe}</CodeBlock>

  </div>
</details>

### Manual option: copy the code from an existing code

However, if for some reason you cannot use the latest version of tool_pluginskel, you can copy the code from the topics or weeks formats. Once you do the copy you should:

1. Copy the folder containing the format files.
2. Rename the folder to the new name. Course format names cannot exceed 21 characters.
3. Rename language files in course/format/pluginname/lang/
4. Change `$string['pluginname']` in course/format/pluginname/lang/en/format_pluginname.php to the new name.
5. Rename class name in lib.php to format_pluginname.
6. Search and replace other occurrences of the old format name, for example in renderer, capabilities names, settings, JavaScript libraries, etc.
7. The new format is ready for modification.
8. After modifying the code, check it with the Code checker.

## Upgrading format to the next Moodle version

Read the files course/format/upgrade.txt, lib/upgrade.txt, and also upgrade.txt of the core APIs that you use in your course format plugin and make changes according to them. When testing don't forget to enable Developer debugging level and error display (Settings->Developer->Debugging).

In case your plugin is a Moodle 3.11 compatible plugin, see the [migration guide](./format/migration) for more information.

## Extending the format base class

All format plugins require a lib.php file containing a format_pluginname class. This class should extend `core_courseformat\base` and define how the plugin will integrate with the core_courseformat subsystem.

Here are the main features in course formats and responsible for them format_base functions.

## Course sections

There is existing functionality in Moodle core to support organizing course modules into sections. Course format plugins do not have to use them but most of them do. Database table `course_sections` stores basic information about sections. Also section info is cached and returned by `format->get_modinfo()` (or the global function `get_fast_modinfo()`) so every action changing the sections must be followed by rebuild_course_cache(). Course module must always belong to the section. Even if your course format does not use sections, the section with the number 0 is always created.

You must define `$string['sectionname']` if your language file even if the format does not use sections because it can be called unconditionally from other parts of the code, even though it won't be displayed.

| `core_courseformat\base` Overridable method  | Description  |
|---|---|
| `uses_sections()` | returns true or false if the format uses sections or not. There is a global function <br/> `course_format_uses_sections()` that invokes it. It affects default navigation tree building. Various modules and reports may call this function to know whether to display the section name for the particular module or not. |
| `get_default_section_name()` | This method gets the default section name if the user has not provided a value for the section name. In format_base, it basically calls `get_section_name()`, which returns the `$string['sectionname']` + the section number of the current section, if available, or blank, otherwise. It can be used in conjunction with your course format's `get_section_name()` implementation. For reference, please refer to the implementations in format_topics and format_weeks classes. |
| `get_section_name()` | Returns the name for a particular section. This function may be called often so it should use only fields cached in section_info object (field course_sections.name is always cached) <br/> In 3.0+, it checks if the `$string['sectionname']` is available in the lang file. If the section name string is not available, it returns an empty string. |
| `get_view_url()` | Returns the URL for a particular section, it can be either anchored on course view page or separate page. See parent function PHPdocs for more details |
| `is_section_current()` | Specifies if the section is current, for example, current week or highlighted topic. This function is only used if your renderer uses it for example if your renderer extends format_section_renderer_base. This function is not called from anywhere else in Moodle core. |
| `get_section_highlighted_name()` | Return the textual label for a current/highlighted section.|
| `set_section_number()` | Setup the format base instance to display a single section instead of all. This method is used to prepare the format base instance to render the course. |
| `get_section_number()` | Return zero if the course will deploy all sections or a section number if the current page is only presenting a single section. |
| `get_course_display()` | Return `COURSE_DISPLAY_SINGLEPAGE` or `COURSE_DISPLAY_MULTIPAGE` depending if the course has multiple section per page or not. |
| `get_last_section_number()` | Returns the last section |
| `get_max_sections()` | Returns the maximum number of sections this format can contain |
| `page_title()` | Formats can override this method to alter the page title. |

### Course features

The format base class has several methods to integrate the course format with the frontend course editor and its webservices.

| `core_courseformat\base` Overridable method  | Description  |
|---|---|
| `ajax_section_move()` | Code executed after sections were rearranged using drag and drop. See the example in format_topics where sections have automatic names depending on their sequence number |
| `uses_course_index()` | Return true if the course format is compatible with the course index drawer. Note that classic based themes are not compatible with the course index. |
| `uses_indentation()` | If the format uses the legacy activity indentation. |
| `supports_components()` | Since Moodle 4.0 the course is rendered using reactive UI components. This kind of component will be the only standard in Moodle 4.3+ but, until then, formats can override this method to specify if they want to use the previous UI elements or the new ones. |
| `supports_news()` | Determine if the news forum is mandatory or not on the course format. |
| `get_default_blocks()` | Course format can specify which blocks should be added to the course page when the course is created in this format.<br/>If the course format is changed during course edit, blocks are not changed.<br/>Whatever course format specifies in the method, site admin can override it with `$CFG->defaultblocks_override` or `$CFG->defaultblocks_pluginname` |
| `extend_course_navigation()` | This function is called when a navigation tree is built.<br/>Node for the course will be created in navigationlib for you and all standard available branches like 'Participants' or 'Reports' will be added to it. After that course format can add nodes for sections and modules. There is a default implementation that adds branches for course sections and modules under them. Or if the course format does not use sections, all modules will just be placed under course mode. The course format is able to override the default navigation tree building.<br/>Note that if navigationlib can not find the node for the current course module, the node will be added automatically (after this callback). |

### Course format options

The core table `course_format_options` in Moodle database is designed to store additional options for course formats. Those options may belong for the whole course or just for course section.

Course format options must not have the same names as fields in database table `course`, section options must not have the same names as fields in `course_sections`. Also, make sure names do not duplicate completion and conditional fields in edit forms.

When the teacher changes the course format in the course edit form AND the old and the new course formats share the same option name, the value of this option is copied from one format to another. For example, if the course had format Topics and had 8 sections in it and teacher changes format to Weeks, the course will have 8 weeks in it.

During backup the course format options are stored as if they were additional fields in `course` table. Do not store IDs of elements (courses, sections, etc.) in course format options because they will not be backed up and restored properly. You can use section numbers because they are relative inside the course. If absolute ids are necessary you can create your own backup/restore scripts, see Backup API.

Webservices expect course format options to be passed in additional entities but for backward compatibility `numsections`, `hiddensections` and `coursedisplay` can also be passed as if they were fields in `course` table.

| `core_courseformat\base` Overridable method  | Description  |
|---|---|
| `course_format_options()` | By overriding this method course format specifies which additional options it has for course |
| `section_format_options()` | By overriding this method course format specifies which additional options it has for course section. Note that since section information is cached you may want to cache some additional options as well. See PHPdocs for more information |
| `get_format_options()` | (usually no need to override) low level function to retrieve course format options values. It is more convenient to use methods get_course() and get_section() |
| `create_edit_form_elements()` | This function is called to alter course edit form and standard section edit form. The default implementation creates simple form elements for each option defined in either `course_format_options()` or `section_format_options()`. Overwrite it if you want to have more comprehensive form elements or if you do not want options to appear in edit forms, etc. |
| `edit_form_validation()` | Overwrite if course format plugin needs additional validation for it's option in course edit form |
| `update_format_options()` | (usually no need to override) low level function to insert/update records in db table `course_format_options` |
| `update_course_format_options()` | updates course format options with the data from the edit course form. The plugin can override for example to include calculated options fields, especially when the course format is being changed. For example, format_topics and format_weeks automatically fill field `numsections` when the user switches from other format |
| `update_section_format_options()` | updates course format options for the section with the data from the edit section form |
| `editsection_form()` | Return an instance of moodleform to edit a specified section. Default implementation returns instance of `editsection_form` that automatically adds additional fields defined in section_format_options() |
| `get_default_course_enddate()` | Overwrite if the course format is time-based. The base class calculates the default course end date based on the number of sections. |
| `delete_format_data()` | This hook method is called when the course is deleted and can be used to remove any course data not stored in the standards `course_format_options` and `course` tables (like user preferences, for example). |

Course format base helpers
The format base class is used for all the core_courseformat integrations, from settings to rendering. All course output classes will receive the course format instance as a primary param and the class has several helper methods to get information about the format.

| `core_courseformat\base` Overridable method  | Description  |
|---|---|
| `get_course()` | (no need to override) returns object with all fields from db table `course` AND all course format options |
| `get_section()` | (no need to override) returns instance of section_info. It will contain all fields from table `course_sections` and all course format options for this section |
| `get_sections()` | Return all course sections (it is just a wrapper fo the modinfo get_section_info_all) |
| `get_course_display()` | Returns if the course is using a multi page or a single page display (`COURSE_DISPLAY_MULTIPAGE` or `COURSE_DISPLAY_SINGLEPAGE`) |
| `get_modinfo()` | Returns the current course modinfo (equivalent to get_fast_modinfo but without specifying the course) |
| `get_renderer()` | Return the course format renderer instance |
| `get_output_classname()` | This method gets a relative output class path (for example, "content\\section") and returns the correct output class namespace depending on if the format has overridden outputs or not. See [overriding output classes](#override-output-classes) section for more information. |
| `is_section_current()` | Returns if a specific section is marked as current (highlighted) or not. |
| `show_editor()` | Do all the user and page validations to know if the current course display has to include editor options or not. This includes both page editing mode and user capabilities. You can pass an array of capabilities which should be checked. If none specified, will default to `moodle/course:manageactivities`. |

## Rendering a course

Each format plugin is responsible for rendering the course in the format.php file, this means each plugin can choose how to render the course content. However, there are some conventions on how a course should be rendered to integrate the plugin with the existing components.

The course rendering is done using four mains elements:

- **File view.php:** responsible for setting up the format base instance and rendering the content.
- **Course format renderer:** all format plugins must provide its own version of the `core_courseformat\output\section_renderer` (or provide an equivalent class with all the necessary methods).
- **Output classes:** by default all course elements have a specific output class inside course/format/output/local folder. Each one of them is responsible for generating the necessary data to render the templates. Format plugins can provide alternative versions of those output classes (see [override output classes](#override-output-classes) for more information)
- **Mustache templates:** each output class has its equivalent mustache template inside course/format/templates. All the course content is rendered using a single "content" template that includes all the rest as sub-templates. For this reason, a plugin that wants to override some templates must provide some extra templates in order to keep the template structure. See [Creating the basic output structure](#creating-the-basic-output-structure) section for more information.

Unless there's a reason for it, the course structure should be rendered overriding the standard outputs and mustache templates.

## Format output classes and templates

The following diagram shows the standard output classes structure:

![Output classes structure](./_files/course_format_output.png)

There are three renderer methods used for refreshing fragments of the course page:

- **render_content:** used to render the full course. This method is not necessary as the content output itself will be used by default.
- **course_section_updated:** needed when the frontend needs to render a particular section. It is used mostly when a new section is created. By default it renders the core_courseformat\output\local\content\section output.
- **Course_section_updated_cm_item:** used every time the frontend needs to update an activity card on the course page. By default it will render the core_courseformat\output\local\content\section\cmitem. The reason why it uses this specific output is that it renders the full course module list item, not just the activity card.

By default, the base renderer methods will use the format output components to render the full course. In case your plugins have special needs, it is possible to override those three methods directly into the format renderer class.

### Override output classes

Instead of having several renderer methods on a single file, the core_courseformat subsystem splits the output logic through several small classes, each one for a specific UI component. Format plugins can easily override specific classes to alter the template data.

The course format base class has a special method called **get_output_classname** that returns the overridden class name if available in the format plugin (or the core one if not). In order to detect the format classes, your plugin must place the overridden one in the equivalent path inside your plugin format_pluginname\output\courseformat\ folder

For example, if a format plugin wants to add new options to the section action menu it should override the core_courseformat\output\local\content\section\controlmenu. To do so the plugin class should be format_pluginname\output\courseformat\content\section\controlmenu. You can find an example of an overridden output in the "course/format/topics/classes/output/courseformat/content/section/controlmenu.php" file.

### Creating the basic output structure

By default, the course renderer will use the core_courseformat output classes and templates. To override some parts of the course elements the plugin must provide a minimum output classes and template structure.

#### Basic output classes

It is recommended your plugin overrides the 3 main course format elements:

- format_pluginname\output\courseformat\content
- format_pluginname\output\courseformat\content\section
- format_pluginname\output\courseformat\content\section\cmitem

Those output classes should extend the equivalent core ones but, at least, they should override the **get_template_name** method to redirect the rendering template to the overridden template. It could also override the export_for_template to alter the template data if necessary.
This is the minimum output classes your plugin must provide:

<Tabs>
  <TabItem value="contentOutput" label="Content" default>

import OutputContent from '!!raw-loader!./_examples/output/content.php';
export const OutputContentProps = {
    examplePurpose: 'Output content',
    plugintype: 'format',
    pluginname: 'pluginname',
    filepath: '/output/courseformat/content.php',
};

<div>{getExample(OutputContentProps, OutputContent)}</div>

  </TabItem>
  <TabItem value="sectionOutput" label="Section">

import OutputSection from '!!raw-loader!./_examples/output/section.php';
export const OutputSectionProps = {
    examplePurpose: 'Output section',
    plugintype: 'format',
    pluginname: 'pluginname',
    filepath: '/output/courseformat/content/section.php',
};

<div>{getExample(OutputSectionProps, OutputSection)}</div>

  </TabItem>
  <TabItem value="cmitemOutput" label="Cmitem">

import OutputCmitem from '!!raw-loader!./_examples/output/cmitem.php';
export const OutputCmitemProps = {
    examplePurpose: 'Output cmitem',
    plugintype: 'format',
    pluginname: 'pluginname',
    filepath: '/output/courseformat/content/section/cmitem.php',
};

<div>{getExample(OutputCmitemProps, OutputCmitem)}</div>

  </TabItem>
</Tabs>

#### Basic template files

Unlike output classes, mustache files cannot be extended nor overridden. To be able to alter specific mustaches your plugin must provide a minimum template structure. To allow partial overriding, the core_courseformat template uses blocks instead of inclusions to include sub templates.

This is the minimum template structure your plugin must provide:

<Tabs>
  <TabItem value="contentTemplate" label="Content" default>

import TemplateContent from '!!raw-loader!./_examples/output/content.mustache';

<CodeBlock language="handlebars" title="templates/local/content.mustache">{TemplateContent}</CodeBlock>

  </TabItem>
  <TabItem value="sectionTemplate" label="Section">

import TemplateSection from '!!raw-loader!./_examples/output/section.mustache';

<CodeBlock language="handlebars" title="templates/local/content/section.mustache">{TemplateSection}</CodeBlock>

  </TabItem>
  <TabItem value="cmitemTemplate" label="Cmitem">

import TemplateCmitem from '!!raw-loader!./_examples/output/cmitem.mustache';

<CodeBlock language="handlebars" title="templates/local/content/section/cmitem.mustache">{TemplateCmitem}</CodeBlock>

  </TabItem>
</Tabs>

### Override mustache blocks

Once your plugin has the basic mustache structure, you can provide extra mustache blocks to override parts of the page. To do so it is important to understand first the special way in which the course format mustaches are included.

Most moodle mustache files include sub-templates by doing `{{> path/to/the/template }}`. However, in the course format subsystems, all sub-templates are loaded using a slightly different pattern.

<details>
  <summary>View example: override course format templates using mustache blocks</summary>
  <div>

For example, imagine a mustache file "original/path/parent" including "original/path/to/the/template":

```handlebars
{{$ original/path/to/the/template }}
    {{> original/path/to/the/template }}
{{/ original/path/to/the/template }}
```

Using this pattern any parent template can replace the sub-template doing:

```handlebars
{{! Then include the parent template }}
{{< original/path/parent }}
    {{! Add custom blocks. }}
    {{$ original/path/to/the/template }}
        {{> new/template/path }}
    {{/ original/path/to/the/template }}
{{/ original/path/parent }}
```

Or can wrap the content with extra HTML:

```handlebars
{{! Then include the parent template }}
{{< original/path/parent }}
    {{! Add custom blocks. }}
    {{$ original/path/to/the/template }}
        <div class="wrapelement">
            {{> new/template/path }}
        </div>
    {{/ original/path/to/the/template }}
{{/ original/path/parent }}
```

Of even replace the fill block by an alternative HTML:

```handlebars
{{! Then include the parent template }}
{{< original/path/parent }}
    {{! Add custom blocks. }}
    {{$ original/path/to/the/template }}
        <div class="new elements">
            Here you can use the template {{outputdata}}
        </div>
    {{/ original/path/to/the/template }}
{{/ original/path/parent }}
```

  </div>
</details>

Due to the fact that mustache blocks are not scoped, blocks can be overridden by any of the parent templates. This generates some possible scenarios depending on your format needs:

- **[Scenario 1](#scenario-1-adding-blocks-directly-on-the-three-main-mustache-templates):** your format just overrides a few course elements like adding menu options o tweaking the sections or activity HTML.
- **[Scenario 2](#scenario-2-keep-all-the-intermediate-templates-structure):** your plugin needs a big UI change, keeping the general structure but altering several course elements.
- **[Scenario 3](#scenario-3-just-keep-a-few-renderer-methods):** Your plugin is a completely different thing that does not follow any standard course rule. Almost everything in your format is done from scratch.

#### Scenario 1: adding blocks directly on the three main mustache templates

If your format only overrides a few inner templates of the course, the overriding blocks can be located in one of the 3 basic templates:

- **local/content:** for general course structure elements
- **local/content/section:** to alter section elements
- **local/content/section/cmitem:** to alter activity elements

<details>
  <summary>View example</summary>
  <div>

If a format requires to override the activity visibility badges your format_pluginname/local/content/section/cmitem template will look like:

```handlebars
{{! include the original course format template block }}
{{< core_courseformat/local/content/section/cmitem }}
    {{! Add custom blocks here. }}
    {{$ core_courseformat/local/content/section/badges }}
        {{> format_pluginname/local/content/cm/badges }}
    {{/ core_courseformat/local/content/section/badges }}
{{/ core_courseformat/local/content/section/cmitem }}
```

  </div>
</details>

Benefits of this approach:

- Easy to maintain in a short term. All templates overrides are located on one of the 3 main templates.
- Fewer files. The plugin only contains the three mains files and the overridden ones.

Negatives of this approach:

- Harder to maintain in the long run. Is it possible that the format must refactor the template structure if future versions require more main templates to be refreshed via ajax.

#### Scenario 2: keep all the intermediate templates structure

If your plugin needs a big UI change, altering a considerable number of the course elements at different levels (course, section and/or activity), the previous approach is not recommended as it may require more code refactoring in future versions.

To keep your plugin more stable through time the best approach is to override the mustache blocks at the inner parts of the mustache files structure instead of at the main elements. It will require more code but the final result will be more stable.

<details>
  <summary>View example</summary>
  <div>

Let's say your format requires overriding the activity visibility badges as in the previous scenario example. Apart from the three main templates, the plugin must create several new template overrides until it reacher the activity badges one:

CM item main file: format_pluginname/local/content/section/cmitem template:

```handlebars
{{! include the original course format template block }}
{{< core_courseformat/local/content/section/cmitem }}
    {{$ core_courseformat/local/content/cm }}
        {{> format_pluginname/local/content/cm }}
    {{/ core_courseformat/local/content/cm }}
{{/ core_courseformat/local/content/section/cmitem }}
```

The content/cm template:

```handlebars
{{< core_courseformat/local/content/cm/activity }}
    {{$ core_courseformat/local/content/cm/badges }}
        {{> format_pluginname/local/content/cm/badges }}
    {{/ core_courseformat/local/content/cm/badges }}
{{/ core_courseformat/local/content/cm/activity }}
```

The content/cm/badges will contain only the overridden HTML.

Apart from the templates files, the plugin could also provide overridden output classes to ensure that future versions will remain compatible if new ajax partials are required:

In the example the extra output classes can look like:

```php tile="format_pluginname\output\local\content\cm class"
<?php
namespace format_pluginname\output\courseformat\content;

class cm extends \core_courseformat\output\local\content\cm {
    public function get_template_name(\renderer_base $renderer): string {
        return 'format_pluginname/local/content/cm;
    }
}
```

```php title="format_pluginname\output\local\content\cm\activity class"
<?php
namespace format_pluginname\output\courseformat\content\cm;

class activity extends \core_courseformat\output\local\content\cm\activity {
    public function get_template_name(\renderer_base $renderer): string {
        return 'format_pluginname/local/content/cm/activity;
    }
}
```

```php title="format_pluginname\output\local\content\cm\badge class"
<?php
namespace format_pluginname\output\courseformat\content\cm;

class badge extends \core_courseformat\output\local\content\cm\badge {
    public function get_template_name(\renderer_base $renderer): string {
        return 'format_pluginname/local/content/cm/badge;
    }
}
```

  </div>
</details>

Benefits of this approach:

- Easy to maintain in the long term. The code will remain the same if future versions require more main templates.
- Overridden templates can be rendered as a regular course format output. Because each of the overridden mustaches has also its output class, the course format subsystem can render them independently.

Negatives of this approach:

- Requires extra files to keep the structure. Most of the files are just there to ensure the course format subsystem knows how to render them if needed in the future.

#### Scenario 3: just keep a few renderer methods

If your plugin is a completely different thing from a regular course you are most likely on your own. Your format may use a completely different set of renderer methods or output classes and you already have your own template structure.

In that case, you may keep it that way. However, there are a few things you could add to your plugin in order to make it compatible with the new course output. Take in mind that the new course editor expects some conventions about renderer methods that should be easy to incorporate into your plugin.

The first thing you should add is all the section and activities data attributes (see [course elements data attributes](#course-elements-data-attributes). The new course editor did not use CSS classes anymore but data attributes. If your format should be able to interact with the standard editor those attributes are necessary.

Secondly, the new frontend JS modules use renderer methods to refresh a full section or an activity. If your format wants to keep this feature you should implement two methods on your renderer class:

- **course_section_updated:** to render a single section.
- **course_section_updated_cm_item:** to render a single course module item. Note that this method does not render an activity card only but also the full course item. In a regular course, this also includes the "li" element.

And third, consider using "local/content" as your main course template, "output\local\content" as your main output class or, if you don't use output classes, use the render_content renderer method to print a full course. Those are the expected names to render the full course. For now, they are only used in your plugin "format.php" file but nobody can guarantee this will continue this way in the future.

## The course editor structure

The core_courseformat provides several JavaScript modules that will be enabled when a teacher edits the course. Those libraries use a reactive pattern to keep the course updated when some edit action is executed.

The following diagram represents the data flow of the new architecture:

![Course editor workflow](./_files/course_editor_workflow.png)

### Enabling the course editor

To enable the course editor in your format you should add the following method to your format base class (in your course/format/pluginname/lib.php):

```php
/**
 * Enable the component based content.
 */
public function supports_components() {
    return true;
}
```

### Course elements data attributes.

The course editor modules use data attributes to find the course elements in the page. If your plugin alters the default templates you should keep those attributes in your HTML structure.

The following table describes the data attributes:

| Concept | Required data attributes |
|---------|------------------------|
| **Section** | `data-for="section"`<br/>`data-id={SECTION.ID}`<br/>`data-number={SECTION.NUM}` |
| **Section header** | `data-for="section_title"`<br/>`data-id={SECTION.ID}<br/>data-number={SECTION.NUM}` |
| **Course module item (activity)** | `data-for="cmitem"`<br/>`data-id={CM.ID}` |
| **Course sections list** | `data-for="course_sectionlist"` |
| **Section course modules list** | `data-for="cmlist"` |
| **Course module action link** | `data-action={ACTIONNAME}`<br/>`data-id={CM.ID}` |
| **Section action link** | `data-action={ACTIONNAME}`<br/>`data-id={SECTION.ID}` |
| **Section info** | `data-for="sectioninfo"` |

## Activity badge

<Since
  version="4.3"
  issueNumber="MDL-78207"
/>

The new activity card design proposed for Moodle 4.3 differentiates badge information from other HTML content (displayed using the pre-existing `afterlink` feature).
A new `core_courseformat\output\activitybadge` class has been added to let modules extend it to display any content in a badge near the activity name.
Some considerations about its main features:

- The badge content is always plain text (no HTML).
- The badge style can be set (by default is initialized with badge-none, but it can be set by any module).
- An optional URL to redirect the user when the badge is clicked.
- An optional ID to add the element in case the module wants to add some JS to the badge events.
- Optionally, any other extra HTML attributes to the badge element (for example, data attributes).

Plugins can implement `mod_PLUGINNAME\output\courseformat\activitybadge` that extends from the original `core_courseformat\output\activitybadge` class. This class will delegate most data attributes to protected methods, so plugins will only need to implement the `update_content()` method, to set these attributes accordingly: `content`, `style`, `url`, `elementid` and `extrattributes`.

```php title="course/format/classes/output/activitybadge.php"
namespace core_courseformat\output;

abstract class activitybadge implements named_templatable, \renderable {

    /** @var array Badge defined styles. */
    public const STYLES = [
        'none' => 'badge-none',
        'dark' => 'badge-dark',
        'danger' => 'badge-danger',
        'warning' => 'badge-warning',
        'info' => 'badge-info',
    ];

    /** @var cm_info The course module information. */
    protected $cminfo = null;

    /** @var string The content to be displayed in the activity badge.  */
    protected $content = null;

    /** @var string The style for the activity badge.  */
    protected $style = self::STYLES['none'];

    /** @var \moodle_url An optional URL to redirect the user when the activity badge is clicked.  */
    protected $url = null;

    /** @var string An optional element id in case the module wants to add some code for the activity badge (events, CSS...). */
    protected $elementid = null;

    /**
     * @var array An optional array of extra HTML attributes to add to the badge element (for example, data attributes).
     * The format for this array is [['name' => 'attr1', 'value' => 'attrval1'], ['name' => 'attr2', 'value' => 'attrval2']].
     */
    protected $extraattributes = [];

    [...]

    abstract protected function update_content(): void;

}
```

This feature has been implemented by:

- **Forum**, to display the unread messages.

    ```php title="mod/forum/classes/output/courseformat/activitybadge.php"
    namespace mod_forum\output\courseformat;

    class activitybadge extends \core_courseformat\output\activitybadge {

        protected function update_content(): void {
            global $CFG;

            require_once($CFG->dirroot . '/mod/forum/lib.php');

            if (forum_tp_can_track_forums()) {
                if ($unread = forum_tp_count_forum_unread_posts($this->cminfo, $this->cminfo->get_course())) {
                    if ($unread == 1) {
                        $this->content = get_string('unreadpostsone', 'forum');
                    } else {
                        $this->content = get_string('unreadpostsnumber', 'forum', $unread);
                    }
                    $this->style = self::STYLES['dark'];
                }
            }
        }
    }
    ```

- **Resource**, to show the file type (extension). The rest of the resource information (size and creation date) has been kept in the `afterlink` section.

    ```php title="mod/resource/classes/output/courseformat/activitybadge.php"
    namespace mod_resource\output\courseformat;

    class activitybadge extends \core_courseformat\output\activitybadge {

        protected function update_content(): void {
            $options = (object) ['displayoptions' => $this->cminfo->customdata['displayoptions']];
            $this->content = resource_get_optional_filetype($options, $this->cminfo);
        }
    }
    ```

A new `core_courseformat/local/content/cm/activitybadge` template has been also created to display this activity badge data. As usual, it can be overridden by any format plugin.
