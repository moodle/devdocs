---
title: Creating mobile course formats
sidebar_position: 8
tags:
  - Moodle App
---

Course format plugins can be supported in the app using the CoreCourseFormatDelegate.

To begin, add a handler for this delegate to your course format's db/mobile.php file:

```php title="db/mobile.php"
$addons = [
    'format_myformat' => [
        'handlers' => [ // Different places where the plugin will display content.
            'myformat' => [ // Handler unique name (alphanumeric).
                'delegate' => 'CoreCourseFormatDelegate', // Delegate (where to display the link to the plugin)
                'method' => 'mobile_course_view', // Main function in \format_myformat\output\mobile.
                'styles' => [
                    'url' => $CFG->wwwroot . '/course/format/myformat/mobile.css',
                    'version' => 2019041000
                ],
                'displaysectionselector' => true, // Set to false to disable the default section selector.
                'displayenabledownload' => true, // Set to false to hide the "Enable download" option in the course context menu.
                'init' => 'myformat_init'
            ]
    ]
];
```

As with other plugins, you then use a function in your plugin's classes/output/mobile.php to return a template:

```php title="classes/output/mobile.php"
class mobile {

    /**
     * Main course page.
     *
     * @param array $args Standard mobile web service arguments
     * @return array
     */
    public static function mobile_course_view($args) {
        global $OUTPUT, $CFG;

        $course = get_course($args['courseid']);
        require_login($course);
        $html = $OUTPUT->render_from_template('format_myformat/mobile_course', []);

        return [
            'templates' => [
                [
                    'id' => 'main',
                    'html' => $html
                ]
            ],
            'otherdata' => [
               ...
            ]
        ];
    }
}
```

Then your templates/mobile_course.mustache file will contain the angular template to display your page

```html handlebars title="templates/mobile_course.mustache"
{{=<% %>=}}
<core-dynamic-component [component]="allSectionsComponent" [data]="data" class="format-myformat">
    <ng-container *ngFor="let section of sections">
        <ion-item-divider color="light">
            <core-format-text [text]="section.name"></core-format-text>
             <!-- Section download. -->
             <div *ngIf="section && downloadEnabled" class="core-button-spinner" float-end>
                <!-- Download button. -->
                <button *ngIf="section.showDownload && !section.isDownloading && !section.isCalculating" (click)="prefetch($event, section)" ion-button icon-only clear color="dark" [attr.aria-label]="'core.download' | translate">
                    <ion-icon name="cloud-download"></ion-icon>
                </button>
                <!-- Refresh button. -->
                <button *ngIf="section.showRefresh && !section.isDownloading && !section.isCalculating" (click)="prefetch($event, section)" ion-button icon-only clear color="dark" [attr.aria-label]="'core.refresh' | translate">
                    <ion-icon name="refresh"></ion-icon>
                </button>
                <!-- Download progress. -->
                <ion-badge class="core-course-download-section-progress" *ngIf="section.isDownloading && section.total > 0 && section.count < section.total">{{section.count}} / {{section.total}}</ion-badge>
                <!-- Spinner (downloading or calculating status). -->
                <ion-spinner *ngIf="(section.isDownloading && section.total > 0) || section.isCalculating"></ion-spinner>
            </div>
        </ion-item-divider>

        <ion-item text-wrap *ngIf="section.summary">
            <core-format-text [text]="section.summary"></core-format-text>
        </ion-item>

        <ng-container *ngFor="let module of section.modules">
            <ng-container *ngIf="module.visibleoncoursepage !== 0">
                <core-course-module text-wrap [module]="module" [courseId]="course.id" [downloadEnabled]="downloadEnabled" (completionChanged)="onCompletionChange($event)">
                </core-course-module>
            </ng-container>
        </ng-container>
    </ng-container>
</core-dynamic-component>
```

You don't have to use a mustache template, you can just use a static angular template.

This will get you to a stage where you have something similar to the core format plugin - a list of sections with headers, each containing its list of course modules.  From here, you can make customisations to support your course format's features.

Note that there are a few objects available to your template without you having to do anything:

- `sections` - this is an array of all the sections on the course, which includes all of the modules within that course.
- `course` - this contains the basic course data
- `downloadEnabled` - This is set using the option in the context menu, if `displayenabledownload` is used in your db.php

## Example: only display certain sections

When your course page loads, the sections array contains all of the sections on the course. However, you might not want to display all of these sections on one page.
You can achieve this by returning the list of sections to display along with the template in classes/output/mobile.php:

```php title="classes/output/mobile.php"
class mobile {
    public static function mobile_course_view($args) {
       ...
       $displaysections = myformat\helper::get_list_of_section_ids($courseid);

        return [
            'templates' => [
                [
                    'id' => 'main',
                    'html' => $html
                ]
            ],
            'otherdata' => [
               'displaysections' => json_encode($displaysections);
            ]
        ];
    }
}

```

Then filter the list of sections in your template:

```html
    <ng-container *ngFor="let section of sections">
        <ng-container *ngIf="CONTENT_OTHERDATA.displaysections.hasOwnProperty(section.id.toString())">
            <!-- code to display the section goes here -->
        </ng-container>
    </ng-container>
```
