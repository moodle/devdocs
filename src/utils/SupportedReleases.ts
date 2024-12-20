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

import VersionData from '@site/data/versions.json';

const Versions = VersionData.versions;
const today = new Date();

export interface versionInfo {
    name: string,
    releaseDate: string,
    version: boolean | number,
    notes?: string,
    releaseNoteUrl?: boolean | string,
    upgradePath?: boolean | string,
}

export interface majorVersionData {
    name: string,
    codeFreezeDate?: string,
    releaseDate: string,
    generalEndDate: string,
    securityEndDate: string,
    extendedSecurityEndDate?: string,
    isLTS: boolean,
    isExperimental: boolean,
    releases?: Array<versionInfo>
}

export const isSupported = (versionData: majorVersionData): boolean => {
    if (versionData.extendedSecurityEndDate) {
        return (new Date(versionData.extendedSecurityEndDate)) > today;
    } else if (versionData.isExperimental) {
        // Do not display experimental releases in the version support info.
        return false;
    }

    return (new Date(versionData.securityEndDate)) > today;
};

export const getReleaseStatus = (versionData: majorVersionData, releaseName: string = null): string => {
    if (releaseName && releaseName.split('.').length > 2) {
        const releaseData = versionData?.releases.find((release) => release.name === releaseName);
        if (!releaseData) {
            // If there is a releaseName for a minor release, but no release data for it,
            // then it has not yet been added and is a future relesae.
            return 'future-stable';
        }

        if ((new Date(releaseData.releaseDate)) > today) {
            return 'future-stable';
        }
    }

    if ((new Date(versionData.releaseDate)) > today) {
        return 'future';
    }

    if ((new Date(versionData.generalEndDate)) > today) {
        return 'current';
    }

    if ((new Date(versionData.securityEndDate)) > today) {
        return 'security';
    }

    if (versionData.extendedSecurityEndDate && (new Date(versionData.extendedSecurityEndDate)) > today) {
        return 'security';
    }

    return 'unsupported';
};

export const getReleaseStatusLabel = (status: string): string => {
    if (status === 'future') {
        return 'Future release';
    }

    if (status === 'current') {
        return 'Current stable';
    }

    if (status === 'security') {
        return 'Current security';
    }

    return 'Not supported';
};

export const getTitle = (majorVersion: string, versionData: majorVersionData): string => {
    if (versionData.isLTS) {
        return `Moodle ${majorVersion} (LTS)`;
    }

    return `Moodle ${majorVersion}`;
};

export const getVersionTitle = (versionName: string, isLTS: boolean = false): string => {
    if (isLTS) {
        return `Moodle ${versionName} (LTS)`;
    }

    return `Moodle ${versionName}`;
};

export const getVersionLabel = (versionName: string, isLTS: boolean = false): string => {
    if (isLTS) {
        return `${versionName} (LTS)`;
    }

    return versionName;
};

export const getAllVersions = (): Array<majorVersionData> => Array(...Versions).map((version) => {
    version.releases = version?.releases?.map((release) => ({
        releaseNoteUrl: null,
        upgradePath: null,
        ...release,
    }));

    return version;
});

export const getSupportedReleases = (): Array<majorVersionData> => (
    getAllVersions().filter((versionData: majorVersionData) => isSupported(versionData))
);

export const getVersion = (versionName: string): majorVersionData => {
    const [major, release] = versionName.split('.');
    const majorVersion = `${major}.${release}`;
    return getAllVersions().find((version) => version.name === majorVersion);
};

export const getRelease = (versionName: string): versionInfo | null => {
    const [major, release] = versionName.split('.');
    const majorVersionName = `${major}.${release}`;
    const majorVersion = getAllVersions().find((version) => version.name === majorVersionName);

    if (!majorVersion) {
        return null;
    }

    return majorVersion.releases.find((versionInfo) => versionInfo.name === versionName);
};
