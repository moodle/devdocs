---
title: Dropzone
---
<Since version="4.4" issueNumber="MDL-80850" />

The use of the `core/dropzone` module provides a simplified developer experience for creating drop zones within Moodle.

The module attempts to ensure that accessibility requirements are met, including applying the correct styles and keyboard navigation.

Drop zones will trigger callbacks for common actions that occur within the drop zone for other code to listen to and react accordingly.

```js title="Example of creating a dropzone"
import Dropzone from 'core/dropzone';

// Get the element that will be the dropzone.
const dropZoneContainer = document.querySelector('#dropZoneId');
// Create a new dropzone accepting only images.
const dropZone = new Dropzone(
    dropZoneContainer,
    'image/*',
    function(files) {
        window.console.log(files);
    }
);
// Set the custom message for the dropzone. Otherwise, it will use the default message.
dropZone.setLabel('Drop images here');
// Initialising the dropzone.
dropZone.init();
```
