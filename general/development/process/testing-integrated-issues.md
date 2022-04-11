---
title: Testing of integrated issues
description: All the information related to the integration review process during the Moodle development.
tags:
  - Processes
  - Core development
  - Testing
  - Quality assurance
---

Testing is an important part of the [Moodle development process](/general/development/process).
Testing day depends on hte integration period (normal vs continuous).
Tester's first priority should be to finish testing on the day they have been assigned. Tester should update testing status or add comments in tracker, so that status of testing is known to iTeam.

## The testing process

:::note

1. All tests are allocated during the week to testers by iTeam. Tests are run usually by the external testers team but sometimes they can be assigned to HQ developers too.
2. HQ developers should check mail or search tracker to see which issues are assigned to them for testing.

:::

1. Pull latest integration from [git://git.moodle.org/integration.git](git://git.moodle.org/integration.git)
2. Test issue by following **Testing instructions**
3. Select `Pass test` or `Fail test` as appropriate, adding a short description of what was tested if not obvious
4. If you find you cannot finish testing a particular pull request, click `Stop testing` and let iTeam know about it.
5. Failed tests will wait for assignee to respond. If the patch is provided late and there is constrained to find tester then issue will be reopened.
6. Once the fail fix is integrated, it goes back to **complete re-testing**.
7. It's responsibility of tester to test the issue again, provided fix patch is not from tester. If tester provides fix patch then tester will be
changed.
8. Tester who passes the issue will be set as tester for the issue.

For test sessions, if you encounter a failure, please fail the issue add a comment on the issue itself. If everything's good, add a comment in the session and complete the session. You may also comment on the issue and say that testing passes on your part.

## Expectation from developer and peer-reviewer

Testing instructions are spot-on, clear and easy to perform. Please, follow the [[Testing instructions guide]] recommendations.

## Expectation from iTeam

- Tests should be allocated when the issue is integrated.
- The iTeam may need to help/re-assign tests if developers are having problems.

## Expectation from tester

- Testing **must happen always against up to date integration.git repository** (unless testing instructions include some exceptional git operation). More specifically, testing **must not happen against development branches** for a number of reasons (based on old core stuff, missing interdependencies with other issues or changes performed along the integration process, upgrade problems...).
- If tester is not available for testing, this should be raised ASAP.
- Testers should try to finish testing as early as possible as they are assigned, so when tests fail, the issue assignee has as much time as possible to resolve it.
- When a test fails, or new (related) regression found then fail test.
- If tester is not sure of results or need explanation on testing instructions, then tester can either fail test with comments, or contact the assignee individually to raise the problem.
- Testers should let the iTeam know ASAP if they are facing any problems, need help or may not be able to complete their allocated tests
- For any reason (big test, not enough time, not started testing yet), if a test is dragged to next day then the tester should leave comment on tracker, updating the status of testing and adding the expected time needed to finish testing.
- When a test is passed, it is recommended to add some extra information that confirms that all works as expected. This could be a browser screenshot, terminal output...
- **All UI tests should be tested on currently supported themes**.

### Checking tests assigned to you

1. Log in to [Tracker](https://tracker.moodle.org/).
2. Visit [Issues waiting to be tested](https://tracker.moodle.org/issues/?filter=11801&jql=project%20%3D%20MDL%20AND%20Tester%20%3D%20currentUser()%20AND%20status%20%3D%20%22Waiting%20for%20testing%22) page.

## Differences in test process during continuous integration periods

During [continuous integration](/general/development/process/integration-review#during-continuous-integrationfreezeqa-period) we change our schedule to produce and release fixes to bugs more quickly than the usual weekly cycle. Our
goal during this period is to release a new version of master multiple times per week. We try to keep the process more flexible during this time in order that developers who have less pressing issues than others can take the load off those concentrating on big fixes. It works best if we work together to help each other out.

:::warning
Priority is given to testing issues to ensure we can release regularly
:::

## Installing a local test site from the integration repository

Moodle uses two Git repositories for its source code. Their names are moodle.git and integration.git and they live at http://git.moodle.org. All submitted patches that were accepted during the integration review go to the integration.git first. Testers use integration.git as the source of the code to test. Patches that survive testing are then promoted to moodle.git and become the part of the official Moodle weekly build.

To obtain the code from the integration.git repository, follow the instructions at [[Git for Administrators page]]. But instead of cloning from git://github.com/moodle/moodle.git, use

```git
   git clone git://git.moodle.org/integration.git
```

as the very first command.

### Changing theme to another one

Ensure you have following setting in the config (it allows changing theme from url).

```php
   $CFG->allowthemechangeonurl = true;
```

For changing to a theme named "yay" add **?theme=yay** to the url.

## Notes

- If issues requires an Oracle and MSSQL installations for testing, and you don't have one, then please let iTeam know about this.
- Any update should be added as comment on MDL issue being tested.
- If testers pass or fail an issue by mistake, then please request iTeam to reopen it for testing.
- Testers should not be involved in the bugfixing or review process.
- If an issue cannot be fixed within a sprint and has to be reopened, the fix for sprint version should be removed and an appropriate backlog version set.
