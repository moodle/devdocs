use mod_quiz\form\edit_override_form;
use mod_quiz\local\access_override_rule_base;
use MoodleQuickForm;
use context_module;
use context;

class override_rule extends access_override_rule_base {

    /**
     * All of the below access_override_rule_base be implemented below.
     */

    public static function add_form_fields(context_module $context, int $overrideid, object $quiz, MoodleQuickForm $mform): void {
        // Do nothing.
    }

    public static function validate_form_fields(array $errors,
            array $data, array $files, edit_override_form $quizform): array {
        return [];
    }

    public static function save_settings(array $override): void {
        // Do nothing.
    }

    public static function delete_settings(int $quizid, array $overrides): void {
        // Do nothing.
    }

    public static function get_settings(): array {
        return [];
    }

    public static function get_required_settings(): array {
        return [];
    }

    public static function get_settings_sql(string $overridetablename): array {
        return [];
    }

    public static function add_table_fields(object $override, array $fields, array $values, context $context): array {
        return [];
    }

    public static function clean_form_data(array $formdata): array {
        return $formdata;
    }
}
