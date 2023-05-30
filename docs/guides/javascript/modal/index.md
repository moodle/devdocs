---
title: Modal Dialogues
tags:
  - Javascript
  - Modal
  - Dialogue
---
{{Moodle 3.2}}

This is currently (2017) the recommended way to create various sorts of pop-up dialogue boxes in JavaScript.

# Why should you use it?

The AMD modal modules provide a simple interface for creating a modal within Moodle. The module will ensure all accessibility requirements are met including applying the correct aria roles, focus control, aria hiding background elements and locking keyboard navigation.

The modals will fire events for common actions that occur within the modal, e.g. show / hide, for other code to listen to and react accordingly.

Moodle ships with a couple of standard modal types for you to re-use including a simple cancel modal, and a save/cancel modal. Hopefully with more to come!

# How do you create a basic modal?

If you'd simply like to display a modal with some simple content then all you'll need is the modal factory. The factory provides a create function that accepts some configuration for your modal that the factory will use to create the modal and optionally a trigger element (the element that will open the modal when activated). The create function will return a promise that is resolved with the created modal.

The configuration is provided as an object with key/value pairs. The options are:

| **key** | **description** |
| --- | --- |
| title | the title to display in the modal header - note: this will render HTML |
| body | the main content to be rendered in the modal body |
| footer | the content to be rendered in the modal footer |
| type | one of the modal types registered with the factory |
| large | a boolean to indicate if the modal should be wider than the default size |

Example 1

```javascript
define(['jquery', 'core/modal_factory'], function($, ModalFactory) {
  var trigger = $('#create-modal');
  ModalFactory.create({
    title: 'test title',
    body: '<p>test body content</p>',
    footer: 'test footer content',
  }, trigger)
  .done(function(modal) {
    // Do what you want with your new modal.
  });
});
```

