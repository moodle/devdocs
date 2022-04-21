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
import { PluginFileSummary } from '@site/src/components';
import {
    fillDefaultProps,
    getDescription,
    getExample,
} from '../../../../_utils';
import type { Props } from '../../../../_utils';
import DefaultDescription from './mod_form-php.mdx';

const defaultExample = `require_once($CFG->dirroot.'/course/moodleform_mod.php');
require_once($CFG->dirroot.'/mod/certificate/lib.php');

class mod_certificate_mod_form extends moodleform_mod {

    function definition() {
        global $CFG, $DB, $OUTPUT;

        $mform =& $this->_form;

        $mform->addElement('text', 'name', get_string('certificatename', 'certificate'), ['size'=>'64']);
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');

        $ynoptions = [
            0 => get_string('no'),
            1 => get_string('yes'),
        ];
        $mform->addElement('select', 'usecode', get_string('usecode', 'certificate'), $ynoptions);
        $mform->setDefault('usecode', 0);
        $mform->addHelpButton('usecode', 'usecode', 'certificate');

        $this->standard_coursemodule_elements();

        $this->add_action_buttons();
    }
`;

export default (initialProps: Props): PluginFileSummary => {
    const props = fillDefaultProps({
        plugintype: 'mod',
        pluginname: '[modname]',
        filepath: '/mod_form.php',
        required: true,
        summary: 'Activity creation/editing form',
        examplePurpose: 'Activity creation/editing form',
        ...initialProps,
    });

    return (
        <PluginFileSummary
            {...props}
            description={getDescription(props, DefaultDescription)}
            examples={getExample(props, defaultExample)}
        />
    );
};
