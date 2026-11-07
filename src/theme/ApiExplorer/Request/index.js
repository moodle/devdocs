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
import Request from '@theme-original/ApiExplorer/Request';

/**
 * Keep the API reference read-only.
 *
 * The hideSendButton option only hides the submit button. The form of the original Request component still
 * sends the request when it is submitted by any other means, for example by pressing Enter in the only text
 * input of the form, so the submission is cancelled before it reaches that handler.
 *
 * @param {object} props
 * @returns {React.ReactNode}
 */
export default function RequestWrapper(props) {
    const preventSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div style={{ display: 'contents' }} onSubmitCapture={preventSubmit}>
            <Request {...props} />
        </div>
    );
}
