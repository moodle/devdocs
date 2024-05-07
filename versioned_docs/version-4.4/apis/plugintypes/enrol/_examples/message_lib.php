class enrol_pluginname_plugin extends enrol_plugin {

    // (...)

    public function edit_instance_form($instance, MoodleQuickForm $mform, $context) {
        $mform->addElement(
            'select',
            'customint4',
            get_string('sendcoursewelcomemessage', 'enrol_pluginname'),
            enrol_send_welcome_email_options()
        );
    }

    /**
     * Enrol a user using a given enrolment instance.
     *
     * @param stdClass $instance the plugin instance
     * @param int $userid the user id
     * @param int $roleid the role id
     * @param int $timestart enrolment start timestamp
     * @param int $timeend enrolment end timestamp
     * @param int $status default to ENROL_USER_ACTIVE for new enrolments
     * @param bool $recovergrades restore grade history
     */
    public function enrol_user(
        stdClass $instance,
        $userid,
        $roleid = null,
        $timestart = 0,
        $timeend = 0,
        $status = null,
        $recovergrades = null
    ) {
        parent::enrol_user(
            $instance,
            $userid,
            $roleid,
            $timestart,
            $timeend,
            $status,
            $recovergrades
        );
        // Send welcome message.
        if ($instance->customint4 != ENROL_DO_NOT_SEND_EMAIL) {
            $this->email_welcome_message($instance, core_user::get_user($userid));
        }
    }
}
