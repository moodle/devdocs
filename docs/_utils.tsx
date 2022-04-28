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
import { ComponentFileSummary as ComponentFileSummaryGeneric } from '@site/src/components';
import { getExample } from '@site/src/moodleBridge';

import type { Props } from '@site/src/moodleBridge';

export {
    getExample,
};

/**
 * Fill the default properties.
 * @param {Props} props
 * @return {Props}
 */
export const fillDefaultProps = (props: Props): Props => ({
    fileType: 'php',
    examplePurpose: props.summary,
    ...props,
});

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
}: Props, DefaultDescription?: string | boolean): ReactFragment => {
    if (description) {
        return description;
    }

    if (description === false) {
        return null;
    }

    return (
        <>
            <DefaultDescription />
            {extraDescription}
        </>
    );
};

export const ComponentFileSummary = (initialProps: Props): ReactFragment => {
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
