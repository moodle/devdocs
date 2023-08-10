---
title: Plugin QA prechecks
sidebar_label: QA prechecks
tags:
  - Guidelines for contributors
  - Plugins
  - Plugin documentation
  - QA
---
Plugin QA prechecks are for testing the functionality of plugins submitted for approval in the Moodle Plugins directory. Together with [code prechecks](../../community/plugincontribution/codeprechecks), they are part of the plugin [approval process](../../community/plugincontribution#sharing-code-in-the-plugins-directory).

Moodle community members with experience in setting up a local Moodle test environment can help with plugin QA prechecks. If you would like to help, please contact David Mudrák [david@moodle.com](mailto:david@moodle.com)

## QA environment setup

To perform plugin QA prechecks, you need to have a test Moodle site (normally the latest stable version) installed locally. Your test site should have

- Developer debugging enabled with debugging messages displayed in order to report all PHP notices, warnings and errors spotted during plugin installation and usage.
- `$CFG->prefix` set to a non-default value, such as "m_" or "mqa_". This allows to catch cases when the default "mdl_" prefix is hard-coded in PHP.

In addition, if possible the site should run on the PostgreSQL database engine to catch potential MySQL-specific SQL statements in the code.

## Process

1. Choose a plugin needing an initial review from the [list of plugins awaiting approval](https://moodle.org/plugins/report/index.php?report=pendingapproval_plugins) (access restricted to members of the [Plugins guardians](../../community/plugincontribution/guardians) group).
1. To show that you are going to perform the QA prechecks, set yourself as the plugin approval issue assignee (CONTRIB-xxx as mentioned at the plugin page comments area).
1. Download and install it on your test site then perform the QA prechecks as listed below.
1. Add a comment to the plugin approval issue with your findings using the 'Plugin QA checklist' canned response.
1. If you detect any problems with the plugin, add a comment to the plugin page asking the plugin developer to look at the plugin approval issue.
1. Once everything is fine, add a comment to the plugin approval issue 'Congratulations, your plugin passes the metadata and usability checks. :-) Coding checks will be done soon.'

## QA prechecks

1. Does the plugin have all the appropriate metadata as described in the [Plugin contribution checklist](../../community/plugincontribution/checklist)?
1. Does the plugin install nicely and not break or otherwise negatively affect the site functionality (anti-regression test)? This also checks that all eventual dependencies are already available in the plugins directory.
1. If possible (e.g. if no complex integration with an external system is needed), test the actual functionality of the plugin to see it works as described (feature test).
