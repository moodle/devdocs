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
import DefaultDescription from './index-php.mdx';

const defaultExample = `require_once('../../config.php');

// The \`id\` parameter is the course id.
$id = required_param('id', PARAM_INT);

// Fetch the requested course.
$course = $DB->get_record('course', ['id'=> $id], '*', MUST_EXIST);

// Require that the user is logged into the course.
require_course_login($course);

$modinfo = get_fast_modinfo($course);

foreach ($modinfo->get_instances_of('[modinfo]') as $instanceid => $cm) {
    // Display information about your activity.
}
`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        required
        defaultDescription={DefaultDescription}
        defaultExample={defaultExample}
        plugintype="mod"
        pluginname="[modname]"
        filepath="/index.php"
        summary="Activity index"
        examplePurpose="Activity index"
        {...initialProps}
    />
);
