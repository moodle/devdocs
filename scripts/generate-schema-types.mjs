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

import { spawnSync } from 'node:child_process';
import { mkdir, readdir } from 'node:fs/promises';
import {
    dirname, extname, join, relative, resolve,
} from 'node:path';

const schemaDirectory = resolve('static/schema');
const outputDirectory = resolve('src/schema');

const findSchemaFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...await findSchemaFiles(path));
        } else if (entry.isFile() && extname(entry.name) === '.json') {
            files.push(path);
        }
    }

    return files;
};

const schemaFiles = (await findSchemaFiles(schemaDirectory)).sort();

if (schemaFiles.length === 0) {
    throw new Error(`No JSON schemas found in ${schemaDirectory}`);
}

for (const schemaFile of schemaFiles) {
    const outputPath = join(
        outputDirectory,
        relative(schemaDirectory, schemaFile).replace(/\.json$/, '.d.ts'),
    );

    await mkdir(dirname(outputPath), { recursive: true });

    const { error, status } = spawnSync('json2ts', [schemaFile, outputPath], {
        stdio: 'inherit',
    });

    if (error) {
        throw error;
    }

    if (status !== 0) {
        throw new Error(`json2ts failed to generate types for ${schemaFile}`);
    }
}
