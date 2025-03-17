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

const defaultExample = `Y.namespace('M.atto_media').Button = Y.Base.create(
    'button',
    Y.M.editor_atto.EditorPlugin,
    [],
    {
        initializer: function() {
            this.addButton({
                callback: this._toggleMedia,
                icon: 'e/media',
                inlineFormat: true,

                // Key code for the keyboard shortcut which triggers this button:
                keys: '66',

                // Watch the following tags and add/remove highlighting as appropriate:
                tags: 'media'
            });
        },

        _toggleMedia: function() {
            // Handle the button click here.
            // You can fetch any passed in parameters here as follows:
            var langs = this.get('langs');
        }
    }, {
        ATTRS: {
            // If any parameters were defined in the 'params_for_js' function,
            // they should be defined here for proper access.
            langs: {
                value: ['Default', 'Value']
            }
        }
    }
);
`;
import ButtonDescription from './button.md';

export default (initialProps: Props): ComponentFileSummary => (
    <ComponentFileSummary
        // defaultDescription={DefaultDescription}
        defaultExample={defaultExample}
        defaultDescription={ButtonDescription}
        plugintype="atto"
        filepath="/yui/src/button/js/button.js"
        filetype="js"
        summary="Example Button JavaScript"
        {...initialProps}
    />
);
