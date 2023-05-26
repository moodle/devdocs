import {get_string as getString} from 'core/str';
import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';

const modalParams = {
    title: getString('action', 'core'),
    body: getString('areyousure', 'core'),
    type: ModalFactory.types.SAVE_CANCEL,
};

const addModalEventHandlers = (modal) => {
    // Important: the current modal uses jQuery events.
    modal.getRoot().on(
        ModalEvents.save,
        () => {
            // Do something.
        }
    );
};

ModalFactory.create(modalParams).then((modal) => {
    // Remove it from the DOM tree after it is closed.
    modal.setRemoveOnClose(true);
    // Modals are created hidden by default.
    modal.show();
    addModalEventHandlers(modal);
    return;
}).catch();
