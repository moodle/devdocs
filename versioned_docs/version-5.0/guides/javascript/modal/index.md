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

## Creating a basic modal

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

:::note Support for earlier versions

If you are supporting an earlier version of Moodle, then you must use the Modal Factory and register your modal.

:::

### Modal Factory

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

#### Using the 'trigger'

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

## Instantiating modal types

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

## Creating a custom modal type

In some situations it is desirable to write a brand new modal.

There are two parts to this:

- a new Modal class which extends the `core/modal` class; and
- a template

:::important Custom modals in Moodle 4.2 and earlier

Since Moodle 4.3, creating the Modal class is as simple as extending the `core/modal` class, and providing a `TYPE` property, and `TEMPLATE` property.

For older versions of Moodle, refer to the [Moodle 4.2 documentation](https://6728347a15ea81be71bdf1d0--moodledevdocs.netlify.app/docs/4.2/guides/javascript/modal/#creating-a-custom-modal-type).

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

### Overriding default configuration

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