NB - When I tried this with Moodle 3.10 it did not work but changing the initial "define" to **require** worked as per [//docs.moodle.org/dev/Useful core JavaScript modules#Modal .28core.2Fmodal.29](https://docs.moodle.org/https///docs.moodle.org/dev/Useful_core_Javascript_modules#Modal_.28core.2Fmodal.29)

The modals will also accept a promise for the body and footer content. It is expected that the promise will be resolved with two strings, the html content and any associated JavaScript. This allows the modal module to work natively with the templates module, such as in the example below.

Example 2

```javascript
define(['jquery', 'core/modal_factory', 'core/templates'], function($, ModalFactory, Templates) {
  var trigger = $('#create-modal');
  ModalFactory.create({
    title: 'test title',
    // Can include JS which is run when modal is attached to DOM.
    body: Templates.render('core/modal_test_3', {}),
    footer: 'test footer content',
  }, trigger)
  .done(function(modal) {
    // Do what you want with your modal.
  });
});
```

Since the modals aren't actually added to the DOM until they are made visible any JavaScript resolved with the promise is cached and only run after all of the elements are added to the DOM,  so you don't have to worry about any special handling in the JavaScript that is being loaded from the template.

# How to manually trigger a Modal

If your trigger is (say) a class that covers a number of actual elements, you may want to grab the actual element that caused the event. Unfortunately, ModalEvents do not capture this and you need to approach the modal a different way. Here is an example - the scenario is a list of items with delete buttons. You need to know which delete button in order to get the item id. Note that code is somewhat simplified for clarity.

```javascript
    $('a.item-delete').on('click', function(e) {
        var clickedLink = $(e.currentTarget);
        ModalFactory.create({
            type: ModalFactory.types.SAVE_CANCEL,
            title: 'Delete item',
            body: 'Do you really want to delete?',
        })
        .then(function(modal) {
            modal.setSaveButtonText('Delete');
            var root = modal.getRoot();
            root.on(ModalEvents.save, function() {
                var elementid = clickedLink.data('id');
                // Do something to delete item
            });
            modal.show();
    });
```

'Normal' JavaScript is used to trap the event and the required element can be captured. No 'trigger' is passed to the ModalFactory so the resulting modal cannot display itself. The modal save event (in this case clicking the delete button) is handled as normally and will still trigger as expected. 'modal.show()' is called to display the modal.

# How do you create a different type of modal?

Moodle comes with a few specialised types of modals for common use cases. Look at lib/amd/src/modal_factory.js to see what is available. These can be created using the factory, similar to the examples above, by specifying the type of modal in the configuration provided to the create function. Each of the modal types may have different configuration options, for example the save/cancel modal doesn't allow you to set the footer content.

Example 3

```javascript
define(['jquery', 'core/modal_factory', 'core/templates'], function($, ModalFactory, Templates) {
  var trigger = $('#create-modal');
  ModalFactory.create({
    type: ModalFactory.types.SAVE_CANCEL,
    title: 'Modal save cancel',
    body: 'This modal is a save/cancel modal',
  }, trigger)
  .done(function(modal) {
    // Do what you want with your modal.
  });
});
```

Each type of modal may fire additional events to allow your code to handle the new functionality being offered. See the modal_events.js module for a list of events that can be fired. For example, if you wanted to have a save/cancel modal that you did some form validation on before saving you could do something like the example below.

Example 4

```javascript
define(['jquery', 'core/modal_factory', 'core/modal_events', 'core/templates'],
        function($, ModalFactory, ModalEvents, Templates) {
  
  var trigger = $('#create-modal');
  ModalFactory.create({
    type: ModalFactory.types.SAVE_CANCEL,
    title: 'Modal save cancel',
    body: 'This modal is a save/cancel modal',
  }, trigger)
  .done(function(modal) {
    modal.getRoot().on(ModalEvents.save, function(e) {
      // Stop the default save button behaviour which is to close the modal.
      e.preventDefault();
      // Do your form validation here.
    });
  });
});
```

# How do you write a new type of modal?

If you'd like to write a new type of modal to be re-used throughout your code you can extend the default modal implementation and make any customisations you require. In order to create a new modal type you'll need to create a new AMD module and import the core/modal module to extend. You can also optionally create a new modal template that builds upon the core/modal template. Finally, you can register your new type with the modal registry to allow you to create your new type using the modal factory.

For example, let's create a modal that opens a login form:
First we can create the HTML for out modal by including and extending the core modal template. All we need to do is override the block defined in that template with our new title, body and footer content.

Let's assume the file is <your_module>/templates/modal_login.mustache

```php
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

Next we can create the new AMD module for the login modal. You can extend the existing modal module which will give you all of the core modal functionality for free allowing you to focus on writing only the specific logic you need. In this example we would only need to write the logic for handling the login.

Let's assume the file is <your_module>/amd/src/modal_login.js

```javascript
define(['jquery', 'core/notification', 'core/custom_interaction_events', 'core/modal', 'core/modal_registry'],
        function($, Notification, CustomEvents, Modal, ModalRegistry) {

    var registered = false;
    var SELECTORS = {
        LOGIN_BUTTON: '[data-action="login"]',
        CANCEL_BUTTON: '[data-action="cancel"]',
    };

    /**
     * Constructor for the Modal.
     *
     * @param {object} root The root jQuery element for the modal
     */
    var ModalLogin = function(root) {
        Modal.call(this, root);

        if (!this.getFooter().find(SELECTORS.LOGIN_BUTTON).length) {
            Notification.exception({message: 'No login button found'});
        }

        if (!this.getFooter().find(SELECTORS.CANCEL_BUTTON).length) {
            Notification.exception({message: 'No cancel button found'});
        }
    };

    ModalLogin.TYPE = 'your_module-login';
    ModalLogin.prototype = Object.create(Modal.prototype);
    ModalLogin.prototype.constructor = ModalLogin;

    /**
     * Set up all of the event handling for the modal.
     *
     * @method registerEventListeners
     */
    ModalLogin.prototype.registerEventListeners = function() {
        // Apply parent event listeners.
        Modal.prototype.registerEventListeners.call(this);

        this.getModal().on(CustomEvents.events.activate, SELECTORS.LOGIN_BUTTON, function(e, data) {
            // Add your logic for when the login button is clicked. This could include the form validation,
            // loading animations, error handling etc.
        }.bind(this));

        this.getModal().on(CustomEvents.events.activate, SELECTORS.CANCEL_BUTTON, function(e, data) {
            // Add your logic for when the cancel button is clicked.
        }.bind(this));
    };

    // Automatically register with the modal registry the first time this module is imported so that you can create modals
    // of this type using the modal factory.
    if (!registered) {
        ModalRegistry.register(ModalLogin.TYPE, ModalLogin, '<your_module>/modal_login');
        registered = true;
    }

    return ModalLogin;
});
```

Once you have both your template and JavaScript ready to go then all you need to do is tie them into where ever you'd like to launch the modal. For the purpose of this example let's assume that we've got a page with a login button with id="login" then you might add this JavaScript to the page.

```javascript
define(['jquery', 'core/templates', 'core/modal_factory', '<your_module>/modal_login'], function($, Templates, ModalFactory, ModalLogin) {
    var trigger = $('#login');

    ModalFactory.create({type: ModalLogin.TYPE}, trigger); 
});
```

# Related

- AMD and [JavaScript Modules](../modules.md)
