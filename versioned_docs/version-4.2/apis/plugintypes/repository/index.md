---
title: Repository plugins
tags:
  - Repositories
  - Plugins
---

import {
    DbAccessPHP,
    Lang,
    Lib,
    VersionPHP,
} from '../../_files';

Repository plugin allow Moodle to bring contents into Moodle from external repositories.

### Prerequisites

Before starting coding, it is necessary to know how to use repository administration pages and how to use the file picker.

The 2 different parts to write in order to implement a full repository:

1. Administration - You can customise the way administrators and users can configure their repositories.
2. File picker integration - The core of your plugin, it will manage communication between Moodle and the repository service, and also the file picker display.

## File structure

Repository plugins are located in the `/repository` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `repository_pluginname` plugin.</summary>

```console
 repository/pluginname/
 |-- db
 |   `-- access.php
 |-- lang
 |   `-- en
 |       `-- repository_pluginname.php
 |-- lib.php
 |-- pix
 |   `-- icon.png
 `-- version.php
```

</details>

Some of the important files for the repository plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

### version.php

<VersionPHP
    plugintype="repository"
/>

### lang/en/repository_pluginname.php

<!-- markdownlint-disable-next-line MD038 -->
export const langExample = `
$string['pluginname']= 'Example repository';
$string['configplugin'] = 'Configuration for Example repository';
$string['pluginname_help'] = 'A repository description';
`;

<Lang
    plugintype="repository"
    pluginname="pluginname"
    example={langExample}
/>

### lib.php

import RepositoryLibExample from '!!raw-loader!./_examples/lib.php';

<Lib
    plugintype="repository"
    pluginname="pluginname"
    example={RepositoryLibExample}
    legacy={false}
    required
>

This file contains the main repository class definition, which must extend the core `\repository` class. By extending the base class and overriding some of the class methods, the plugin can configure standard features and behaviours. See [Administration API](../../subsystems/admin/index.md) for more information.

</Lib>

### db/access.php

import RepositoryAccessExample from '!!raw-loader!./_examples/access.php';

<DbAccessPHP
    plugintype="repository"
    pluginname="pluginname"
    example={RepositoryAccessExample}
/>

## Repository API methods

Repository plugins can present, store, and link files in different ways depending on the type of remote system that the repository connects to.

Some of the key API functions are described below.

### supported_returntypes(): int

Return any combination of the following values:

- `FILE_INTERNAL` - the file is stored within the Moodle file system.
- `FILE_EXTERNAL` - the file is stored in the external repository. It is not stored within the Moodle file system. When accessing the file it is returned from the remote system.
- `FILE_REFERENCE` - the file stays in the external repository but may be cached locally. In that case it should be synchronised automatically, as required, with any changes to the external original.
- `FILE_CONTROLLED_LINK` - the file remains in the external repository, and ownership of the file in the remote system is changed to the [system account in the external repository](https://docs.moodle.org//en/OAuth\_2\_services). When the file is accessed, the system account is responsible for granting access to users.

<Tabs>
  <TabItem value="options" label="Setting options example" default>

> The return types that your plugin supports will be presented as options to the user when they are adding a file from the file picker. The `FILE_EXTERNAL` option is not reflected in this list as this is an internal feature of your API.
>
> ![Supported returntypes options settings](./_files/options.png)

  </TabItem>
  <TabItem value="code" label="View code" default>

```php
function supported_returntypes() {
    return FILE_INTERNAL | FILE_EXTERNAL | FILE_REFERENCE | FILE_CONTROLLED_LINK;
}
```

  </TabItem>
</Tabs>

The return values influence the choices offered to a user when selecting a file in file picker. Consider the screenshot above, which is from the dialogue that appears directly after choosing (but before uploading) a file in mod_resource. The three options result from `FILE_INTERNAL`, `FILE_REFERENCE`, and `FILE_CONTROLLED_LINK` being present. `FILE_REFERENCE` corresponds to the "alias/shortcut" option.

The option `FILE_EXTERNAL` is never reflected in the file picker for mod_resource, so its absence or presence in supported_returntypes() is never reflected here. However, `FILE_EXTERNAL` is the only return type supported by mod_url: For mod_url, file picker will only(!) list repositories that support `FILE_EXTERNAL`.

This implies that a plugin that uses a file picker is able to narrow the set of supported return types. For example, assignsubmission_file disallows `FILE_EXTERNAL` and `FILE_REFERENCE`.

In the end, which type is
used by Moodle depends on the choices made by the end user (for example inserting a link, will result in `FILE_EXTERNAL`-related functions being used, using a 'shortcut/alias' will result in the '`FILE_REFERENCE`'-related functions being used).

### supported_filetypes()

If your plugin only supports certian file types, then you should implement the optional `supported_filetypes()` method.

This method is used to hide repositories when they don't support certain file types - for example, if a user is inserting a video then any repository which does not support videos will not be shown.

Supported file types can be specified using standard mimetypes (such as `image/gif`) or file groups (such as `web_image`). For a full list of the supported mimetypes and groups, see the [`core_filetypes`](https://github.com/moodle/moodle/blob/v4.0.0/lib/classes/filetypes.php#L47) class.

<Tabs>
  <TabItem value="all" label="All files" default>

```php
function supported_filetypes() {
    // Allow any kind of file.
    return '*';
}
```

  </TabItem>
  <TabItem value="mimetypes" label="Filter mimetypes">

```php
function supported_filetypes() {
    // Example of image mimetypes.
    return ['image/gif', 'image/jpeg', 'image/png'];
}
```

  </TabItem>
  <TabItem value="groups" label="Filter file groups">

```php
function supported_filetypes() {
    // Example of a file group.
    return ['web_image'];
}
```

  </TabItem>
</Tabs>

### Course and User Repository Instances.

A system-wide instance of a repository is created when it is enabled. It is also possible to support both course, and user specific repositories.. This can be achieved by setting the  `enablecourseinstances` and `enableuserinstances` options.  There are three ways that this can be done:

1. Define **$string\['enablecourseinstances'\]** and **$string\['enableuserinstances'\]** in your plugin's language file. You can check an example in the [filesystem repository](https://github.com/moodle/moodle/blob/v4.0.0/repository/filesystem/lang/en/repository_filesystem.php).
2. The plugin must provide a **get_instance_option_names** method which returns at least one instance option name. This method defined the specific instances options, if none instance attribute is needed, the system will not allow the plugin to define course and user instances. Note, you must not define the form fields for these options in the **type_config_form()** function. For example, [filesystem repository](https://github.com/moodle/moodle/blob/v4.0.0/repository/filesystem/lib.php#L439).
3. Several 'core' repositories use the **db/install.php** to create the original repository instance by constructing an instance of the **repository_type** class.  The options can be defined in the array passed as the second parameter to the constructor. For example [Wikipedia repository](https://github.com/moodle/moodle/blob/v4.0.0/repository/wikimedia/db/install.php).

### Developer-defined API

These are settings that are configured for the whole Moodle site and not per instance of your plugin. All of these are optional, without them there will be no configuration options in the Site administration > Plugins > Repositories > pluginname page.

#### get_type_option_names(): array

This function must be declared static

Optional. Return an array of string. These strings are setting names. These settings are shared by all instances.
Parent function returns an array with a single item - pluginname.

<details>
  <summary>View example</summary>
  <div>

```php
public static function get_type_option_names() {
   return array_merge(parent::get_type_option_names(), ['rootpath']);
}
```

  </div>
</details>

#### type_config_form($mform, $classname='repository')

This function must be declared static

Optional. This is for modifying the Moodle form displaying the plugin settings. The [Form Definition](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition) documentation has details of all the types of elements you can add to the settings form.

<details>
  <summary>View example</summary>
  <div>

For example, to display the standard repository plugin settings along with the custom ones use:

```php
public static function type_config_form($mform, $classname='repository') {
    parent::type_config_form($mform);

    $rootpath = get_config('repository_pluginname', 'rootpath');
    $mform->addElement('text', 'rootpath', get_string('rootpath', 'repository_pluginname'), array('size' => '40'));
    $mform->setDefault('rootpath', $rootpath);
}
```

  </div>
</details>

#### type_form_validation($mform, $data, $errors)

This function must be declared static

Optional. Use this function if you need to validate some variables submitted by plugin settings form. To use it, check through the associative array of data provided ('settingname' => value) for any errors. Then push the items to $error array in the format ("fieldname" => "human readable error message") to have them highlighted in the form.

```php
public static function type_form_validation($mform, $data, $errors) {
    if (!is_dir($data['rootpath'])) {
        $errors['rootpath'] = get_string('invalidrootpath', 'repository_pluginname');
    }
    return $errors;
}
```

### Instance settings

These functions relate to a specific instance of your plugin (for example the URL and login details to access a specific webdav repository). All of these are optional, without them, the instance settings form will only contain a single 'name' field.

#### get_instance_option_names(): array

This function must be declared static

Optional. Return an array of strings. These strings are setting names. These settings are specific to an instance.

If the function returns an empty array, the API will consider that the plugin displays only one repository in the file picker.

Parent function returns an empty array. This is equivalent to **get_type_option_names()**, but for a specific instance.

<details>
  <summary>View example</summary>
  <div>

```php
public static function get_instance_option_names() {
    return ['fs_path']; // From repository_filesystem
}
```

  </div>
</details>

#### instance_config_form($mform)

This function must be declared static

Optional. This is for modifying the Moodle form displaying the settings specific to an instance. This is equivalent to **type_config_form($mform, $classname)** but for instances. The [Form Definition](https://docs.moodle.org/dev/lib/formslib.php_Form_Definition) documentation has details of all the types of elements you can add to the settings form.

<details>
  <summary>View example</summary>
  <div>

For example, to add a required text box called email_address:

```php
public static function get_instance_option_names() {
    $mform->addElement(
        'text',
        'email_address',
        get_string('emailaddress', 'repository_pluginname')
    );
    $mform->addRule('email_address', $strrequired, 'required', null, 'client');
}
```

  </div>
</details>

:::note

**mform** has by default a name text box (cannot be removed).

:::

#### instance_form_validation($mform, $data, $errors)

This function must be declared static

Optional. This allows us to validate what has been submitted in the instance configuration form. This is equivalent to ''type_form_validation($mform, $data, $errors), but for instances. For example:

```php
public static function instance_form_validation($mform, $data, $errors) {
    if (empty($data['email_address'])) {
        $errors['email_address'] = get_string('invalidemailsettingname', 'repository_flickr_public');
    }
}
```

#### Getting / updating settings

Both global and instance settings can be retrieved, from within the plugin, via **$this->get_option('settingname')** and updated via **$this->set_option(array('settingname' => 'value'))**.

:::note

You cannot call **$this** from static methods.  If you need access the non static variables, you may have to store the values in the **_construct()** method into private static variables.

:::

#### plugin_init()

This function must be declared static.

Optional. This function is called when the administrator adds the plugin. So unless the administrator deletes the plugin and re-adds it, it should be called only once.

Parent function does nothing.

### Example of using the settings

As an example, let's create a Flickr plugin for accessing a public flickr account. The plugin will be called "Flickr Public".

Firstly the skeleton:

```php title="repository/flickr_public/lib.php"
<?php
/**
 * repository_flickr_public class
 * Moodle user can access public flickr account
 *
 * @license http://www.gnu.org/copyleft/gpl.html GNU Public License
*/
class repository_flickr_public extends repository {
}
```

Then consider the question "What does my plugin do?"

In the Moodle file picker, we want to display some flickr public repositories directly linked to a flickr public account. For example **My Public Flickr Pictures**, and also ''My Friend's Flickr Pictures''. When the user clicks on one of these repositories, the public pictures are displayed in the file picker.

In order to access to a flickr public account, the plugin needs to know the email address of the Flickr public account owner. So the administrator will need to set an email address for every repository. Let's add an "email address" setting to every repository. To do so you need to override:

- **get_instance_option_names** returing ['email_address'].
- **instance_config_form** adding a text box called 'email_address' into the form.

So at this moment all our Flickr Public Repositories will have a specific email address. However this is not enough. In order to communicate with Flickr, Moodle needs to know a Flickr API key https://www.flickr.com/services/api/. This API key is the same for any repository. We could add it with the email address setting but the administrator would have to enter the same API key for every repository. Hopefully the administrator can add settings to the plugin level, impacting all repositories. To do so you need to override:

- **get_type_option_names** returing ['api_key'].
- **type_config_form** adding the api_key text input element into the form.

At this point we have created everything necessary for the administration pages. But let's go further. It would be good if the user can enter any "Flickr public account email address" in the file picker. In fact we want to display in the file picker a Flickr Public repository that the Moodle administrator can never delete. Let's add:

- **plugin_init** using __repository::static_function__ to create a default repository instance.

That's all - the administration part of our Flickr Public plugin is done. For your information, Box.net, Flickr, and Flickr Public all have similar administration APIs.

import FlickPublicLib from '!!raw-loader!./_examples/flickr_public_lib.php';

<Lib
    plugintype="repository"
    pluginname="pluginname"
    example={FlickPublicLib}
    legacy={false}
    summary={false}
    description=""
/>

## Repository APIs

### Quick Start

The File Picker uses Ajax calls to present the repository content. In order to integrate a repository with the the Ajax callbacks there are several possibilities:

- When a plugin requires a special user login (for example OAuth) the plugin must detect user session in the `constructor()` function, and use `print_login()` if required.
- For plugins that need to connect to a remote repository the connections can be done into the `get_listing()` or `constructor()` function.
- To retrieve the file that the user selected from a remote server, the plugin must rewrite the `get_file()` method.
- To provide search feature the plugin must rewrite the `search()` method.

All those methods are descrived below.

### Functions you MUST override

These functions cover the basics of initialising your plugin each time the repository is accessed and listing the files available to the user from within the plugin.

#### __construct($respoitoryid, $context=SYSCONTEXTID, $options=array(), $readonly=0)

Should be overridden to do any initialisation required by the repository, including:

- logging in via optional_param, if required - see 'print_login', below
- getting any options from the database

The possible items in the $options array are:

- 'ajax' - bool, true if the user is using the AJAX filepicker
- mimetypes' - array of accepted mime types, or '\*' for all types

Calling parent::\__construct($repositoryid, $context, $options, $readonly); is essential and will set up various required member variables:

- this->id - the repository instance id (the ID of the entry in mdl_repository_instances)
- this->context - the context in which the repository instance can be found
- this->instance - the repository instance record (from mdl_repository_instances)
- this->readonly - whether or not the settings can be changed
- this->options - the above options, combined with the settings saved in the database
- this->name - as specified by $this->get_name()
- this->returntypes - as specified by $this->supported_returntypes()

#### get_listing($path="", $page="")

This function will return a list of files to be displayed to the user, the list must be a array.

<details>
  <summary>View example</summary>
  <div>

```php
/**
 * Get file listing.
 *
 * This is a mandatory method for any repository.
 *
 * See repository::get_listing() for details.
 *
 * @param string $encodedpath
 * @param string $page
 * @return array the list of files, including meta information
 */
