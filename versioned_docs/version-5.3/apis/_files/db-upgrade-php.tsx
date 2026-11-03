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
import { ComponentFileSummary } from '../../_utils';
import type { Props } from '../../_utils';
import DefaultDescription from './db-upgrade-php.mdx';

const defaultExample = `
function xmldb_certificate_upgrade($oldversion = 0) {
    if ($oldversion < 2012091800) {
        // Add new fields to certificate table.
        $table = new xmldb_table('certificate');
        $field = new xmldb_field('showcode');
        $field->set_attributes(XMLDB_TYPE_INTEGER, '1', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0', 'savecert');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        // Add new fields to certificate_issues table.
        $table = new xmldb_table('certificate_issues');
        $field = new xmldb_field('code');
        $field->set_attributes(XMLDB_TYPE_CHAR, '50', null, null, null, null, 'certificateid');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Certificate savepoint reached.
        upgrade_mod_savepoint(true, 2012091800, 'certificate');
    }

    // Everything has succeeded to here. Return true.
    return true;
}`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        recommended
        defaultDescription={DefaultDescription}
        defaultExample={defaultExample}
        filepath="/db/upgrade.php"
        summary="Upgrade steps"
        examplePurpose="Upgrade steps"
        {...initialProps}
    />
);
