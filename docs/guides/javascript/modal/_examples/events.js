import {get_string as getString} from 'core/str';
import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';

const modalParams = {
    title: getString('action', 'core'),
    body: getString('areyousure', 'core'),
    type: ModalFactory.types.SAVE_CANCEL,
};

ModalFactory.create(modalParams).then((modal) => {
    modal.setRemoveOnClose(true);
    modal.show();

    modal.getRoot().on(
        ModalEvents.bodyRendered,
        () => {
            // The modal body is rendered in the DOM (but not displayed on page).
        }
    );
    modal.getRoot().on(
        ModalEvents.save,
        () => {
            // Do something when the save button is clicked.
        }
    );
    modal.getRoot().on(
        ModalEvents.shown,
        () => {
            // Do something when the modal is shown.
        }
    );
    modal.getRoot().on(
        ModalEvents.hidden,
        () => {
            // Do something when the modal hides.
        }
    );
    modal.getRoot().on(
        ModalEvents.cancel,
        () => {
            // Do something when cancel button is clicked.
        }
    );

    return;
}).catch();
