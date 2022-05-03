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

import Person, { type PersonProps } from '../Person';
import ProjectData from '@site/data/projects.json';

export declare interface DiscussionLink {
    title: string,
    link: string,
}

export declare interface ProjectSummaryData {
    projectName: string,
    title: string,
    owners: Array<PersonProps>,
    status: string,
    issueNumbers?: Array<string>,
    discussionLinks?: Array<DiscussionLink>,
}

export const getProject = (projectName: string): ProjectSummaryData => {
    if (!ProjectData.projects[projectName]) {
        throw new Error(`Unknown project ${projectName}`);
    }

    const project = ProjectData.projects[projectName];

    function getIssueNumbers(): Array<string> {
        if (typeof project.issueNumbers === 'string') {
            return [project.issueNumbers];
        }

        return project.issueNumbers;
    }

    return {
        projectName,
        title: project.title,
        owners: project.owners.map((owner: PersonProps) => Person(owner)),
        status: project.status,
        issueNumbers: getIssueNumbers(),
        discussionLinks: project.discussionLinks,
    };
};
