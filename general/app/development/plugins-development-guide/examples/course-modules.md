---
title: Course Modules
tags:
  - Moodle App
---

You can implement custom course modules using the [CoreCourseModuleDelegate](../api-reference.md#corecoursemoduledelegate).

In this example, we're going to implement a simple activity module that displays a certificate issued for the current user along with the list of previously issued certificates. It also stores view events in the course log, and it works offline. When the user downloads the course or activity, the data is pre-fetched for offline use.

We'll start by declaring the handler in `db/mobile.php`:

```php
$addons = [
    'mod_certificate' => [
        'handlers' => [
            'coursecertificate' => [
                'displaydata' => [
                    'icon' => $CFG->wwwroot . '/mod/certificate/pix/icon.gif',
                    'class' => '',
                ],
                'delegate' => 'CoreCourseModuleDelegate',
                'method' => 'mobile_course_view',
                'offlinefunctions' => [
                    'mobile_course_view' => [],
                    'mobile_issues_view' => [],
                ],
            ],
        ],
        'lang' => [
            ['pluginname', 'certificate'],
            ['summaryofattempts', 'certificate'],
            ['getcertificate', 'certificate'],
            ['requiredtimenotmet', 'certificate'],
            ['viewcertificateviews', 'certificate'],
        ],
    ],
];
```

In this file, we declare the `mobile_course_view` and `mobile_issues_view` Web Services for offline use. When these are called, the parameters will include the current `userid` and `courseid`. Once they have been called, the result will be cached in the app and these pages will work offline.

Of course, this only includes viewing the pages; but any interaction that requires sending data to the server will not work.

Now, let's implement the [content response](../api-reference.md#content-responses) in `classes/output/mobile.php`:

```php
class mobile {

    public static function mobile_course_view($args) {
        global $OUTPUT, $USER, $DB;

        $args = (object) $args;
        $cm = get_coursemodule_from_id('certificate', $args->cmid);

        // Capabilities check.
        require_login($args->courseid, false, $cm, true, true);

        $context = context_module::instance($cm->id);

        require_capability('mod/certificate:view', $context);

        if ($args->userid !== $USER->id) {
            require_capability('mod/certificate:manage', $context);
        }

        $certificate = $DB->get_record('certificate', ['id' => $cm->instance]);

        // Get certificates from external (taking care of exceptions).
        try {
            $issued = mod_certificate_external::issue_certificate($cm->instance);
            $certificates = mod_certificate_external::get_issued_certificates($cm->instance);
            $issues = array_values($certificates['issues']); // Make it mustache compatible.
        } catch (Exception $e) {
            $issues = [];
        }

        // Set timemodified for each certificate.
        foreach ($issues as $issue) {
            if (!empty($issue->timemodified)) {
                continue;
            }

            $issue->timemodified = $issue->timecreated;
        }

        $showget = !$certificate->requiredtime ||
            has_capability('mod/certificate:manage', $context) ||
            certificate_get_course_time($certificate->course) >= ($certificate->requiredtime * 60);

        $certificate->name = format_string($certificate->name);
        [$certificate->intro, $certificate->introformat] = external_format_text(
            $certificate->intro,
            $certificate->introformat,
            $context->id,
            'mod_certificate',
            'intro'
        );

        $data = [
            'certificate' => $certificate,
            'showget' => $showget && count($issues) > 0,
            'issues' => $issues,
            'issue' => $issues[0],
            'numissues' => count($issues),
            'cmid' => $cm->id,
            'courseid' => $args->courseid,
        ];

        return [
            'templates' => [
                [
                    'id' => 'main',
                    'html' => $OUTPUT->render_from_template('mod_certificate/mobile_view_page', $data),
                ],
            ],
            'files' => $issues,
        ];
    }

}
```

In the first part of the function, we check permissions and capabilities (like a view.php script would normally do). Then, we retrieve the certificate information that's necessary to display the template.

We also return a list of files to prefetch for offline use.

Finally, let's implement the mustache template in `templates/mobile_view_page.mustache`:

```html handlebars
{{=<% %>=}}
<div>
    <core-course-module-description description="<% certificate.intro %>" component="mod_certificate" componentId="<% cmid %>">
    </core-course-module-description>

    <ion-list>
        <ion-list-header>
            <p class="item-heading">{{ 'plugin.mod_certificate.summaryofattempts' | translate }}</p>
        </ion-list-header>

        <%#issues%>
            <ion-item>
                <ion-label>
                    <ion-button expand="block" color="light" core-site-plugins-new-content title="<% certificate.name %>"
                            component="mod_certificate" method="mobile_issues_view" [args]="{cmid: <% cmid %>, courseid: <% courseid %>}">
                        {{ 'plugin.mod_certificate.viewcertificateviews' | translate: {$a: <% numissues %>} }}
                    </ion-button>
                </ion-label>
            </ion-item>
        <%/issues%>

        <%#showget%>
            <ion-item>
                <ion-label>
                    <ion-button expand="block" core-course-download-module-main-file moduleId="<% cmid %>"
                        courseId="<% certificate.course %>" component="mod_certificate"
                        [files]="[{
                            fileurl: '<% issue.fileurl %>',
                            filename: '<% issue.filename %>',
                            timemodified: '<% issue.timemodified %>', mimetype: '<% issue.mimetype %>',
                        }]">
                        <ion-icon name="cloud-download" slot="start"></ion-icon>
                        {{ 'plugin.mod_certificate.getcertificate' | translate }}
                    </ion-button>
                </ion-label>
            </ion-item>
        <%/showget%>

        <%^showget%>
            <ion-item>
                <ion-label>
                    {{ 'plugin.mod_certificate.requiredtimenotmet' | translate }}
                </ion-label>
            </ion-item>
        <%/showget%>

        <!-- Call log WS when the template is loaded. -->
        <span core-site-plugins-call-ws-on-load name="mod_certificate_view_certificate"
                [params]="{certificateid: <% certificate.id %>}" [preSets]="{getFromCache: 0, saveToCache: 0}">
        </span>
    </ion-list>
</div>
```

Here's some things to pay attention to:

1. We are showing the module description using `core-course-module-description`.
2. We are showing the certificate information with a list of elements, adding a header on top.
3. We are using translate pipe to show the `summaryofattempts` string. We could've used mustache translation, but it is usually better to delegate the localization to the app.
4. We added a button to transition to another page when there are certificates issued. The [`core-site-plugins-new-content` directive](../api-reference.md#core-site-plugins-new-content) indicates that if the user clicks the button, we need to call the `mobile_issues_view` function; passing as arguments the `cmid` and `courseid`. The content returned by this function will be displayed in a new page (we'll implement this shortly).
5. We added a button to download an issued certificate. The [`core-course-download-module-main-file` directive](../api-reference.md#core-course-download-module-main-file) indicates that clicking this button will download the whole activity and open the main file. This means that, using this button, we can prefetch the whole activity to be available offline.
6. We are using the [`core-site-plugins-call-ws-on-load` directive](../api-reference.md#core-site-plugins-call-ws-on-load) to indicate that once the page is loaded, we need to call a Web Service function. In this case, we are calling the `mod_certificate_view_certificate` to log that the user viewed this page.

Now, let's implement the page to view the individual certificates:

```php title="classes/output/mobile.php"
public static function mobile_issues_view($args) {
    global $OUTPUT, $USER, $DB;

    $args = (object) $args;
    $cm = get_coursemodule_from_id('certificate', $args->cmid);

    // Capabilities check.
    require_login($args->courseid, false, $cm, true, true);

    $context = context_module::instance($cm->id);

    require_capability ('mod/certificate:view', $context);

    if ($args->userid != $USER->id) {
        require_capability('mod/certificate:manage', $context);
    }

    $certificate = $DB->get_record('certificate', ['id' => $cm->instance]);

    // Get certificates from external (taking care of exceptions).
    try {
        $issued = mod_certificate_external::issue_certificate($cm->instance);
        $certificates = mod_certificate_external::get_issued_certificates($cm->instance);
        $issues = array_values($certificates['issues']); // Make it mustache compatible.
    } catch (Exception $e) {
        $issues = [];
    }

    $data = ['issues' => $issues];

    return [
        'templates' => [
            [
                'id' => 'main',
                'html' => $OUTPUT->render_from_template('mod_certificate/mobile_view_issues', $data),
            ],
        ],
    ];
}
```

```html handlebars title="templates/mobile_view_issues.mustache"
{{=<% %>=}}
<div>
    <ion-list>
        <%#issues%>
            <ion-item>
                <ion-label>
                    <p class="item-heading">{{ <%timecreated%> * 1000 | coreFormatDate: 'dffulldate' }}</p>
                    <p><%grade%></p>
                </ion-label>
            </ion-item>
        <%/issues%>
    </ion-list>
</div>
```

The method for the new page is very similar to the first one: we check the capabilities, retrieve the information required for the template, and return the rendered template.

The template is a simple Ionic list that will display the issued certificates. We are showing their creation date using the `coreFormatDate` pipe, and their grade.

## Other examples

- [Custom certificate module](https://github.com/mdjnelson/moodle-mod_customcert)
- [Group choice module](https://github.com/ndunand/moodle-mod_choicegroup)
- [Attendance module](https://github.com/danmarsden/moodle-mod_attendance)
- [ForumNG module](https://github.com/moodleou/moodle-mod_forumng)
