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
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import NextVersionData from '@site/nextVersion';

/* eslint-disable global-require */

const FeatureList = [
    {
        link: '/general/development/gettingstarted',
        title: 'Getting started',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>
                New to Moodle Development?
                <br />
                Our quick start guide helps you take your first steps.
            </>
        ),
        linkText: 'Get started',
    },
    {
        link: '/general/development/policies/codingstyle',
        title: 'Coding standards',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                Read our style guidelines, including coding standards and naming conventions.
            </>
        ),
        linkText: 'View standards',
    },
    {
        link: `${NextVersionData.nextVersionRoot}/apis`,
        title: 'API guides',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                Learn all about Moodle APIs with our deep-dive guides, complete with examples and explanations.
            </>
        ),
        linkText: 'Read API guides',
    },
    {
        link: '/general/community',
        title: 'Developer community',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                Join the open source community that makes Moodle.
            </>
        ),
        linkText: 'Discover communities',
    },
    {
        link: '/general/releases',
        title: 'Release notes',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                Technical specs and new features of Moodle releases, supported versions and more.
            </>
        ),
        linkText: 'Check the release notes',
    },
    {
        link: '/general/app',
        title: 'Moodle App',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                Interested in app development? Learn how to get started working with the Moodle App.
            </>
        ),
        linkText: 'Learn more',
    },
];

function Feature({
    index, link, title, description, linkText,
}) {
    return (
        <div className={clsx('col col--4 ', styles.card, styles[`card-${index}`])}>
            <div className={styles['card-inner']}>
                <div className={styles['card-content']}>
                    <div className={styles['card-corner']}>
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="50" />
                        </svg>
                    </div>
                    <h2>{title}</h2>
                    <div className={styles['card-description']}>
                        {description}
                    </div>
                    <div className={styles['card-button']}>
                        <Link
                            to={link}
                        >
                            <span>
                                {linkText}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className={clsx('row', styles.cards)}>
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} index={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
