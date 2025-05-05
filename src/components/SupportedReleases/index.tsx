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
import styles from './styles.module.css';
import {
    type majorVersionData,
    getSupportedReleases,
    getReleaseStatus,
    getReleaseStatusLabel,
    getVersionLabel,
} from '@site/src/utils/SupportedReleases';

export {
    styles,
};

export default function SupportedReleases(): JSX.Element {
    const rows = getSupportedReleases()
        .filter((versionData: majorVersionData) => versionData.hidden !== true)
        .map((versionData: majorVersionData) => {
            const releaseStatus = getReleaseStatus(versionData);
            return {
                name: versionData.name,
                version: getVersionLabel(versionData.name, versionData.isLTS),
                initialReleaseDate: versionData.releaseDate,
                generalSupportEnds: versionData.generalEndDate,
                securitySupportEnds: versionData.securityEndDate,
                releaseStatus,
                releaseStatusLabel: getReleaseStatusLabel(releaseStatus),
            };
        }).reverse();

    return (
        <MDXProvider>
            <table>
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Release status</th>
                        <th>Initial release date</th>
                        <th>General support ends</th>
                        <th>Security support ends</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr
                            key={`SupportedRelease${row.name}`}
                        >
                            <td>{row.version}</td>
                            <td
                                className={styles[`release-state-${row.releaseStatus}`]}
                            >
                                {row.releaseStatusLabel}
                            </td>
                            <td>{row.initialReleaseDate}</td>
                            <td>{row.generalSupportEnds}</td>
                            <td>{row.securitySupportEnds}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </MDXProvider>
    );
}
