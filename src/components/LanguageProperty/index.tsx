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
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';

export type LanguagePropertyProps = {
    types: string[],
    required?: boolean,
    recommended?: boolean,
}

function getTypeBadge(types: string[]) {
    return types.map((type) => (
        <Tooltip key={type} title={`This property should be a ${type}`}>
            <Chip
                label={type}
                color="success"
                variant="outlined"
            />
        </Tooltip>
    ));
}

function getRequiredBadge(required: boolean = false, recommended: boolean = false) {
    if (required) {
        return (
            <Tooltip title="This property must be specified">
                <Chip
                    label="Required"
                    color="error"
                />
            </Tooltip>
        );
    }

    if (recommended) {
        return (
            <Tooltip title="This property is optional, but is recommended">
                <Chip
                    label="Recommended"
                    color="warning"
                />
            </Tooltip>
        );
    }

    return (
        <Tooltip title="This property is optional">
            <Chip
                label="Optional"
                color="success"
                variant="outlined"
            />
        </Tooltip>
    );
}

export default function LanguageProperty({
    types,
    required = false,
    recommended = false,
}: LanguagePropertyProps): JSX.Element {
    return (
        <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
        >
            <Grid item>
                {getTypeBadge(types)}
                {getRequiredBadge(required, recommended)}
            </Grid>
        </Stack>
    );
}
