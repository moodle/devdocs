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
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { program } from 'commander';
import { getLogger } from '../utils.js';

const logger = getLogger();

program
    .name('add-translation-header')
    .description('Add a translations header where relevant')
    .version('1.0.0');

program
    .arguments('<filename>', 'Path to the markdown file')
    .option('-v, --verbose', 'Display logs in verbose mode')
    .option('-d, --debug', 'Display logs in debug mode')
    .action(async (filename, options) => {
        if (options.debug || process.env.DEBUG) {
            logger.level = 'debug';
        }

        if (options.verbose || process.env.DEBUG) {
            logger.level = 'verbose';
        }

        const fqdn = path.resolve(filename);
        logger.info(`Parsing ${filename} from ${fqdn}`);
        const fileContent = await readFile(fqdn, { encoding: 'utf-8' });
        const lines = fileContent.split('\n');
        logger.debug(`Parsed ${filename} and found ${lines.length} lines`);

        const isPossibleMatch = /^\[.*\(https:\/\/docs.moodle.org\/(?<language>[^/]*)\/.*$/;
        const excludeLangs = [
            'dev',
            'en',
        ];

        let hasSeenAny = false;
        const newLines = [];
        let firstNonTranslationLine = null;
        lines.reverse().every((line, lineIndex) => {
            if (line.length === 0) {
                return true;
            }
            const matches = isPossibleMatch.exec(line);
            if (!matches || excludeLangs.indexOf(matches.groups.language) !== -1) {
                if (!hasSeenAny) {
                    logger.info('No translation found on final line');
                    process.exit(1);
                } else {
                    firstNonTranslationLine = lines.length - lineIndex;
                    newLines.unshift('');
                    newLines.unshift('## Translations');
                    newLines.unshift('');
                    return false;
                }
            }

            logger.debug(`Identified line as having a translation: ${line}`);
            hasSeenAny = true;
            newLines.unshift(`- ${line}`);
            return true;
        });
        lines.reverse();

        lines.splice(firstNonTranslationLine, lines.length, ...newLines);

        writeFile(fqdn, lines.join('\n'));
    });

program.parse();
