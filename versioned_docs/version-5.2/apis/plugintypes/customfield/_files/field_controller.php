namespace customfield_myfield;

class field_controller extends \core_customfield\field_controller {

    /** @var string Plugin type */
    const TYPE = 'radio';

    /**
     * Add fields for editing a checkbox field.
     *
     * @param \MoodleQuickForm $mform
     */
    public function config_form_definition(\MoodleQuickForm $mform) {
        $mform->addElement(
            'header',
            'header_specificsettings',
            get_string('specificsettings', 'customfield_checkbox')
        );
        $mform->setExpanded('header_specificsettings', true);

        $mform->addElement(
            'selectyesno',
            'configdata[checkbydefault]',
            get_string('checkedbydefault', 'customfield_checkbox')
        );
        $mform->setType('configdata[checkbydefault]', PARAM_BOOL);
    }
}
