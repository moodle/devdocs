use mod_quiz\form\edit_override_form;
use mod_quiz\form\preflight_check_form;
use mod_quiz\quiz_settings;
use mod_quiz\local\access_rule_base;
use mod_quiz_mod_form;
use MoodleQuickForm;

class quizaccess_pluginname extends access_rule_base {

    /**
     * Below are methods inherited from mod_quiz\local\access_rule_base. All of these functions,
     * are optional to rewrite - although it depends on the behaviour of your rule which will
     * determine which functions should be reimplemented.
     */

    public function __construct($quizobj, $timenow) {
        $this->quizobj = $quizobj;
        $this->quiz = $quizobj->get_quiz();
        $this->timenow = $timenow;
    }

    public static function make(quiz_settings $quizobj, $timenow, $canignoretimelimits) {
        return null;
    }

    public function prevent_new_attempt($numprevattempts, $lastattempt) {
        return false;
    }

    public function prevent_access() {
        return false;
    }

    public function is_preflight_check_required($attemptid) {
        return false;
    }

    public function add_preflight_check_form_fields(preflight_check_form $quizform,
        MoodleQuickForm $mform, $attemptid) {
        // Do nothing by default.
    }

    public function validate_preflight_check($data, $files, $errors, $attemptid) {
        return $errors;
    }

    public function notify_preflight_check_passed($attemptid) {
        // Do nothing by default.
    }

    public function current_attempt_finished() {
        // Do nothing by default.
    }

    public function description() {
        return '';
    }

    public function is_finished($numprevattempts, $lastattempt) {
        return false;
    }

    public function end_time($attempt) {
        return false;
    }

    public function time_left_display($attempt, $timenow) {
        $endtime = $this->end_time($attempt);
        if ($endtime === false) {
            return false;
        }
        return $endtime - $timenow;
    }

    public function attempt_must_be_in_popup() {
        return false;
    }

    public function get_popup_options() {
        return [];
    }

    public function setup_attempt_page($page) {
        // Do nothing by default.
    }

    public function get_superceded_rules() {
        return [];
    }

    public static function add_settings_form_fields(
        mod_quiz_mod_form $quizform, MoodleQuickForm $mform) {
        // By default do nothing.
    }

    public static function validate_settings_form_fields(array $errors,
            array $data, $files, mod_quiz_mod_form $quizform) {
        return $errors;
    }

    public static function get_browser_security_choices() {
        return [];
    }

    public static function save_settings($quiz) {
        // By default do nothing.
    }

    public static function delete_settings($quiz) {
        // By default do nothing.
    }

    public static function get_settings_sql($quizid) {
        return ['', '', []];
    }

    public static function get_extra_settings($quizid) {
        return [];
    }
}
