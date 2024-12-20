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
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Admonition from '@theme/Admonition';
import { getReleaseStatus, getVersion } from '@site/src/utils/SupportedReleases';

function UnsupportedTitle() {
    return (
        <Translate
            id="version.unsupported.warning.title"
        >
            Unsupported Moodle Version
        </Translate>
    );
}

function UnreleasedTitle() {
    return (
        <Translate
            id="version.unreleased.warning.title"
        >
            Unreleased Moodle Version
        </Translate>
    );
}

function UpgradeLink() {
    return (
        <Translate
            id="documentation.versionWarning.content"
            description={'A banner used to indicate that the current page relates to '
                + 'a version of Moodle no longer in security support'}
            values={{
                upgrade: (
                    <Link to="https://docs.moodle.org/en/Upgrading">
                        <strong>
                            <Translate
                                id="upgrade"
                                description="Link label for upgrading"
                            >
                                upgrade
                            </Translate>
                        </strong>
                    </Link>
                ),
            }}
        >
            {'You are encouraged to {upgrade} to a supported version of Moodle.'}
        </Translate>
    );
}

function GeneralSupportExpiredWarning({ versionData }) {
    return (
        <Admonition
            type="caution"
            icon={
                <AutoFixHighIcon fontSize="inherit" />
            }
            title={
                <UnsupportedTitle versionData={versionData} />
            }
        >
            <strong>
                <Translate
                    description="A heading to indicate that the Moodle version is only in security support"
                    id="documentation.support.securityOnly"
                >
                    This version of Moodle is no longer supported for general bug fixes.
                </Translate>
            </strong>
            <br />
            <UpgradeLink />
        </Admonition>
    );
}

function FutureReleaseWarning({ versionData }) {
    return (
        <Admonition
            type="caution"
            icon={
                <AutoFixHighIcon fontSize="inherit" />
            }
            title={
                <UnreleasedTitle versionData={versionData} />
            }
        >
            <strong>
                <Translate
                    description="A heading to indicate that the document relates to an unreleased Moodle version"
                    id="documentation.support.unreleased"
                >
                    This version of Moodle has not yet been released.
                </Translate>
            </strong>
        </Admonition>
    );
}

function SecuritySupportExpiredWarning({ versionData }) {
    return (
        <Admonition
            type="danger"
            icon={
                <AutoFixHighIcon fontSize="inherit" />
            }
            title={
                <UnsupportedTitle versionData={versionData} />
            }
        >
            <strong>
                <Translate
                    description="A message to indicate that the version indicated is not under security support"
                    id="version.support.securityExpired"
                >
                    This version of Moodle is no longer supported and will not receive fixes for security risks.
                </Translate>
            </strong>
            <br />
            <UpgradeLink />
        </Admonition>
    );
}

function ExperimentalWarning() {
    return (
        <Admonition
            type="danger"
            icon={
                <AutoFixHighIcon fontSize="inherit" />
            }
            title="Experimental release"
        >
            <strong>
                <Translate
                    description="A message to indicate that the version indicated an experimental release"
                    id="version.support.experimental"
                >
                    This version of Moodle is an experimental release and not intended for general production systems.
                </Translate>
            </strong>
        </Admonition>
    );
}

function VersionedSupportWarning({ versionData, moodleVersion }) {
    const releaseStatus = getReleaseStatus(versionData, moodleVersion);

    if (versionData.isExperimental) {
        // Experimental version.
        return (
            <ExperimentalWarning versionData={versionData} />
        );
    }

    if (releaseStatus === 'current') {
        // Still in general support.
        return null;
    }

    if (releaseStatus === 'future' || releaseStatus === 'future-stable') {
        // Not yet supported.
        // TODO Add a warning banner.
        return (
            <FutureReleaseWarning versionData={versionData} />
        );
    }

    if (releaseStatus === 'unsupported') {
        // Not in support at all.
        return (
            <SecuritySupportExpiredWarning versionData={versionData} />
        );
    }

    return (
        <GeneralSupportExpiredWarning versionData={versionData} />
    );
}

export default function VersionInfo({ frontMatter }) {
    const { moodleVersion = null } = frontMatter;

    if (!moodleVersion) {
        // No version number found.
        return null;
    }

    const versionData = getVersion(moodleVersion);
    if (!versionData) {
        // No valid version data found.
        return null;
    }

    return (
        <VersionedSupportWarning
            versionData={versionData}
            moodleVersion={moodleVersion}
        />
    );
}
