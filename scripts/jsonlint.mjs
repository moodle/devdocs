#!/usr/bin/env node --experimental-json-modules
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
import path from 'path';
import { readFile } from 'fs/promises';
import { program } from 'commander';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import Ajv from 'ajv/dist/2019.js';
import Draft7Schema from 'ajv/dist/refs/json-schema-draft-07.json' assert {type: 'json'};

program
    .name('jsonlint')
    .description('Check a JSON file for validity against a schema')
    .version('1.0.0');

const getSchemaDefinition = async (schema) => {
    console.log(`Getting schema at ${schema}`);
    try {
        return await $RefParser.dereference(schema);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    return Promise.reject();
};

const getSchema = (filepath, schema) => {
    if (schema.startsWith('http://') || schema.startsWith('https://')) {
        return schema;
    }

    if (schema.startsWith('file://') || schema.startsWith('.')) {
        return path.resolve(path.dirname(filepath), schema);
    }

    return schema;
};

program
    .arguments('<filepath>', 'Path to the file to check')
    .action(async (filename) => {
        const filepath = path.resolve(filename);
        const rawJson = await readFile(filepath, { encoding: 'utf-8' });
        const json = JSON.parse(rawJson);
        if (typeof json.$schema === 'undefined') {
            console.log('Nothing to validate against');
            process.exit(0);
        }

        const schema = await getSchemaDefinition(getSchema(filepath, json.$schema));

        const ajv = new Ajv();
        ajv.addMetaSchema(Draft7Schema);

        const valid = ajv.validate(schema, json);
        if (valid) {
            console.log(`No errors found validating ${filepath} against ${json.$schema}`);
        } else {
            console.log(ajv.errors);
            process.exit(1);
        }
    });

program.parse();