public function get_listing($encodedpath = '', $page = '') {
    // This methods
    return [
        //this will be used to build navigation bar.
        'path'=>[
            [
                'name'=>'root'
                'path'=>'/'
            ],
            [
                'name'=>'subfolder',
                'path'=>'/subfolder'
            ],
        ],
        'manage'=>'http://webmgr.moodle.com',
        'list'=> [
            [
                'title'=>'filename1',
                'date'=>'1340002147',
                'size'=>'10451213',
                'source'=>'http://www.moodle.com/dl.rar',
            ],
            [
                'title'=>'folder',
                'date'=>'1340002147',
                'size'=>'0',
                'children'=>[],
            ],
        ],
    ];
}
```

  </div>
</details>

Amongst other details, this returns a **title** for each file (to be displayed in the filepicker) and the **source** for the file (which will be included in the request to 'download' the file into Moodle or to generate a link to the file). Directories return a **children** value, which is either an empty array (if 'dynload' is specified) or an array of the files and directories contained within it.

<details>
  <summary>The full specification of list element</summary>
  <div>

import FullList from '!!raw-loader!./_examples/full_list.jsonc';

<CodeBlock language="json">{FullList}</CodeBlock>

  </div>
</details>

### Dynamically loading

Some repositories contain many files which cannot load in one time, in this case, we need dynamically loading to fetch them step by step, files in subfolder won't be listed until user click the folder in file picker treeview.

As a plug-in developer, if you set dynload flag as **true**, you should return files and folders (set children as a null array) in current path only instead of building the whole file tree.

The use of the **object** tag, instead of returning a **list** of files, allows you to embed an external file chooser within the repository panel. See [Repository plugins embedding external file chooser](https://docs.moodle.org/dev/Repository_plugins_embedding_external_file_chooser) for details about how to do this.

### User login (optional)

If our plugin allows a user to log in to a remote service, you can support this using the `print_login()` and `check_login` function, which are desribed below.

#### print_login

For plugins which need to support login to a remote service, the `print_login()` function can be used to return an array of the form elements needed to support the login.

<details>
  <summary>View example</summary>
  <div>

:::note

It is important to note that the repository login can be called on both Ajax and non ajax requests. For this reason the `print_login()` should check for `$this->options['ajax']` to know if it should return an array or the full login HTML form.

:::

```php
public function print_login() { // From repository_pluginname
    global $OUTPUT;

    if ($this->options['ajax']) {
        $user_field = (object) [
            'label' => get_string('username', 'repository_pluginname'),
            'id' => 'pluginname_username',
            'type' => 'text',
            'name' => 'al_username',
        ];

        $passwd_field = (object) [
            'label' => get_string('password', 'repository_pluginname'),
            'id' => 'pluginname_password',
            'type' => 'password',
            'name' => 'al_password',
        ];

        $ret = [];
        $ret['login'] = [$user_field, $passwd_field];
        return $ret;
    } else { // Non-AJAX login form - directly output the form elements.
        // Print the login form HTML including the input username and password fields.
        $loginform = new repository_pluginname\output\login();
        echo $OUTPUT->render($loginform);
        // Example of a login form:
        // <label> Username </label>
        // <input type="text" name="al_username" />
        // <label> Password </label>
        // <input type="password" name="al_password" />
        // <input type="submit" value="Enter" />
    }
}
```

  </div>
</details>

This will help to generate a form by file picker which contains user name and password input elements.

If your login form is static and never changes, you can add `$ret['allowcaching']) = true;` and filepicker will not send the request to the server every time user opens the login/search form.

For plugins that do not fully process the login via a popup window, the submitted details can be retrieved, from within the `__construct` function, via `$submitted = optional_param('fieldname', [PARAM_INT/PARAM_TEXT)`.

<details>
  <summary>View example</summary>
  <div>

```php title="lib/alfresco/lib.php"
public function __construct($repositoryid, $context = SYSCONTEXTID, $options = []) {
    global $SESSION;

    /* Skipping code that is not relevant to user login */

    $this->alfresco = new Alfresco_Repository($this->options['alfresco_url']);
    $this->username = optional_param('al_username', '', PARAM_RAW);
    $this->password = optional_param('al_password', '', PARAM_RAW);
    try{
        // deal with user logging in.
        if (empty($SESSION->{$this->sessname}) && !empty($this->username) && !empty($this->password)) {
            $this->ticket = $this->alfresco->authenticate($this->username, $this->password);
            $SESSION->{$this->sessname} = $this->ticket;
        } else {
            if (!empty($SESSION->{$this->sessname})) {
                $this->ticket = $SESSION->{$this->sessname};
            }
        }
        $this->user_session = $this->alfresco->createSession($this->ticket);
        $this->store = new SpacesStore($this->user_session);
    } catch (Exception $e) {
        $this->logout();
    }
    $this->current_node = null;

    /* Skipping code that is not relevant to user login */

}
```

  </div>
</details>

Many types include a single element of type 'popup' with the param 'url' pointing at the URL used to authenticate the repo instance.

<details>
  <summary>View example</summary>
  <div>

```php title="Code taken from repository_boxnet"
public function print_login() {
    $ticket = $this->boxclient->getTicket();
    if ($this->options['ajax']) {
        $loginbtn = (object)[
            'type' => 'popup',
            'url' => ' https://www.box.com/api/1.0/auth/' . $ticket->get_oauth_tokens(),
        ];
        $result = [];
        $result['login'] = [$loginbtn];
        return $result;
    } else {
        // Print the login form HTML including the input username, password and ticket fields.
        $loginform = new repository_boxnet\output\login($ticket);
        echo $OUTPUT->render($loginform);
        // Example of a login form:
        // <label> Username </label>
        // <input type="text" name="boxusername" />
        // <label> Password </label>
        // <input type="password" name="boxpassword" />
        // <input type="hidden" name="ticket" value="{$ticket->get_oauth_tokens()}" />
        // <input type="submit" value="Enter" />
    }
}
```

  </div>
</details>

#### check_login(): bool

This function will return a boolean value to tell Moodle whether the user has logged in.
By default, this function will return true.

```php
public function check_login(): bool {
    global $SESSION;
    return !empty($SESSION->{$this->sessname});
}
```

#### logout

When a user clicks the logout button in file picker, this function will be called. You may clean up the session or disconnect the connection with remote server here. After this the code should return something suitable to display to the user (usually the results of calling **$this->print_login()**):

```php title="lib/alfresco/lib.php"
public function logout() {
    global $SESSION;
    unset($SESSION->{$this->sessname});
    return $this->print_login();
}
```

### Transferring files to Moodle (optional)

These functions all relate to transferring the files into Moodle, once they have been chosen in the filepicker. All of them are optional and have default implementations which are often suitable to use as they are.

#### get_file_reference($source)

This function takes $source as in user input, parses and cleans it (recommended to call clean_param()). It prepares the reference to the file in repository-specific format that would be passed on to methods get_file(), get_link(), get_moodle_file(), get_file_by_reference() and/or stored in DB in case of creating a shortcut to file. For the most of repositories it is just clean $source value. For has_moodle_files-repositories this function also changes encoding.

#### get_file($url, $filename = "")

For FILE_INTERNAL or FILE_REFERENCE this function is called at the point when the user has clicked on the file and then on 'select this file' to add it to the filemanager / editor element. It does the actual transfer of the file from the repository and onto the Moodle server. The default implementation is to download the $url via CURL. The $url parameter is the $reference returned by get_file_reference (above, but usually the same as the 'source' returned by 'get_listing'). The $filename should usually be processed by $path = $this->prepare_file($filename), giving the full 'path' where the file should be saved locally. This function then returns an array, containing:

- path - the local path where the file was saved
- url - the $url param passed into the function

<Tabs>
  <TabItem value="generic" label="Basic example" default>

```php
public function get_file($url, $filename = '') {
// Default implementation from the base 'repository' class
    $path = $this->prepare_file($filename); // Generate a unique temporary filename
    $curlobject = new curl();
    $result = $curlobject->download_one($url, null, ['filepath' => $path, 'timeout' => self::GETFILE_TIMEOUT]);
    if ($result !== true) {
        throw new moodle_exception('errorwhiledownload', 'repository', '', $result);
    }
    return ['path'=>$path, 'url'=>$url];
}
```

  </TabItem>
  <TabItem value="aquella" label="repository_aquella example" default>

Slightly extended version taken from repository_equella

```php
public function get_file($reference, $filename = '') {
    global $USER;
    // Replace the line below by any method your plugin have to check a reference.
    $details = example_external_server::get_details_by_reference($reference->reference));
    if (!isset($details->url) || !($url = $this->appendtoken($details->url))) {
        // Occurs when the user isn't known..
        return null;
    }
    $path = $this->prepare_file($filename);
    $cookiepathname = $this->prepare_file($USER->id. '_'. uniqid('', true). '.cookie');
    $curlobject = new curl(['cookie'=>$cookiepathname]);
    $result = $curlobject->download_one(
        $url,
        null,
        ['filepath' => $path, 'followlocation' => true, 'timeout' => self::GETFILE_TIMEOUT]
    );
    // Delete cookie jar.
    if (file_exists($cookiepathname)) {
        unlink($cookiepathname);
    }
    if ($result !== true) {
        throw new moodle_exception('errorwhiledownload', 'repository', '', $result);
    }
    return ['path'=>$path, 'url'=>$url];
}
```

  </TabItem>
</Tabs>

#### get_link($url)

Used with `FILE_EXTERNAL` to convert a reference (from 'get_file_reference', but ultimately from the output of 'get_listing') into a URL that can be used directly by the end-user's browser. Usually just returns the original $url, but may need further transformation based on the internal implementation of the repository plugin.

#### get_file_source_info($source)

Takes the 'source' field from 'get_listing' (as returned by the user's browser) and returns the value to be stored in files.source field in DB (regardless whether file is picked as a copy or by reference). It indicates where the file came from. It is advised to include either full URL here or indication of the repository.
Examples: 'Dropbox: /filename.jpg', 'http://fullurl.com/path/file', etc.

This value will be used to display warning message if reference can not be restored from backup.  Also it can (although not has to) be used in get_reference_details() to produce the human-readable reference source in the fileinfo dialogue in the file manager.

### Search functions (optional)

These functions allow you to implement search functionality within your repository.

#### print_search

When a user clicks the search button on file picker, this function will be called to return a search form. By default, it will create a form with single search bar - you can override it to create a advanced search form.

A custom search form must include the following:

- A text field element named **s**, this is where users will type in their search criteria
- A hidden element named **repo_id** and the value must be the id of the repository instance
- A hidden element named **ctx_id** and the value must be the context id of the repository instance
- A hidden element named **sesskey** and the value must be the session key

<details>
  <summary>View example</summary>
  <div>

```php title="The default implementation in class 'repository'"
public function print_search() {
    global $PAGE;
    $renderer = $PAGE->get_renderer('core', 'files');
    return $renderer->repository_default_searchform();
    // The default search HTML from repository/renderer.php:
    // <div class="fp-def-search"><input name="s" value='.get_string('search', 'repository').' /></div>;
}
```

  </div>
</details>

#### search($search_text, $page = 0)

Return the results of doing the search. Any additional parameters from the search form can be retrieved by $param = optional_param('paramname', [PARAM_INT / PARAM_TEXT);.

The return should return an array containing:

- list - with the same layout as the 'list' element in 'get_listing'

<details>
  <summary>View example</summary>
  <div>

```php title="Example from repoistory_googledocs"
public function search($search_text, $page = 0) {
    $gdocs = new google_docs($this->googleoauth);
    return [
        'dynload' => true,
        'list' => $gdocs->get_file_list($search_text),
    ];
}
```

  </div>
</details>

#### global_search()

Return true if should be included in a search throughout all repositories (currently not available via the UI)

### Repository support for returning file as alias/shortcut

It is possible to link to the file from external (or internal) repository by reference. In UI it is called "create alias/shortcut". This creates a row in `files` table but the contents of the file is not stored. Although it may be cached by repository if developer wants to.

Make sure that function supported_returntypes() returns FILE_REFERENCE among other types.

Note that external file is synchronised by moodle when UI wants to show the file size.

#### get_reference_file_lifetime()

Return minimum number of seconds before checking for changes to the file (default implementation = 1 day)

```php
public function get_reference_file_lifetime($ref) {
    return DAYSECS; // One day, 60 * 60 * 24 seconds.
}
```

#### sync_individual_file(stored_file $storedfile)

Called after the file has reached the 'lifetime' specified above to see if it should now be synchronised (default implementation is to return true)

```php
public function sync_individual_file(stored_file $storedfile) {
    return true;
}
```

#### get_reference_details($reference, $filestatus = 0)

Returns human-readable information about where the original file is stored (to be displayed in the filepicker properties box).

This is usually prefixed with the repository name, and a semicolon. For example: `Myrepository: http://url.to.file`.

