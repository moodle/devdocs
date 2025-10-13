---
title: Output API
tags:
  - Output
  - API
---

<!-- cspell:ignore renderables, sometext, courseid, enabletrusttext -->

The Output API is responsible for visual aspects of Moodle content. This page explains how renderers, renderables, themes and templates all work together.

## Page Output Journey

Let's start with building a page that is part of an admin tool.

```php title="/admin/tool/demo/index.php"
<?php
// Standard GPL and phpdocs
require_once(__DIR__ . '/../../../config.php');
require_once($CFG->libdir.'/adminlib.php');

admin_externalpage_setup('tooldemo');

// Set up the page.
$title = get_string('pluginname', 'tool_demo');
$pagetitle = $title;
$url = new moodle_url("/admin/tool/demo/index.php");
$PAGE->set_url($url);
$PAGE->set_title($title);
$PAGE->set_heading($title);

$output = $PAGE->get_renderer('tool_demo');

echo $output->header();
echo $output->heading($pagetitle);

$renderable = new \tool_demo\output\index_page('Some text');
echo $output->render($renderable);

echo $output->footer();
```

:::info Setup of an admin page

On admin pages, the `admin_externalpage_setup($sectionname);` function should be called to set up and perform permission checks, for example:

```php title="admin/tool/demo/mypage.php"
require_once(__DIR__ . '/../../config.php');
require_once("{$CFG->libdir}/adminlib.php");
admin_externalpage_setup('example');
```

:::

