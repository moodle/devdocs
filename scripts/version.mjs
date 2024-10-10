#!/usr/bin/env node
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

/* eslint-disable import/no-extraneous-dependencies */

import { program } from 'commander';
import { readFile, writeFile } from 'fs/promises';
import inquirer from 'inquirer';

const versionData = JSON.parse(await readFile('./data/versions.json'));

const getMajorVersionFromData = (majorVersion) => versionData.versions.find((version) => version.name === majorVersion);
const getMajorVersionIndexFromData = (majorVersion) => versionData.versions.findIndex(
    (version) => version.name === majorVersion,
);
const getMajorVersionNameFromMinor = (minorVersion) => minorVersion.split('.').slice(0, 2).join('.');
const updateMajorVersionWithData = (majorVersion, data) => {
    const index = getMajorVersionIndexFromData(majorVersion);
    versionData.versions[index] = data;
};
const updateMinorVersionWithData = (majorVersion, minorVersion, data) => {
    const majorVersionData = getMajorVersionFromData(majorVersion);
    const minorVersionIndex = majorVersionData.releases.findIndex((release) => release.name === minorVersion);
    majorVersionData.releases[minorVersionIndex] = data;
    updateMajorVersionWithData(majorVersion, majorVersionData);
};

const persistVersionData = async () => {
    await writeFile('./data/versions.json', JSON.stringify(versionData, null, 4));
};

const getFormatter = (options = {}) => new Intl.DateTimeFormat('en-AU', {
    timezone: 'Australia/Perth',
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    ...options,
});

const getDateParts = (date, options = {}) => {
    const formattedDate = getFormatter(options).formatToParts(date);

    return Object.fromEntries(formattedDate.map(({ type, value }) => [type, value]));
};

const getFormattedDate = (date) => {
    const dateParts = getDateParts(date);

    return `${dateParts.weekday} ${dateParts.day} ${dateParts.month} ${dateParts.year}`;
};

const getReleaseDateFromDate = (date) => {
    const dateParts = getDateParts(date, {
        month: '2-digit',
        day: '2-digit',
    });

    return `${dateParts.year}${dateParts.month}${dateParts.day}00`;
};

const getDateFormattedForVersionFile = (date) => {
    const dateParts = getDateParts(date, {
        month: 'long',
        day: 'numeric',
    });

    return `${dateParts.day} ${dateParts.month} ${dateParts.year}`;
};

const getThreeDigitVersionFromName = (name) => {
    const [major, minor] = name.split('.');

    if (Number(minor) < 10) {
        return `${major}0${minor}`;
    }

    return `${major}${minor}`;
};

const getMajorVersion = async (defaultVersion = null) => {
    const { major } = await inquirer.prompt({
        type: 'input',
        name: 'major',
        message: 'What version do you want to add a release to?',
        default: defaultVersion,
        validate: (input) => (input.match(/^\d+\.\d+$/) ? true : 'Version must be a number'),
    });

    return major;
};

const getReleaseDate = async (defaultDate = null) => (
    await inquirer.prompt({
        type: 'input',
        name: 'releaseDate',
        message: 'What is the expected release date?',
        default: defaultDate,
        validate: (input) => {
            const parsedDate = new Date(input);

            if (Number.isNaN(parsedDate.valueOf())) {
                return 'Invalid date. Dates should be in a valid JS Date format.';
            }

            return true;
        },
        filter: (input) => new Date(input),
    })
).releaseDate;

const getFreezeDate = async (releaseDate) => {
    const { hasFreezeDate } = await inquirer.prompt({
        name: 'hasFreezeDate',
        type: 'confirm',
        message: 'Do you want to set a code freeze date?',
        default: true,
    });

    if (!hasFreezeDate) {
        return null;
    }

    const getSuggestedDate = () => getFormattedDate(new Date(
        new Date(releaseDate)
            .setDate(releaseDate.getDate() - (6 * 7)),
    ));

    const { theDate } = await inquirer.prompt({
        type: 'input',
        name: 'theDate',
        message: 'What is the code freeze date?',
        default: getSuggestedDate(),
        validate: (input) => {
            const parsedDate = new Date(input);

            if (Number.isNaN(parsedDate.valueOf())) {
                return 'Invalid date. Dates should be in a valid JS Date format.';
            }

            if (parsedDate > releaseDate) {
                return 'Code freeze date must be before the release date';
            }

            return true;
        },
        filter: (input) => new Date(input),
    });

    return theDate;
};

