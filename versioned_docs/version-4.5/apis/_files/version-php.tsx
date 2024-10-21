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
import { type ComponentFileSummaryProps } from '@site/src/components/ComponentFileSummary';
import React from 'react';
import { ComponentFileSummary } from '../../_utils';
import DefaultDescription from './version-php.mdx';

const defaultExample = `defined('MOODLE_INTERNAL') || die();

$plugin->version = TODO;
$plugin->requires = TODO;
$plugin->supported = TODO;   // Available as of Moodle 3.9.0 or later.
$plugin->incompatible = TODO;   // Available as of Moodle 3.9.0 or later.
$plugin->component = 'TODO_FRANKENSTYLE';
$plugin->maturity = MATURITY_STABLE;
$plugin->release = 'TODO';

$plugin->dependencies = [
    'mod_forum' => 2022042100,
    'mod_data' => 2022042100
];
`;

export default function VersionPHP(props: ComponentFileSummaryProps): JSX.Element {
    return (
        <ComponentFileSummary
            required
            filepath="/version.php"
            filetype="php"
            summary="Version metadata"
            examplePurpose="Version metadata"
            defaultDescription={DefaultDescription}
            defaultExample={defaultExample}
            {...props}
        />
    );
}
