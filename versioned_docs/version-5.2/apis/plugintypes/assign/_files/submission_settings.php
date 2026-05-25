// Note: This is on by default.
$settings->add(
    new admin_setting_configcheckbox('assignsubmission_file/default',
        new lang_string('default', 'assignsubmission_file'),
        new lang_string('default_help', 'assignsubmission_file'),
        1
    )
);

if (isset($CFG->maxbytes)) {
    $name = new lang_string('maximumsubmissionsize', 'assignsubmission_file');
    $description = new lang_string('configmaxbytes', 'assignsubmission_file');

    $element = new admin_setting_configselect(
        'assignsubmission_file/maxbytes',
        $name,
        $description,
        1048576,
        get_max_upload_sizes($CFG->maxbytes)
    );
    $settings->add($element);
}
