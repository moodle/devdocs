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

import React, { type ReactNode, type ComponentProps } from 'react';
import Link from '@docusaurus/Link';
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';

export declare type PersonProps = {
    name: string;
    githubUsername?: string;
} & ComponentProps<'details'>;

function getLink(person: PersonProps): ReactNode {
    if (person.githubUsername) {
        return (
            <ListItem
                alignItems="flex-start"
                key={person.key}
            >
                <ListItemAvatar>
                    <Avatar
                        src={`https://avatars.githubusercontent.com/${person.githubUsername}`}
                    />
                </ListItemAvatar>
                <Link
                    to={`https://github.com/${person.githubUsername}`}
                >
                    <ListItemText
                        primary={person.name}
                        secondary={person.githubUsername}
                    />
                </Link>
            </ListItem>
        );
    }

    return (
        <>
            {person.name}
        </>
    );
}

export default function Person(person: PersonProps): ReactNode {
    return (
        <div key={`Person:${person.name}`}>
            {getLink(person)}
        </div>
    );
}
