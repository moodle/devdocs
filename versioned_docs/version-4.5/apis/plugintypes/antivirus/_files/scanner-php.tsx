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
import { ComponentFileSummary } from '../../../../_utils';
import type { Props } from '../../../../_utils';
import DefaultDescription from './scanner-php.mdx';

const defaultExample = `
namespace antivirus_scanmyfile;

class scanner extends \\core\\antivirus\\scanner {

    public function is_configured() {
        // Note: You will likely want a more specific check.
        // This example just checks whether configuration exists.
        return (bool) $this->get_config('pathtoscanner');
    }

    public function scan_file($file, $filename, $deleteinfected) {
        if (!is_readable($file)) {
            // This should not happen.
            debugging('File is not readable.');
            return;
        }

        // Execute the scan using the fictitious scanmyfile tool.
        // In this case the tool returns:
        // - 0 if no virus is found
        // - 1 if a virus was found
        // - [int] on error
        $return = $this->scan_file_using_scanmyfile_scanner_tool($file);

        if ($return == 0) {
            // Perfect, no problem found, file is clean.
            return;
        } else if ($return == 1) {
            // Infection found.
            if ($deleteinfected) {
                unlink($file);
            }
            throw new \\core\\antivirus\\scanner_exception(
                'virusfounduser',
                '',
                ['filename' => $filename]
            );
        } else {
            // Unknown problem.
            debugging('Error occurred during file scanning.');
            return;
        }
    }

    public function scan_file_using_scanmyfile_scanner_tool($file): int {
        // Scanning routine using antivirus own tool goes here..
        // You should choose a return value appropriate for your tool.
        // These must match the expected values in the scan_file() function.
        // In this example the following are returned:
        // - 0: No virus found
        // - 1: Virus found
        return 0;
    }
}
`;

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        defaultDescription={DefaultDescription}
        defaultExample={defaultExample}
        examplePurpose="Antivirus scanner"
        filepath="/classes/scanner.php"
        summary="Antivirus scanner"
        {...initialProps}
    />
);
