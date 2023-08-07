---
title: Plugins directory API
sidebar_position: 10
tags:
  - Guidelines for contributors
  - Plugins
  - Plugin documentation
---
The Plugins directory at http://moodle.org/plugins exposes some of its features via web services layer, allowing the community to develop custom tools and integrations with other services such as GitHub Actions or Travis CI.

## Access token

To use the web service described below, the caller (client) authenticates itself with an access token. In almost all cases, developers use their own personal token and let the scripts (clients) work on behalf of them.

The easiest way to obtain the access token (and some other useful information) is to visit *Plugins > API access* page at moodle.org through the side Navigation block.

The token can be alternatively obtained via the *Preferences > Security keys* or programmatically via `login/token.php` script at moodle.org (however, tokens obtain that way have very short expiration in contrast with the ones generated at the dedicated page).

## Plugins maintenance service

The Plugins maintenance service (`plugins_maintenance`) provides functions for the plugins maintainers. The service is declared as:

```php
'Plugins maintenance' => [
    'functions' => [
        'local_plugins_get_maintained_plugins',
        'local_plugins_add_version',
    ],
    'shortname' => 'plugins_maintenance',
    'requiredcapability' => 'local/plugins:editownplugins',
    'enabled' => true,
    'restrictedusers' => 0,
    'downloadfiles' => true,
    'uploadfiles' => true,
],
```

### Getting the list of maintained plugins

The first external function `local_plugins_get_maintained_plugins` allows to read the list of all plugins and their recent versions the caller is maintainer of. It does not expect any parameters and its return structure is described as follows:

```php
return new external_multiple_structure(
    new external_single_structure([
        'id' => new external_value(PARAM_INT, 'Internal plugin identifier'),
        'name' => new external_value(PARAM_TEXT, 'Name of the plugin'),
        'shortdescription' => new external_value(PARAM_TEXT, 'Short description'),
        'description' => new external_value(PARAM_RAW, 'Description'),
        'descriptionformat' => new external_format_value('description'),
        'frankenstyle' => new external_value(PARAM_PLUGIN, 'Full component frankenstyle name'),
        'type' => new external_value(PARAM_ALPHANUMEXT, 'Plugin type'),
        'websiteurl' => new external_value(PARAM_URL, 'Website URL'),
        'sourcecontrolurl' => new external_value(PARAM_URL, 'Source control URL'),
        'bugtrackerurl' => new external_value(PARAM_URL, 'Bug tracker URL'),
        'discussionurl' => new external_value(PARAM_URL, 'Discussion URL'),
        'timecreated' => new external_value(PARAM_INT, 'Timestamp of plugin submission'),
        'approved' => new external_value(PARAM_INT, 'Approval status'),
        'visible' => new external_value(PARAM_BOOL, 'Visibility status'),
        'aggdownloads' => new external_value(PARAM_INT, 'Stats aggregataion - downloads'),
        'aggfavs' => new external_value(PARAM_INT, 'Stats aggregataion - favourites'),
        'aggsites' => new external_value(PARAM_INT, 'Stats aggregataion - sites'),
        'statusamos' => new external_value(PARAM_INT, 'AMOS registration status'),
        'viewurl' => new external_value(PARAM_URL, 'View URL'),
        'currentversions' => new external_multiple_structure(
            new external_single_structure([
                'id' => new external_value(PARAM_INT, 'Internal version identifier'),
                'version' => new external_value(PARAM_INT, 'Version number'),
                'releasename' => new external_value(PARAM_TEXT, 'Release name'),
                'releasenotes' => new external_value(PARAM_RAW, 'Release notes'),
                'releasenotesformat' => new external_format_value('releasenotes'),
                'maturity' => new external_value(PARAM_INT, 'Maturity code'),
                'changelogurl' => new external_value(PARAM_URL, 'Change log URL'),
                'altdownloadurl' => new external_value(PARAM_URL, 'Alternative download URL'),
                'md5sum' => new external_value(PARAM_TEXT, 'MD5 hash of the ZIP content'),
                'vcssystem' => new external_value(PARAM_ALPHA, 'Version control system'),
                'vcssystemother' => new external_value(PARAM_TEXT, 'Name of the other version control system'),
                'vcsrepositoryurl' => new external_value(PARAM_URL, 'Version control system URL'),
                'vcsbranch' => new external_value(PARAM_TEXT, 'Name of the branch with this version'),
                'vcstag'  => new external_value(PARAM_TEXT, 'Name of the tag with this version'),
                'timecreated' => new external_value(PARAM_INT, 'Timestamp of version release'),
                'approved' => new external_value(PARAM_INT, 'Approval status'),
                'visible'  => new external_value(PARAM_BOOL, 'Visibility status'),
                'supportedmoodle' => new external_value(PARAM_TEXT, 'Comma separated list of support Moodle versions'),
                'downloadurl' => new external_value(PARAM_URL, 'Download URL'),
                'viewurl' => new external_value(PARAM_URL, 'View URL'),
                'smurfresult' => new external_value(PARAM_TEXT, 'Code prechecks results summary'),
            ])
        ),
    ])
);
```

#### Example cURL client fetching the list of maintained plugins

