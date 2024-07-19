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

### Using the 'trigger'

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

## Creating a custom modal type

In some situations it is desirable to write a brand new modal.

There are two parts to this:

- a new Modal class which extends the `core/modal` class; and
- a template

Creating the Modal class is as simple as extending the `core/modal` class, providing a `TYPE` property, and registering the modal with the modal factory.

We highly recommend declaring the _template_ as a static property on the class too and this will be required from Moodle 4.3 onwards.

```javascript title="mod/example/amd/src/my_modal.js"
import Modal from 'core/modal';
import ModalRegistry from 'core/modal_registry';

export default class MyModal extends Modal {
    static TYPE = "mod_example/my_modal";
    static TEMPLATE = "mod_example/my_modal";
}

let registered = false;
if (!registered) {
    ModalRegistry.register(MyModal.TYPE, MyModal, MyModal.TEMPLATE);
    registered = true;
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

Once defined, the new modal can be instantiated using the Modal Factory, for example:

```javascript title="Instantiating a custom modal"
import ModalFactory from 'core/modal_factory';
import MyModal from 'mod_example/my_modal';

export default const init = async() => {
    // ...
    const modal = await ModalFactory.create({
        type: MyModal.TYPE,
    });

    modal.show();
}
```
