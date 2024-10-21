defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/repository/lib.php');

class repository_flickr_public extends repository {

    // User specific settings.

    /**
     * Options names.
     *
     * Tell the API that the repositories have specific settings: "email address"
     *
     * @return string[] of options.
     */
    public static function get_instance_option_names() {
        return ['email_address'];
    }

    /**
     * Repository configuration form.
     *
     * Add an "email address" text box to the create/edit repository instance Moodle form
     *
     * @param moodleform $mform Moodle form
     */
    public static function instance_config_form($mform) {
        $mform->addElement(
            'text',
            'email_address',
            get_string('emailaddress', 'repository_flickr_public')
        );
        $mform->addRule(
            'email_address',
            get_string('required'),
            'required',
            null,
            'client'
        );
    }

    // Global repository plugin settings.

    /**
     * Repository global settings names.
     *
     * We tell the API that the repositories have general settings: "api_key"
     *
     * @return string[] of options.
     */
    public static function get_type_option_names() {
        return array('api_key');
    }

    /**
     * Repository global settings form.
     *
     * We add an "api key" text box to the create/edit repository plugin Moodle form (also called a Repository type Moodle form)
     *
     * @param moodleform $mform Moodle form
     */
    public function type_config_form($mform) {
        //the following line is needed in order to retrieve the API key value from the database when Moodle displays the edit form
        $api_key = get_config('flickrpublic', 'api_key');

        $mform->addElement(
            'text',
            'api_key',
            get_string('apikey', 'repository_flickr_public'),
            ['value' => $api_key, 'size' => '40']
        );
        $mform->addRule(
            'api_key',
            get_string('required'),
            'required',
            null,
            'client'
        );
    }

    // Method called when the repostiroy plugin is installed.

    /**
     * Plugin init method.
     *
     * this function is only called one time, when the Moodle administrator add the Flickr Public Plugin into the Moodle site.
     */
    public static function plugin_init() {
        //here we create a default repository instance. The last parameter is 1 in order to set the instance as readonly.
        repository::static_function(
            'flickrpublic',
            'create',
            'flickrpublic',
            0,
            context_system::instance(),
            ['name' => 'default instance', 'email_address' => null],
            1
        );
    }
}
