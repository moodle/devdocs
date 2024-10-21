---
title: Utilities
tags:
  - Privacy
  - GDPR
---
While implementing the privacy API into your plugin, there are CLI scripts that can help you to test things on the fly.

:::danger Important

These scripts are to assist during development. They are not intended to replace proper unit tests.

:::

Put these scripts into the root of your Moodle development installation and run them via command line. See [Privacy API](./index.md) for the full guide on implementing the API in your plugin.

## Test of privacy API compliance

```php
<?php

// Set this if you want to run the script for one component only. Otherwise leave empty.
$CHECK_COMPONENT = '';

define('CLI_SCRIPT', true);

require_once('config.php');

$user = \core_user::get_user(2);

\core\session\manager::init_empty_session();
\core\session\manager::set_user($user);

$rc = new \ReflectionClass(\core_privacy\manager::class);
$rcm = $rc->getMethod('get_component_list');
$rcm->setAccessible(true);

$manager = new \core_privacy\manager();
$components = $rcm->invoke($manager);

$list = (object) [
    'good' => [],
    'bad' => [],
];

foreach ($components as $component) {
    if ($CHECK_COMPONENT && $component !== $CHECK_COMPONENT) {
        continue;
    }
    $compliant = $manager->component_is_compliant($component);
    if ($compliant) {
        $list->good[] = $component;
    } else {
        $list->bad[] = $component;
    }
}

echo "The following plugins are not compliant:\n";
echo "=> " . implode("\n=> ", array_values($list->bad)) . "\n";

echo "\n";
echo "Testing the compliant plugins:\n";
foreach ($list->good as $component) {
    $classname = \core_privacy\manager::get_provider_classname_for_component($component);
    echo "== {$component} ($classname) ==\n";
    if (check_implements($component, \core_privacy\local\metadata\null_provider::class)) {
        echo "    Claims not to store any data with reason:\n";
        echo "      '" . get_string($classname::get_reason(), $component) . "'\n";
    }
    else if (check_implements($component, \core_privacy\local\metadata\provider::class)) {
        $collection = new \core_privacy\local\metadata\collection($component);
        $classname::get_metadata($collection);
        $count = count($collection->get_collection());
        echo "    Found {$count} items of metadata\n";
        if (empty($count)) {
            echo "!!! No metadata found!!! This an error.\n";
        }

        if (check_implements($component, \core_privacy\local\request\user_preference_provider::class)) {
            $userprefdescribed = false;
            foreach ($collection->get_collection() as $item) {
                if ($item instanceof \core_privacy\local\metadata\types\user_preference) {
                    $userprefdescribed = true;
                    echo "     ".$item->get_name()." : ".get_string($item->get_summary(), $component) . "\n";
                }
            }
            if (!$userprefdescribed) {
                echo "!!! User preference found, but was not described in metadata\n";
            }
        }

        if (check_implements($component, \core_privacy\local\request\core_user_data_provider::class)) {
            // No need to check the return type - it's enforced by the interface.
            $contextlist = $classname::get_contexts_for_userid($user->id);
            $approvedcontextlist = new \core_privacy\local\request\approved_contextlist($user, $contextlist->get_component(), $contextlist->get_contextids());
            if (count($approvedcontextlist)) {
                $classname::export_user_data($approvedcontextlist);
                echo "    Successfully ran a test export\n";
            } else {
                echo "    Nothing to export.\n";
            }
        }
        if (check_implements($component, \core_privacy\local\request\shared_data_provider::class)) {
            echo "    This is a shared data provider\n";
        }
    }
}

echo "\n\n== Done ==\n";

function check_implements($component, $interface) {
    $manager = new \core_privacy\manager();
    $rc = new \ReflectionClass(\core_privacy\manager::class);
    $rcm = $rc->getMethod('component_implements');
    $rcm->setAccessible(true);

    return $rcm->invoke($manager, $component, $interface);
}
```

## Test of exporting user data

```php
<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Helper utility to perform a test export.
 *
 * @copyright 2018 Andrew Nicols <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('CLI_SCRIPT', true);
require_once('config.php');
require_once("$CFG->libdir/clilib.php");

list($options, $unrecognized) = cli_get_params(
    [
        'username' => '',
        'userid' => '',
    ],
    []
);

$user = null;
$username = $options['username'];
$userid = $options['userid'];

if (!empty($options['username'])) {
    $user = \core_user::get_user_by_username($options['username']);
} else if (!empty($options['userid'])) {
    $user = \core_user::get_user($options['userid']);
}

while (empty($user)) {
    if (!empty($username)) {
        echo "Unable to find a user with username '{$username}'.\n";
        echo "Try again.\n";
    } else if (!empty($userid)) {
        echo "Unable to find a user with userid '{$userid}'.\n";
        echo "Try again.\n";
    }
    $username = readline("Username: ");
    $user = \core_user::get_user_by_username($username);
}

echo "Processing export for " . fullname($user) . "\n";

\core\session\manager::init_empty_session();
\core\session\manager::set_user($user);

$PAGE = new moodle_page();
$OUTPUT = new core_renderer($PAGE, RENDERER_TARGET_GENERAL);

$manager = new \core_privacy\manager();

$approvedlist = new \core_privacy\local\request\contextlist_collection($user->id);

$contextlists = $manager->get_contexts_for_userid($user->id);
foreach ($contextlists as $contextlist) {
    $approvedlist->add_contextlist(new \core_privacy\local\request\approved_contextlist(
        $user,
        $contextlist->get_component(),
        $contextlist->get_contextids()
    ));
}

$exportedcontent = $manager->export_user_data($approvedlist);
$basedir = make_temp_directory('privacy');
$exportpath = make_unique_writable_directory($basedir, true);
$fp = get_file_packer();
$fp->extract_to_pathname($exportedcontent, $exportpath);

echo "\n";
echo "== File export was uncompressed to {$exportpath}\n";
echo "============================================================================\n";
```

## Test of deleting user data

```php
<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

define('CLI_SCRIPT', true);
require_once('config.php');
require_once("$CFG->libdir/clilib.php");

list($options, $unrecognized) = cli_get_params(
    [
        'username' => '',
        'userid' => '',
    ],
    []
);

$user = null;
$username = $options['username'];
$userid = $options['userid'];

if (!empty($options['username'])) {
    $user = \core_user::get_user_by_username($options['username']);
} else if (!empty($options['userid'])) {
    $user = \core_user::get_user($options['userid']);
}

while (empty($user)) {
    if (!empty($username)) {
        echo "Unable to find a user with username '{$username}'.\n";
        echo "Try again.\n";
    } else if (!empty($userid)) {
        echo "Unable to find a user with userid '{$userid}'.\n";
        echo "Try again.\n";
    }
    $username = readline("Username: ");
    $user = \core_user::get_user_by_username($username);
}

echo "Processing delete for " . fullname($user) . "\n";

\core\session\manager::init_empty_session();
\core\session\manager::set_user($user);

$manager = new \core_privacy\manager();

$approvedlist = new \core_privacy\local\request\contextlist_collection($user->id);

$trace = new text_progress_trace();
$contextlists = $manager->get_contexts_for_userid($user->id, $trace);
foreach ($contextlists as $contextlist) {
    $approvedlist->add_contextlist(new \core_privacy\local\request\approved_contextlist(
        $user,
        $contextlist->get_component(),
        $contextlist->get_contextids()
    ));
}

$manager->delete_data_for_user($approvedlist, $trace);
```