- `$reference` is the 'source' output by `get_listing`
- `$filestatus` can be either `0` (OK - default) or `666` (source file missing).

<details>
  <summary>View example</summary>
  <div>

```php title="lib.php"
public function get_reference_details($reference, $filestatus = 0) {
    if (!$filestatus) {
        // Replace the line below by any method your plugin have to check a reference.
        $details = example_external_server::get_details_by_reference($reference);
        return $this->get_name() . ': ' . $details->filename;
    } else {
        return get_string('lostsource', 'repository', '');
    }
}
```

  </div>
</details>

#### get_file_by_reference($reference)

Returns up-to-date information about the original file, only called when the 'lifetime' is reached and 'sync_individual_file' returns true.

- For image files - download the file and return either $ret->filepath (full path on the server), $ret->handle (open handle to the file) or $ret->content (raw data from the file) to allow the file to be saved into the Moodle filesystem and the thumbnail to be updated
- For non-image files - avoid downloading the file (if possible) and just return $ret->filesize to update that information
- For missing / inaccessible files - return null
    Remember this function may be called quite a lot, as the filemanager often wants to know the filesize.

<details>
  <summary>View example</summary>
  <div>

```php title="/lib.php"
public function get_file_by_reference($reference) {
    global $USER;
    // Replace the line below by any method your plugin have to check a reference.
    $details = example_external_server::get_details_by_reference($reference->reference));
    if (!isset($details->url) || !($url = $this->appendtoken($details->url))) {
        // Occurs when the user isn't known.
        return null;
    }

    // Download the file details.
    $return = null;
    $cookiepathname = $this->prepare_file($USER->id . '_' . uniqid('', true) . '.cookie');
    $headparams = ['followlocation' => true, 'timeout' => self::SYNCFILE_TIMEOUT];
    $curlobject = new curl(['cookie' => $cookiepathname]);

    if (file_extension_in_typegroup($ref->filename, 'web_image')) {
        // The file is an image - download and return the file path.
        $path = $this->prepare_file('');
        $result = $curlobject->download_one($url, null, $headparams);
        if ($result === true) {
            $return = (object) ['filepath' => $path];
        }
    } else {
        // The file is not an image - just get the file details.

        $result = $curlobject->head($url, $headparams);
    }

    // Delete cookie jar.
    if (file_exists($cookiepathname)) {
        unlink($cookiepathname);
    }

    $this->connection_result($ccurlobject->get_errno());
    $curlinfo = $ccurlobject->get_info();
    if ($return === null && isset($curlinfo['http_code']('list'])) &&
            $curlinfo['http_code']== 200 &&
            array_key_exists('download_content_length', $curlinfo) &&
            $curlinfo['download_content_length']('http_code']) >= 0) {
        // We received a correct header and at least can tell the file size.
        $return = (object) ['filesize' => $curlinfo['download_content_length']];
    }
    return $return;
}
```

  </div>
</details>

#### send_file($storedfile, $lifetime=86400, $filter=0, $forcedownload=false, array $options = null)

Send the requested file back to the user's browser. The 'reference' for the file can be found via $storedfile->get_reference(). If the file is not found / no longer exists, the function 'send_file_not_found()' should be used. Otherwise the file should be output directly, via the most appropriate method:

- Use a 'Location: ' header to redirect to the external URL
- Download the file and cache within the Moodle filesystem (possibly using '$this->import_external_file_contents()'), then call 'send_stored_file'.

:::note

It is up to the repository developer to decide whether to actually download the file or to return a locally cached copy instead.

:::

<details>
  <summary>View example</summary>
  <div>

```php title="/lib.php"
public function send_file($stored_file, $lifetime=86400 , $filter=0, $forcedownload=false, array $options = null) {
    // Replace the line below by any method your plugin have to check a reference.
    $details  = example_external_server::get_details_by_reference($stored_file->get_reference()));
    $url = $this->appendtoken($details->url);
    if ($url) {
        header('Location: ' . $url);
    } else {
        send_file_not_found();
    }
}
```

  </div>
</details>

An example of caching files within the Moodle filesystem can be found in repository_dropbox.
