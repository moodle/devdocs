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
import { ComponentFileSummary, type ComponentFileSummaryProps } from '../../_utils';
import DefaultDescription from './composer-json.mdx';

const defaultExample = `{
    "name": "myplugin/moodle-block_myblock",
    "description": "A description of my Moodle block plugin",
    "type": "moodle-block",
    "require": {
        "moodle/moodle": "^5.2",
        "moodle/composer-installer": "*",
        "abgreeve/moodle-block_stash": "^5.2"
    },
    "license": "GPL-3.0-or-later"
}`;

export default function ComposerJSON(props: ComponentFileSummaryProps): React.JSX.Element {
    return (
        <ComponentFileSummary
            filepath="/composer.json"
            filetype="json"
            summary="Allows the plugin to be distributed and installed via Composer"
            examplePurpose="Basic Composer package definition for a block plugin"
            defaultDescription={DefaultDescription}
            defaultExample={defaultExample}
            showLicense={false}
            showFileHeader={false}
            {...props}
        />
    );
}
