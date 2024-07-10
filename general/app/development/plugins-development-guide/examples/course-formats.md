---
title: Course Formats
tags:
  - Moodle App
---

You can implement custom course formats using the [CoreCourseFormatDelegate](../api-reference.md#corecourseformatdelegate):

```php title="db/mobile.php"
$addons = [
    'format_myformat' => [
        'handlers' => [
            'myformat' => [
                'delegate' => 'CoreCourseFormatDelegate',
                'method' => 'mobile_course_view',
                'styles' => [
                    'url' => $CFG->wwwroot . '/course/format/myformat/mobile.css',
                    'version' => 2019041000,
                ],
                'init' => 'myformat_init',
            ],
        ],
    ],
];
```

```php title="classes/output/mobile.php"
class mobile {

    public static function mobile_course_view($args) {
        global $OUTPUT, $CFG;

        $course = get_course($args['courseid']);
        require_login($course);
        $html = $OUTPUT->render_from_template('format_myformat/mobile_course', []);

        return [
            'templates' => [
                [
                    'id' => 'main',
                    'html' => $html,
                ],
            ],
            'otherdata' => [
               // ...
            ],
        ];
    }

}
```

```html handlebars title="templates/mobile_course.mustache"
{{=<% %>=}}
<core-dynamic-component [component]="coreCourseFormatComponent.allSectionsComponent" [data]="data" class="format-myformat">
    @for (section of sections; track section.id) {
        <ion-item-divider>
            <ion-label>
                <core-format-text [text]="section.name" contextLevel="course" [contextInstanceId]="course.id">
                </core-format-text>
            </ion-label>
        </ion-item-divider>

        @if (section.summary) {
            <ion-item>
                <ion-label>
                    <core-format-text [text]="section.summary" contextLevel="course" [contextInstanceId]="course.id">
                    </core-format-text>
                </ion-label>
            </ion-item>
        }

        @for (module of section.modules; track module.id) {
            @if (module.visibleoncoursepage !== 0) {
                <core-course-module [module]="module" [section]="section" (completionChanged)="onCompletionChange()">
                </core-course-module>
            }
        }
    }
</core-dynamic-component>
```

Note that in this case, the template is not rendering any dynamic data with mustache; it's simply a static Angular template.

With this, you will have something similar to the core format plugin: a list of sections with headers, each containing its list of course modules. From here, you can make customisations to support your course format's features.

To find more about the specific properties and configuration options, make sure to read the [CoreCourseFormatDelegate](../api-reference.md#corecourseformatdelegate) reference.

## Filtering sections

When your course page loads, the sections array contains all of the sections on the course. However, you might not want to display all of these sections on one page.
You can achieve this by returning the list of sections to display along with the template in the rendering method:

```php
class mobile {

    public static function mobile_course_view($args) {
       // ...

       $displaysections = myformat\helper::get_list_of_section_ids($courseid);

        return [
            'templates' => [
                [
                    'id' => 'main',
                    'html' => $html,
                ],
            ],
            'otherdata' => [
               'displaysections' => json_encode($displaysections),
            ],
        ];
    }

}
```

Then filter the list of sections in your template:

```html
@for (section of sections; track $index) {
    @if (section.id in CONTENT_OTHERDATA.displaysections) {
        <!-- code to display the section goes here -->
    }
}
```

## Using JavaScript

You can also register custom formats using [JavaScript initialisation](../index.md#javascript-initialisation).

For example, you can implement a single activity format returning the following data:

```html ng2 title="template with 'main' ID"
<core-dynamic-component [component]="componentClass" [data]="data"></core-dynamic-component>
```

```js title="JavaScript"
const that = this;

class AddonSingleActivityFormatComponent {

    constructor() {
        this.data = {};
    }

    ngOnChanges(changes) {
        const self = this;

        if (this.course && this.sections?.length) {
            const module = this.sections[0]?.modules?.[0];

            if (module && !this.componentClass) {
                that.CoreCourseModuleDelegate.getMainComponent(that.Injector, this.course, module).then((component) => {
                    self.componentClass = component ?? that.CoreCourseUnsupportedModuleComponent;
                });
            }

            this.data.courseId = this.course.id;
            this.data.module = module;
        }
    }

    async doRefresh(refresher, done) {
        await this.dynamicComponent.callComponentFunction('doRefresh', [refresher, done]);
    }

}

class AddonSingleActivityFormatHandler {

    constructor() {
        this.name = 'singleactivity';
    }

    isEnabled() {
        return true;
    }

    canViewAllSections() {
        return false;
    }

    getCourseTitle(course, sections) {
        return sections?.[0]?.modules?.[0]
            ?? course.fullname
            ?? '';
    }

    displayCourseIndex() {
        return false;
    }

    getCourseFormatComponent() {
        return that.CoreCompileProvider.instantiateDynamicComponent(that.INIT_TEMPLATES['main'], AddonSingleActivityFormatComponent);
    }

}

this.CoreCourseFormatDelegate.registerHandler(new AddonSingleActivityFormatHandler());
```
