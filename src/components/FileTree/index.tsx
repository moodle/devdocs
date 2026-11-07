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
import CodeBlock from '@theme/CodeBlock';

function parseObjectTree(tree: DirectoryStructure, prefix = ''): string {
    const keys = Object.keys(tree);
    let result = '';

    keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');

        const value = tree[key];

        let comment = '';
        let children: DirectoryStructure | undefined;

        // Determine the format at runtime
        if (value !== null && typeof value === 'object') {
            if ('_comment' in value || '_children' in value) {
                // It's using the expanded object format
                const expanded = value as ExpandedItem;
                comment = expanded._comment ? ` # ${expanded._comment}` : ''; // eslint-disable-line no-underscore-dangle
                children = expanded._children; // eslint-disable-line no-underscore-dangle
            } else {
                // It's using the simple nested directory format
                children = value as DirectoryStructure;
            }
        } else if (typeof value === 'string') {
            // Inline shorthand string comment support: "filename": "comment string"
            comment = ` # ${value}`;
        }

        // 1. Append the node line
        result += `${prefix}${pointer}${key}${comment}\n`;

        // 2. Recurse into children if they exist
        if (children) {
            result += parseObjectTree(children, nextPrefix);
        }
    });

    return result;
}

type FileValue = string | null;

export interface ExpandedItem {
    _comment?: string;
    _children?: DirectoryStructure;
}

// A node can now be a primitive file, a simple nested directory, or an expanded item
export type TreeItem = FileValue | DirectoryStructure | ExpandedItem;

export interface DirectoryStructure {
    [nodeName: string]: TreeItem;
}

export type FileTreeProps = {
    structure: DirectoryStructure;
};

export default function FileTree({ structure }: FileTreeProps): JSX.Element {
    return (
        <CodeBlock>
            {parseObjectTree(structure)}
        </CodeBlock>
    );
}
