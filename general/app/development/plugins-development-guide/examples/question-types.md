---
title: Question Types
tags:
  - Moodle App
---

You can implement custom question types using the [CoreQuestionDelegate](../api-reference.md#corequestiondelegate):

```php title="db/mobile.php"
$addons = [
    "qtype_YOURQTYPENAME" => [
        "handlers" => [
            'YOURQTYPENAME' => [
                'displaydata' => [
                    'title' => 'YOURQTYPENAME question',
                    'icon' => '/question/type/YOURQTYPENAME/pix/icon.gif',
                    'class' => '',
                ],
                'delegate' => 'CoreQuestionDelegate',
                'method' => 'mobile_get_YOURQTYPENAME',
                'offlinefunctions' => [
                    'mobile_get_YOURQTYPENAME' => [],
                ],
                'styles' => [
                    'url' => '/question/type/YOURQTYPENAME/mobile/styles_app.css',
                    'version' => '1.00',
                ],
            ],
        ],
        'lang' => [
            ['pluginname', 'qtype_YOURQTYPENAME'],
        ],
    ],
];
```

```php title="classes/output/mobile.php"
class mobile {

    public static function mobile_get_YOURQTYPENAME() {
        global $OUTPUT, $CFG;

        $html = $OUTPUT->render_from_template('qtype_YOURQTYPENAME/mobile', []);

        return [
            'templates' => [
                [
                    'id' => 'main',
                    'html' => $html,
                ],
            ],
            'javascript' => file_get_contents($CFG->dirroot . '/question/type/YOURQTYPENAME/mobile/mobile.js'),
        ];
    }

}
```

```html handlebars title="templates/mobile.mustache"
<section class="list qtype-YOURQTYPENAME-container qtype-YOURQTYPENAME" ion-list *ngIf="question.text || question.text === ''">
    <ion-item class="addon-qtype-YOURQTYPENAME-container qtext">
        <ion-label>
            <core-format-text
                [component]="component"
                [componentId]="componentId"
                [text]="question.text"
                (afterRender)="questionRendered()">
            </core-format-text>
        </ion-label>
    </ion-item>
</section>
```

```js title="mobile/mobile.js"
const that = this;
const result = {
    componentInit() {
        if (!this.question) {
            console.warn('Aborting because of no question received.');

            return that.CoreQuestionHelperProvider.showComponentError(that.onAbort);
        }

        const div = document.createElement('div');

        div.innerHTML = this.question.html;

         // Get question questiontext.
        const questiontext = div.querySelector('.qtext');

        // Replace Moodle's correct/incorrect and feedback classes with our own.
        // Only do this if you want to use the standard classes.
        this.CoreQuestionHelperProvider.replaceCorrectnessClasses(div);
        this.CoreQuestionHelperProvider.replaceFeedbackClasses(div);

         // Treat the correct/incorrect icons.
        this.CoreQuestionHelperProvider.treatCorrectnessIcons(div);

        if (div.querySelector('.readonly') !== null) {
            this.question.readonly = true;
        }

        if (div.querySelector('.feedback') !== null) {
            this.question.feedback = div.querySelector('.feedback');
            this.question.feedbackHTML = true;
        }

         this.question.text = this.CoreDomUtilsProvider.getContentsOfElement(div, '.qtext');

        if (typeof this.question.text === 'undefined') {
            this.logger.warn('Aborting because of an error parsing question.', this.question.name);

            return this.CoreQuestionHelperProvider.showComponentError(this.onAbort);
        }

        // Called by the reference in html to (afterRender)="questionRendered()".
        this.questionRendered = function questionRendered() {
            // Do stuff that needs the question rendered before it can run.
        };

        // Wait for the DOM to be rendered.
        setTimeout(() => {
            // Put stuff here that will be pulled from the rendered question.
        });

        return true;
    }
};

result;
```

## Other examples

- [Question type plugin template](https://github.com/marcusgreen/moodle-qtype_TEMPLATE)
- [Gapfill question type](https://github.com/marcusgreen/moodle-qtype_gapfill)
- [Wordselect question type](https://github.com/marcusgreen/moodle-qtype_wordselect)
- [RegExp question type](https://github.com/rezeau/moodle-qtype_regexp)
