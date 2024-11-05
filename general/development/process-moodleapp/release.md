---
title: Moodle App Release Process
sidebar_label: Release
sidebar_position: 1
tags:
  - Moodle App
  - Release notes
---

## Six weeks before (Code freeze)

| **#** | **Task** | **Responsible** |
|---|---|---|
| 1. | Force an update of the [local_moodlemobileapp](https://moodle.org/plugins/view.php?id=997) plugin (as release candidate) with new strings in [moodle.org/plugins](https://moodle.org/plugins) (only for Moodle version 3.5). | Developer |
| 2. | Ask someone from sites or community team to review the new English strings. | Community or Sites team |
| 3. | Announce in the [moodle translation forums](https://lang.moodle.org/mod/forum/view.php?id=5) the new strings available. This will allow translators to add the new strings during the days prior to the release. | Developer |
| 4. | Add the release notes in the release issue created (search for the [release_notes tag](https://tracker.moodle.org/issues/?jql=project%20%3D%20MOBILE%20AND%20labels%20%3D%20release_notes)). Ask someone from the documentation team to review the release notes. | Developer |
| 5. | Contact the marketing team announcing the new release and highlights. | Team Lead |
| 6. | Add new QA tests to the `apps_test` site. New QA tests should be labeled with [qa_test_required](https://tracker.moodle.org/issues/?jql=project%20%3D%20MOBILE%20AND%20resolution%20in%20(Unresolved%2C%20Fixed)%20AND%20labels%20%3D%20qa_test_required%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC), remove that label once they are added to the site. | Tester |
| 7. | Complete all TODOs related with the upcoming release, which are marked in code with a comment starting with `@todo {version-number}` (for example, before releasing 4.1 we'd search for comments starting with `@todo 4.1`) | Developer |
| 8. | Update npm dependencies in the `main` branch, both in the root folder and in cordova-plugin-moodleapp, and run `npm audit` to ensure all the dependencies are OK. Also check github vulnerabilities report. | Developer |
| 9. | Freeze npm dependencies to avoid being updated during QA. For the root package.json, this can be done running `npx gulp freeze-dependencies` (make sure no error appears in console). cordova-plugin-moodleapp dependencies need to be frozen manually. | Developer |
| 10. | **Start testing** | Tester |

## The release day

| **#** | **Task** | **Responsible** |
|---|---|---|
| 1. | Set the right version number for the new Moodle LMS major release in the [authenticated-site.ts](https://github.com/moodlehq/moodleapp/blob/main/src/core/classes/sites/authenticated-site.ts#L63) constant `MOODLE_RELEASES`. | Developer |
| 2. | Launch the internal release github workflow. | Developer |
| 3. | Do some testing with the production builds before sending the application to the stores (overall testing to see that nothing is broken): <ul><li>Correct definitive version name displayed (and commit)</li><li>AOT compiling worked</li><li>Language strings synchronised from [lang.moodle.net](https://lang.moodle.net)</li><li>New language packs added</li></ul> | All the team |
| 4. | Launch behat tests (latest branch). | Developer |
| 5. | Send the applications to the stores for review. | Team Lead |
| 6. | Check TAG/Release have been created in github ([moodlehq/moodleapp](https://github.com/moodlehq/moodleapp/releases)) with the version number. | Developer |
| 7. | Update the `ci` branch in the behat tests plugin ([moodlehq/moodle-local_moodleappbehat](https://github.com/moodlehq/moodle-local_moodleappbehat/)) with the latest behat code and features. | Developer |
| 8. | Update [upgrade guides](../../app/upgrading). | Developer |
| 9. | Open PR with release documentation updates (from [moodlemobile/devdocs:app-docs](https://github.com/moodlemobile/devdocs/tree/app-docs) to [moodle/devdocs](https://github.com/moodle/devdocs)). | Developer |
| 10. | Mark the issue and the [version](https://tracker.moodle.org/projects/MOBILE?selectedItem=com.atlassian.jira.jira-projects-plugin:release-page) as released in the tracker. | Team Lead |
| 11. | Update [release notes](../../app_releases.md). | Team Lead |

## The following days

| **#** | **Task** | **Responsible** |
|---|---|---|
| 1. | Create an issue in the tracker for the next release, like: [MOBILE-4270](https://tracker.moodle.org/browse/MOBILE-4270) | Developer |
| 2. | Social media announcements (Forum and Twitter). | All the team & Marketing team |
| 3. | Post in [moodle.org/news](https://moodle.org/news). | Team Lead |
| 4. | Review the users and developers documentation (check that everything is in order). Review the [docs_required and dev_docs_required_tags](https://tracker.moodle.org/issues/?jql=project%20%3D%20MOBILE%20AND%20labels%20in%20%28docs_required%2C%20dev_docs_required%29). Review the [Mobile features wiki documentation](https://docs.moodle.org/en/Moodle_Mobile_features). | All the team |
| 5. | Update branches and tags in all repositories ([moodleapp](https://github.com/moodlehq/moodleapp), [local_moodlemobileapp](https://github.com/moodlehq/moodle-local_moodlemobileapp/), [local_moodleappbehat](https://github.com/moodlehq/moodle-local_moodleappbehat), etc.). Update github parse workflow on local_moodlemobileapp to add the new dev version. | Developer |
| 6. | Prepare the repository for the next release: <ul><li>Bump version numbers in the following files: `config.xml`, `package.json`, `package-lock.json`, and `moodle.config.json`.</li> <li>Set the version number for the next Moodle LMS major release in the [authenticated-site.ts](https://github.com/moodlehq/moodleapp/blob/main/src/core/classes/sites/authenticated-site.ts#L63) constant `MOODLE_RELEASES`</li> </ul> You can see an example of doing all of that in this PR: [4.3.0 version update](https://github.com/moodlehq/moodleapp/pull/3707)| Developer |
| 7. | Check that the [Docker image](https://cloud.docker.com/u/moodlehq/repository/docker/moodlehq/moodleapp/) for the new version was successfully built. | Developer |
| 8. | Update of the [`local_moodlemobileapp`](https://moodle.org/plugins/view.php?id=997) plugin (as final release) in [moodle.org/plugins](https://moodle.org/plugins). | Developer |
| 9. | Update of the [`local_moodleappbehat`](https://github.com/moodlehq/moodle-local_moodleappbehat/) plugin (as final release) in [moodle.org/plugins](https://moodle.org/plugins). | Developer |
| 10. | Check if the Android API level should be increased or not to use a recent one. | Developer |
| 11. | Review the new features/improvements specs/shaping documents to ensure that they clearly reflect the actual implementation of the feature. | All the team |
| 12. | Review that all the minor issues found during the QA testing have a related and triaged MOBILE issue in the tracker. | All the team |
| 13. | Make sure that tests are passing with all the supported versions in [ci.moodle.org](https://ci.moodle.org). | Developer |
| 14. | Update APK in [download.moodle.org/mobile](https://download.moodle.org/mobile). | Team Lead |
| 15. | Unfreeze the dependencies in the root package.json and in cordova-plugin-moodleapp. | Developer |

## See also

- [Moodle App Release Notes](../../app_releases.md)
