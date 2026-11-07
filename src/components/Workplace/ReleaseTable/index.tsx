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
import { MDXProvider } from '@mdx-js/react';
import {
    getVersion, getVersionTitle, type versionInfo, getReleaseStatus,
} from '@site/src/utils/Workplace/SupportedReleases';
import Link from '@docusaurus/Link';
import Admonition from '@theme/Admonition';

interface ReleaseTableProps {
    releaseName: string,
    isRolling?: boolean,
}

const releaseNoteLink = (
    releaseName: string,
    release: versionInfo,
    isLms: boolean = false,
    isRolling = false,
): null | JSX.Element => {
    const isMajorRelease = (release.name.endsWith('.0') || (release.name.match(/\./g) || []).length === 1);
    let label = `${isLms ? 'Moodle LMS' : 'Moodle Workplace'} `;
    label += `${isMajorRelease ? releaseName : release.name} `;

    if (!isLms && !release.releaseNoteUrl) {
        return null;
    }

    if (!isLms && typeof release.releaseNoteUrl === 'string') {
        label += isRolling ? 'rolling' : '';
        return <Link href={release.releaseNoteUrl}>{label}</Link>;
    }

    const linkTo = isMajorRelease
        ? `/general/releases/${releaseName}`
        : `/general/releases/${releaseName}/${release.name}/`;

    return <Link to={linkTo}>{label}</Link>;
};

const getEndText = (supportDate: string, isRolling: boolean) => {
    const now = new Date();
    const supportDateFormatted = new Date(supportDate);

    if (isRolling) {
        return supportDateFormatted < now ? 'rolling ended' : 'rolling will end';
    }
    return supportDateFormatted < now ? 'ended' : 'will end';
};

export default function ReleaseTable({ releaseName, isRolling = false }: ReleaseTableProps): JSX.Element {
    const rows = getVersion(releaseName, isRolling);
    const impAndNewFeatEndDate = isRolling ? rows.improvementsandnewfeaturesEndDate : rows.generalEndDate;
    const version = `${releaseName}.x`;

    return (
        <MDXProvider>
            <table>
                <thead>
                    <tr>
                        <th>Version name</th>
                        <th>Date</th>
                        <th>Version number</th>
                        <th>Moodle LMS release notes</th>
                        <th>Moodle Workplace release notes</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.releases.map((row) => (
                        <tr
                            key={`SupportedRelease${row.name}`}
                        >
                            <td>{getVersionTitle(row.name)}</td>
                            <td>{row.releaseDate}</td>
                            <td>{row.version}</td>
                            <td>{releaseNoteLink(releaseName, row, true, isRolling)}</td>
                            <td>{releaseNoteLink(releaseName, row, false, isRolling)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Admonition type="info">
                <p>
                    {getReleaseStatus(rows) === 'unsupported' ? (
                        <>
                            Support has ended
                        </>
                    ) : (
                        <>
                            {isRolling && (
                                <>
                                    {`Improvements and new features in ${version} `}
                                    {`${getEndText(impAndNewFeatEndDate, isRolling)} ${impAndNewFeatEndDate}.`}
                                    <br />
                                </>
                            )}
                            {`Bug fixes for general core bugs in ${version} `}
                            {`${getEndText(rows.generalEndDate, isRolling)} ${rows.generalEndDate}.`}
                            <br />
                            {`Bug fixes for security issues in ${version} `}
                            {`${getEndText(rows.securityEndDate, isRolling)} ${rows.securityEndDate}.`}
                        </>
                    )}
                </p>
            </Admonition>
        </MDXProvider>
    );
}
