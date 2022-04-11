import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
  {
    link: '/docs/gettingstarted/quickstart',
    title: 'Quick start',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        New to Moodle Development?
        <br />
        Read our quick start to Moodle Development.
      </>
    ),
  },
  {
    link: '/general/development/policies/codingstyle',
    title: 'Coding standards',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
       Learn about our coding standards, styles, and conventions.
      </>
    ),
  },
  {
    link: '/docs/apis',
    title: 'Read our API Guides',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Want to learn more about our APIs?
        <br/>
        Learn about them through our series of deep-dive guides, complete with examples and explanations.
      </>
    ),
  },
  {
    link: '/general/community',
    title: 'Join our community',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Discover our community, and learn about our mission, and our roadmap.
      </>
    ),
  },
];

function Feature({Svg, link, title, description}) {
  return (
    <div className={clsx('col col--4 ') + styles.featuresBox}>
        <div>
          <div className="text--center">
            <Svg className={styles.featureSvg} role="img" />
          </div>
          <div className="text--center padding-horiz--md">
      <Link
          to={link}
          className={styles.featureLink}
        >
            <h3>{title}</h3>
      </Link>
            <p>{description}</p>
          </div>
        </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className="text--center">Moodle Documentation</h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
