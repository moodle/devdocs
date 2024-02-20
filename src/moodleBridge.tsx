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

import React, { type ReactNode } from 'react';
import CodeBlock from '@theme/CodeBlock';
import DefaultComponentData from '@site/data/main/components.json';

export interface ComponentList {
    plugintypes: object,
    subsystem: object,
}

export interface Props {
    description?: string | ReactNode,
    example?: string,
    exampleFilepath?: string,
    examplePurpose?: string,
    extraDescription?: string,
    filepath?: string,
    filetype?: string,
    modulename?: string,
    pluginname?: string,
    plugintype?: string,
    showFileHeader?: boolean,
    showLicense?: boolean,
    summary?: string,
}

/**
 * Fetch the path to a plugintype's root directory for th given plugin type.
 *
 * @param {ComponentList} ComponentData
 * @param {string} pluginType
 * @returns {string} The path
 */
export const getPluginTypePath = (ComponentData: ComponentList) => (pluginType: string): string => {
    if (ComponentData.plugintypes[pluginType]) {
        return ComponentData.plugintypes[pluginType];
    }

    return `[path/to/${pluginType}]`;
};

/**
 * Get the filename for an example file.
 *
 * @param {ComponentList} ComponentData The `components.json` file data for the relevant version of Moodle.
 * @param {Props} props
 * @returns {string}
 */
export const getFileNameGetter = (ComponentData: ComponentList) => ({
    plugintype = 'plugintype',
    pluginname = 'pluginname',
    filepath = null,
}: Props): string => {
    let pluginPath = getPluginTypePath(ComponentData)(plugintype);

    if (pluginname) {
        pluginPath += `/${pluginname}`;
    } else {
        pluginPath += '/[pluginname]';
    }

    return `${pluginPath}${filepath}`;
};

/**
 * Get the filename for an example file using component data defined in the main branch.
 *
 * @param {Props} props
 * @returns {string}
 */
export const getFileNameWithComponentPath = getFileNameGetter(DefaultComponentData);

/**
 * Fetch the Moodle License as used in a PHP file.
 *
 * @returns {string}
 */
export const getPhpLicense = (): string => `// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
`;

/**
 * Fetch the standard file opening - i.e. `<?php` for PHP.
 *
 * @param {Props} props
 * @returns {string}
 */
const getFileTypeHeader = ({
    filetype = 'php',
}: Props): string => {
    switch (filetype) {
    case ('js'):
    case ('javascript'):
    case ('xml'):
        return null;
    default:
        return '<?php';
    }
};

/**
 * Fetch the standard File docblock used in JS files.
 *
 * @param {Props} props
 * @returns {string}
 */
export const getJSFileDocHeader = ({
    plugintype = 'plugintype',
    pluginname = 'pluginname',
    examplePurpose,
    modulename,
}: Props): string => {
    if (!examplePurpose) {
        throw Error('Purpose must be specified');
    }

    if (!modulename) {
        throw Error('AMD Module name must be specified');
    }

    return [
        '/**',
        ` * ${examplePurpose} for the ${plugintype}_${pluginname} plugin.`,
        ' *',
        ` * @module   ${plugintype}_${pluginname}/${modulename}`,
        ' * @copyright Year, You Name <your@email.address>',
        ' * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later',
        ' */',
        '',
    ].join('\n');
};

/**
 * Fetch the standard File docblock used in JS files.
 *
 * @param {Props} props
 * @returns {string}
 */
export const getYUIFileDocHeader = ({
    plugintype = 'plugintype',
    pluginname = 'pluginname',
    examplePurpose,
    modulename,
}: Props): string => {
    if (!examplePurpose) {
        throw Error('Purpose must be specified');
    }

    if (!modulename) {
        throw Error('YUI Module name must be specified');
    }

    return [
        '/*',
        ` * @package   ${plugintype}_${pluginname}`,
        ' * @copyright Year, You Name <your@email.address>',
        ' * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later',
        ' */',
        '',
        '/**',
        ` * @module moodle-${plugintype}_${pluginname}-${modulename}`,
        ' */',
        '',
    ].join('\n');
};

/**
 * Fetch the standard File docblock used in PHP files.
 *
 * @param {Props} props
 * @returns {string}
 */
export const getPhpFileDocHeader = ({
    plugintype = 'plugintype',
    pluginname = 'pluginname',
    examplePurpose,
}: Props): string => {
    if (!examplePurpose) {
        throw Error('Purpose must be specified');
    }

    return [
        '/**',
        ` * ${examplePurpose} for the ${plugintype}_${pluginname} plugin.`,
        ' *',
        ` * @package   ${plugintype}_${pluginname}`,
        ' * @copyright Year, You Name <your@email.address>',
        ' * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later',
        ' */',
        '',
    ].join('\n');
};

export const getFileExampleTitle = getFileNameWithComponentPath(DefaultComponentData);

export const getFileDocHeader = (props: Props): string => {
    if (!props.showFileHeader) {
        return '';
    }
    switch (props?.filetype) {
    case ('xml'):
        return '';
    case ('js'):
    case ('javascript'):
        return getJSFileDocHeader(props);
    case ('yui'):
        return getYUIFileDocHeader(props);
    default:
        return getPhpFileDocHeader(props);
    }
};

export const getFileLicense = (props: Props): string => {
    if (!props.showLicense) {
        return '';
    }
    switch (props.filetype) {
    default:
        return getPhpLicense();
    }
};

const getFormattedExample = (props, defaultExample = null) => {
    const selectExample = () => {
        if (props.example) {
            return props.example;
        }

        if (defaultExample) {
            return defaultExample;
        }

        return null;
    };

    const exampleContent = [
        getFileLicense(props),
        getFileDocHeader(props),
        selectExample(),
    ].filter((value) => value).map((value) => value.trim()).join('\n\n');

    const fileTypeHeader = getFileTypeHeader(props);
    return [fileTypeHeader, exampleContent].filter((value) => value).join('\n');
};

const getLanguage = ({
    filetype = 'php',
}: Props): string => {
    switch (filetype) {
    case ('js'):
    case ('javascript'):
        return 'javascript';
    case ('xml'):
        return 'xml';
    case ('php'):
    case (null):
        return 'php';
    default:
        return filetype;
    }
};

/**
 * Compose an example file for the given dataset.
 *
 * This function takes a set of Component Data for a specific version of Moodle.
 *
 * @param {ComponentList} ComponentData
 * @param {Props} initialProps
 * @param {string} defaultExample
 * @returns {CodeBlock}
 */
export const fileExampleGetter = (ComponentData: ComponentList) => (
    initialProps: Props,
    defaultExample: string,
): JSX.Element => {
    const props = {
        plugintype: 'plugintype',
        showLicense: true,
        showFileHeader: true,
        filepath: initialProps.exampleFilepath ?? initialProps.filepath,
        ...initialProps,
    };

    const getFilename = getFileNameGetter(ComponentData);
    const exampleContent = getFormattedExample(props, defaultExample);

    return (
        <CodeBlock
            title={getFilename(props)}
            language={getLanguage(props)}
        >
            {exampleContent}
        </CodeBlock>
    );
};

/**
 * Compose an example file for the given dataset.
 *
 * This function takes a set of Component Data for main.
 *
 * @param {Props} initialProps
 * @param {string} defaultExample
 * @returns {CodeBlock}
 */
export const getExample = fileExampleGetter(DefaultComponentData);

export {
    CodeBlock,
};
