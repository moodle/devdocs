use mod_quiz\form\edit_override_form;
use mod_quiz\local\access_rule_base;
use mod_quiz\local\rule_overridable;
use MoodleQuickForm;

class quizaccess_pluginname extends access_rule_base implements rule_overridable {

    /**
     * All of the below rule_overridable interface functions will need to be implemented.
     */

    public static function add_override_form_fields(edit_override_form $quizform, MoodleQuickForm $mform): void {
        // Use the $mform to add the rule override fields...
        $mform->addElement(
            'select',
            'plgn_setting1',
            get_string('plgn_setting1', 'quizaccess_pluginname'),
            ['A', 'B', 'C'],
        );

        $mform->addElement(
            'select',
            'plgn_setting2',
            get_string('plgn_setting2', 'quizaccess_pluginname'),
            ['1', '2', '3'],
        );
    }

    public static function get_override_form_section_header(): array {
        // Return the label and content of the section header in an array.
        return ['name' => 'pluginname', 'title' => get_string('pluginname', 'quizaccess_pluginname')];
    }

    public static function get_override_form_section_expand(edit_override_form $quizform): bool {
        // Determine if rule section in override form should load expanded.
        // Should typically return true if the quiz has existing rule settings.
        global $DB;
        return $DB->record_exists('quizaccess_pluginname', ['quiz' => $quizform->get_quiz()->id]);
    }

    public static function validate_override_form_fields(array $errors,
            array $data, array $files, edit_override_form $quizform): array {
        // Check and push to $errors array...
        return $errors;
    }

    public static function save_override_settings(array $override): void {
        // Save $override data to plugin settings table...
        global $DB;

        $plgnoverride = (object)[
            'overrideid'    => $override['overrideid'],
            'setting1'      => $override['plgnm_setting1'],
            'setting2'      => $override['plgnm_setting2'],
        ];

        if ($plgnoverrideid = $DB->get_field('quizaccess_pluginname_overrides', 'id', ['overrideid' => $override['overrideid']])) {
            $plgnoverride->id = $plgnoverrideid;
            $DB->update_record('quizaccess_pluginname_overrides', $plgnoverride);
        } else {
            $DB->insert_record('quizaccess_pluginname_overrides', $plgnoverride);
        }
    }

    public static function delete_override_settings($quizid, $overrides): void {
        // Remove $overrides from $quiz.
        global $DB;
        $ids = array_column($overrides, 'id');
        list($insql, $inparams) = $DB->get_in_or_equal($ids);
        $DB->delete_records_select('quizaccess_pluginname_overrides', "id $insql", $inparams);
    }

    public static function get_override_setting_keys(): array {
        // Return string array of all override form setting keys.
        return ['plgnm_setting1', 'plgnm_setting2'];
    }

    public static function get_override_required_setting_keys(): array {
        // Return string array of override form setting keys that are required.
        return ['plgnm_setting1'];
    }

    public static function get_override_settings_sql($overridetablename): array {
        // Return an array of selects, joins and parameters to be used to query relevant rule overrides...
        return [
            "plgnm.setting1 plgnm_setting1, plgnm.setting2 plgnm_setting2",
            "LEFT JOIN {quizaccess_pluginname_overrides} plgnm ON plgnm.overrideid = {$overridetablename}.id",
            [],
        ];
    }

    public static function add_override_table_fields($override, $fields, $values, $context): array {
        // Extend the override table view by adding fields and values that display the rule's overrides.
        if (!empty($override->plgnm_setting1)) {
            $fields[] = get_string('pluginname', 'quizaccess_pluginname');
            $values[] = "{$override->plgnm_setting1}, {$override->plgnm_setting2}";
        }
        return [$fields, $values];
    }
}
