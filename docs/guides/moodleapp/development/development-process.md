---
title: Moodle App Development process
sidebar_label: Process
sidebar_position: 1
tags:
  - Moodle App
---

The development of new features and improvements in the Moodle App is organised in the following six phases:

Discovery - Shaping - Implementation - QA Testing - Release - Evaluation

As a summary of the process we can say that during the discovery phase we do an initial selection of features and improvements to be included in the next release of the app by reviewing the feedback from different stakeholders and the improvements detected by Moodle HQ's UX team user research.

In the shaping phase we do an initial high-level design and specifications so we can commence with the implementation phase in which the developers, with the help of designers, will implement the selected features.

During the Testing & QA phase, we do intensive testing to check that there are no regressions and, sometimes, we publish Beta versions to check the upcoming new features in advance and provide feedback before the release so that we can make the necessary adjustments.

Once we are confident we have a stable new version that is aligned with our stakeholders' expectations we move to the Release phase in which the new version of the app is fully rolled-out to users.

During the evaluation phase we analyse stakeholders' feedback to validate if we met their expectations.

## Discovery

During this first phase we analyse different stakeholders' needs and then we prioritise them so we can build a short-term roadmap for upcoming app releases.

We have different stakeholders (order does not indicate importance):

- End users
- External compliance entities/organisations
- Moodle Partners and Resellers
- BMA clients
- Pro/Premium plans clients
- Moodle Community
- Other Moodle Product teams

### Prioritisation

We use the MoSCoW method. The term MoSCoW itself is an acronym derived from the first letter of each of four prioritisation categories: M - Must have S - Should have C - Could have W - Won't have.

There is some existing criteria for what's mandatory (MUST) to include in a new release:

- New Moodle LMS functionality (affecting students)
- New Moodle Workplace functionality (affecting students)
- User-facing serious UX problems (app speed/performance, notifications, navigation and resume activity/courses)
- Compliance (GDPR, accessibility)
- Technology (mandatory libraries updates etc…)
- Critical bugs
- Security issues

For what's not mandatory, we use additional methods such as "Value versus Complexity" but there is always a subjective evaluation and the Moodle Apps Product Manager is the one making the final decisions.

New features and improvements under the "Could have" category can be removed at any time during the implementation phase if we feel we won't be able to implement them.

Only critical issues (bugs or MUST not properly detected such as LMS changes) can be added once the implementation phase has commenced but minor nice-to-have improvements will often be added throughout the release cycle.

### Schedule

We usually release between four to six versions of the Moodle App per year.

Usually a few weeks after a Moodle LMS major release and also between two major LMS releases.

## Shaping

During this phase there are two major things happening:

1. A high-level design solution is drafted.
2. Technical specifications are created.

So basically, we are defining what the feature should be doing, how it will work and how it interacts with other systems and the rest of the app. The evaluation criteria (used to check if we solved the problem once is used by end users) is also defined in this phase.

During this phase a developer and a designer will work together so the designer is aware of the technical limitations and the developer has a clear understanding of the high-level proposed solution to be refined during the implementation phase.

## Implementation

During this phase the developer and the designer will work on building the solution outlined in the Shaping phase, making decisions and choosing trade-offs about the finer details. Both the designer and the developer have full responsibility and they work autonomously unless they need specific help from other developers with more experience in certain areas.

Before the code gets integrated and it is ready for testing, a colleague has to perform the so-called peer-review, that is basically another developer (not involved in the original implementation) taking a fresh look at the code.

Once the code implementing the features is integrated, a tester will ensure that it works as expected. Automatic tests should be added by the developer in new features, so this step is mostly to look for regressions and to check that all the possible use cases for the solution were considered at implementation time.

## QA testing

Once all the selected new features, improvements and bugs fixes have been implemented and tested, we perform a complete review of the Moodle app functionality in order to detect possible regressions.

This is manually done, we go through a list of features of the Moodle app and we check that everything is working as expected in both Android and iOS devices.

At the beginning of this process, we also invite our community members to do some beta testing of the upcoming new features of improvements, to do this, we use Apple TestFlight and Android Beta Testing. Our community members are able to provide feedback prior to the release that will help to detect potential issues.

## Release

Once the QA testing phase has finished, we move on into the Release phase which consists basically in doing a full-rollout of the new version of the app in Google Play and the Apple App Store.

## Evaluation

In this phase we basically collect feedback to see if the new features and improvements are well received by our final users. As well as using the evaluation criteria we defined in the Shaping phase.
If something is not working as expected because it has bugs or the selected design solution is not working for most of our users we will action in the next development cycle to address the problem.
