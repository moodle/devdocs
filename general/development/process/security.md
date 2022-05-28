---
title: Security procedures
sidebar_label: Security
tags:
  - Security
  - Processes
---
In the Moodle software, security issues are treated very seriously. Even though a lot of time is dedicated designing the code to avoid such problems, it is inevitable in a project of this size that new vulnerabilities will occasionally be discovered.

## Disclosure policy

In Moodle, *responsible disclosure* is practised, which means there is a policy of disclosing all security issues that come to our attention, but only after we have solved the issue and given registered Moodle sites time to upgrade or patch their installations.

When reporting a security issue, you are asked to observe these same guidelines too. Beyond communicating with the security team, **do not share your knowledge of security issues with the public at large**.

## How can I report a  security issue?

Please submit your findings via our **[security issue submission form](https://moodle.org/security/report)**, providing step by step instructions if possible. The form is broken down into sections to help you provide all of the necessary details to help us assess the issue.

The [submission form](https://moodle.org/security/report) is linked to our [Bugcrowd](https://bugcrowd.com) program, which ensures more efficient triage of incoming security issues and a smoother overall responsible disclosure process.

If you are a developer and wish to submit a fix along with your submission, please feel free to [create a new issue](https://tracker.moodle.org/secure/CreateIssue.jspa?pid=10011&issuetype=1) in the Moodle Tracker instead, ensuring that you set a security level on the issue (**"Serious security issue"** or **"Minor security issue"**), which will hide it from public view. If you are submitting via Tracker and not sure whether an issue is a security issue, you should set the security level to **"Could be a security issue"**.

:::warning

In line with the responsible disclosure philosophy, please do *not* post about security issues in the forums on moodle.org or elsewhere, as this will reveal the issue before we are able to prepare a fix.

:::

## How we deal with a reported security issue

1. Issues submitted via the submission form are received by Bugcrowd's triage team, who perform initial triage on the report.
1. If the issue is confirmed valid and not a duplicate by the Bugcrowd team, the Moodle security team reviews the issue and evaluates its potential impact on all supported versions of Moodle. If the issue was submitted directly into Tracker rather than via the form, this will be the first step in the process.
1. Valid issues are then pushed to the [Moodle Tracker](https://tracker.moodle.org) (restricted from public view).
1. The Moodle security team works with the issue reporter to resolve the problem, following the [Security issue development process](/general/development/process#security-issues) and keeping details of the problem and its solution hidden until a release is made.
1. New versions are created and tested.
1. Meanwhile Moodle requests [CVE identifiers](http://cve.mitre.org/) for the security issue.
1. New packages are created and made available on [download.moodle.org](https://download.moodle.org/).
1. Advisories are mailed to administrators of registered Moodle sites, giving a period of time when they can upgrade before the issue becomes public.
1. A public announcement is made about the security issue in the [Moodle security news forum](http://moodle.org/mod/forum/view.php?id=7128).
1. [Open Source Software Security](http://oss-security.openwall.org/wiki/) is notified about it.
1. Issues submitted via the submission form are marked fixed in the Bugcrowd platform, which will notify the reporter.

## Rewards

When a patched Moodle LMS security vulnerability is announced via [CVE](http://cve.mitre.org/) and in the [Moodle security news forum](http://moodle.org/mod/forum/view.php?id=7128), credits are always given by naming the first reporter of the issue (regardless of submission method).

In addition to this, if an email address is provided with submissions made via the [submission form](https://moodle.org/security/report), it is possible for members of the Bugcrowd platform to claim their submissions under their Bugcrowd account. Please note that security issues submitted by other means (for example, Tracker, email) cannot be linked to a Bugcrowd account, as they will not be triaged via that platform.

At this time, no paid public bug bounty program is offered.

## See also

- [Security issue development process](/general/development/process#security-issues)
- [Moodle Penetration Testing](/general/development/process/security/penetration-testing)

## Translations

<!-- cspell:disable -->

- [Sicherheitsprozeduren](https://docs.moodle.org/de/Sicherheitsprozeduren)
- [Procedimientos de seguridad en Moodle](https://docs.moodle.org/es/Procedimientos_de_seguridad_en_Moodle)
