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

function getVersionNumber(versionNumber) {
    if (typeof versionNumber === 'number' && Number.isInteger(versionNumber)) {
        return versionNumber.toFixed(1);
    }

    return versionNumber;
}

function getTypeLabel(type) {
    if (type === 'since') {
        return 'Since';
    }

    if (type === 'deprecated') {
        return 'Deprecated';
    }

    throw new Error(`Unknown <Since> type: '${type}'`);
}

function getSinceLabel(type, versionNumber, issueNumber) {
    const normalisedVersionNumber = getVersionNumber(versionNumber);

    const label = (
        <span>
            {getTypeLabel(type)}
            {' '}
            {normalisedVersionNumber}
        </span>
    );

    const chip = (
        <Chip
            key={`chip-${type}${normalisedVersionNumber}`}
            label={label}
        />
    );

    if (issueNumber) {
        return (
            <Link
                to={`https://tracker.moodle.org/browse/${issueNumber}`}
                key={`link-${type}${normalisedVersionNumber}`}
            >
                {chip}
            </Link>
        );
    }

    return chip;
}

function getBadges({
    issueNumber = null,
    type = 'since',
    versions = [],
    version = null,
}) {
    if (version) {
        return getSinceLabel(type, version, issueNumber);
    }

    return versions.map((ver) => getSinceLabel(type, ver, issueNumber));
}

export default function Since(props) {
    const badges = getBadges(props);

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
