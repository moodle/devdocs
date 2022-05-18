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
import { usePluginData } from '@docusaurus/useGlobalData';

const versionRegex = /(?<majorVersion>\d+\.\d+)(?:\.(?<minorVersion>\d+))?/;
const parseMoodleVersion = (moodleVersion) => {
    const matches = versionRegex.exec(moodleVersion);
    if (matches) {
        return matches.groups;
    }

    return null;
};

function isSupported(versionData) {
    return versionData.now < versionData.generalSupportEnds;
}

function isSecuritySupported(versionData) {
    return versionData.now < versionData.securitySupportEnds;
}

function UnsupportedTitle() {
    return (
        <Translate
            id="version.unsupported.warning.title"
        >
            Unsupported Moodle Version
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
                    description="A heading to indicate that the document is a draft"
                    id="documentation.inProgress.warning"
                >
                    This version of Moodle is no longer supported for general bug fixes.
                </Translate>
            </strong>
            <br />
            <UpgradeLink />
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

function VersionedSupportWarning({ versionData }) {
    if (isSupported(versionData)) {
        // Still in general support.
        return null;
    }

    if (!isSecuritySupported(versionData)) {
        // Not in support at all.
        return (
            <SecuritySupportExpiredWarning versionData={versionData} />
        );
    }

    return (
        <GeneralSupportExpiredWarning versionData={versionData} />
    );
}

function getVersionData(moodleVersionsData, moodleVersion) {
    const version = parseMoodleVersion(moodleVersion);
    if (!version) {
        return null;
    }

    if (!moodleVersionsData.versionMetadata[`${version.majorVersion}`]) {
        return null;
    }

    const thisVersion = moodleVersionsData.versionMetadata[`${version.majorVersion}`];
    const versionData = {
        isLTS: thisVersion.isLTS || false,
        now: new Date(),
        releaseDate: new Date(thisVersion.release),
        generalSupportEnds: new Date(thisVersion.general),
        securitySupportEnds: new Date(thisVersion.security),
    };

    return versionData;
}

export default function VersionInfo({ frontMatter }) {
    const { moodleVersion = null } = frontMatter;
    const moodleVersionsData = usePluginData('moodle-versions');

    if (!moodleVersion) {
        // No version number found.
        return null;
    }

    const versionData = getVersionData(moodleVersionsData, moodleVersion);
    if (!versionData) {
        // No valid version number found.
        return null;
    }

    return (
        <VersionedSupportWarning
            versionData={versionData}
        />
    );
}
