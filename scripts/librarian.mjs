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

import { program } from 'commander';
import { readFile, writeFile, access } from 'fs/promises';
import { parseXmlString } from 'libxmljs2';
import path from 'path';

const getLibraryData = async () => {
    process.chdir('.moodle');
    const moodleDir = process.cwd();
    const { fetchComponentData } = await import(`${moodleDir}/.grunt/components.js`);

    const exists = async (dir) => {
        try {
            await access(dir);
            return true;
        } catch {
            return false;
        }
    };

    const thirdPartyLibraries = fetchComponentData().pathList
        .map((componentPath) => componentPath.replace(/\\/g, '/'))
        .map((componentPath) => `${componentPath}/thirdpartylibs.xml`)
        .sort();

    const libraryList = [];
    const libraryFields = [
        'location',
        'name',
        'description',
        'version',
        'license',
        'licenseversion',
        'repository',
    ];

    for (const libraryPath of thirdPartyLibraries) {
        if (!await exists(libraryPath)) {
            continue;
        }

        const libraryDir = path.dirname(libraryPath).replace(`${moodleDir}/`, '');
        const libraries = parseXmlString(await readFile(libraryPath));
        for (const library of libraries.get('//libraries').childNodes()) {
            if (library.type() === 'element') {
                const libraryData = {
                    copyrightHolders: [],
                };
                for (const field of libraryFields) {
                    libraryData[field] = library.get(field)?.text();
                }

                libraryData.location = `${libraryDir}/${libraryData.location}`;

                libraryData.customised = !!library.get('customised');
                for (const copyrightHolder of library.get('copyrights')?.childNodes() || []) {
                    if (copyrightHolder.type() !== 'element') {
                        continue;
                    }
                    libraryData.copyrightHolders.push(copyrightHolder.text());
                }

                libraryList.push(libraryData);
            }
        }
    }
    return libraryList.sort((a, b) => a.location.localeCompare(b.location));
};

const generateLibraryJSON = async () => {
    const startDir = process.cwd();
    const outputFile = `${process.cwd()}/data/libraries.json`;
    const libraries = await getLibraryData();
    process.chdir(startDir);

    writeFile(outputFile, JSON.stringify(libraries, null, 4));
};

const renderOutdatedNotice = (isOutdated) => {
    if (!isOutdated) {
        return '';
    }

    return `
:::danger Outdated

This library is not currently used in Moodle

:::
    `;
};

const renderCustomisedNotice = (isCustomised) => {
    if (!isCustomised) {
        return '';
    }

    return ' (with Moodle customisations)';
};

const renderCopyrightHolders = (copyrightHolders) => {
    if (copyrightHolders.length === 0) {
        return '';
    }

    return `- **Copyright holders**:
${copyrightHolders.map((copyrightHolder) => `  - ${copyrightHolder}`).join(`
`)}
`
        .replaceAll(/</g, '')
        .replaceAll(/>/g, '');
};

const renderLibraryUrl = (libraryUrl) => {
    if (libraryUrl.length === 0) {
        return '';
    }

    return `- **URL**: [${libraryUrl}](${libraryUrl})`;
};

const renderLibraryData = (libraryData, isOutdated) => {
    const libraryName = libraryData.name;
    const libraryDescription = libraryData.description || '';
    const libraryLocation = libraryData.location;
    const libraryVersion = libraryData.version || '';
    const libraryLicense = libraryData.license || '';
    const libraryLicenseVersion = libraryData.licenseversion || '';
    const libraryCustomised = libraryData.customised;
    const libraryCopyrightHolders = libraryData.copyrightHolders || [];
    const libraryUrl = libraryData.repository || '';

    return `
### ${libraryName}

${libraryDescription}

${renderOutdatedNotice(isOutdated)}
- **Location**: ${libraryLocation}
- **Version**: ${libraryVersion}${renderCustomisedNotice(libraryCustomised)}
- **License**:  ${libraryLicense} ${libraryLicenseVersion}
${renderLibraryUrl(libraryUrl)}
${renderCopyrightHolders(libraryCopyrightHolders)}
`.replaceAll(/ *$/gm, '');
};

const generateCredits = async () => {
    const generateLibraryContentForFile = async (filePath, isOutdated) => JSON.parse(await readFile(filePath, 'utf-8'))
        .sort((a, b) => a.location.localeCompare(b.location))
        .map((libraryData) => renderLibraryData(libraryData, isOutdated)).join('');

    const formattedLibraries = await generateLibraryContentForFile('data/libraries.json', false);
    const formattedLegacyLibraries = await generateLibraryContentForFile('data/legacy-libraries.json', true);

    const outputFile = 'general/community/credits/thirdpartylibs.md';

    const headerContent = await readFile('src/templates/thirdpartylibs/header.md.tpl', 'utf-8');
    const otherLibrariesList = await readFile('src/templates/thirdpartylibs/other-libraries.md.tpl', 'utf-8');
    const legacyHeaderContent = await readFile('src/templates/thirdpartylibs/outdated-header.md.tpl', 'utf-8');
    const footerContent = await readFile('src/templates/thirdpartylibs/footer.md.tpl', 'utf-8');
    const content = `${headerContent}
${formattedLibraries}
${otherLibrariesList}
${legacyHeaderContent}
${formattedLegacyLibraries}
${footerContent}`.replaceAll(/\n{3,}/g, '\n\n');

    writeFile(outputFile, content);
};

program
    .name('Librarian')
    .description('CLI Utility to handle Third-Party Library processing')
    .version('1.0.0');

program
    .command('fetch')
    .description('Generate a JSON file containing all third-party libraries currently in Moodle')
    .option('--debug')
    .action(generateLibraryJSON);

program
    .command('generate')
    .description('Generate the Third-party libraries Credit page using the generated libraries data')
    .action(generateCredits);

program.parse();
