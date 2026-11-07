<?php
class enrol_guest_plugin extends enrol_plugin {

    /**
     * We are a good plugin and don't invent our own UI/validation code path.
     *
     * @return boolean
     */
    public function use_standard_editing_ui() {
        return true;
    }

    /**
     * Returns true if the current user can add a new instance of enrolment plugin in course.
     * @param int $courseid
     * @return boolean
     */
    public function can_add_instance($courseid) {
        global $DB;

        $context = context_course::instance($courseid, MUST_EXIST);

        if (!has_capability('moodle/course:enrolconfig', $context)) {
            return false;
        }

        if (!has_capability('enrol/pluginname:config', $context)) {
            return false;
        }

        // In this example we only allow one instance per course.
        if ($DB->record_exists('enrol', ['courseid' => $courseid, 'enrol' => 'pluginname'])) {
            return false;
        }

        return true;
    }

    /**
     * Add elements to the edit instance form.
     *
     * @param stdClass $instance
     * @param MoodleQuickForm $mform
     * @param context $context
     * @return bool
     */
    public function edit_instance_form($instance, MoodleQuickForm $mform, $context) {
        $options = [
            'example1' => get_string('example1', 'enrol_pluginname'),
            'example2' => get_string('example2', 'enrol_pluginname'),
        ];
        $mform->addElement(
            'select',
            'customchar1',
            get_string('something', 'enrol_pluginname'),
            $options
        );
        $mform->setDefault('customchar1', $this->get_config('something'));

        $mform->addElement(
            'text',
            'customtext1',
            get_string('extraname', 'enrol_pluginname')
        );
    }

    /**
     * Perform custom validation of the data used to edit the instance.
     *
     * @param array $data array of ("fieldname"=>value) of submitted data
     * @param array $files array of uploaded files "element_name"=>tmp_file_path
     * @param object $instance The instance loaded from the DB
     * @param context $context The context of the instance we are editing
     * @return array of "element_name"=>"error_description" if there are errors,
     *         or an empty array if everything is OK.
     */
    public function edit_instance_validation($data, $files, $instance, $context) {
        $errors = [];

        // Do some validation.
        if ($data['customchar1'] != 'example2' && empty($data['customtext1'])) {
            $errors['customtext1'] = get_string('missing_extraname', 'enrol_pluginname');
        }

        return $errors;
    }

    /**
     * Add new instance of enrol plugin.
     * @param object $course the course object
     * @param array $fields instance fields
     * @return int id of new instance, null if can not be created
     */
    public function add_instance($course, array $fields = null) {
        // Add $fields calculations here.
        $instanceid = parent::add_instance($course, $fields);
        // Insert elements to the enrolment plugins tables if needed.
        return $instanceid;
    }
}
