namespace customfield_checkbox;

class data_controller extends \core_customfield\data_controller {

    /**
     * Return the name of the field where the information is stored
     * @return string
     */
    public function datafield(): string {
        return 'intvalue';
    }

    /**
     * Add fields for editing a checkbox field.
     *
     * @param \MoodleQuickForm $mform
     */
    public function instance_form_definition(\MoodleQuickForm $mform) {
        $field = $this->get_field();
        $config = $field->get('configdata');
        $elementname = $this->get_form_element_name();

        // If checkbox is required (i.e. "agree to terms") then use 'checkbox' form element.
        // The advcheckbox element cannot be used for required fields because advcheckbox elements always provide a value.
        $isrequired = $field->get_configdata_property('required');
        $mform->addElement($isrequired ? 'checkbox' : 'advcheckbox', $elementname, $this->get_field()->get_formatted_name());
        $mform->setDefault($elementname, $config['checkbydefault']);
        $mform->setType($elementname, PARAM_BOOL);

        if ($isrequired) {
            $mform->addRule($elementname, null, 'required', null, 'client');
        }
    }

    /**
     * Returns the default value as it would be stored in the database (not in human-readable format).
     *
     * @return mixed
     */
    public function get_default_value() {
        return $this->get_field()->get_configdata_property('checkbydefault') ? 1 : 0;
    }

    /**
     * Returns value in a human-readable format
     *
     * @return mixed|null value or null if empty
     */
    public function export_value() {
        $value = $this->get_value();
        return $value ? get_string('yes') : get_string('no');
    }
}
