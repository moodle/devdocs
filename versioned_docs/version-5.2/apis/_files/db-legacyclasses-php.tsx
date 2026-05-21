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
import DefaultDescription from './db-legacyclasses-php.mdx';

const defaultExample = `
defined('MOODLE_INTERNAL') || die;

$legacyclasses = [
    'old_class_name' => 'path/within/classes/directory.php',

    // Examples:
    \\coding_exception::class => 'exception/coding_exception.php',
    \\moodle_exception::class => 'exception/moodle_exception.php',

    // Example loading a class from a different subsystem.
    // This should typically only be used in core.
    \\cache::class => [
        'core_cache',   // The name of the subsystem to load from.
        'cache.php',    // The file name within that filesystem's classes directory.
    ],
];
`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        refreshedDuringPurge
        defaultExample={defaultExample}
        defaultDescription={DefaultDescription}
        filepath="/db/legacyclasses.php"
        summary="Legacy classes"
        examplePurpose="Legacy classes"
        {...initialProps}
    />
);
