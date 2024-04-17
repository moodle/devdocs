---
title: Block plugins
tags:
  - Blocks
  - Tutorial
  - Plugins
---

import {
    Lang,
    VersionPHP,
    DbAccessPHP,
} from '../../_files';
import { ComponentFileSummary } from '../../../_utils';

Block plugins allow you to show supplemental information, and features, within different parts of Moodle.

## File structure

Blocks plugins are located in the `/blocks` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `block_pluginname` plugin.</summary>

```console
 blocks/pluginname/
 |-- db
 |   `-- access.php
 |-- lang
 |   `-- en
 |       `-- block_pluginname.php
 |-- pix
 |   `-- icon.png
 |-- block_pluginname.php
 |-- edit_form.php (optional)
 `-- version.php
```

</details>

### block_pluginname.php

import BlockFile from '!!raw-loader!./_examples/block_pluginname.php';

<ComponentFileSummary
    required
    filepath="/block_pluginname.php"
    summary="Block definition class"
    plugintype="block"
    pluginname="pluginname"
    example={BlockFile}
    description="This file will hold the class definition for the block, and is used both to manage it as a plugin and to render it onscreen."
/>

:::info

The `init` method is essential for all blocks, and its purpose is to give values to any class member variables that need instantiating.

:::

### db/access.php

import accessExample from '!!raw-loader!./_examples/access.php';

<DbAccessPHP
    plugintype="block"
    pluginname="pluginname"
    example={accessExample}
    required
/>

### lang/en/block_pluginname.php

export const langExample = `$string['pluginname'] = 'Pluginname block';
$string['pluginname'] = 'Pluginname';
$string['pluginname:addinstance'] = 'Add a new pluginname block';
$string['pluginname:myaddinstance'] = 'Add a new pluginname block to the My Moodle page';`;

<Lang
    plugintype="block"
    pluginname="pluginname"
    example={langExample}
/>

### version.php

<VersionPHP
    plugintype="block"
/>

### edit_form.php

import EditForm from '!!raw-loader!./_examples/edit_form.php';

<ComponentFileSummary
    filepath="/edit_form.php"
    summary="Block edit form class"
    plugintype="block"
    pluginname="pluginname"
    example={EditForm}
    description="This file is only needed if your plugin has a specific configuration form. It is not required for most plugins. We can extend this configuration form, and add custom preferences fields, so that users can better tailor our block to a given task or page."
/>

The example below adds a text attribute to the block instance settings.

:::caution

All your field names need to start with **"config_"**, otherwise they will not be saved and will not be available within the block via $this->config.

:::

## Creating a new block plugin

The easiest way to create a new block plugin is by using the latest version of [Tool Pluginskel](https://moodle.org/plugins/tool_pluginskel). You can use the following yaml file to generate a basic block skeleton.

<details>
  <summary>View pluginskel recipe</summary>
  <div>

import PluginskelRecipe from '!!raw-loader!./_examples/pluginskel_recipe.yaml';

<CodeBlock language="yaml">{PluginskelRecipe}</CodeBlock>

  </div>
</details>

## Block base class API methods

All blocks must provide a main class that extends the core block class. However, there are two different types of blocks:

- `block_base` - The default base class for content blocks.
- `block_list` - For blocks that displays a list items.

Depending on your plugin needs your main class in `blocks/pluginname/block_pluginname.php` must extend either `block_base` or `block_list`.

### Block class attributes

Once the block instance is created, there are several $this attributes that can be used:

- `$this->config` The block instance configuration. By default it is an empty object but if the block has an [edit_form.php](#edit_formphp) file, it will be an object with the form data.
- `$this->content` This variable holds all the actual content that is displayed inside each block. Valid values for it are either NULL or an object of class stdClass, which must have specific member variables depending on the extended block base class.
- `$this->page` The page object that the block is being displayed on.
- `$this->context` The context object that the block is being displayed in.
- `$this->title` The title of the block.

### init()

The init method is called before the block is displayed. It is essential for all blocks, and its purpose is to give values to any class member variables that need instantiating. However, it is called before $this->config is set, if your plugin needs some configation value to define global attributes like the block title, it should be done in the specialization method.

### specialization()

This function is called on your subclass right after an instance is loaded. It is used to customize the title and other block attributes depending on the page type, context, configuration, etc.

<details>
  <summary>View example</summary>
  <div>

Example of a specialization method using the instance configuration.

```php
function specialization() {
    if (isset($this->config->title)) {
        $this->title = format_string($this->config->title, true, ['context' => $this->context]);
    } else {
        $this->title = get_string('newhtmlblock', 'block_html');
    }
}
```

  </div>
</details>

### get_content(): string

In order to get our block to actually display something on screen, we need to add one more method to our class (before the final closing brace in our file) inside of the block_pluginname.php script.

<Tabs>
  <TabItem value="basecontent" label="block_base block" default>

```php
class block_pluginname extends block_base {

