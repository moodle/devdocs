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
import { getRelease } from '@site/src/utils/SupportedReleases';
import Link from '@docusaurus/Link';

export interface ReleaseInfoProps {
    releaseName: string,
}

function ReleaseInfo(releaseName: string, key: string): JSX.Element {
    const versionInfo = getRelease(releaseName);

    if (versionInfo && typeof versionInfo[key] !== 'undefined') {
        return (
            <>
                {versionInfo[key]}
            </>
        );
    }

    // No release information found.
    // Assume that it's in the future rather than ignoring it completely.
    return (
        <>
            not yet released
        </>
    );
}

export function ReleaseDate({ releaseName }: ReleaseInfoProps): JSX.Element {
    return ReleaseInfo(releaseName, 'releaseDate');
}

export function ReleaseVersion({ releaseName }: ReleaseInfoProps): JSX.Element {
    return ReleaseInfo(releaseName, 'version');
}

export function ReleaseNoteIntro({ releaseName }: ReleaseInfoProps): JSX.Element {
    const trackerReleaseNumber = releaseName.endsWith('.0') ? releaseName.slice(0, -2) : releaseName;

    return (
        <>
            <p>

                Release date:
                {' '}
                <ReleaseDate releaseName={releaseName} />
                <br />
            </p>
            <p>
                Here is
                {' '}
                <Link
                    href={`https://moodle.atlassian.net/secure/IssueNavigator!executeAdvanced.jspa?jqlQuery=project+%3D+mdl+AND+resolution+%3D+fixed+AND+fixVersion+in+%28%22${trackerReleaseNumber}%22%29+ORDER+BY+priority+DESC&runQuery=true&clear=true`}
                >
                    the full list of fixed issues in
                    {' '}
                    {releaseName}
                </Link>
                .
            </p>
        </>
    );
}
