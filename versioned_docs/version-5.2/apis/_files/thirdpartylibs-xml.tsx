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
import DefaultDescription from './thirdpartylibs-xml.mdx';

const defaultExample = `<?xml version="1.0"?>
<libraries>
    <library>
        <location>javascript/html5shiv.js</location>
        <name>Html5Shiv</name>
        <version>3.6.2</version>
        <license>Apache</license>
        <licenseversion>2.0</licenseversion>
    </library>
    <library>
        <location>vendor/guzzle/guzzle/</location>
        <name>guzzle</name>
        <version>v3.9.3</version>
        <license>MIT</license>
        <licenseversion></licenseversion>
    </library>
</libraries>`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        defaultDescription={DefaultDescription}
        defaultExample={defaultExample}
        filepath="/thirdpartylibs.xml"
        filetype="xml"
        summary="Details of third-party libraries included in the plugin"
        showLicense={false}
        showFileHeader={false}
        {...initialProps}
    />
);
