/**
 * Copyright (c) Moodle Pty Ltd.
 *
 * Moodle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Moodle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import { ComponentFileSummary } from '../../../../_utils';
import type { Props } from '../../../../_utils';
import DefaultDescription from './mod_form-php.mdx';

const defaultExample = `require_once($CFG->dirroot.'/course/moodleform_mod.php');
require_once($CFG->dirroot.'/mod/certificate/lib.php');

class mod_certificate_mod_form extends moodleform_mod {

    function definition() {
        global $CFG, $DB, $OUTPUT;

        $mform =& $this->_form;

        // Section header title according to language file.
        $mform->addElement('header', 'general', get_string('general', 'certificate'));

        // Add a text input for the name of the certificate.
        $mform->addElement('text', 'name', get_string('certificatename', 'certificate'), ['size' => '64']);
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');

        // Add a select menu for the 'use code' setting.
        $ynoptions = [
            0 => get_string('no'),
            1 => get_string('yes'),
        ];
        $mform->addElement('select', 'usecode', get_string('usecode', 'certificate'), $ynoptions);
        $mform->setDefault('usecode', 0);
        $mform->addHelpButton('usecode', 'usecode', 'certificate');

        // Standard Moodle course module elements (course, category, etc.).
        $this->standard_coursemodule_elements();

        // Standard Moodle form buttons.
        $this->add_action_buttons();
    }

    function validation($data, $files) {
        $errors = array();

        // Validate the 'name' field.
        if (empty($data['name'])) {
            $errors['name'] = get_string('errornoname', 'certificate');
        }

        return $errors;
    }

    function data_preprocessing(&$default_values) {
        // Set default values for the form fields.
        $default_values['name'] = 'Default Certificate Name';
        $default_values['usecode'] = 1;

    }

    function definition_after_data() {
        $mform = $this->_form;
        $data = $this->get_data();

        // Disable the 'name' field if 'usecode' is set to 1.
        if ($data && !empty($data->usecode)) {
            $mform->disabledIf('name', 'usecode', 'eq', 1);
        }

    }

    function preprocess_data($data) {
        // Modify the 'name' data before saving.
        $data->name = strtoupper($data->name);

        return $data;
    }
}
`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        required
        defaultDescription={DefaultDescription}
        defaultExample={defaultExample}
        examplePurpose="Activity creation/editing form"
        filepath="/mod_form.php"
        pluginname="[modname]"
        plugintype="mod"
        summary="Activity creation/editing form"
        {...initialProps}
    />
);
