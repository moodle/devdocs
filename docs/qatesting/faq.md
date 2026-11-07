---
title: Frequently Asked Questions
tags:
- Quality Assurance
- Testing
- Core development
sidebar_position: 3
---

{/* <!-- markdownlint-disable no-inline-html --> */}

## FAQ

<details>
<summary>Do I need to be a developer?</summary>

No. This is one of the most common misconceptions, and a big part of why we're writing this page. Most QA testing is about using Moodle like a normal user would: following a written test case ("log in, create a lesson, add a student") and reporting whether it worked as expected. You're not writing code, and you don't need to know how Moodle is built under the hood.

The only two new things are creating the Moodle Tracker account and reporting your results there instead of in your own notes. Both are learnable in a few minutes, and covered in the [Getting Started](./gettingstarted.md) guide.

</details>

<details>
<summary>How long does it take to do a test?</summary>

Roughly 20 to 40 minutes per test, depending on how many steps it has and how familiar you already are with that part of Moodle. The first time, budget about 15 minutes extra for one-time account setup (covered in "How to start" above).

As mentioned above, testing is flexible and asynchronous. No fixed hours, no minimum commitment. And every test counts.

</details>

<details>
<summary>When does the next QA cycle run?</summary>

The Moodle 5.3 cycle runs from 31 August 2026 to 2 October 2026.

</details>

<details>
<summary>How can I hear about future cycles?</summary>

For future cycles, subscribe to the [Testing and QA forum](https://moodle.org/mod/forum/view.php?id=56), where cycle announcements and any changes get posted.

</details>

<details>
<summary>Why are you promoting testing 5.3 in particular?</summary>

Because 5.3 is special. Roughly every three releases, Moodle designates one as a Long-Term Support (LTS) version. Many organisations skip straight from one LTS release to the next. Moodle 5.3 is one of those releases, so there's a good chance your own institution will upgrade to it before long. Testing 5.3 now is, indirectly, helping your institution, your students, and yourself.

</details>

<details>
<summary>Why do people help test Moodle?</summary>

Moodle testers each have their own reasons for getting involved. For Michelle Lomman, an Instructional Designer and Moodle Educator based in Melbourne: "Moodle has given me so much, so I wanted to be able to contribute something back."

For Al Rachels, a long-time Moodle plugins maintainer and retired Computer Applications teacher in the US, it was "the best way to really understand the new bits and pieces of the next Moodle version."

Source: ["QA testing for Moodle 4.0 – A community effort!"](https://moodle.com/news/qa-testing-moodle-4/) at moodle.com

</details>

<details>
<summary>What do I get out of it?</summary>

Beyond directly improving software used by learners worldwide, your Moodle profile will get a QA tester badge for each cycle you help test. This is the badge from 2025:

import QATestingBadge from './_faq/testingbadge.png';

<center><img src={QATestingBadge} width="200" alt="Moodle QA Testing Badge 2025"/></center>

Also, your name will appear in the [Moodle testing credits page](/general/community/credits/testing) at the end of the QA cycle. It's also a genuinely good, low-pressure way to get comfortable with how a large open-source project runs, and how QA works in software generally, if that's something you're curious about.

</details>

<details>
<summary>I have questions or want to share feedback. How do I get in touch?</summary>

This is our first time reaching out to new testers this way, so if the process trips you up anywhere (you can't assign yourself a test, a step is unclear, you can't create an issue on the Tracker), that's on us to fix, not a sign you're doing something wrong. Telling us what didn't make sense helps us fix the instructions for the next person, not just you. We'd also love to hear how your first time testing went.

Reach us in any of these places:

- The [Testing & QA forum](https://moodle.org/mod/forum/view.php) is actively watched, and a good place to subscribe so you know when a new cycle opens.
- [Moodle QA chat on Matrix](https://matrix.to/#/#qa:moodle.com) is our live chat channel for testers.
- The comments section on the test case itself; useful for questions specific to one test.

If something unrelated to the test itself goes wrong, add the `qa_help_needed` label to the ticket and leave a comment with your question. If the test instructions themselves seem outdated or unclear, add the `qa_instructions_update` label instead — that helps us fix it for the next tester too.

</details>

## Advanced

<details>
<summary>Go beyond preselected tests</summary>

Visit the QA testing dashboard — [Moodle 5.3 QA testing](https://moodle.atlassian.net/jira/dashboards/10612) — to explore the full list of tests. For example, if you want tests for the "Book" activity aimed at "Teachers", you can [filter by those components](https://moodle.atlassian.net/issues/).

</details>

<details>
<summary>Using your own site</summary>

If your only available site is running a different Moodle version (for example, your organisation's live site), please don't use it for this QA cycle. We're testing 5.3 specifically, not a previous version.

If you do have your own site running the latest Moodle 5.3dev, check the [QA testing documentation for developers](/general/development/process/testing/qa) first, then go ahead and use it.

</details>

---
