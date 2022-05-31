---
title: Overview
slug: /community
tags:
  - Quality Assurance
  - Processes
---

A lot of people ask how the development of Moodle operates. This page should give you a working overview that should help in understanding a lot of other developer documentation.

## The key players

- **Martin Dougiamas**<br/>
Martin is the founder lead developer of Moodle. Generally he tries to facilitate democracy and meritocracy but occasionally has to make executive decisions on things.
- **[Moodle HQ](https://moodle.com/careers/)**<br />
The team of developers who are directly funded by the Moodle project to work full-time on core developments.
- **Moodle Partners**<br />
Over 50 companies around the world that provide Moodle services. These companies often have their own developers and may contribute to Moodle directly by working on core code or by creating plugins.
- **Component leads**<br />
 A number of people around the world have volunteered to lead various components in Moodle. This involves maintaining existing code as well as listening to the community and improving that component with new features.

There are many other people contributing to Moodle in many ways. For a full list see the [Moodle developers](http://moodle.org/dev/) page on moodle.org.

## How we develop the Roadmap

The [Roadmap](./roadmap.md) lists the new features being developed for the next major version. This list is derived mostly from the issues with large numbers of votes in the Moodle [Tracker](/general/development/tracker/guide), so please vote for what you want!  Other influences include general discussion, surveys and feature requests at Moodle Moots and in the Moodle forums.

Component leads decide on features in individual components so make your case to them!

## Moodle versions

Moodle major releases (with big new features) are on a regular 6 month cycle, in  May and November, since Moodle 2.6. Each major release increments the version number by 0.1 (eg 3.4 -> 3.5 -> 3.6) and starts a new branch of minor releases.

Minor releases (with bug fixes only) are on a 2 month cycle, unless a security emergency occurs. They will increment the major release by 0.0.1 (eg 3.5 -> 3.5.1 -> 3.5.2).

The full details of these can be seen in the [Releases](/general/releases).

## Support lifetime

Moodle HQ is committed to supporting major releases for 12 months of general fixes (usually 6 point releases) and 18 months (an additional 6 months) of security fixes.

That means we usually release minor versions for the last three major branches.

Some versions, every two years, are [long term supported (LTS)](https://en.wikipedia.org/wiki/Long-term_support) for a total of 36 months, with 18 additional months of security fixes compared to other versions.

## Issue tracking

Issue tracking is an important part of a continuous quality control process. It involves reporting of problems (bugs), ideas for improvement and new features. Unlike most proprietary software programs, Moodle issue reporting and tracking information is open to everyone. Moodle's issue tracking system is called the [Tracker](http://tracker.moodle.org/).

All Moodle users are encouraged to be active participants when it comes to testing. Anyone with a Tracker user account can create, view, comment on, vote, and watch bugs.

## Processes

As you might guess, a large software project like Moodle with hundreds of contributors and varied opinions can be difficult to manage.

Over time we have developed a number of well-defined processes for getting code in and out of Moodle and for governing everyone's workflow in a way that is fair and clear.

See our [Process](../development/process.md) document for full information on our development processes, including how you can contribute to the project.

## Coding Standards

Over time we have distilled our best practice in writing code down into our [Coding Guide](/general/development/policies).  These rules cover the formatting and layout of all our code to make it consistent across the code base. If you plan to write Moodle code, you need to read it thoroughly.

## Plugins and APIs

Although Moodle is open source and you can change anything you want, the best and most maintainable way to extend Moodle is to write a plugin (sometimes called a module). Plugins are a directory of code that can be simply "dropped" in into any Moodle installation and it will be detected, installed and automatically made available as a tool within the Moodle interface.

See our [Plugin documentation](https://docs.moodle.org/dev/Plugins) for full details of the various types of plugin available.

## See also

- [Finding your way into the Moodle code](https://docs.moodle.org/dev/Finding_your_way_into_the_Moodle_code)
- [Working with the Community](https://docs.moodle.org/dev/Working_with_the_Community)
- [Plugin contribution](https://docs.moodle.org/dev/Plugin_contribution)
- [How to guarantee your change is integrated to Moodle core](http://www.slideshare.net/poltawski/how-to-guarantee-your-change-is-integrated-to-moodle-core) presentation by Dan Poltawski
