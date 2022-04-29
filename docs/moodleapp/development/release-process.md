---
title: Moodle App Release process
sidebar_label: Release process
sidebar_position: 8
tags:
  - Moodle App
  - Release notes
---

## Two weeks before (Code freeze)

| **#** | **Task** | **Responsibility** |
|---|---|---|
| 1. | Create an issue in the tracker for the release, like: [MOBILE-1248](https://tracker.moodle.org/browse/MOBILE-1248) | Integration Lead |
| 2. | Force an update of the [local_moodlemobileapp](https://moodle.org/plugins/view.php?id=997) plugin (as release candidate) with new strings in moodle.org/plugins (only for Moodle version 2.6). | Dev |
| 3. | Ask someone from sites or community team to review the new English strings. | Community or Sites team |
| 4. | Announce in the [moodle translation forums](https://lang.moodle.org/mod/forum/view.php?id=5) the new strings available. This will allow translators to add the new strings during the days prior to the release. | Integration Lead |
| 5. | Add the release notes in the release issue created (search for the [release_notes tag](https://tracker.moodle.org/issues/?jql=project%20%3D%20MOBILE%20AND%20labels%20%3D%20release_notes)). Ask someone from the documentation team or Martin to review the release notes. | Integration Lead |
| 6. | Contact the marketing team announcing the new release and highlights. | Integration Lead |
| 7. | Add new QA tests to the "Testing cases" document. New QA tests should be labeled with [qa_test_required](https://tracker.moodle.org/issues/?jql=project%20%3D%20MOBILE%20AND%20resolution%20in%20(Unresolved%2C%20Fixed)%20AND%20labels%20%3D%20qa_test_required%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC). Remove that label once are added to the document. | Tester |
| 8. | Run npm audit to ensure all the dependencies are OK. | Developer |
| 9. | Freeze Cordova plugins and Javascript libraries versions (node modules) in the integration branch. | Developer |
| 10. | **Start testing** | Tester |

## The release day

| **#** | **Task** | **Responsibility** |
|---|---|---|
| 1. | Fix the version name in integration:config.xml, integration:package.json and integration:src/config.json (remove the -dev). | Integration Lead |
| 2. | Integrate the [integration branch onto the master one](https://github.com/moodlehq/moodleapp/compare/master...integration). | Integration Lead |
| 3. | Do some testing with the production builds before sending the application to the stores (overall testing to see that nothing is broken because of the branch merge done in step 2): <ul><li>Correct definitive version name displayed (and commit)</li><li>AOT compiling worked</li><li>Language strings synchronised from lang.moodle.net</li><li>New language packs added</li></ul> | All the team |
| 4. | Send the applications to the stores for review. | Integration Lead |
| 5. | Create a TAG/Release in github ([moodlehq/moodleapp](https://github.com/moodlehq/moodleapp/releases)) with the version number. | Integration Lead |
| 6. | Mark the issue and the [version](https://tracker.moodle.org/projects/MOBILE?selectedItem=com.atlassian.jira.jira-projects-plugin:release-page) as released in the tracker. | Integration Lead |
| 7. | Update [release notes](/general/app_releases). | Integration Lead |

## The following days

| **#** | **Task** | **Responsibility** |
|---|---|---|
| 1. | Social media announcements (Forum and Twitter). | All the team & Marketing team |
| 2. | Post in moodle.org/news. | Team Lead |
| 3. | Review the users and developers documentation (check that everything is in order). Review the [docs_required and dev_docs_required_tags](https://tracker.moodle.org/issues/?jql=project%20%3D%20MOBILE%20AND%20labels%20in%20%28docs_required%2C%20dev_docs_required%29). Review the [Mobile features wiki documentation](https://docs.moodle.org/en/Moodle_Mobile_features). | All the team |
| 4. | Delete the integration and desktop branches and create it again based on master. | Team Lead |
| 5. | Bump version numbers in the following files in the integration branch: config.xml, src/config.json (appending a -dev to the versionname field to indicate that is a development version), package.json. | Integration Lead |
| 6. | Unfreeze Cordova plugins and Javascript libraries versions (node modules). | Developer |
| 7. | Check that the [Docker image](https://cloud.docker.com/u/moodlehq/repository/docker/moodlehq/moodleapp/general) for the new version was successfully built. | Integration Lead |
| 8. | Update of the [local_moodlemobileapp](https://moodle.org/plugins/view.php?id=997) plugin (as final release) in moodle.org/plugins. | Developer |

## See also

- [Moodle App Release Notes](/general/app_releases)
