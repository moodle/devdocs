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
import { Stack, Chip } from '@mui/material';
import Link from '@docusaurus/Link';

export default function Since(props) {
    const badges = props.versions.map((version) => getSinceLabel(version, props.issueNumber));

    return (
        <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
        >
            {badges}
        </Stack>
    );
}

function getVersionNumber(versionNumber) {
    if (typeof versionNumber === 'number' && Number.isInteger(versionNumber)) {
        return versionNumber.toFixed(1);
    }

    return versionNumber;
}

function getSinceLabel(versionNumber, issueNumber) {
    const normalisedVersionNumber = getVersionNumber(versionNumber);

    const label = (
        <span>
            Since
            {' '}
            {normalisedVersionNumber}
        </span>
    );

    const chip = (
        <Chip
            key={`Since${normalisedVersionNumber}`}
            label={label}
        />
    );

    if (issueNumber) {
        return (
            <Link
                to={`https://tracker.moodle.org/browse/${issueNumber}`}
            >
                {chip}
            </Link>
        );
    }

    return chip;
}
