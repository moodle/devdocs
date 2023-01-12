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
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';
import SchoolIcon from '@mui/icons-material/School';
import courseList from '@site/data/academycourses.json';
import { Tooltip } from '@mui/material';

export default function AcademyLink(props) {
    const { courseName } = props;
    if (!courseList.courses[courseName]) {
        throw Error(`Unknown course ${courseName}`);
    }

    const Course = courseList.courses[courseName];

    return (
        <Admonition
            type="info"
            icon={
                <SchoolIcon fontSize="inherit" />
            }
            title="Learn more on Moodle Academy"
        >
            You can learn more about
            {' '}
            <strong>{ props.subject }</strong>
            {' '}
            from the
            {' '}
            <Tooltip
                title={Course.summary}
            >
                <Link
                    to={`${courseList.siteHome}course/view.php?id=${Course.id}`}
                >
                    { Course.name }
                </Link>
            </Tooltip>
            {' '}
            on Moodle Academy.
        </Admonition>
    );
}
