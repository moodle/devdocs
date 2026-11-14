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
import type { Project as ProjectSchema } from '@site/schema/projects.d.ts';

export declare interface Link {
    title: string,
    link: string,
}

declare interface IssueLinks extends Array<Link> {}

export declare interface ProjectSummaryData {
    projectName: string,
    title: string,
    owners: Array<PersonProps>,
    status: string,
    issueLinks?: IssueLinks,
    discussionLinks?: Array<Link>,
}

export const getProject = (
    projectName: string|string[],
    projectData: { [key: string]: ProjectSchema } = ProjectData.projects,
): ProjectSummaryData => {
    if (!projectData) {
        projectData = ProjectData.projects;
    }

    if (Array.isArray(projectName)) {
        if (projectName.length > 1) {
            if (!projectData[projectName[0]]) {
                throw new Error(`Unknown project ${projectName[0]}`);
            }

            const thisProject = projectData[projectName[0]];
            return getProject(projectName.slice(1), thisProject.children);
        }
        projectName = projectName[0];
    }

    if (!projectData[projectName]) {
        throw new Error(`Unknown project ${projectName}`);
    }

    const project = projectData[projectName];

    return {
        projectName,
        title: project.title,
        owners: project.owners.map((owner: PersonProps) => Person(owner)),
        status: project.status,
        issueLinks: project.issueLinks,
        discussionLinks: project.discussionLinks,
    };
};