Firstly, we set some general `$PAGE` properties. We load the title of the page from a language string (see [String API](https://docs.moodle.org/dev/String_API)).

```php
// Set up the page.
$title = get_string('pluginname', 'tool_demo');
$pagetitle = $title;
$url = new moodle_url("/admin/tool/demo/index.php");
$PAGE->set_url($url);
$PAGE->set_title($title);
$PAGE->set_heading($title);
```

:::note What is $PAGE and where did it come from ?

`$PAGE` is a global variable used to track the state of the page that is being returned. It is an instance of the `moodle_page` class defined in `lib/pagelib.php`. See [Page API](https://docs.moodle.org/dev/Page_API) for more information on the `$PAGE` variable.

:::

The most important properties stored in `$PAGE` are the page context, URL, layout, title and headings. `$PAGE` also gives access to some other important classes such as `$PAGE->requires`, which is an instance of the `page_requirements_manager` (`lib/outputrequirementslib.php`). The `page_requirements_manager` class lets us set dependencies on e.g. JavaScript and CSS to be inserted in the correct place in the page (The order in which things are inserted into the page is hugely important for performance).

`$PAGE` also lets us load specific renderers for a plugin, or plugin and subtype. We will cover renderers in more detail next.

```php
$output = $PAGE->get_renderer('tool_demo');
```

This gets an instance of the `plugin_renderer_base` class that we use to create all output for our page. Themers can subclass this renderer to override specific render methods in order to customise Moodle's output. See [Output renderers](https://docs.moodle.org/dev/Output_renderers) for more information, and [Overriding a renderer](https://docs.moodle.org/dev/Overriding_a_renderer) for information about how themers can customise a renderer.

:::important

Some pages use the global variable `$OUTPUT` to generate their output. This is a generic renderer used for core pages etc, but plugins should always use a more specific plugin renderer.

:::

```php
echo $output->header();
echo $output->heading($pagetitle);
```

This code prints the header of the page and adds one heading to the page at the top of the content region. Page headings are very important in Moodle and should be applied consistently. See [HTML Guidelines](https://docs.moodle.org/dev/HTML_Guidelines) for more information on how and where to use headings.

```php
$renderable = new \tool_demo\output\index_page('Some text');
echo $output->render($renderable);
```

This is the most interesting part of our page. We are creating an instance of a renderable and telling our renderer to render it. The renderable is usually more complex than this. It should hold all the data required for the renderer to display the page. This means we should perform all our logic such as database queries, page parameters and access checks in advance then pass the results as data to the renderable. The renderable then just takes that data and returns an HTML representation of it.

```php
echo $output->footer();
```

This prints the HTML for the bottom of the page. It is very important because it also prints out things that were added to the `page_requirements_manager` and that need to be printed in the footer; things like JavaScript includes, navigation tree setup, closing open containers tags etc. The reason all JavaScripts are added to the footer of the page is for performance. If you add JavaScript includes to the top of the page, or inline with the content, the browser must stop and execute the JavaScript before it can render the page. See https://developers.google.com/speed/docs/insights/BlockingJS for more information.

### Accessing renderers with dependency injection

<Since version="5.0" issueNumber="MDL-83888" />

In the example above, we used `$PAGE->get_renderer('tool_demo')` to get an instance of the renderer. This is the traditional way to get a renderer. However, if you are in a class designed for dependency injection, the use of global variables is discouraged. You can read more about dependency injection in the [Dependency Injection](../../core/di/index.md) guide.

Instead, you can use the `core\output\renderer_helper` class to get any renderer instance without using the global. This is an example of how to use the `renderer_helper` class to get a renderer instance:

```php
class my_di_example {
    public function __construct(
        /** @var \core\output\renderer_helper $rendererhelper the renderer helper */
        protected readonly \core\output\renderer_helper $rendererhelper,
    ) {
    }

    public function do_something_with_my_renderer() {
        /** @var \tool_demo\output\renderer $renderer */
        $renderer = $this->rendererhelper->get_renderer('tool_demo');
        // Do something with the renderer.
    }

    public function do_something_with_core_renderer() {
        // For convenience, the renderer helper also provides a method to get the core renderer.
        $renderer = $this->rendererhelper->get_core_renderer();
        // Do something with the core renderer.
    }
}
```

:::note

The `core\output\renderer_helper` class serves as a wrapper around the global `$PAGE` object. This is necessary because the `$PAGE` object can change during script execution, making direct injection impossible. Dependency injection relies on singletons, and the `renderer_helper` class provides a workaround for this limitation.

:::

### Renderable

In the code above, we created a renderable. This is a class that you have to add to your plugin. It holds all the data required to display something on the page. Here is the renderable for this example:

```php title="/admin/tool/demo/classes/output/index_page.php"
<?php
// Standard GPL and phpdocs

namespace tool_demo\output;

use renderable;
use renderer_base;
use templatable;
use stdClass;

class index_page implements renderable, templatable {
    /** @var string $sometext Some text to show how to pass data to a template. */
    private $sometext = null;

    public function __construct($sometext): void {
        $this->sometext = $sometext;
    }

    /**
     * Export this data so it can be used as the context for a mustache template.
     *
     * @return stdClass
     */
    public function export_for_template(renderer_base $output): stdClass {
        $data = new stdClass();
        $data->sometext = $this->sometext;
        return $data;
    }
}
```

This class implements the:

- `renderable` interface, which has no methods
- `templatable` interface, which means that this class could be rendered with a template, so it must implement the `export_for_template` method

In this example, the class accepts data via it's constructor, and stores that data in class variables. It does nothing else with the data in this example (but it could). Note that the `export_for_template` function should only return simple types (`arrays`, `stdClass`, `bool`, `int`, `float`, `string`), or those that implement the [`Stringable`](https://www.php.net/manual/en/class.stringable.php) interface.

If you wish to use a specific template to render the content you may specify anyone by replacing `templatable` with `named_templatable`, which extends templatable and requires that you implement a `get_template_name()` method that returns the name of the template you wish to use.

```php title="Example implementation of get_template_name()"
    /**
     * Gets the name of the mustache template used to render the data.
     *
     * @return string
     */
    public function get_template_name(\renderer_base $renderer): string {
         return 'tool_demo/index_page';
    }
```

Now let's look at the renderer for this plugin.

```php title="admin/tool/demo/classes/output/renderer.php"
<?php
// Standard GPL and phpdocs

namespace tool_demo\output;

use plugin_renderer_base;

class renderer extends plugin_renderer_base {
    /**
     * Defer to template.
     *
     * @param index_page $page
     *
     * @return string html for the page
     */
    public function render_index_page($page): string {
        $data = $page->export_for_template($this);
        return parent::render_from_template('tool_demo/index_page', $data);
    }
}
```

The renderer exists to provide `render_<page>` methods for all renderables used in the plugin. A theme designer can provide a custom version of this renderer that changes the behaviour of any of the render methods and so to customize their theme. In this example, the render method for the index page (`render_index_page`) does 2 things. It asks the renderable to export it's data so that it is suitable for passing as the context to a template, and then renders a specific template with this context. A theme designer could either manipulate the data in the render method (e.g. removing menu entries), or change the template (change the generated HTML) to customize the output.

You do not need to implement a renderer for a plugin if you are using templates and you either:

1. Use the `templatable` interface and have a template with the same name in the same namespace
2. Use the `named_templatable` interface

In these cases the data from the renderable will be automatically routed to the correct template, however if you do implement a render method that will be used in preference to the default routing.

The template used in this plugin is located in the plugin's templates folder. The template can also be overridden by a theme designer.

```xml title="admin/tool/demo/templates/index_page.mustache"
<div class="hero-unit">
  <h1>Heading</h1>
  <p>{{sometext}}</p>
</div>
```

This is the mustache template for this demo. It uses some bootstrap classes directly to position and style the content on the page. `{{sometext}}` is replaced with the variable from the context when this template is rendered. For more information on templates see [Templates](../../../guides/templates/index.md).

## Output Functions

This section explains how dynamic data should be sent from Moodle to the web browser in an organised and standard way.

:::important
It is possible to have your own output methods but, thinking that you are going to share your code (yep, this is an OpenSource project!) and in the collaborative way we try to build and maintain the system every day, it would be really better to follow the basic guidelines explained below.

By using them you will be helping to have better, more secure and readable code. Spend some minutes trying to understand them, please!
:::

Of course, these functions can be discussed, modified and new functions can arrive if there are some good reasons for it. Just discuss it in the [General developer forum](http://moodle.org/mod/forum/view.php?id=55).

For each of the functions below we'll try to explain when they should be used, explaining the most important parameters supported and their meaning. Let's review them!

### String formatting functions

The `format_string` and `format_text` functions should always be used when preparing the output of information. They may also be used to process information before it is stored in the database however, filters should only be applied at output. For example, language filters must only be applied as the content is prepared for output because we don't yet know the user's preferred language.

#### p() and s()

```php
function s($var, $strip=false)
function p($var, $strip=false)
```

The only difference between these two functions is that `s()` returns the string, while `p()` prints it directly.

These functions should be used to:

- Print all the **values of form fields** like `<input>` or `<textarea>` tags.
- **Print plain (non-HTML) text** that has been introduced by the user (search string, quiz responses, ...).
- Print in general as long as the text does not need to be cleaned or processed by filters.
- Print HTML source code instead of rendering it.

The functions replace certain characters that have a special meaning in HTML (`<, >, ", ', and &`) with HTML entities so that they are displayed as intended. Note that even though the value of form fields printed with `p()` will have these characters converted to HTML entities, the submitted values will still contain the original characters.

The key parameter for this function is:

- `strip`: Set to `true` to strip slashes from the string. Only set this parameter to `true` when the data to be processed is not coming from the database. This should be used when the string comes from HTTP requests (forms, links, ...). (Default is `false`, so no strip will be performed)

#### format_text()

```php
function format_text(
    string $text,
    $format = FORMAT_MOODLE,
    [
        'noclean' => false,
        'trusted' => false,
        'filter' => true,
        'context' => $context,
        'para' => true,
        'newline' => true,
        'allowid' => false,
        'blanktarget' => false,
    ],
);

```

This function should be used to:

- print **any html/plain/markdown/moodle text**, needing any of the features below. It is mainly used for long strings like posts, answers, glossary items, etc.
- filter content through Moodle or 3rd party language filters for multi-language support. This is not to be confused with [get_string](https://docs.moodle.org/dev/String_API#get_string.28.29) which is used to access localized strings in Moodle from its language packs. Together, these functions enable Moodle multi-language support.
Note that this function is **process intensive** because it supports **cleaning** of dangerous contents, delegates processing to enabled **content filters**, supports different **formats** of text (HTML, PLAIN, MARKDOWN, MOODLE) and performs a lot of **automatic conversions** like adding smilies, build links. Also, it includes a strong **cache mechanism** (DB-based) that will alleviate the server from a lot of work processing the same texts time and again.

Some interesting parameters for this function are:

- **format**: This parameter specifies the format of the text. `FORMAT_MOODLE` is a useful format for processing plain text because it features automatic rendering of links and smilies, and does a good job of converting plain text to HTML output. Other supported formats include `FORMAT_HTML`, `FORMAT_PLAIN`, `FORMAT_MARKDOWN`. (Default is `FORMAT_MOODLE`)
- **options**: Here we can specify options for processing the text. You only need to define them if they are different from the default values. The main options are:
  - `options->noclean`: Set to `true` to skip the clean-up of text, **un-protecting us** from attacks and other security flaws. You **should never set it to `true`** unless you are 200% sure that only trusted users can edit the content such as site administrators. **Never use it for user-submitted text** (posts...) or you will be attacked sooner or later! Note that this option is ignored for `FORMAT_PLAIN` where the text is never cleaned. (Default is `false`, so protection is enabled)
  - `options->trusted`: Set to `true` if the content is trusted and does not need clean-up. This argument is only enabled if `$CFG->enabletrusttext` is also set to `true`. It is ignored if `noclean` is specified. (Default is `false`)
  - `options->filter`: Set to `false` if you do not want to allow filters to process the text. This is ignored by `FORMAT_PLAIN` for which filters are never applied. (Default is `true`)
  - `options->context`: If text is filtered (and this happens by default), it is very important to specify the context (id or object) for applying filters. If context is not specified it will be taken from `$PAGE->context` and may potentially result in displaying the same text differently on different pages. For example, all module-related information should have module context even when it appears in course-level reports, all course-related information such as name and description should have course context even when displayed on the front page or system pages.
  - `options->para`: Set to `false` if you do not want every paragraph to automatically be enclosed between HTML paragraph tags (`<p>...</p>`). This option only applies to `FORMAT_MOODLE`. (Defaults is `true`)
  - `options->newlines`: Set to `false` if line feeds in text should be converted to HTML newlines (`<br />`). This option only applies to `FORMAT_MOODLE`. (Default to `true`)
  - `options->overflowdiv`*: Set to `true` if you want the formatted text to automatically be encased in a div with the class no-overflow before being returned. (Default is `false`)
  - `options->allowid`: Set to `true` to ensure that the id attributes will not be removed, even when using HTML Purifier. (Default is `false`)
  - `options->blanktarget`: Set to `true` to have `target="_blank"` added to all `<a>` tags unless the target attribute is explicitly specified. (Default is `false`)

#### format_string()

```php
function format_string(string $text, $striplinks = true, ['context' => $context, 'escape' => true, 'filter' => true])
```

This function should be used to:

- print **short non-html strings that need filter processing** (activity titles, post subjects, glossary concepts...). If the string contains HTML, it will be filtered out. If you want the HTML, use `format_text()` instead.
- filter content through Moodle or 3rd party language filters for multi-language support. Not to be confused with [get_string](https://docs.moodle.org/dev/String_API#get_string.28.29) which is used to access localized strings in Moodle and its language packs. Together, these functions enable Moodle multi-language support.
All enabled **heading filters** will be applied to the string.

Please note that this function is a stripped version of the full `format_text()` function detailed above. **It does not offer any of its options or protections**. It simply filters the strings and returns the result, so we must ensure that the string has been processed properly and cleaned at input time using the proper `xxx_param()` functions.

Some interesting parameters for this function are:

- `striplinks`: Set to `false` to keep all links after the text has been processed by filters. Used when we want to show the text inside menus, page titles, etc. (Default is `true`)
- `options`
  - `options->context`: Context (id or object) for applying filters. If context is not specified it will be taken from `$PAGE->context` and may potentially result in displaying the same text differently on different pages. For example, all module-related information should have module context even when it appears in course-level reports, all course-related information such as name and description should have course context even when they are displayed on the front page or system pages.
  - `options->escape`: Set to `false` if you do not want to escape HTML entities. (Default is `true`)
  - `options->filter`: Set to `false` if you do not want to allow filters to process the text. This is ignored by `FORMAT_PLAIN` for which filters are never applied. (Default is `true`)

### Simple elements rendering

:::important

Those methods are designed to replace the old ```html_writer::tag(...)``` methods. Even if many of them are just wrappers around the old methods, they are more semantic and could be overridden by component renderers.

:::

While to render complex elements, you should use [templates](../../../guides/templates/index.md), some simple elements can be rendered using the following functions:

#### container()

```php
function container(string $contents, ?string $classes = null, ?string $id = null): string
```

This function should be used to:

- Print a basic **div** container with the given contents, classes and id.

Some interesting parameters for this function are:

- `contents`: The contents of the container.
- `classes`: The classes of the container. Note that this parameter is a comma-separated list of classes, not an array.
- `id`: An optional id of the container.

#### paragraph()

```php
function paragraph(string $contents, ?string $classes = null, ?string $id = null): string
```

This function should be used to:

- Print a basic **p** paragraph with the given contents, classes and id.

Some interesting parameters for this function are:

- `contents`: The contents of the paragraph.
- `classes`: The classes of the paragraph. Note that this parameter is a comma-separated list of classes, not an array.
- `id`: An optional id of the paragraph.

#### visually_hidden_text()

```php
function visually_hidden_text(string $contents): string
```

This function should be used to:

- Print an inline text for screen readers only.

Some interesting parameters for this function are:

- `contents`: The contents fo screen readers.

In the standard Boost theme this method will output a span using the [Bootstrap screen reader class](https://getbootstrap.com/docs/4.0/getting-started/accessibility/#visually-hidden-content):

```html
<span class="visually-hidden">Contents</span>
```

### Other

#### Progress Bars

There are two types of progress bars you can use in Moodle.

##### Standard Progress Bars

The first is the old standard progress bar which updates as the page loads (ie. the page won't fully load until the progress bar is finished). It can be used to render the current process on the page, or via cli to render the progress of a script.

Example:

```php
<?php
define('NO_OUTPUT_BUFFERING', true); // Required if not used via cli.
require 'config.php';

$PAGE->set_context(context_system::instance());
$PAGE->set_url('/');

echo $OUTPUT->header();

$pb = new \core\output\progress_bar('bar', 500);
$pb->create();
$num_tasks = 500; // the number of tasks to be completed.
for($cur_task = 0; $cur_task <= $num_tasks; $cur_task++)
{
    for ($i=0; $i<100000; $i++)
    {
        ;;;
    }
    $pb->update($cur_task, $num_tasks, 'this is'. $cur_task . 'h');
}

echo $OUTPUT->footer();
```

##### Stored Progress Bars

The other type of progress bar you can use is a stored progress bar, which can be used to store and update the progress of a long-running task in the database, and render live updates to the web page via AJAX web service polling.

It can be implemented into a CLI script. Example:

```php
<?php

define('CLI_SCRIPT', true);

require_once('config.php');
require_once($CFG->libdir . '/clilib.php');

$num_tasks = 5000; // the number of tasks to be completed.

$progress = new \core\output\stored_progress_bar('example-cli-bar');
$progress->start();

for($cur_task = 0; $cur_task <= $num_tasks; $cur_task++)
{
    $progress->update($cur_task, $num_tasks, 'this is '. $cur_task . '/' . $num_tasks);
}

mtrace('DONE');
```

Or a scheduled or adhoc task, via a trait. Example:

```php
class stored_progress_scheduled_task_example extends \core\task\scheduled_task {

    use \core\task\stored_progress_task_trait;

    public function execute() {

        // This simulates a specific count of iterations the task will do, e.g. x number of courses to loop through and do something.
        $iterations = 100;

        $this->start_stored_progress(); // Updates the stored progress record with a start time.

        for ($i = 1; $i <= $iterations; $i++) {

            // Here we just update and tell it which one we are on and it will work out % from those.
            $this->progress->update($i, $iterations, 'i am at ' . $i  . ' of ' . $iterations);
            sleep(1);

        }

        return true;

    }

}

$task = new stored_progress_scheduled_task_example();
$task->initialise_stored_progress(); // Creates a stored progress record, so the progress can be displayed in "pending" state.
```

With the stored progress bars, you can update the progress either via iterations, by passing in the total amount expected and then the current iteration, using `->update()`(see: previous example), this will calculate the percentage complete for you. Or you can use `->update_full()` to manually set the percentage complete.

## Reusing Output Classes in Web Services

<Since version="5.1" issueNumber="MDL-85509" />

The `renderable` interface and its `export_for_template` method are intended for preparing data for template rendering. However, the structure and content of this exported data are closely tied to the template's requirements, which may evolve over time. As a result, this data is not stable enough for use in web services, where a consistent and predictable data structure is required for API consumers.

However, many output classes contain useful logic that can be reused in web services. To enable this, you should implement the `externable` interface in your output class. The `externable` interface is specifically designed to provide a stable data structure for web services, ensuring consistency and reliability across API versions.

When implementing the `externable` interface, you should also create an accompanying `exporter` class for your output. The `externable` interface defines methods that allow consumers to reliably export data:

- `get_exporter`: Returns an instance of the exporter class used to export the data.
- `get_read_structure`: Wraps the exporter's static `get_read_structure` method, allowing web services to parse the returned data structure.
- `read_properties_definition`: Wraps the exporter's static `read_properties_definition` method, enabling the combination of properties from multiple exporters.

By following this approach, you can reuse output class logic in web services while maintaining a stable and well-defined API.

<details>
  <summary>Here is an example of how to implement the `externable` interface in your output class.</summary>

```php

namespace mod_MYPLUGIN\output;

use cm_info;
use core\output\externable;
use core\output\named_templatable;
use core\output\renderable;
use core\output\renderer_base;
use core_courseformat\base as course_format;
use mod_MYPLUGIN\external\myname_exporter;
use stdClass;

class myname implements externable, named_templatable, renderable {
    public function __construct(
        /** @var cm_info The course module. */
        public cm_info $cm,
    ) {
    }

    #[\Override]
    public function export_for_template(renderer_base $output): stdClass {
        // This method is used to prepare data for rendering in a template.
        // It is related to the `templatable` interface and could return an object or array.
        $cm = $this->cm;
        $result = (object) [
            'activityname' => \core_external\util::format_string($cm->name, $cm->context, true),
            'activityurl' => $cm->url,
            'hidden' => empty($cm->visible),
            'extraclasses' => 'mystyle fw-bold',
        ];
        if ($cm->is_stealth()) {
            $result->extrawarning = get_string('stealth', 'mod_MYPLUGIN');
        }
        return $result;
    }

    #[\Override]
    public function get_template_name(renderer_base $renderer): string {
        // This method is used to specify the template name for rendering.
        // It is not used for webservice clients, but it is required by the named_templatable interface.
        return 'core_courseformat/local/overview/activityname';
    }

    #[\Override]
    public function get_exporter(?\core\context $context = null): myname_exporter {
        $context = $context ?? \core\context\system::instance();
        return new myname_exporter($this, ['context' => $context]);
    }

    #[\Override]
    public static function get_read_structure(
        int $required = VALUE_REQUIRED,
        mixed $default = null
    ): \core_external\external_single_structure {
        return myname_exporter::get_read_structure($required, $default);
    }

    #[\Override]
    public static function read_properties_definition(): array {
        return myname_exporter::read_properties_definition();
    }

    // The rest of getter and other methods can be implemented here.
}
```

</details>

:::important PHPUnitTests are required

To ensure the stability of exported data, any class implementing `externable` must provide a PHPUnit test that verifies both the structure and values of the exported data.

:::

### Using `exporters` with `exportable` objects.

The `exporter` class is used to define how the data from an `externable` object should be exported for webservice clients. It provides a structured way to define the properties and related data that will be returned by the webservice.

<details>
  <summary>Here is an example of how to implement an `exporter` to an `externable` output.</summary>

This is an example of an exporter for the `myname` output class we created above.

```php
namespace mod_MYPLUGIN\external;

use core\external\exporter;
use mod_MYPLUGIN\output\myname;

class myname_exporter extends exporter {
    /**
     * Constructor with parameter type hints.
     *
     * @param action_link $data The action link data to export.
     * @param array $related Related data for the exporter.
     */
    public function __construct(
        myname $data,
        array $related = [],
    ) {
        parent::__construct($data, $related);
    }

    #[\Override]
    protected static function define_properties(): array {
        return [];
    }

    #[\Override]
    protected static function define_related() {
        // Most exporter need to define the context as related data to parse texts.
        return [
            'context' => 'context',
        ];
    }

    #[\Override]
    protected static function define_other_properties() {
        return [
            'activityname' => [
                'type' => PARAM_TEXT,
                'null' => NULL_NOT_ALLOWED,
                'description' => 'The name of the activity.',
            ],
            'activityurl' => [
                'type' => PARAM_URL,
                'null' => NULL_ALLOWED,
                'description' => 'The URL of the activity.',
            ],
            'hidden' => [
                'type' => PARAM_BOOL,
                'null' => NULL_NOT_ALLOWED,
                'description' => 'Whether the activity is hidden.',
            ],
        ];
    }

    #[\Override]
    protected function get_other_values(\renderer_base $output) {
        /** @var \cm_info $cm */
        $cm = $this->data->cm;

        return [
            'activityname' => \core_external\util::format_string($cm->name, $cm->context, true),
            'activityurl' => $cm->url,
            'hidden' => empty($cm->visible),
        ];
    }
}
```

</details>

Once the exporter is implemented, the webservice can use it to return the data in a consistent.

<details>
  <summary>Here is an example of how to implement a webservice using an `externable` output.</summary>

```php
namespace mod_MYPLUGIN\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;
use core\output\renderer_helper;
use mod_MYPLUGIN\output\myname;
use stdClass;

class get_my_name extends external_api {
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid' => new external_value(PARAM_INT, 'Course module id', VALUE_REQUIRED),
        ]);
    }

    public static function execute(int $cmid): stdClass {
        [
            'cmid' => $cmid,
        ] = external_api::validate_parameters(self::execute_parameters(), [
            'cmid' => $cmid,
        ]);

        [$course, $cm] = get_course_and_cm_from_cmid($cmid);

        $context = \core\context\module::instance($cm->id);
        self::validate_context($context);

        // Check any capability required to view the activity.

        $page = \core\di::get(renderer_helper::class)->get_core_renderer();
        $output = new myname($cm);

        $exporter = $output->get_exporter($context);
        return $exporter->export($renderer);
    }

    /**
     * Webservice returns.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return myname::get_read_structure();
    }
}
```

</details>

## See also

- [HTML Guidelines](https://docs.moodle.org/dev/HTML_Guidelines)
- [Output renderers](https://docs.moodle.org/dev/Output_renderers)
- [Overriding a renderer](https://docs.moodle.org/dev/Overriding_a_renderer)
- [Templates](../../../guides/templates/index.md)
