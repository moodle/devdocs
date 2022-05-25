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
import { getVersion, getVersionTitle, type versionInfo } from '@site/src/utils/SupportedReleases';
import Link from '@docusaurus/Link';

interface ReleaseTableProps {
    releaseName: string,
}

const releaseNoteLink = (releaseName: string, release: versionInfo): null | JSX.Element => {
    if (release.releaseNoteUrl === false) {
        return null;
    }

    if (release.releaseNoteUrl && typeof release.releaseNoteUrl === 'string') {
        return (
            <Link href={release.releaseNoteUrl}>Release Notes</Link>
        );
    }

    if (release.name.endsWith('.0') || (release.name.match(/\./g) || []).length === 1) {
        return (
            <Link to={`/general/releases/${releaseName}`}>Release Notes</Link>
        );
    }

    return (
        <Link to={`/general/releases/${releaseName}/${release.name}/`}>Release Notes</Link>
    );
};

const getNotes = (release: versionInfo): null | JSX.Element => {
    const upgradeNoteLink = release.upgradePath && typeof release.upgradePath === 'string' && (
        <Link href={release.upgradePath}>Upgrade notes</Link>
    );

    const manualNotes = release.notes && (
        <>
            {release.notes}
        </>
    );

    return (
        <>
            {upgradeNoteLink}
            {manualNotes}
        </>
    );
};

export default function ReleaseTable({ releaseName }: ReleaseTableProps): JSX.Element {
    const rows = getVersion(releaseName);

    return (
        <MDXProvider>
            <table>
                <tbody>
                    {rows.releases.map((row) => (
                        <tr
                            key={`ReleaseVersion${row.name}`}
                        >
                            <th scope="row">
                                {getVersionTitle(row.name)}
                            </th>
                            <td>{row.releaseDate}</td>
                            <td>{row.version}</td>
                            <td>
                                {releaseNoteLink(releaseName, row)}
                            </td>
                            <td>
                                {getNotes(row)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </MDXProvider>
    );
}