```bash
#!/bin/bash

# Replace this with your own service access token.
TOKEN="d41d8cd98f00b204e9800998ecf8427e"

CURL="curl -s"
ENDPOINT=https://moodle.org/webservice/rest/server.php
FUNCTION=local_plugins_get_maintained_plugins

${CURL} ${ENDPOINT} --data-urlencode "wstoken=${TOKEN}" --data-urlencode "wsfunction=${FUNCTION}" \
    --data-urlencode "moodlewsrestformat=json" | jq
```

### Releasing a new version

The second function `local_plugins_add_version` allows to release a new version to the plugin. The input parameters are described as:

```php
return new external_function_parameters([
    // The pluginid or frankenstyle must be provided (in this order of precedence).
    'pluginid' => new external_value(PARAM_INT, 'Internal identifier of the plugin', VALUE_DEFAULT, null),
    'frankenstyle' => new external_value(PARAM_PLUGIN, 'Full component name of the plugin', VALUE_DEFAULT, null),
    // ZIP can be specified by draft area itemid (with single file in it), content or URL (in this order of precedence).
    'zipdrafitemtid' => new external_value(PARAM_INT, 'Itemid of user draft area with uploaded ZIP', VALUE_DEFAULT, null),
    'zipcontentsbase64' => new external_value(PARAM_RAW, 'ZIP file contents encoded with MIME base64', VALUE_DEFAULT, null),
    'zipurl' => new external_value(PARAM_URL, 'ZIP file URL', VALUE_DEFAULT, null),
    // Following params may be auto-detected from the ZIP content.
    'version' => new external_value(PARAM_INT, 'Version number', VALUE_DEFAULT, null),
    'releasename' => new external_value(PARAM_TEXT, 'Release name', VALUE_DEFAULT, null),
    'releasenotes' => new external_value(PARAM_RAW, 'Release notes', VALUE_DEFAULT, null),
    'releasenotesformat' => new external_format_value('releasenotes', VALUE_DEFAULT, FORMAT_MOODLE),
    'maturity' => new external_value(PARAM_INT, 'Maturity code', VALUE_DEFAULT, null),
    'supportedmoodle' => new external_value(PARAM_TEXT, 'Comma separated list of supported Moodle versions',
        VALUE_DEFAULT, null),
    // Other optional properties.
    'changelogurl' => new external_value(PARAM_URL, 'Change log URL', VALUE_DEFAULT, null),
    'altdownloadurl' => new external_value(PARAM_URL, 'Alternative download URL', VALUE_DEFAULT, null),
    'vcssystem' => new external_value(PARAM_ALPHA, 'Version control system', VALUE_DEFAULT, null),
    'vcssystemother' => new external_value(PARAM_TEXT, 'Name of the other version control system', VALUE_DEFAULT, null),
    'vcsrepositoryurl' => new external_value(PARAM_URL, 'Version control system URL', VALUE_DEFAULT, null),
    'vcsbranch' => new external_value(PARAM_TEXT, 'Name of the branch with this version', VALUE_DEFAULT, null),
    'vcstag'  => new external_value(PARAM_TEXT, 'Name of the tag with this version', VALUE_DEFAULT, null),
]);
```

The API has been designed so that:

- The actual ZIP can be taken from pre-uploaded file (standard way of using `webservice/upload.php`), or submitting the file contents directly, or providing an URL the ZIP should be fetched from.
- As many as possible parameters (such as list of supported Moodle versions, release name, release notes etc) default to the values specified in the ZIP itself.
- So it should be enough to specify just the plugin (either by numerical ID number of frankenstyle) and the ZIP with the new version. All other values are optional and can be used to override the auto-detected ones.

When successful, the external function's response is described as:

```php
return new external_single_structure([
    'id' => new external_value(PARAM_INT, 'Internal identifier of the newly created version'),
    'md5sum' => new external_value(PARAM_TEXT, 'MD5 hash of the ZIP content'),
    'timecreated' => new external_value(PARAM_INT, 'Timestamp of version release'),
    'downloadurl' => new external_value(PARAM_URL, 'Download URL'),
    'viewurl' => new external_value(PARAM_URL, 'View URL'),
    'warnings' => new external_multiple_structure(
        new external_value(PARAM_RAW, 'Validation warnings')
    ),
]);
```

#### Example CLI script to release a new version of a plugin

```bash
#!/bin/bash

# Replace this with your own service access token.
TOKEN="d41d8cd98f00b204e9800998ecf8427e"

# Set the full component name of the plugin.
PLUGIN=mod_subcourse
# Path to the ZIP fle with the new version.
ZIP=version.zip

CURL="curl -s"
HOST="https://moodle.org/"
ENDPOINT_REST="${HOST}/webservice/rest/server.php"
ENDPOINT_UPLOAD="${HOST}/webservice/upload.php"

ITEMID=$(${CURL} -F data=@${ZIP} "${ENDPOINT_UPLOAD}?token=${TOKEN}" | jq --raw-output '.[0].itemid')

${CURL} ${ENDPOINT_REST} --data-urlencode "wstoken=${TOKEN}" --data-urlencode "wsfunction=${FUNCTION}" --data-urlencode "moodlewsrestformat=json" \
    --data-urlencode "frankenstyle=${PLUGIN}" --data-urlencode "zipdrafitemtid=${ITEMID}" | jq
```

#### GitHub Actions

A new workflow can be configured at GitHub Actions to automatically release a new version in the Plugins directory once a tag is pushed to the repository. Please see https://github.com/moodlehq/moodle-plugin-release for details.
