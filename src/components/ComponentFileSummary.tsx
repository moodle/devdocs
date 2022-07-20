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

/* eslint-disable react/no-unused-prop-types */
import React, { type ReactNode } from 'react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Details from '@theme/Details';
import { MDXProvider } from '@mdx-js/react';

const getBadge = (title, description, colour = 'info'): JSX.Element => (
    <Grid item key={title}>
        <Tooltip title={description}>
            <Chip
                label={title}
                color={colour}
            />
        </Tooltip>
    </Grid>
);

function getBadges({
    required = false,
    legacy = false,
    deprecated = false,
    refreshedDuringUpgrade = false,
    refreshedDuringPurge = false,
}): Array<typeof Grid> {
    const badges = [];
    if (refreshedDuringUpgrade) {
        // This file is re-read during an upgrade and configuration will be re-applied.
        badges.push(getBadge(
            'Upgradable',
            'Changes to this file or directory will be re-applied during a Moodle upgrade. '
            + 'If you make any changes to it, '
            + 'you can simply increment the version number and perform a Moodle upgrade.',
            'info',
        ));
    }

    if (refreshedDuringPurge) {
        // This file is re-read during an upgrade and configuration will be re-applied.
        badges.push(getBadge(
            'Refreshed on cache purge',
            'The contents of this file or directory are cached. '
            + 'To see your changes you can simply purge Moodle\'s caches and refresh the page.',
            'info',
        ));
    }

    if (required) {
        badges.push(getBadge(
            'Required',
            'This file must be present',
            'success',
        ));
    }

    if (legacy) {
        badges.push(getBadge(
            'Legacy',
            'Use of this file is being phased out. It is still supported for older installations but will be removed..',
            'warning',
        ));
    }

    if (deprecated) {
        badges.push(getBadge(
            'Deprecated',
            'Use of this file is deprecated and not recommended.'
            + 'It may still be provided for older versions of Moodle but is no longer used.',
            'error',
        ));
    }

    return badges;
}

function getExamples(props) {
    const { example, open = false } = props;
    if (example) {
        return (
            <Grid item xs={12}>
                <Details
                    summary={<summary>View example</summary>}
                    open={open}
                >
                    {example}
                </Details>
            </Grid>
        );
    }

    return null;
}

export interface ComponentFileSummaryProps {
    description?: string | ReactNode,
    defaultDescription?: string | ReactNode,
    defaultExample?: string | ReactNode,
    example?: string | ReactNode | JSX.Element,
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
    children?: React.ReactNode,
    required?: boolean,
    legacy?: boolean,
    refreshedDuringUpgrade?: boolean,
    refreshedDuringPurge?: boolean,
}

export default function ComponentFileSummary(props: ComponentFileSummaryProps): JSX.Element {
    const {
        filepath,
        summary,
    } = props;

    const badges = getBadges(props);

    const description = (() => {
        if (props.description) {
            return (
                <Grid item xs={12}>
                    {props.description}
                </Grid>
            );
        }
        return null;
    })();

    return (
        <MDXProvider>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <h4>
                        {summary}
                    </h4>
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={2} justifyContent="flex-end">
                        {badges}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <h5>
                        File path:
                        {' '}
                        {filepath}
                    </h5>
                </Grid>
                {description}
                {getExamples(props)}
            </Grid>
        </MDXProvider>
    );
}