const getGeneralSupportDate = async (releaseDate) => {
    const getSuggestedDate = () => {
        const supportLength = 12;
        let calculatedDate;
        calculatedDate = new Date(new Date(releaseDate).setMonth(releaseDate.getMonth() + supportLength));
        calculatedDate = new Date(calculatedDate.setDate(calculatedDate.getDate() - 1));
        return getFormattedDate(calculatedDate);
    };

    const { theDate } = await inquirer.prompt({
        type: 'input',
        name: 'theDate',
        message: 'What is the general support end date?',
        default: getSuggestedDate(),
        validate: (input) => {
            const parsedDate = new Date(input);

            if (Number.isNaN(parsedDate.valueOf())) {
                return 'Invalid date. Dates should be in ISO format.';
            }

            if (parsedDate < releaseDate) {
                return 'General Support must be after the release date';
            }

            return true;
        },
        filter: (input) => new Date(input),
    });

    return theDate;
};

const getSecurityEndDate = async (releaseDate, generalSupportEndDate, isLTS) => {
    const getSuggestedDate = () => {
        const supportLength = isLTS ? 36 : 18;
        let calculatedDate;
        calculatedDate = new Date(new Date(releaseDate).setMonth(releaseDate.getMonth() + supportLength));
        calculatedDate = new Date(calculatedDate.setDate(calculatedDate.getDate() - 1));
        return getFormattedDate(calculatedDate);
    };

    const { theDate } = await inquirer.prompt({
        type: 'input',
        name: 'theDate',
        message: 'What is the security support end date?',
        default: getSuggestedDate(),
        validate: (input) => {
            const parsedDate = new Date(input);

            if (Number.isNaN(parsedDate.valueOf())) {
                return 'Invalid date. Dates should be in ISO format.';
            }

            if (parsedDate < generalSupportEndDate) {
                return 'Security support must must be after the general support end date';
            }

            return true;
        },
        filter: (input) => new Date(input),
    });

    return theDate;
};

const getReleaseVersionForMajor = async (schema, releaseDate) => {
    const { version } = await inquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'What is the release version?',
        default: getReleaseDateFromDate(releaseDate),
        validate: (input) => {
            if (input.match(/^\d{10}$/)) {
                return true;
            }

            return 'Version must be in the format YYYYMMDD00';
        },
    });

    return version;
};

const getNotes = async () => {
    const { addNotes } = await inquirer.prompt({
        type: 'confirm',
        name: 'addNotes',
        message: 'Do you want to add notes?',
        default: false,
    });

    if (!addNotes) {
        return null;
    }

    const { standardNotes } = await inquirer.prompt({
        type: 'expand',
        name: 'standardNotes',
        message: 'Choose a standard note, or write your own',
        choices: [{
            key: 'c',
            name: 'Cancel (do not add any notes)',
            value: null,
        }, {
            key: 's',
            name: 'Unscheduled minor release',
        }, {
            key: 'e',
            name: 'Support has ended',
        }, {
            key: 'n',
            name: 'Custom',
            value: false,
        }],
    });

    if (standardNotes || standardNotes === null) {
        return standardNotes;
    }

    const { notes } = await inquirer.prompt({
        type: 'input',
        name: 'notes',
        message: 'Enter the notes',
    });

    return notes;
};

const addMinorRelease = async (
    confirmAddAnother = false,
    suggestedReleaseDate = null,
    versionList = [],
) => {
    if (confirmAddAnother) {
        const { addMinor } = await inquirer.prompt({
            type: 'confirm',
            name: 'addMinor',
            message: 'Do you want to add another minor release?',
            default: false,
        });
        if (!addMinor) {
            return;
        }
    }

    const majorVersionName = await getMajorVersion(versionList.length ? versionList.pop() : null);
    const thisVersionData = getMajorVersionFromData(majorVersionName);

    if (!thisVersionData) {
        throw new Error(`Major version ${majorVersionName} does not exist`);
    }

    const { releases } = thisVersionData;
    const lastRelease = releases[releases.length - 1];
    const lastReleaseName = lastRelease.name.split('.');
    const nextReleaseName = `${majorVersionName}.${Number(lastReleaseName[2]) + 1}`;
    const nextReleaseVersion = lastRelease.version + 1;

    const releaseDate = await getReleaseDate(suggestedReleaseDate);

    const schema = {
        name: nextReleaseName,
        releaseDate: getDateFormattedForVersionFile(releaseDate),
        version: nextReleaseVersion,
        releaseNoteUrl: false,
    };

    const notes = await getNotes();

    if (notes) {
        schema.notes = notes;
    }

    console.log(`Adding the following schema for ${majorVersionName}`);
    console.log(schema);

    thisVersionData.releases.push(schema);
    updateMajorVersionWithData(majorVersionName, thisVersionData);
    await persistVersionData();

    addMinorRelease(!versionList.length, releaseDate, versionList);
};

