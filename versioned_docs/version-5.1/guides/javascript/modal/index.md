---
title: Modal Dialogues
tags:
  - Javascript
  - Modal
  - Dialogue
---

<Since version="3.2" />

The use of modal modules provides a simplified developer experience for creating modal dialogues within Moodle.

The module attempts to ensure that all accessibility requirements are met, including applying the correct aria roles, focus control, aria hiding background elements, and locking keyboard navigation.

Modals will fire events for common actions that occur within the modal for other code to listen to and react accordingly.

Moodle ships with several standard modal types for you to re-use including a simple cancel modal, and a save/cancel modal.

## Creating a basic modal {/* #creating-a-basic-modal */}

<Since version="4.3"  issueNumber="MDL-78324" />

Modals can be created by calling the static `create` method on the modal type you wish to create, for example:

```javascript title="Creating a stadard modal"
import Modal from 'core/modal';

export const init = async () => {
    const modal = await Modal.create({
        title: 'Test title',
        body: '<p>Example body content</p>',
        footer: 'An example footer content',
        show: true,
        removeOnClose: true,
    });
}
```

Other standard options are described in the JS Documentation for [the MoodleConfig type](https://jsdoc.moodledev.io/master/module-core_modal.html#~MoodleConfig).

:::note[Support for earlier versions]

If you are supporting an earlier version of Moodle, then you must use the Modal Factory and register your modal.

:::

### Modal Factory {/* #modal-factory */}

<DeprecatedSince version="4.3"  issueNumber="MDL-78324" />

The Modal Factory can be used to instantiate a new Modal. The factory provides a `create` function, accepting some configuration which is used to create the modal instance, and an optional _trigger element_. The `create` function returns a Promise that is resolved with the created modal.

The configuration is provided as an object with key/value pairs. The options are:

| **key** | **description** |
| --- | --- |
| title | the title to display in the modal header - note: this will render HTML |
| body | the main content to be rendered in the modal body |
| footer | the content to be rendered in the modal footer |
| type | one of the modal types registered with the factory |
| large | a boolean to indicate if the modal should be wider than the default size |

```javascript title="Basic instantiation of a modal"
import ModalFactory from 'core/modal_factory';

export const init = async () => {
    const modal = await ModalFactory.create({
        title: 'test title',
        body: '<p>Example body content</p>',
        footer: 'An example footer content',
    });
    modal.show();

    // ...
};
```

Where text, language strings, or HTML is accepted, a Promise can also be provided.

```javascript title="Using a template to render the body"
import ModalFactory from 'core/modal_factory';
import Templates from 'core/templates';

export const init = async () => {
    const modal = await ModalFactory.create({
        title: 'test title',
        body: Templates.render('mod_example/example_modal_content', {id: 42}),
        footer: 'An example footer content',
    });
    modal.show();

    // ...
};
```

#### Using the 'trigger' {/* #using-the-trigger */}

<DeprecatedSince version="4.3"  issueNumber="MDL-78324" />

Moodle Modals created using the Modal Factory support an optional _trigger_ element. Whilst this is available, it is no longer recommended and support for it will likely be removed in Moodle 4.3.

```javascript title="Providing a trigger"
import ModalFactory from 'core/modal_factory';
import Templates from 'core/templates';
import $ from 'jquery';

export const init = async () => {
    const modal = await ModalFactory.create({
        title: 'test title',
        body: Templates.render('mod_example/example_modal_content', {id: 42}),
        footer: 'An example footer content',
    }, $('a.item-delete'));

    // ...
};
```

## Instantiating modal types {/* #instantiating-modal-types */}

A number of commonly used modals are available as standard, these include:

- a Delete / Cancel modal
- a Save / Cancel modal
- a Cancel modal

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="43Split">
<TabItem value="after43" label="Moodle 4.3">
<Since version="4.3"  issueNumber="MDL-78324" />

:::note

If you are developing code for use in Moodle 4.2, or earlier, then you must continue to follow the 4.2 guidelines.

:::

To use these modals you can call the `create` method on the relevant Modal Class.

```javascript title="Creating a save/cancel modal"
import ModalSaveCancel from 'core/modal_save_cancel';
import {get_string as getString} from 'core/str';

export const init = async () => {
    const modal = await ModalSaveCancel.create({
        title: 'test title',
        body: getString('confirmchange', 'mod_example'),
    });

    // ...
};
```

Each type of modal may fire additional events to allow your code to handle the new functionality being offered -- for example, if you wanted to have a save/cancel modal that you did some form validation on before saving you could do something like the example below.

```javascript title="Listening to a Save event"
import ModalSaveCancel from 'core/modal_save_cancel';
import ModalEvents from 'core/modal_events';
import {get_string as getString} from 'core/str';

export const init = async () => {
    const modal = await ModalSaveCancel.create({
        title: 'test title',
        body: getString('confirmchange', 'mod_example'),
    });

    modal.getRoot().on(ModalEvents.save, (e) => {
        // ...
    })

    // ...
};
```

</TabItem>
<TabItem value="pre43" label="Moodle 4.2 and earlier">

To use these modals you can provide the `type` argument to the `ModalFactory.create` method. This argument takes a string value and values can be found for these modals in `ModalFactory.TYPES`.

```javascript title="Creating a save/cancel modal"
import ModalFactory from 'core/modal_factory';
import {get_string as getString} from 'core/str';

export const init = async () => {
    const modal = await ModalFactory.create({
        type: ModalFactory.types.SAVE_CANCEL,
        title: 'test title',
        body: getString('confirmchange', 'mod_example'),
    });

    // ...
};
```

Each type of modal may fire additional events to allow your code to handle the new functionality being offered -- for example, if you wanted to have a save/cancel modal that you did some form validation on before saving you could do something like the example below.

```javascript title="Listening to a Save event"
import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';
import {get_string as getString} from 'core/str';

export const init = async () => {
    const modal = await ModalFactory.create({
        type: ModalFactory.types.SAVE_CANCEL,
        title: 'test title',
        body: getString('confirmchange', 'mod_example'),
    });

    modal.getRoot().on(ModalEvents.save, (e) => {
        // ...
    })

    // ...
};
```

</TabItem>
</Tabs>

## Heading structure {/* #heading-structure */}

The `core/modal` template renders the dialogue title as a level 2 heading:

```mustache title="The title element in core/modal"
<h2 id="{{uniqid}}-modal-title" class="modal-title fs-5 text-truncate" data-region="title">Test title</h2>
```

The level is deliberately fixed at `<h2>`. A dialogue can be opened from anywhere in a page, so it cannot know what the surrounding heading structure is, and the page behind it already provides the single `<h1>`. Placing the title at level 2 keeps it directly beneath that `<h1>` wherever the dialogue is opened from.

Its appearance comes from the `fs-5` [Bootstrap font size utility class](https://getbootstrap.com/docs/5.3/utilities/text/#font-size), not from the element. Never change the heading element to make a title look bigger or smaller -- change the utility class.

:::info[Why `<h2>` and not `<h1>`?]

[Bootstrap's own documentation](https://getbootstrap.com/docs/5.3/components/modal/) uses an `<h1>` for the modal title, on the basis that a dialogue is its own document context. Moodle uses an `<h2>` instead because the page behind the dialogue already has an `<h1>`, and accessibility auditing tools commonly report a second `<h1>` as a failure.

:::

### Headings within a dialogue {/* #headings-within-a-dialogue */}

Because the title is an `<h2>`, the first heading level available to you inside the body or footer of a dialogue is `<h3>`:

```mustache title="mod/example/templates/my_modal.mustache"
{{< core/modal }}
    {{$title}}{{#str}} pluginname, mod_example {{/str}}{{/title}}
    {{$body}}
        <h3>{{#str}} settings, mod_example {{/str}}</h3>
        {{! ... }}
        <h4>{{#str}} advancedsettings, mod_example {{/str}}</h4>
        {{! ... }}
    {{/body}}
{{/ core/modal }}
```

Skipping a level -- going straight from the `<h2>` title to an `<h4>`, for example -- breaks the heading hierarchy that assistive technology users rely on to navigate the dialogue. See the [heading requirements](/general/development/process/peer-review/accessibility-checklist#page-headers-and-title) in the accessibility peer review checklist.

This applies to content that is rendered *into* a dialogue as much as to the dialogue's own template. If a language string, filter, or renderer emits headings, and that output can be displayed in a dialogue, its heading levels must fit beneath the `<h2>` title too.

:::tip[Sizing nested headings]

If a nested heading needs to look smaller than its level implies, apply an `fs-*` utility class, or set the size in your theme's SCSS. Choose the heading element for its meaning and the class for its appearance.

:::

### Overriding the header {/* #overriding-the-header */}

The `core/modal` template exposes a `header` block, which replaces the whole `modal-header` region including the title element. If you override it, you must render your own heading and it must keep the same level, id, and `modal-title` class, otherwise the dialogue loses the accessible name that `aria-labelledby` points at:

```mustache title="Overriding the header block"
{{< core/modal }}
    {{$header}}
        <h2 id="{{uniqid}}-modal-title" class="modal-title fs-5 text-truncate" data-region="title">
            {{#str}} pluginname, mod_example {{/str}}
        </h2>
        {{! Any additional header content. }}
    {{/header}}
{{/ core/modal }}
```

In most cases you should override the `title` block instead, and leave the heading itself to `core/modal`.

:::note[Dialogues that are not built with `core/modal`]

Some dialogue-like components render their own `modal-header` markup rather than extending `core/modal` -- `tool_usertours` tour steps are one example in core. These follow the same rule: the title is an `<h2 class="modal-title fs-5">`, and content headings start at `<h3>`.

:::

### Testing the heading structure {/* #testing-the-heading-structure */}

The `best-practice` axe ruleset checks heading order, so an `@accessibility` Behat scenario is the simplest way to guard the structure of a dialogue:

```gherkin
@accessibility
Scenario: The example dialogue has a valid heading structure
  Given I open the example dialogue
  Then the "Example dialogue" "dialogue" should meet accessibility standards with "best-practice" extra tests
```

Assert on the semantics rather than the presentation. `"h2.modal-title" "css_element"` is a stable assertion; including the `fs-5` utility class in the selector is not, because the class that sets the title's size may change.

See [Accessibility testing](/general/development/policies/accessibility/testing) for more on writing accessibility tests.

:::note[Earlier releases]

Before [MDL-75699](https://tracker.moodle.org/browse/MDL-75699) the dialogue title was an `<h5>`, and headings inside a dialogue were expected to nest beneath that. If you are writing code that must also run on releases from before that fix, be aware that the same markup produces a different heading hierarchy there.

:::

## Creating a custom modal type {/* #creating-a-custom-modal-type */}

In some situations it is desirable to write a brand new modal.

There are two parts to this:

- a new Modal class which extends the `core/modal` class; and
- a template

:::important[Custom modals in Moodle 4.2 and earlier]

Since Moodle 4.3, creating the Modal class is as simple as extending the `core/modal` class, and providing a `TYPE` property, and `TEMPLATE` property.

For older versions of Moodle, refer to the [Moodle 4.2 documentation](https://672834180938720008adb671--moodledevdocs.netlify.app/docs/4.2/guides/javascript/modal/#creating-a-custom-modal-type).

:::

```javascript title="mod/example/amd/src/my_modal.js"
import Modal from 'core/modal';

export default class MyModal extends Modal {
    static TYPE = "mod_example/my_modal";
    static TEMPLATE = "mod_example/my_modal";
}
```

The template should extend the `core/modal` core template and can override any of the title, body, or footer regions, for example:

```mustache title="mod/example/templates/my_modal.mustache"
{{< core/modal }}
    {{$title}}{{#str}} login {{/str}}{{/title}}
    {{$body}}
        <div class="container">
            <form>
                <div class="form-group row">
                    <label for="inputEmail" class="col-sm-2 col-form-label">{{#str}} email {{/str}}</label>
                    <div class="col-sm-10">
                        <input type="email" class="form-control" id="inputEmail" placeholder="{{#str}} email {{/str}}">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">{{#str}} password {{/str}}</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" id="inputPassword" placeholder="{{#str}} password {{/str}}">
                    </div>
                </div>
            </form>
        </div>
    {{/body}}
    {{$footer}}
        <button type="button" class="btn btn-primary" data-action="login">{{#str}} login {{/str}}</button>
        <button type="button" class="btn btn-secondary" data-action="cancel">{{#str}} cancel {{/str}}</button>
    {{/footer}}
{{/ core/modal }}
```

Once defined, the new modal can be instantiated using the standard `create` method, for example:

```javascript title="Instantiating a custom modal"
import MyModal from 'mod_example/my_modal';

export default const init = async() => {
    // ...
    const modal = await MyModal.create({});

    modal.show();
}
```

### Overriding default configuration {/* #overriding-default-configuration */}

When creating your own modal type, you may wish to override the standard configuration. This can be achieved by overriding the `configure` class and providing your own options, for example:

```javascript title="Overriding standard options"
import Modal from 'core/modal';

export default class MyModal extends Modal {
    static TYPE = "mod_example/my_modal";
    static TEMPLATE = "mod_example/my_modal";

    configure(modalConfig) {
        // Show this modal on instantiation.
        modalConfig.show = true;

        // Remove from the DOM on close.
        modalConfig.removeOnClose = true;

        super.configure(modalConfig);

        // Accept our own custom arguments too.
        if (modalConfig.someValue) {
            this.setSomeValue(someValue);
        }
    }

    setSomeValue(value) {
        this.someValue = value;
    }
}
```
