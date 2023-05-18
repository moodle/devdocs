---
title: Modal Factory
tags:
  - JavaScript
  - Library
  - Frontend
---

import { Since, CodeBlock, TabItem, Tabs } from '@site/src/components';

The modal factory simplifies the creation of modal components. The module will ensure all accessibility requirements are met, including aria roles, focus control, aria hiding background elements and locking keyboard navigation.

The modals will fire events for common actions that occur within the modal. For example, when showing or hiding the modals.

Moodle ships with some standard modal types for you to re-use, including a simple cancel modal and a save/cancel modal.

## Creating a new modal

The `ModalFactory.create` method is responsible for creating a modal.

This method gets a modal definition object with the following attributes:

- body (string|Promise): The modal body content is the only required attribute.
- title (string|Promise): An optional modal title
- type (string): The modal type. By default, a modal with no action buttons (`ModalFactory.types.DEFAULT`).

Once called, it returns a Promise to a modal object. The created modal is hidden and should be configured before using it. Usually, the modal post-creation configuration consists on:

- `modal.setRemoveOnClose(true);` ff the modal is not reusable (meaning it is re-created when needed), calling this method will remove the element from the DOM when the modal is closed.
- `modal.show()` to show the modal.
- `modal.hide()` to force hiding the modal
- `modal.setTitle(string|Promise)` replace the modal title
- `modal.setBody(string|Promise)` replace the modal body
- `modal.setButtonText(string actionName, string|Promise text)` set a button text. Each modal type has different button action names depending on the action buttons in the modal footer.

import UsageExample from '!!raw-loader!./_examples/usage';

<CodeBlock language="js" title="Example of modal factory usage">{UsageExample}</CodeBlock>

## Capturing modal events

The current modals trigger jQuery events for user interactions. The `core/modal_events` module lists all available modal events.

Events triggered by all modal types:

- `ModalEvents.shown`
- `ModalEvents.hidden`
- `ModalEvents.destroyed`
- `ModalEvents.bodyRendered`
- `ModalEvents.outsideClick`

<details>
  <summary>View modal events handlers example</summary>
  <div>

import EventsExample from '!!raw-loader!./_examples/events';

<CodeBlock language="js">{EventsExample}</CodeBlock>

  </div>
</details>

## Types of modals

### Save and cancel

Using the `ModalFactory.types.SAVE_CANCEL` type, the modal will have a save and cancel button in the footer.

Modal type events:

- `ModalEvents.save`
- `ModalEvents.cancel`

Modal type specific methods:

- `modal.setSaveButtonText()` return the current selected value.

### Delete and cancel

Using the `ModalFactory.types.DELETE_CANCEL` type, the modal will have a red delete button and a cancel one in the footer.

Modal type events:

- `ModalEvents.'delete'`
- `ModalEvents.cancel`

Modal type specific methods:

- `modal.setDeleteButtonText()` return the current selected value.

### Cancel

Using the `ModalFactory.types.CANCEL` type, the modal will only have a cancel button in the footer.

Modal type events:

- `ModalEvents.cancel`

### Alert

Using the `ModalFactory.types.ALERT` type, the modal will display an alert ot the user.

### Radio selector modal

Using the `ModalFactory.types.RADIO` type, the modal will display a list of options from which the user can choose.

Modal type events:

- `ModalEvents.save`
- `ModalEvents.cancel`
- `ModalEvents.radioChanged`

Because the radio modal needs to display a list of options to the user, the accepted `body` attribute for this type of modal only accepts an array of choices. Each choice is an object with the attributes:

- `string value`: the selectable value
- `string|Promise name` : the displayed value
- `string icon`: an optional icon
- `string description`: an optional additional description
- `boolean disabled`: if the option should be disabled
- `boolean selected`: if the option is selected

Modal type specific methods:

- `modal.getSelectedValue()` return the current selected value.

<details>
  <summary>View radio modal example</summary>
  <div>

import RadioExample from '!!raw-loader!./_examples/radio';

<CodeBlock language="js">{RadioExample}</CodeBlock>

  </div>
</details>
