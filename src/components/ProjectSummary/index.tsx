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

import React, { type ReactNode, type PropsWithRef } from 'react';
import styles from './styles.module.css';
import { getProject, type ProjectSummaryData } from '@site/src';
import {
    List,
} from '@mui/material';
import Link from '@docusaurus/Link';

export declare type ProjectSummaryProps = {
  projectName: string,
} & PropsWithRef<'ProjectSummary'>;

export default function ProjectSummary(props: ProjectSummaryProps): ReactNode {
    function getStatus({ status }: ProjectSummaryData): ReactNode {
        return (
            <>
                {status}
            </>
        );
    }

    function getOwners({ owners }: ProjectSummaryData): ReactNode {
        if (!owners) {
            return null;
        }

        return (
            <List>
                {owners}
            </List>
        );
    }

    function GetProjectSummary(projectData: ProjectSummaryData): ReactNode {
        return (
            <table className={styles.projecttable}>
                <tbody>
                    <tr>
                        <th>Owners</th>
                        <td>{getOwners(projectData)}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{getStatus(projectData)}</td>
                    </tr>
                    {projectData.discussionLinks?.length > 0
                        && (
                            <tr>
                                <th>Links</th>
                                <td>
                                    {projectData.discussionLinks.map(({ link, title }) => (
                                        <div key={title}>
                                            <Link
                                                to={link}
                                            >
                                                {title}
                                            </Link>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        )}
                    {projectData.issueLinks?.length > 0
                        && (
                            <tr>
                                <th>Issues</th>
                                <td>
                                    {projectData.issueLinks.map(({ link, title }) => (
                                        <div key={title}>
                                            <Link
                                                to={link}
                                            >
                                                {title}
                                            </Link>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
        );
    }

    return GetProjectSummary(getProject(props.projectName));
}
