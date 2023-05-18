import {get_string as getString} from 'core/str';
import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';

const SELECTORS = {
    OPENMODALBUTTON: `#open-modal-button`,
};

const addModalEventHandlers = (modal) => {
    // Important: the current modal uses jQuery events.
    modal.getRoot().on(
        // Each type of modal has its own events.
        ModalEvents.delete,
        () => {
            // Do something.
            modal.hide();
        }
    );
};

export const init = async() => {
    const modalParams = {
        // Both title and body can be a string or a Promise of a string.
        title: getString('action', 'core'),
        body: getString('areyousure', 'core'),
        // There are several types defined.
        type: ModalFactory.types.DELETE_CANCEL,
    };
    const modal = await ModalFactory.create(modalParams);
    addModalEventHandlers(modal);

    // Bind the modal show to a button.
    document.querySelector(SELECTORS.OPENMODALBUTTON).addEventListener(
        'click',
        () => modal.show()
    );
};