    // (...)

    public function get_content() {
        if ($this->content !== null) {
            return $this->content;
        }

        $this->content =  new stdClass;
        $this->content->text = 'The content of pluginname block';
        $this->content->footer = 'Footer here...';

        return $this->content;
    }
}
```

  </TabItem>
  <TabItem value="listcontent" label="block_list block">

```php
class block_pluginname extends block_list {

    // (...)

    public function get_content() {
        global $OUTPUT;
        if ($this->content !== null) {
            return $this->content;
        }

        $this->content = (object) [
            'items'  => [],
            'icons'  => [],
            'footer' => 'Footer here...',
        ];

        $this->content->items[] = 'An item of pluginname block';
        $this->content->icons[] = $OUTPUT->pix_icon('i/course', get_string('course'));

        // Add more list items here.

        return $this->content;
    }
}
```

  </TabItem>
</Tabs>

:::caution

The get_content can be called several times during the page rendering. To prevent your class from calculating it every time your plugin should check if $this->content is already defined at the beginning of the method.

:::

:::tip

If the block content is empty (an empty string) the block will not be displayed. In the case of an extending block_base block this means empty the `$this->content->text` and the `$this->content->footer` values. In a block_list block, the `$this->content->items` array should be empty. Moodle performs this check by calling the block's `is_empty()` method, and if the block is indeed empty then it is not displayed at all.

:::

### applicable_formats(): array

Blocks can be added to any kind of page. However, some blocks may only be displayed on certain page types. This method is used to define the page types that the block can be displayed on. See [Limit the block to specific contexts](#limit-the-block-to-specific-contexts) section below for more information.

### instance_allow_multiple()

By default, only one instance of each block plugin can be added to a page. However, if your plugin allows multiple instances you can overrdie the instance_allow_multiple method.

<details>
  <summary>View example</summary>
  <div>

```php
public function instance_allow_multiple() {
    return true;
}
```

  </div>
</details>

:::note

Even if a block itself allows multiple instances in the same page, the administrator still has the option of disallowing such behavior. This setting can be set separately for each block from the Administration / Configuration / Blocks page.

:::

### hide_header(): bool

Using this method each block instance can decide if the standard block header is shown or not. This method will be ignored in edit mode.

<details>
  <summary>View example</summary>
  <div>

```php
public function hide_header() {
    return true;
}
```

  </div>
</details>

### html_attributes(): array

The block base class can inject extra HTML attributes to the block wrapper. This is useful for example to add a class to the block wrapper when the block is being displayed in a specific context.

By default, each block section in the page will use a standard `block` class and the specific `block_pluginname` class. However, if you want to add a class to the block wrapper, you can override html_attributes to alter those attrributes.

<details>
  <summary>View example</summary>
  <div>

```php
public function html_attributes() {
    // Get default values.
    $attributes = parent::html_attributes();
    // Append our class to class attribute.
    $attributes['class'] .= ' block_'. $this->name();
    return $attributes;
}
```

  </div>
</details>

This results in the block having all its normal HTML attributes, as inherited from the base block class, plus our additional class name. We can now use this class name to change the style of the block, add JavaScript events to it via YUI, and so on. And for one final elegant touch,  we have not set the class to the hard-coded value "block_simplehtml", but instead used the Blocks/Appendix_A#name.28.29| name() method to make it dynamically match our block's name.

### instance_config_save(): stdClass

An optional method to modify the instance configuration before it is saved. See [add instance configuration settings](#add-instance-configuration-settings) section below for more information.

### has_config(): bool

An optional method to tell Moodle that the block has a global configuration settings form. See [enabling Global Configuration](#enabling-global-configuration) section below for more information.

## Add instance configuration settings

By default, block instances have no configuration settings. If you want to add some, you can add them by adding a few methods and classes to your block.

### Create an edit_form.php file

To have a configuration form, you need to add an [edit_form.php](#edit_formphp) file into your plugin. After defining the configuration, your block's base instance will have all your settings in its [$this->config attribute](#block-class-attributes). See the [edit_form.php section above](#edit_formphp) for an example.

:::caution

Note that $this->config is available in all block methods **except the init() one**. This is because init() is called immediately as the block is being created, with the purpose of setting things up. Use [specialization](#specialization) instead.

:::

:::note

You cannot use the 'checkbox' element in the form (once set it will stay set). You must use advcheckbox instead.

:::

### Optional instance_config_save method

By default, all config_* settings will be stored in the `block_instances` table. The complete form data will be encoded in base64 before storing it in the <!-- cspell:disable --> `configdata` <!-- cspell:enable --> field. Every time a block instance is initialized all that data will be decoded in the [$this->config attribute](#block-class-attributes).

However, for some cases like the Atto HTML editor, you may want to store them in the database instead, or to alter the config data before storing it. In that case you can create a instance_config_save method.

<details>
  <summary>View example</summary>
  <div>

```php title="Example of adding data before storing it
public function instance_config_save($data,$nolongerused =false) {
    // Example of add new data.
    $data->somenewattribute = 'Some new value';

    // Example of alter the current data.
    $data->text = 'Some new text';

    // Call the parent method to the data inside block_instance.configdata.
    return parent::instance_config_save($data,$nolongerused);
}
```

  </div>
</details>

## Add global settings to the block plugin

Apart from the specific block instance configuration, the block plugin can use global settings to customize its behavior. Those settings can only be set in the site administration and are a great way to customize the behavior of all blocks on a site.

:::note

Global settings are not part of hte block instance and should be accessed via the global get_config method. For example:

```php
$settingvalue = get_config('block_pluginname', 'settingname');
```

:::

### create a settings.php file

Implementing such configuration for our block is quite similar to implementing the [instance configuration](#add-instance-configuration-settings). To enable global configuration for the block, your plugin should contain **/blocks/simplehtml/settings.php** file. This file will populate the global admin form with form field definitions for each setting. See [Common files: settings.php](../commonfiles#settingsphp) for more information.

### Enabling Global Configuration

While in other Moodle pulgins the existence of a settings.php is enough to enable global configuration, for the blocks plugins it is mandatory to override the has_config method in the base class.

<details>
  <summary>View example</summary>
  <div>

```php"
function has_config() {
    return true;
}
```

  </div>
</details>

## Limit the block to specific contexts

Some blocks are useful in some circumstances, but not in others. An example of this would be the "Social Activities" block, which is useful in courses with the "social" course format, but not courses with the "weeks" format. Moodle allows us to declare in which pages a block is available on. The information is given to Moodle as a standard associative array, with each key corresponding to a page format and defining a boolean value (true/false) that declares whether the block should be allowed to appear in that page format.

Each page in Moodle can define it's own page type name. However, there are some conventions:

- `all` value is used as a catch-all option. This means that if a block returns `['all' => true]` it can be used in any kind of page.
- `site-index` - Moodle frontpage.
- `course-view` - Course page, independent from the course format.
- `course-view-FORMATNAME` - Course page, with the "FORMATNAME" course format. For example, course-view-weeks is for courses with weeks format.
- `mod` - Any activity page, independent from the module.
- `mod-MODNAME-view` - Activity page, with the "MODNAME" activity. For example, mod-forum-view is for forums.
- `my` - The Moodle dashboard page.
- `admin` - Any administration page.

<details>
  <summary>View example</summary>
  <div>

```php
public function applicable_formats() {
    return [
        'admin' => false,
        'site-index' => false,
        'course-view' => true,
        'mod' => true,
        'my' => false
    ];
}
```

  </div>
</details>
