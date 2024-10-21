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
import { ComponentFileSummary } from '../../_utils';
import type { Props } from '../../_utils';
import DefaultDescription from './db-renamedclasses-php.mdx';

const defaultExample = `
defined('MOODLE_INTERNAL') || die;

$renamedclasses = [
    'old_class_name' => 'fully_qualified\\\\new\\\\name',

    // Examples:
    'assign_header' => 'mod_assign\\\\output\\\\header',
    '\\assign_header' => 'mod_assign\\\\output\\\\header',
    '\\assign' => 'mod_assign\\\\assignment',

    // Incorrect:
    // The new class name should _not_ have a leading \\.
    'assign_header' => '\\\\mod_assign\\\\output\\\\header',
];
`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        refreshedDuringPurge
        defaultExample={defaultExample}
        defaultDescription={DefaultDescription}
        filepath="/db/renamedclasses.php"
        summary="Renamed classes"
        examplePurpose="Renamed classes"
        {...initialProps}
    />
);
