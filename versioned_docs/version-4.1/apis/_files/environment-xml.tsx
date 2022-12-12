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
import DefaultDescription from './environment-xml.mdx';

const defaultExample = `
<?xml version="1.0" encoding="UTF-8" ?>
<COMPATIBILITY_MATRIX>
  <PLUGIN name="plugintype_pluginname">
    <PHP_EXTENSIONS>
      <PHP_EXTENSION name="soap" level="required">
      </PHP_EXTENSION>
    </PHP_EXTENSIONS>
  </PLUGIN>
</COMPATIBILITY_MATRIX>`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        showFileHeader={false}
        showLicense={false}
        refreshedDuringUpgrade
        filepath="/environment.xml"
        filetype="xml"
        summary="Plugin-specific environment requirements"
        defaultDescription={DefaultDescription}
        defaultExample={defaultExample}
        {...initialProps}
    />
);
