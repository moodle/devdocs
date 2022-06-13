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

module.exports = {
    // The application ID provided by Algolia
    appId: 'NNUY2D5GV2',

    // Public API key: it is safe to commit it
    apiKey: '11b0ce30d623418a6279455023c0faf8',

    indexName: 'moodle',

    // Optional: see doc section below.
    // Contextual search is enabled by default.
    // It ensures that search results are relevant to the current language and version.
    // contextualSearch: true,

    // Optional: Specify domains where the navigation should occur through window.location instead
    // of history.push.
    // Useful when our Algolia config crawls multiple documentation sites and we want to
    // navigate with window.location.href to them.
    // externalUrlRegex: 'external\\.com|domain\\.com',

    // Optional: Algolia search parameters
    // searchParameters: {},

    // Optional: path for search page that enabled by default (`false` to disable it)
    // searchPagePath: 'search',

    // Other Algolia params can go here.
};