const addMajorRelease = async (
    name,
    minors = [],
) => {
    console.log('------------------------------------------------------------------------');
    console.log(`Adding a new major version: ${name}`);
    console.log('------------------------------------------------------------------------');
    console.log('');
    console.log('Notes:');
    console.log('');
    console.log('- All dates must be in the format DD Month YYYY, for example 24 Feb 2025');
    console.log('- Code freeze dates are typically 6 weeks before the release date.');
    console.log('- Regular releases have an 18-month support period.');
    console.log('- LTS releases have a 3-year support period.');
    console.log('');
    console.log('All end dates are on the release date of that major release.');
    console.log('------------------------------------------------------------------------');
    console.log('');
    if (!name.match(/^\d+\.\d+$/)) {
        throw new Error('Major versions must be in the format X.Y');
    }

    if (versionData.versions[name]) {
        throw new Error(`Version ${name} already exists`);
    }

    const { isLTS } = await inquirer.prompt({
        type: 'confirm',
        name: 'isLTS',
        message: 'Is this an LTS release?',
        default: false,
    });

    const releaseDate = await getReleaseDate();
    const codeFreezeDate = await getFreezeDate(releaseDate);
    const generalSupportEndDate = await getGeneralSupportDate(releaseDate);
    const securityEndDate = await getSecurityEndDate(releaseDate, generalSupportEndDate, isLTS);

    const schema = {
        name,
        releaseDate: getDateFormattedForVersionFile(releaseDate),
        generalEndDate: getDateFormattedForVersionFile(generalSupportEndDate),
        securityEndDate: getDateFormattedForVersionFile(securityEndDate),
        isLTS,
    };

    if (codeFreezeDate) {
        schema.codeFreezeDate = getDateFormattedForVersionFile(codeFreezeDate);
    }

    const releaseVersion = await getReleaseVersionForMajor(schema, releaseDate);

    const threeDigitVersion = getThreeDigitVersionFromName(name);
    schema.releases = [{
        name: `${name}.0`,
        releaseDate: schema.releaseDate,
        version: Number(releaseVersion),
        upgradePath: `https://docs.moodle.org/${threeDigitVersion}/en/Upgrading`,
        releaseNoteUrl: false,
    }];

    versionData.versions.unshift(schema);

    console.log(`Adding the following schema for ${name}`);
    console.log(schema);
    await persistVersionData();
    addMinorRelease(!minors.length, releaseDate, minors);
};

const releaseVersions = (versions) => {
    for (const version of versions) {
        const majorVersionName = getMajorVersionNameFromMinor(version);
        const majorVersion = getMajorVersionFromData(majorVersionName);

        if (!majorVersion) {
            throw new Error(`Version ${version} does not exist`);
        }

        const minorVersionIndex = majorVersion.releases.findIndex((release) => release.name === version);
        if (minorVersionIndex === -1) {
            throw new Error(`Version ${version} does not exist`);
        }

        const minorVersionData = majorVersion.releases[minorVersionIndex];
        delete minorVersionData.releaseNoteUrl;
        updateMinorVersionWithData(majorVersionName, version, minorVersionData);
    }

    persistVersionData();
};

program
    .name('Version Manager')
    .description('CLI tooling to help manage version data for Moodle releases');

program
    .command('major <name> [majors...]')
    .description(
        'Generate a new major version, and optionally a list of other major releases with upcoming minor releases',
    )
    .action(addMajorRelease);

program
    .command('minors [majors...]')
    .description('Generate new minor release versions for the supplied list of major releases')
    .action((majors) => addMinorRelease(false, null, majors));

program
    .command('release <versions...>')
    .description('Mark the supplied minor releases as released by removing the releaseNoteUrl:false property')
    .action(releaseVersions);

program.parse();
