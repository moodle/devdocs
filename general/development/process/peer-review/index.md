---
title: Peer review
description: All the information related to the peer-reviewing process during the Moodle development.
tags:
  - Processes
  - Core development
  - Peer-review
sidebar_position: 3

---
## Peer review list

The list of issues ready for peer review is found in the [Waiting for a peer reviewer](https://tracker.moodle.org/issues/?filter=13607) filter on the Moodle tracker.

## Checklist

These are points to consider while peer-reviewing issues. Further explanation below.

```
[] Syntax
[] Output
[] Component library
[] Icons
[] Language
[] Accessibility
[] Databases
[] Performance and Clustering
[] Security
[] Privacy (see Privacy API)
[] The Moodle mobile app / web services
[] Third party code
[] Documentation
[] Git
[] Testing (instructions and automated tests)
[] Overall completeness and correctness
```

Acceptable check-marks are Y (for yes), N (for no) or - (for not applicable). All N check-marks should be accompanied by an explanation of the problem that still needs to be addressed.

### Syntax

To allow the community of Moodle developers to work together, conventions should be followed.

- The code is easy to understand and, where it isn't, comments have been provided.
- Variables are named correctly (all lower case, no camel-case, no underscores).
- Functions are named correctly (all lower case, no camel-case, underscores allowed).
- PHP DocBlocks have been updated and adhere to coding style guide.
- Where functions are being removed, the [deprecation policy](../../policies/deprecation/index.md) is followed.
- The code doesn't use deprecated functions.
- $_GET, $_POST, $_REQUEST, $_COOKIE, and $_SESSION are never used.

:::tip
See the [Coding style guide](../../policies/codingstyle/index.md) for details. Most of the previous items list are checked automatically by the CiBot (Automated code review). So in this case it's recommended to review the execution results to validate that there aren't errors. However, take into account that for now, CiBot is not checking all file types (it happens, for instance, with the JavaScript files).
:::

### Output

Output needs to be controlled by renderers to achieve consistency and correct application of themes.

Ensure that:

- Output renders are used to generate output strings, including HTML tags;
- HTML output is valid html5;
- No inline styles have been used in HTML output (everything has to be in CSS);
- CSS has been added to the appropriate CSS files (base, specific area, sometimes canvas);
- Existing classes/layouts provided by Bootstrap and/or the theme are used where possible;
- The code doesn't use buffered output unless absolutely necessary.
- All visual output has a RTL alternative included
- Feedback any notices (E_STRICT, etc) seen into the MDL.

### Component library

Any improvement or new feature that introduces UI features to Moodle core from Moodle 4.0 onwards must be documented within the [Component library](../../tools/component-library.md).

This applies to any feature introduced or updated from Moodle 4.0 onwards, which:

- Any User Interface in the Moodle core component
- Any User Interface in any Moodle core subsystem
- Any User Interface in a Moodle plugin which is intended to be re-used
- Any User Interface feature which is intended to be re-used by another part of the code

Ensure that any new User Interface feature in Moodle 4.0 or later which matches the above criteria:

- Is documented in the [Component library](../../tools/component-library.md)
- Includes examples of usage
- Has appropriate descriptions
- Respects all Moodle-supplied themes

### Icons

Are new icons being introduced? If so, ensure that:

- The icons abide by our icon guidelines with regards to size, design and format
- The icons are do not unnecessarily add new ways of expressing existing concepts
- The icons are in a pix folder that makes sense

### Language

Naming things is hard. For help with wordings for new features and improvements, add the `ux_writing` label to the issue.

To achieve appropriate internationalisation of Moodle, language strings must be managed correctly.

Ensure that:

- New language strings are named correctly (all lower case, no camel-case, underscores are permissible in some cases);
- Help strings are named and formatted as described in [Help strings](https://docs.moodle.org/dev/Help_strings);
- Language strings are used instead of hard-coded strings for text output;
- Language strings have not been removed or renamed, had their meaning changed or had their parameters changed in stable branches (permitted only in main following [string deprecation policy](../../../projects/api/string-deprecation.md)); and
- [AMOS commands](https://docs.moodle.org/dev/AMOS_commands) have been specified when moving or copying language strings.

### Accessibility

Moodle should be accessible to everyone. When reviewing any changes that affects the frontend, ensure that these points have been considered:

- Automated tools: Does it pass automated accessibility checks? (e.g. via [axe DevTools](https://www.deque.com/axe/devtools/) or [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/))
- Colours: Do the text have sufficient colour contrast against the background? If the patch introduces elements that convey information through colours, are there alternative means to convey this information to users with visual impairments?
- HTML validity: Does the patch generate a page with valid HTML? (e.g. checked via [Nu HTML validator](https://validator.w3.org/nu/#textarea))
- Keyboard navigation: Can you successfully navigate through the interface via keyboard?
- Screen reader: When using a screen reader (e.g. [ChromeVox](https://support.google.com/chromebook/answer/7031755?hl=en), [NVDA](https://www.nvaccess.org/), [JAWS](https://www.freedomscientific.com/products/software/jaws/), etc), are the UI components being properly and clearly announced?

But, remember that what you are doing here is part of a peer review. If you want to perform a systematic accessibility check, you can follow the [Accessibility checklist](./accessibility-checklist.md).

### Databases

DB calls are the greatest performance bottleneck in Moodle.

If there is SQL code you can test quickly then do so.

Ensure that:

- There are minimal DB calls (no excessive use of the DB); and
- The code uses SQL compatible with all the supported DB engines (check all selected fields appear in an 'ORDER BY' clause).

### Performance and clustering

It is easy to write code that works sufficiently well when you are working on either small sets of data or with a small number of active users. Picking performance issues can be quite difficult and can required a complex level of understanding of both the section of code being reviewed, but also other parts that interact with it.

Clustering is when the same code is run on different computers and an end user could send each request to a different computer. This can produce a number of concurrency issues if not thought through. One example is; If you complete an opcache_reset(), no other server except the one you ran it on knows that it happened. So data can get out of sync.

Ensure that:

- Any filesystem, database or cache accesses are done in the most efficient way.
- That any code or function that appear expensive are not in critical paths. eg; They don't load on every page.
- The least possible code is running to complete the task, especially looking for hidden loops. They can appear from calling functions.
- Any code that runs is not specific to a single node. (eg opcache_reset()) This ensures clusters will run correctly.
- If the code could affect performance at all, make sure there is a comment noting what was considered.
  - What they did to mitigate performance impact, or why they thought it wasn't an issue.
  - Why they made certain trade-offs.

### Security

The user community relies on Moodle being responsibly secure.

Ensure that:

- User login is checked where an identity is needed;
- `Sesskey` values are checked before all write actions where appropriate (some read actions as well);
- Capabilities are checked where roles differ;
- User inputs are properly escaped (eg the correct param type is used and risky types such as raw are only used where necessary and safe to do so); and
- If the issue itself is a [security](https://docs.moodle.org/dev/security) issue, the [security process](../../process.md#security-issues) is being followed.
  - Ensure that the fix is **not** available in a public repository (ie. a personal Github account); stand-alone patches should be provided instead.
  - The issue will not be integrated until just before the next minor version release.

### Privacy

The user community relies on Moodle keeping user's privacy.

Ensure that:

- No unnecessary personal user data is saved;
- All personal user data is saved in compliance with General Data Protection Regulation (GDPR) which is an EU directive;
- For all stored data you will need to:
- Describe the type of data that they store;
- Provide a way to export that data; and
- Provide a way to delete that data.

:::info
See more info in [Privacy API](/docs/apis/subsystems/privacy/).
:::

### The Moodle mobile app

The Moodle app supports most of the student-related Moodle functionality. It is important to think about how a change in that type of functionality might affect it.

Ensure that:

- The issue is labelled with `affects_mobileapp` when the developer suspects that the changes can affect the app.
- New module settings are returned via the existing Web Services in the module
- When the code includes a new Web Service that will be necessary for the Moodle app, the new Web Service is included in the mobile service
- New global settings that affect new features for the app are included in the WebServices returning global settings (tool_mobile_get_config)
- The testing instructions include testing steps for the Moodle App

### Third party code

Does the change contain [third party code](../../../community/plugincontribution/thirdpartylibraries.md)? If so, ensure that:

- The code is licensed under a [GPL compatible license](http://www.gnu.org/licenses/license-list.html#GPLCompatibleLicenses%7C).
- The instructions for upgrading/importing the library and contained within a readme_moodle.txt file.
- The library is recorded in a thirdparty.xml file, including licensing information.
- Third party code has been scanned to check for url accessible entry points that could be exploited. These should either be disabled, or if required functionality they should be checked for security weaknesses.
- Does not duplicate the functionality of any existing api or third party library in core.
- Any modifications to third party code are recorded in readme_moodle.txt

### Documentation

Work does not stop when code is integrated.

Ensure that:

- The PHPdoc comments on all classes, methods and fields are useful. (Comments that just repeat the function name are not helpful! Add value.)
- Where an API has been changed significantly, ensure that [upgrade notes](../upgradenotes) have been written (or upgrade.txt on older branches).
- Where something has been deprecated, that the comments don't just say "do NOT use this any more!!!" but actually follow the [deprecation policy](../../policies/deprecation/index.md).
- Appropriate [labels](../../tracker/labels.md) have been added when there has been a function change, particularly
  - `docs_required` - any functional change, usually paired with `ui_change`
  - `dev_docs_required` - any change to APIs, usually paired with `api_change`
  - `ui_change` - any functional change, usually paired with docs_required, except ui_change remains permanently
  - `api_change`- any change to APIs that devs will need to know about, usually paired with dev_docs_required, except api_change remains permanently,
  - `unit_test_required` and `acceptance_test_required` - when there are api or ui changes needing improved coverage, and
  - `qa_test_required` - for significant functional changes not covered by automated tests
  - `developer_notes` - for things worth calling out in [Integration exposed!](https://moodle.org/mod/forum/view.php?id=7966)
- Also, verify that the components for the issue are correctly set, so maintainers (subscribed by default) will be mailed about issues early in the process.

### Git

Ensure that:

- The commit matches the [Coding style](../../policies/codingstyle/index.md#git-commits)
- The Git history is clean and the work has been rebased to logical commits; and
- The original author of the work provided as a patch has been given credit within the commit (as author of in the commit message if changes were made).

See also the [Commit cheat sheet](https://docs.moodle.org/dev/Commit_cheat_sheet) for further guidance.

### Testing instructions and automated tests

It is the developer's responsibility to test code before integration. As well as verifying that the proposed change works, good tests can and should help the peer reviewer, integration reviewer, and anyone looking at this code in future to understand how it is supposed to work. They also help verify that everything that might be affected by this change was considered.

For manual testing check that:

- The manual testing instructions:
  - Are in the [correct format](./testing/guide).
  - Are clear.
  - Are concise.
  - Are sufficient to verify that the change is working.
  - Have considered what else might be affected by the change. That is, we have not just make the original issue go away, but we have done that without introducing any regressions.
  - Regarding the previous point, a common thing to overlook is the Moodle mobile app users, so please consider that.
- Having said all that, the testing instructions should be no longer than necessary. There is no point testing essentially the same thing twice. Testers do a valuable job, but they have limited time. Please respect that.
- In relation to that, it is OK not to write testing instructions for parts of the fix that are already covered well enough by automated tests. Just remember that automated checks cannot see every problem that a set of human eyeballs would see.
- Look for evidence that the assignee has tested according to the instructions and verified that they are passing. (This is the responsibility of the assignee, not the peer reviewer.)

For automated testing (PHPunit and Behat):

- Automated tests are our way of verifying that Moodle works as expected, and that future changes do not cause unexpected regressions. Therefore, all Moodle code should come with tests.
- If it is a bug that is being fixed, then the fact that the bug could exist means that an automated tests was missing (otherwise we would have found the bug sooner). So every bug fix should come with test coverage. (If there is a genuine reason this is impossible, this should be explained in a tracker comment.)
- However, running automated tests takes time and energy. Check that the tests are not excessive, and that they follow best practice (e.g. Behat tests using generators, not setting things up through the UI.) Don't make MDL-15169 worse!
- Not every change in Moodle requires an entire new test. Sometimes, it is more appropriate and efficient to add some checks in an existing tests. (But this should not be taken to excess, since that could lead to a mess where it is not clear what is being tested where.)
- Check that the tests have been added in the best place. Are the tests in a place where someone working on related features in the future will expect to find them.
- As part of your review, check that the unit tests pass. Hopefully this can just be done by checking GitHub actions. (If the developer has not enabled GHA yet, encourage them to do so by linking them to [the instructions](https://moodledev.io/general/development/tools/gha).)
- Look for evidence that relevant Behat tests pass, especially when it involved UI changes. Note that Behat is not run by GitHub actions, but all the tests will be run as part of the integration process.

### Overall completeness and correctness

Ensure that:

- The code seems to solve the described problem completely within its reported scope (and further issues have been created to resolve remaining parts or further refactoring).
- The code makes sense in relation to the broader codebase (look at the whole function, not just the altered code).
- The developer has searched for and fixed other areas that may also have been affected by the same problem.
- Verify that the related component maintainers, if known, have participated and are aware of the issue (as assignee, or existing comments...). If they have not, please perform a friendly @mention to make them aware about the issue. A list of component leads is available here: https://docs.moodle.org/dev/Component_Leads.
- If any version numbers have been changed in [version.php](https://docs.moodle.org/dev/version.php) files, then the changes follow [the rule for updating version numbers in core](https://docs.moodle.org/dev/Moodle_versions#How_to_increment_version_numbers_in_core).
- There are comments on tracker explaining why current approach was taken and why other options (especially large issues). If not comment asking them to explain.

## Process

Peer review process helps to prepare the issue for integration. The peer reviewer is another developer who was not involved in the development process on the issue and therefore can take a fresh look and notice something that original developer might have forgotten during development. It is important to check that the bug actually is present and the code fixes it without creating new regressions.

### Completing Peer review as a community member

Any other developer can review any change. That is why it is called 'peer' review. However, not everyone has the necessary permissions in the tracker to click the buttons 'Start peer review', 'Finish peer review' etc. This should not discourage you from looking at other contributors code and providing comments and feedback. The issue will still need to wait for someone with the right permissions to come along and click the buttons, but they can read your review and then need do no more than double-check some points, which will save a lot of time.

To provide feedback to the developer, leave the issue in "Waiting for Peer Review" (since you don't have permission to do anything else, and also that makes it easy for someone with sufficient permissions to find the issue and move it forwards). Review the code using the checklist below, including any appropriate comments. Once finished, please post a comment clearly stating the outcome of your review. If you think it needs more work then indicate what needs to be changed. If you are happy with the patch, leave a clear comment that you believe this is ready to be made part of Moodle. This can then easily be seen by a HQ developer or component lead and they can quickly take appropriate action.

If a followup review happens to identify something you did not find, you have an opportunity to expand your knowledge and provide better reviews in the future as well as having saved everybody else some time.

Feedback to indicate the issue is ready to progress might look like the following;

```
Thanks again for your contribution. I have reviewed the patch:

[Copy and paste the checklist here, and complete it]

I don't have permission to use the peer review buttons on this issue. I hope that someone with sufficient permissions will move the issue forwards soon.
```

You should now add the '[ready_for_integration](../../tracker/labels.md)' tag to the issue to indicate you have passed the peer review and it can move to the next step.

Feedback to indicate the issue requires further work might look like the following;

```
Thanks for providing a patch. I think the following points require further work

[Copy and paste the checklist here, and complete it]

Please indicate If you are willing to continue working on this issue and complete the solution.
```

Can you help with peer reviewing? If so, please see the [list of issues waiting for peer review](https://tracker.moodle.org/issues/?filter=13607).

### Peer review for development by HQ or a known common contributor

When code comes from a HQ developer or external developer who has been contributing significantly to Moodle and is well acquainted with Moodle standards, peer review is limited to checking the code according to the Checklist below.

If everything is fine, the peer reviewer submits the issue for integration.

If some additional work is needed or the author specifically asked not to submit for integration yet, the peer reviewer clicks on "Finish peer review" and the issue state returns to "Development in progress". Usually the name of the peer reviewer stays on the issue and if a second peer review is requested it is expected that the same Peer reviewer picks it up. If the peer reviewer is not able to do the second review, they should remove their name and comment about it. Otherwise the issue does not appear on "waiting for peer review" dashboard. Please remember that not all jira users have permission to submit for integration.

### Peer review for external developers

When the code has come from an external developer, the peer reviewer will also help the developer to lead the issue to integration. In this case the peer reviewer should not use "Finish peer review" button.

If the issue needs additional work, the peer reviewer comments about the suggested changes but does not change the status of the issue and it remains as "Peer review in progress". If the author of the patch does not reply in 4 days, the peer reviewer may select either to complete the patch themselves or reopen the issue. The decision should be based on the amount of work required to complete the solution, for example, changing coding style or commit message, rebasing, backporting, adding testing instructions, etc. should be performed by the peer reviewer. This may require picking the commits into reviewer's git branch.

It is very important to give the credit to the author of the code by either keeping their authorship on the commit or adding "Thanks to XXXX for providing the patch" to the commit message. If the author of the patch is not in jira-developers group the special user 'moodle.com' should be entered in Assignee field.

There could be situations when the patch is incomplete, does not fix the original issue, creates regressions or otherwise is not correct. As stated above, the peer reviewer should comment about it and wait for the feedback from the author. If there is no feedback, or the author can not work on this issue any more, and the peer reviewer also does not find it easy and important enough to complete, the issue needs to be reopened. Button "Fail peer review" (available to HQ developers only) will reset the issue status to "Reopened". On this screen peer reviewer should remove assignee, peer reviewer and "patch" label from the issue. This way issue will become available again for anybody who want to work on it. All communication will remain in comments and issue history.

If the issue has passed peer review but the integrator or tester has raised some questions about it, then normally the developer who created the patch would be expected to respond. If they do no respond quickly enough, then the peer reviewer is expected to step in and take responsibility for the change they reviewed.

Once the issue is ready for integration, you can submit it to integration on behalf of the developer. Most external developers (those who are not in the jira-developers group) do not have permission to submit their own issues to integration so cannot do it themselves.

#### Replies templates

```
Thanks for providing a patch.
I have reviewed your code and can confirm that it addresses the reported issue. We would like to include it in core. Moodle values its contributors and tries to give them credit when possible. If you are interested in your name appearing on the https://moodle.org/dev/contributions.php page you can create a git commit that we will then pull into Moodle. You can learn more about Git and how Moodle uses it at [Git for developers|https://docs.moodle.org/dev/Git_for_developers] page. Please let me know if you want to prepare a git branch. Or if you don't have time to go through the whole process at the moment I can pick your patch myself.
```

```
Thanks for providing a patch.
Your code looks almost ready for integration into Moodle. There are just some little things that need to be changed to comply with Moodle standards. Can you please take a look at the review results below and tell me if you are able to modify your branch to address them.
```

```
I have reviewed your patch, it addresses the problem and complies with Moodle standards. I'm pushing this issue for integration. Following Moodle [Process|https://docs.moodle.org/dev/Process] it will go through integration review and testing before being included in the product. There might be additional questions from an integrator and/or a tester at those stages. It would be appreciated if you read tracker emails and can reply to questions if needed. If everything goes well during the next two stages your issue will be included in the next weekly release and your count on https://moodle.org/dev/contributions.php page will increase.
Thanks again for your contribution.
```

```
Thanks for providing a patch.
Unfortunately this patch does not fully address the reported issue. ... DETAILS...

Even though the code does solve the issue in the short-term it is very likely to create regressions .....

I have spent some time reviewing the patch and I would recommend that you .....

Please let me know If you are willing to continue working on this issue and complete the solution.
```

## See also

- [Code checker plugin](http://moodle.org/plugins/view.php?plugin=local_codechecker)
