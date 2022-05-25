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
import { getLogger } from '../../../utils.js';

const logger = getLogger();

program
    .name('convert-wikipedia-table')
    .description('Convert a WikiMedia table to Markdown')
    .version('1.0.0');

const getCellsFromLine = (line, mark) => line.split(mark).map((content) => content.trim());

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

        let tableLines = [];
        let inTable = false;
        let tableData = {};
        const replacements = [];

        // See https://www.mediawiki.org/wiki/Help:Tables#Wiki_table_markup_summary for information on the Wikimedia table markup.
        lines.forEach((line, lineIndex) => {
            if (line.indexOf('{|') === 0) {
                inTable = true;
                tableLines = [lineIndex];
                tableData = {
                    caption: null,
                    header: [],
                    currentRow: [],
                    body: [],
                    horizontal: true,
                };
                return;
            }

            if (!inTable) {
                return;
            }

            tableLines.push(lineIndex);

            if (line.indexOf('|}') === 0) {
                inTable = false;
                if (tableData.currentRow.length) {
                    tableData.body.push(tableData.currentRow);
                }
                tableData.currentRow = [];

                // Replace the table content.
                replacements.push({ tableLines, tableData });

                return;
            }

            logger.debug(`Parsing line '${line}'`);

            if (line.indexOf('|+') === 0) {
                tableData.caption = line.replace(/^\|\+ */, '');
                logger.verbose(`|+ Table caption: '${tableData.caption}'`);
            } else if (line.indexOf('|-') === 0) {
                logger.verbose('|- Encountered new row syntax');
                if (tableData.currentRow.length) {
                    tableData.body.push(tableData.currentRow);
                }
                tableData.currentRow = [];
            } else if (line.indexOf('!') === 0) {
                const lineData = line.replace(/^! */, '');
                const cellData = getCellsFromLine(lineData, '!!');
                cellData.forEach((cell) => logger.verbose(`  > Found a header cell: '${cell}'`));
                tableData.header.push(...cellData);
                if (tableData.body.length) {
                    tableData.horizontal = false;
                }
            } else if (line.indexOf('|') === 0) {
                const lineData = line.replace(/^\| */, '');
                const cellData = getCellsFromLine(lineData, '||');
                cellData.forEach((cell) => logger.verbose(`  > Found a row cell: '${cell}'`));
                tableData.currentRow.push(...cellData);
            } else {
                // This cell has newlines.
                logger.verbose('    > This cell has newline content. Replace newlines with <br />');
                tableData.currentRow[tableData.currentRow] += `<br/> ${line}`;
            }
        });

        console.log(tableData);

        // Process in reverse to make line ordering easier.
        replacements.reverse().forEach(({ tableLines: linesToReplace, tableData: thisTableData }) => {
            const newLines = [''];
            if (thisTableData.header.length && thisTableData.horizontal) {
                newLines.push(`| ${thisTableData.header.join(' | ')} |`);
                newLines.push(`${'| --- '.repeat(thisTableData.header.length)}|`);
                thisTableData.body.forEach((row) => {
                    newLines.push(`| ${row.join(' | ')} |`);
                });
                newLines.push('');
            } else {
                // GitHub Formatted Markdown does not support tables without a header.
                newLines.push('<!--');
                newLines.push('  Github Flavoured Markdown does not support tables without headers.');
                newLines.push('  We must use an HTML table here.');
                newLines.push('  Please note that Spacing in this table is important.');
                newLines.push('  Markdown must have empty newlines between it and HTML markup.');
                newLines.push('-->');
                newLines.push('<table><tbody>');
                thisTableData.body.forEach((row) => {
                    if (thisTableData.horizontal) {
                        let html = '<tr>';
                        row.forEach((cell) => {
                            html += '<td>';
                            newLines.push(html);
                            html = '';
                            newLines.push('');
                            newLines.push(cell);
                            newLines.push('');
                            html += '</td>';
                        });
                        html += '</tr>';
                        newLines.push(html);
                    } else {
                        let html = '';
                        newLines.push('<tr><th>');
                        newLines.push('');
                        newLines.push(thisTableData.header.shift());
                        newLines.push('');
                        html += '</th>';
                        row.forEach((cell) => {
                            html += '<td>';
                            newLines.push(html);
                            newLines.push('');
                            newLines.push(cell);
                            newLines.push('');
                            html = '</td>';
                        });
                        html += '</tr>';
                        newLines.push(html);
                    }
                });
                newLines.push('</tbody></table>');
            }

            lines.splice(linesToReplace[0], linesToReplace.length, ...newLines);

            logger.verbose(
                `Created table with ${thisTableData.body.length} rows and ${thisTableData.header.length} columns`,
            );
        });

        writeFile(fqdn, lines.join('\n'));
    });

program.parse();
