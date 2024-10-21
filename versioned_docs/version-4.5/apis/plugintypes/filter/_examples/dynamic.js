import {eventTypes} from 'core_filters/events';

/** @var {bool} Whether this is the first load of videojs module */
let firstLoad;

/**
 * Initialise the dynamic content filter.
 *
 * @method
 * @listens event:filterContentUpdated
 */
export const init = () => {
    if (!firstLoad) {
        return;
    }
    firstLoad = true;
    // Add the event listener.
    document.addEventListener(eventTypes.filterContentUpdated, contentUpdatedHandler);
};

/**
 * Notify video.js of new nodes.
 *
 * @param {Event} event The event.
 */
const contentUpdatedHandler = (event) => {
    const updatedContent = event.detail.nodes;
    updatedContent.forEach(content => {
        // Alter any updated content.
    });
};
