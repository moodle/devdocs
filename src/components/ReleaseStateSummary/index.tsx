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
import type { majorVersionData } from '@site/src/utils/SupportedReleases';
import { getReleaseStatus, getVersion } from '@site/src/utils/SupportedReleases';
import Link from '@docusaurus/Link';
import Admonition from '@theme/Admonition';
import Heading from '@theme/Heading';

export interface ReleaseInfoProps {
    releaseName: string,
}

function supportedRelease({ releaseData }: majorVersionData): JSX.Element {
    const generalEndDate = new Date(releaseData.generalEndDate);
    const securityEndDate = new Date(releaseData.securityEndDate);

    return (
        <>
            <Heading as="h2">Release status</Heading>
            <Admonition type="info" title="Important dates">
                <p>
                    Moodle
                    {' '}
                    {releaseData.name}
                    , which
                    {' '}
                    {releaseData.isLTS && <strong>is an LTS release</strong>}
                    {!releaseData.isLTS && <strong>is not an LTS release</strong>}
                    , was released on
                    {' '}
                    <strong>
                        {releaseData.releaseDate}
                    </strong>
                    .
                </p>
                <p>
                    General support
                    {' '}
                    {generalEndDate < new Date() && <>ended</>}
                    {generalEndDate >= new Date() && <>will end</>}
                    {' '}
                    on
                    {' '}
                    <strong>
                        {releaseData.generalEndDate}
                    </strong>
                    .
                </p>
                <p>
                    Security support
                    {' '}
                    {securityEndDate < new Date() && <>ended</>}
                    {securityEndDate >= new Date() && <>will end</>}
                    {' '}
                    on
                    {' '}
                    <strong>
                        {releaseData.securityEndDate}
                    </strong>
                    .
                </p>
            </Admonition>
        </>
    );
}

function getAdmonitionType(date): string {
    const today = new Date();
    if (date < today) {
        return 'danger';
    }

    return 'info';
}

function futureRelease({ releaseData }: majorVersionData): JSX.Element {
    const today = new Date();
    const codeFreezeDate = new Date(releaseData.codeFreezeDate);

    return (
        <>
            <Heading as="h2">Release status</Heading>
            <Admonition type={getAdmonitionType(codeFreezeDate)} title="Important dates">
                <p>
                    Moodle
                    {' '}
                    {releaseData.name}
                    , which
                    {' '}
                    {releaseData.isLTS && <strong>will be an LTS release</strong>}
                    {!releaseData.isLTS && <strong>will not be an LTS release</strong>}
                    , is scheduled for release on
                    {' '}
                    <strong>
                        {releaseData.releaseDate}
                    </strong>
                    .
                </p>
                <p>
                    The
                    {' '}
                    <Link to="/general/development/process/integration#during-continuous-integrationfreezeqa-period">
                        code freeze
                    </Link>
                    {' '}
                    {codeFreezeDate < today && <strong>started</strong>}
                    {codeFreezeDate >= today && <strong>will start</strong>}
                    {' '}
                    on
                    {' '}
                    <strong>
                        {releaseData.codeFreezeDate}
                    </strong>
                    .
                </p>
                <p>
                    General support will end on
                    {' '}
                    <strong>
                        {releaseData.generalEndDate}
                    </strong>
                    .
                </p>
                <p>
                    Security support will end on
                    {' '}
                    <strong>
                        {releaseData.securityEndDate}
                    </strong>
                    .
                </p>
            </Admonition>
        </>
    );
}

export default function ReleaseStateSummary({ releaseName }: ReleaseInfoProps): JSX.Element {
    const releaseData = getVersion(releaseName);
    const status = getReleaseStatus(releaseData);

    if (status === 'future') {
        return futureRelease({ releaseData });
    }

    if (status === 'current' || status === 'security') {
        return supportedRelease({ releaseData });
    }

    return (
        <>
        </>
    );
}
