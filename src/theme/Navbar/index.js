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
import {
    useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import Navbar from '@theme-original/Navbar';
import styles from './index.module.css';

export default function NavbarWrapper(props) {
    const openMenu = (element) => {
        if (document.getElementById(element).style.display !== 'block') {
            document.getElementById(element).style.display = 'block';
        } else {
            document.getElementById(element).style.display = 'none';
        }
    };

    const openSitesMenu = () => {
        document.getElementById('sites-nav').style.display = 'block';
        document.getElementById('navbar_nav').style.display = 'none';
    };

    const closeSitesMenu = () => {
        document.getElementById('sites-nav').style.display = 'none';
        document.getElementById('navbar_nav').style.display = 'block';
    };

    const mobileSidebar = useNavbarMobileSidebar();

    if (mobileSidebar.shouldRender) {
        return (
            <Navbar {...props} />
        );
    }

    return (
        <>
            <nav className={styles.moodlesitestopnavbar}>

                <button
                    className={styles.mobile_menu}
                    type="button"
                    onClick={() => openMenu('navbar_wrapper')}
                    aria-label="Toggle navigation"
                >
                    <span className={styles.fa_waffle_mobile} />
                </button>
                <a href="https://moodle.org" className="navbar-brand position-lg-fixed d-none d-lg-flex align-items-center m-0 p-0 aabtn">
                    <img src="https://moodle.org/theme/moodleorg/pix/moodle_logo_TM.svg" className={styles.nav_logo} height="32px" alt="Moodle.org" />
                </a>
                <div className={styles.navbar_wrapper} id="navbar_wrapper">
                    <ul className={styles.navbar_nav}>
                        <li>
                            <a className={styles.nav_link} href="https://moodle.org/course"><span>Forums</span></a>
                        </li>
                        <li>
                            <a className={styles.nav_link} href="https://docs.moodle.org"><span>Documentation</span></a>
                        </li>
                        <li>
                            <a className={styles.nav_link} href="https://download.moodle.org"><span>Downloads</span></a>
                        </li>
                        <li>
                            <a className={styles.nav_link} href="https://moodle.org/demo"><span>Demo</span></a>
                        </li>
                        <li>
                            <a className={styles.nav_link} href="https://tracker.moodle.org"><span>Tracker</span></a>
                        </li>
                        <li>
                            <a className={styles.nav_link} href="https://moodledev.io/"><span>Development</span></a>
                        </li>
                        <li>
                            <a className={styles.nav_link} href="https://lang.moodle.org"><span>Translation</span></a>
                        </li>

                        <div className={styles.extra_links}>

                            <hr height="8px" style={{ margin: '0.5rem' }} />

                            <li>
                                <a className={styles.nav_link} href="https://moodle.org/public/search">
                                    <i className={styles.fa_search} style={{ marginRight: '0.5rem' }} />
                                    Search
                                </a>
                            </li>
                            <li>
                                <button className={styles.nav_link} type="button" onClick={openSitesMenu}>
                                    <i className={styles.fa_waffle} style={{ marginRight: '0.5rem' }} />
                                    Moodle Sites
                                    <i className={styles.fa_arrow_r} style={{ marginLeft: '1rem' }} />
                                </button>
                            </li>

                        </div>

                        <li className={styles.search}>
                            <a
                                className={styles.nav_link}
                                href="https://moodle.org/public/search"
                                aria-label="Search moodle.org"
                            >
                                <i className={styles.fa_search} />
                            </a>
                        </li>
                        <li className={styles.waffle}>
                            <button
                                className={styles.nav_link}
                                type="button"
                                onClick={() => openMenu('waffle_menu')}
                                aria-label="Toggle sites menu"
                            >
                                <i className={styles.fa_waffle} />
                            </button>
                        </li>

                        <div className={styles.moodle_sites} id="waffle_menu">
                            <div className={styles.pathways}>
                                <div className={styles.heading}>What are you looking for?</div>
                                <hr />
                                <p>
                                    Learn about Moodle&apos;s products, like Moodle LMS or Moodle Workplace,
                                    or find a Moodle Certified Service Provider.
                                    <br />
                                    <br />
                                    <a href="https://moodle.com">
                                        Moodle.com
                                        {' '}
                                        <i className="fa fa-long-arrow-right icon" />
                                    </a>
                                </p>
                                <hr />
                                <p>
                                    Our social network to share and curate open educational resources.
                                    <br />
                                    <br />
                                    <a href="https://moodle.net">
                                        MoodleNet
                                        {' '}
                                        <i className="fa fa-long-arrow-right icon" />
                                    </a>
                                </p>
                                <hr />
                                <p>
                                    Courses and programs to develop your skills
                                    as a Moodle educator, administrator, designer or developer.
                                    <br />
                                    <br />
                                    <a href="https://moodle.academy">
                                        Moodle Academy
                                        {' '}
                                        <i className="fa fa-long-arrow-right icon" />
                                    </a>
                                </p>
                            </div>
                        </div>
                    </ul>

                    <ul className={styles.sites_nav} id="sites-nav">
                        <button
                            className={styles.nav_link}
                            type="button"
                            onClick={closeSitesMenu}
                            aria-label="Close sites menu"
                        >
                            <i className={styles.fa_arrow_left} style={{ marginLeft: '-0.6rem' }} />
                        </button>
                        <div className="pt-2 pathways">
                            <p>
                                <a href="https://moodle.com">Moodle.com</a>
                                <br />
                                Learn about Moodle&apos;s products,
                                like Moodle LMS or Moodle Workplace, or find a Moodle Certified Service Provider.
                                <br />
                            </p>
                            <hr />
                            <p>
                                <a href="https://moodle.net">MoodleNet</a>
                                <br />
                                Our social network to share and curate open educational resources.
                                <br />
                            </p>
                            <hr />
                            <p>
                                <a href="https://moodle.academy">Moodle Academy</a>
                                <br />
                                Courses and programs to develop your skills as a Moodle educator,
                                administrator, designer or developer.
                                <br />
                            </p>
                        </div>
                    </ul>

                </div>

            </nav>

            <Navbar {...props} />

        </>
    );
}
