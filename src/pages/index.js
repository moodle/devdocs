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
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
    return (
        <header className={clsx(styles['header-content'], 'container')}>
            <div className={styles['header-content-inner']}>
                <div className={clsx(styles['header-title'])}>
                    <h1>
                        Developer
                        <br />
                        <em>Resource centre</em>
                    </h1>
                </div>
                <div className={styles['header-right']}>
                    <div className={styles.copy}>
                        <p>
                            Learn how to build, develop,
                            and contribute to the world&apos;s most customisable Learning Management System.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    return (
        <Layout
            title="Welcome to the Moodle Developer Resource site"
            description="The Work-in-progress (not-yet official) source of Developer Resources for Moodle Developers."
        >
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
