---
title: Roadmap
tags:
  - Core development
---

## Introduction

The Moodle Project is designed to have a positive effect on the world by supporting and empowering the educators who are teaching students in all sectors, in all countries.

To do this, our team at Moodle HQ looks to the world, talks with our community, and creates solutions in the forms of products that fit our values of **education**, **openness**, **respect**, **integrity** and **innovation**.

This document summarises, for a broad audience, the best current plans on the future technical development of the Moodle's open source learning platform, consisting of Moodle LMS, Moodle Workplace LMS, MoodleCloud, MoodleNet, Moodle Apps, and Moodle Educator Certificates.

### Where this roadmap comes from

Proposals for improvements and new features come from a variety of different places.

Feedback from the community is extremely important and you can reach us by

- creating new issues on [tracker](http://tracker.moodle.org),
- joining the [Moodle Users Association](https://moodleassociation.org/) to vote on a new project for each release,
- discussing your ideas on the [forums](https://moodle.org/forums),
- creating new solutions as a plugin in the [Moodle Plugins directory](https://moodle.org/plugins),
- or meeting us in person at one of our [MoodleMoots](https://moodle.com/events/)

Moodle also has an extensive network of [Moodle Partners](https://moodle.com/partners). Moodle Partners are service providers that are certified by Moodle HQ to provide high quality Moodle services for schools, institutions and organisations. We work closely with our partners to determine the needs of Moodle Users and improve the platform.

Our Roadmap is built via our [Roadmap process](https://docs.moodle.org/dev/Roadmap_process). This process is continuously evolving but it always seeks to involve all our key stakeholders - students, teachers, admins, institutions, and of course our partners and supporters.

## The big picture

Working on the Moodle learning platform involves millions of moving parts, and every release generally includes hundreds of improvements. However, there are **four main goals** that we are focussing on for the next two years:

### User experience and flow

The entire user experience from onboarding, into daily teaching/learning and expert customisation of Moodle is the core value of what makes Moodle useful or not in the real world, in fully online and blended modes.

While we're working on hundreds of smaller, annoying issues, we are also doing some major re-thinking around what an LMS should be in the next decade and beyond as a tool to empower educators and learners.

### Enabling all our developers

Our significant community of engaged developers are an amazing group of over 1000 people - many of them make a living being part of the Moodle community.

We are of course working on ways to make Moodle programming easier and better, with better training and support as well as improved APIs, plugins, integrations and support for modern technologies.

However, a particularly exciting initiative is the new Moodle Plugins Service, due in 2021, which will provide an "app store" experience on which all developers can build financial sustainability for their work, while teachers will have easier access to use hundreds of new plugins in their courses via the web interface, without needing to convince their admins to install code. This will help the entire plugins ecosystem.

### Better integrations between Moodle products

The current Moodle products already integrate with each other, of course, but there is much more to be done to make them work together more seamlessly, as part of one platform, so that our users have a better experience and also so that they become more aware of solutions to their problems.

### Better integration with the world

Moodle is never used alone, and it is a part of many ecosystems at many levels. We must connect to all kinds of other systems, we must of course comply with new legislation such as the GDPR, Accessibility and much more.

In particular though, we are committed to helping to promote [<span class="underline">Open EdTech</span>](https://openedtech.global/) and to work closely with qualified Open EdTech products and major stakeholders to design and build an open architecture for a long-term future.

## Roadmap timeline

<!--
  Github Flavoured Markdown does not support tables without headers.
  We must use an HTML table here.
  Please note that Spacing in this table is important.
  Markdown must have empty newlines between it and HTML markup.
-->
<table>
<thead>
<tr>
<th> 2022 </th>
<th> Moodle LMS </th>
<th> Moodle Workplace </th>
<th> Moodle Apps </th>
<th> MoodleCloud </th>
<th> MoodleNet </th>
<th> Moodle Academy </th>
</tr>
</thead>
<tbody>
<tr>
<td> </td>
<td>

- **Minor releases**

</td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
</tr>

<tr><th> Q4 </th><td>

- **Moodle 4.1**
- **UX improvements**
  - Course activities
  - Gradebook
  - Global UX (tables/filters)
- **New**
  - Improved integration with MoodleNet and other Moodle sites
  - Improved integration with 3rd party platforms/tools
  - Database improvements (MUA)
  - Question bank improvements

</td><td>

</td><td>

- **Release 4.1**

</td><td>

- **Release 4.1**

</td><td>

</td><td>

</td></tr>
</tbody></table>

### Notes on the Moodle LMS releases

#### Moodle 4.1 (November 2022)

Moodle 4.1 (and following 4.x releases) will see a continuation of user experience (UX) improvements for the Moodle LMS platform. Moodle 4.0 focused on significant UX improvements for navigation and the main course page experience. In Moodle 4.1 we will focus on improving the UX for the course activities, commencing with the most widely used activities such as Assignment and Quiz. Improving the gradebook UX will be another main focus.

Other projects include:

- Improving the integration with MoodleNet
- Investigating and commencing the project to improve messaging in Moodle (proposed integration with [Matrix](https://matrix.org/) messaging)
- MUA projects to improve the Database and Assignment activities
- Continuing the [Question bank improvements](https://docs.moodle.org/dev/Question_bank_improvements_for_Moodle_4.1) project

### Release support time-frames

We are extending security support on Moodle 3.9 and Moodle 3.11 to November 2023. We are also extending general bug fix support on Moodle 3.11 by 6 months to November 2022. This will provide additional support and time for sites to make the transition to Moodle 4.0 or Moodle 4.1.

| Version | (Scheduled) Release date | Full support period ends | Security support period ends |
| --- | --- | --- | --- |
| Moodle 3.9 (LTS) | 15 June 2020 | 10 May 2021 | 13 Nov 2023 (ext 6M) |
| Moodle 3.10 | 9 Nov 2020 | 8 Nov 2021 | 9 May 2022 |
| Moodle 3.11 | 17 May 2021 | 14 Nov 2022 (ext 6M) | 13 Nov 2023 (ext 12M) |
| Moodle 4.0 | Apr 2022 | May 2023 | Nov 2023 |
| Moodle 4.1 (LTS) | Nov 2022 | Nov 2023 | Nov 2025 |

## Past releases

See our [Releases](/general/releases) page for information about past releases.

After Moodle 2.0 we switched to time-based releases rather than feature-based releases (see our [development process](/general/development/process)). Because of this, the details above on future releases are an indication of current priorities only, and are targeted to be released in the upcoming releases. Anything not ready by the next release date will generally be pushed to the following major release.

### See also

- [Releases](/general/releases) - versions of Moodle that have already been released
- [Key dates relating to future releases](/general/releases/#general-release-calendar)

## Translations

<!-- cspell:disable -->

- [Plan de desarrollo](https://docs.moodle.org/es/Plan_de_desarrollo)
- [Planification](https://docs.moodle.org/fr/Planification)
