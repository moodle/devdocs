---
title: Code review tips
tags:
  - Processes
  - Integration
  - Code
  - Code review
sidebar_position: 5
---

:::info About this page

This guide provides tips for code review in Moodle. It is intended for developers who are reviewing code at any stage of the development process (Peer review, CLR or Integration review).

Thanks [Safat](https://moodle.org/user/profile.php?id=3375956) for sharing your experience and knowledge with the community!

:::

## General

### Zero trust

As bad as this term sounds, this is a rule of thumb while reviewing any patch or tracker. Even if the patch comes from the most experienced developer in the world, you should put zero trust in the patch and look at it like all other patches. While we should respect the opinions and approaches of more experienced engineers, as a reviewer, it's your responsibility to make sure that the patch is clean. Humans make mistakes, regardless of their experience in any product.

### Error log

It's not a hard requirement, but for patches that are touching critical APIs, try to check the error log after going through the testing instructions. It helps finding patches that have error logs recorded that have not been tested by CI or any other automated systems.

### Reproduce the patch

Simple rule, if you can't reproduce it, it's not an issue. If the reporter is having issues in their system which you don't have access to, that's not your business anymore. They will have to provide a proper docker environment or steps for an issue to be reproduced. Although it should be caught in the triaging stage, it's always good to double-check.

### Evaluate the feasibility of an issue

Anyone can create a tracker and push it. That doesn't necessarily mean that is something should be included in Moodle LMS core. While they are also a user, we will have to make sure the patch for an improvement is beneficial enough for everyone. Proactively engage the UX team to evaluate feature feasibility from a user perspective.

### Understand the impact

An important point to remember is that, the main purpose of code review is not just to review code quality and find syntax errors, coding style, documentation issues, etc. While we have to do that as we don't have a tighter tools yet, our main goal is to evaluate the impact of a patch, how it will behave in the wild with other APIs, and whether this is a breaking change. A patch might work great isolated in its own even PHPUnit and behat passing, but it might create issues somewhere else. While it's not always possible to understand all the impacts and we can't just keep digging a patch for 7 days, keeping the impact in mind will help mitigate risks upfront.

### Evaluate the approach

A regular example of this can be drinking water. You can drink water, in a cup, in a glass, in a jug, in a bottle, or even in a plastic container you took out of your dishwasher while it was shining clean. But which is the most appropriate one to use? A glass! But that's not always possible, right? You might drink using your hand when there is nothing available, or you might use a wine glass when you loaded your dishwasher with all the glasses and you have nothing left. Same way, one patch can be done too many different ways, while some ways might be wrong, some might be right, and some might be half and half right. You will have to evaluate the best possible approach to fix that patch. The impact of a patch mentioned above will play a big role here. This kinda thinking will improve with time, but it ties up to the fact that, as a reviewer, you will have to put your brain in front of the patch to confirm the approach rather than trusting the approach of the given patch entirely and just reviewing as is.

### Testing instructions review

Leverage your developer expertise to anticipate potential ambiguities in testing instructions. Then, test as if you were a user with no prior knowledge, focusing on identifying gaps and areas requiring clarification. This process can also reveal underlying UX issues.

### Involve UI/UX people

As we have a lot of help in terms of UI/UX at the moment, always involve them in string changes, UI changes, etc. That endorses the work and your review as well then accepting a patch. The `ux_review_required` and `ux_writing` [labels](https://moodledev.io/general/development/tracker/labels) are there for a reason, use them.

### Pushing code to help

While reviewing, pushing a patch to help the assignee is a great one! That's particularly helpful when the change needed is significant or to show some code to explain a different approach.

### Always cross-check Moodle's policy

Moodle has a bunch of policies, about component communication, upgrades, and some more. These are independent of the coding style or PHP-related policy we have. Always review them and make sure they are not violated in a patch.

:::tip

Please note, as a reviewer, you will get many many different types of patches, some will be easy, some will be complex, some will make you crazy, and some might make you put your head in a bucket full of water and stop breathing, regardless, never be afraid to review a tracker and ask for help. Being a reviewer is a rewarding experience, and to be honest, reviewing something will help you learn faster than writing something. Good luck reviewers!

:::

## CLR specific

### Pushing a patch to IR

Pushing a patch to IR to someone else is not a shame or a topic of fear or skills. You looked at a patch and you didn't feel comfortable pushing it and didn't feel comfortable posting your comments, not a problem. Add your comments as a restricted note in the tracker or your own, then cross-check with the person who reviewed it. There are two ways to learn, making a mistake and learning from it, and learning then not making a mistake, you decide!

### Rejecting a patch

Patches can be rejected, and it's not a big deal. They can be pushed back to IR with comments but, sometimes, you can easily say if a patch is wrong and the reported issue is not an issue. When in doubt, take advantage of the internal channels and discuss these when needed instead of rejecting it or pushing it back to IR.

### Pushing back

When you review a tracker and there is a possibility that it will come back with a large amount of change or the entire approach is not right, you can always push back and ask them to take time, do it properly PR again and send back to CLR/IR. But it's a judgment call.

### Be mindful about pushing with critical information

There will be patches that will include developer docs, mention that in your comment while pushing so that whoever merges that, can also merge the developer docs and never forget about that. In cases where the Assignee field is empty, which typically occurs with a user's first issue, please explicitly mention that within your comment. This ensures awareness for adding them manually to the proper Tracker group once the issue is closed.
