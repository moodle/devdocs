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

import React, { useMemo } from 'react';
import styles from './styles.module.css';
import { ValidExample, InvalidExample } from '@site/src/components';

export default function CodeDiff(props) {
    const titles = useMemo(() => props.titles?.split(', ').map((title) => title.trim()), [props.titles]);

    return (
        <div className={styles['code-diff']}>
            <InvalidExample title={titles?.[0] ?? null}>
                {props.children[0]}
            </InvalidExample>
            <ValidExample title={titles?.[1] ?? null}>
                {props.children[1]}
            </ValidExample>
        </div>
    );
}
