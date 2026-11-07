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
import DefaultDescription from './db-services-php.mdx';

const defaultExample = `
$functions = [
    'plugintype_pluginname_create_things' => [
        'classname' => 'plugintype_pluginname\\external\\create_things',
        'description' => 'Create a new thing',
        'type' => 'write',
        'ajax' => true,
        'services' => [
            MOODLE_OFFICIAL_MOBILE_SERVICE,
        ],
    ],
];
`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        refreshedDuringUpgrade
        recommended
        filepath="/db/services.php"
        summary="Web service function declarations"
        examplePurpose="Web service function declarations"
        defaultExample={defaultExample}
        defaultDescription={DefaultDescription}
        {...initialProps}
    />
);
