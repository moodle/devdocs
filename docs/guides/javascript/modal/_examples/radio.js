import {get_string as getString} from 'core/str';
import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';
import Templates from 'core/templates';

const SELECTORS = {
    OPENMODALBUTTON: `#open-modal-button`,
};

// The user choices accepts several attributes.
const options = [
    {
        "value": "first",
        "name": Str.get_string('addpagehere', 'core'),
        "description": Str.get_string('adminhelpcourses', 'core'),
        "selected": true,
    },
    {
        "value": "second",
        "name": "Second option",
        "icon": Templates.renderPix('e/save', 'core'),
        "description": "Second option description",
    },
    {
        "value": "third",
        "name": "Third option",
        "description": "Third option description",
        "icon": Templates.renderPix('e/cancel', 'core'),
        "disabled": true,
    },
];

const addModalEventHandlers = (modal) => {
    modal.getRoot().on(
        ModalEvents.save,
        () => {
            // The getSelectedValue method returns the value of the selected option.
            savedValue.innerHTML = modal.getSelectedValue();
        }
    );
};

export const init = async () => {
    const modalParams = {
        // In radio type modals the body should be a list of options.
        body: options,
        title: getString('action', 'core'),
        type: ModalFactory.types.RADIO,
    };
    const modal = await ModalFactory.create(modalParams);
    addModalEventHandlers(modal);

    // Bind the modal show to a button.
    document.querySelector(SELECTORS.OPENMODALBUTTON).addEventListener(
        'click',
        () => modal.show()
    );
};
