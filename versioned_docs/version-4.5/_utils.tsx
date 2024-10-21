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
import ComponentFileSummaryGeneric, {
    type ComponentFileSummaryProps,
} from '@site/src/components/ComponentFileSummary';
import { MDXProvider } from '@mdx-js/react';

import { getExample } from '@site/src/moodleBridge';

export {
    getExample,
    ComponentFileSummaryProps,
};

/**
 * Fill the default properties.
 * @param {Props} props
 * @return {Props}
 */
export const fillDefaultProps = (props: ComponentFileSummaryProps): ComponentFileSummaryProps => ({
    filetype: 'php',
    examplePurpose: props.summary,
    ...props,
});

const normaliseDescription = (Value: ReactNode | string): null | JSX.Element => {
    if (typeof Value === 'boolean' || !Value) {
        return null;
    }

    if (typeof Value === 'string' || React.isValidElement(Value)) {
        return (
            <MDXProvider>
                {Value}
            </MDXProvider>
        );
    }

    return (
        <MDXProvider>
            <Value />
        </MDXProvider>
    );
};

/**
 * Get the preferred description given a standard properties value which contains an optional description,
 * and/or extraDescription, and a DefaultDescription object.
 *
 * @param {Props} props
 * @param {DefaultDescription} DefaultDescription The default description to use if the `description` property is empty
 * @returns {MDXLayout}
 */
export const getDescription = ({
    description = null,
    extraDescription = null,
    children = null,
}: ComponentFileSummaryProps, defaultDescription?: ReactNode | string): null | ReactNode | JSX.Element => {
    if (children) {
        const Description = normaliseDescription(children);
        return (
            <MDXProvider>
                {Description}
            </MDXProvider>
        );
    }

    if (description) {
        const Description = normaliseDescription(description);
        return (
            <MDXProvider>
                {Description}
            </MDXProvider>
        );
    }

    const Description = normaliseDescription(defaultDescription);
    const ExtraDescription = normaliseDescription(extraDescription);

    if (Description) {
        return (
            <MDXProvider>
                {Description}
                {ExtraDescription}
            </MDXProvider>
        );
    }

    return null;
};

export const ComponentFileSummary = (initialProps: ComponentFileSummaryProps): JSX.Element => {
    const props = fillDefaultProps({
        examplePurpose: initialProps?.summary ?? null,
        ...initialProps,
    });

    props.description = getDescription(props, props?.defaultDescription ?? null);

    if (props?.example || props?.defaultExample) {
        props.example = getExample(props, props?.defaultExample ?? null);
    }

    return ComponentFileSummaryGeneric(props);
};
