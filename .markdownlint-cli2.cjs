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

// For full details on all of these configuration settings:
// https://github.com/DavidAnson/markdownlint#rules--aliases

const path = require('path');

const config = {};

// Set the default state for all rules.
config.default = true;

// MD001 / heading - increment / header - increment - Heading levels should only increment by one level at a time
// MD002 / first - heading - h1 / first - header - h1 - First heading should be a top - level heading
// MD003 / heading - style / header - style - Heading style

// MD004 / ul - style - Unordered list style
config.MD004 = {
    style: 'dash',
};

// MD005 / list - indent - Inconsistent indentation for list items at the same level
// MD006 / ul - start - left - Consider starting bulleted lists at the beginning of the line

// MD007 / ul - indent - Unordered list indentation
// MD009 / no - trailing - spaces - Trailing spaces
// MD010 / no - hard - tabs - Hard tabs
// MD011 / no - reversed - links - Reversed link syntax
// MD012 / no - multiple - blanks - Multiple consecutive blank lines

// MD013 / line - length - Line length
// Disable for better readability.
config.MD013 = false;

// MD014 / commands - show - output - Dollar signs used before commands without showing output
config.MD014 = false;

// MD018 / no - missing - space - atx - No space after hash on atx style heading
// MD019 / no - multiple - space - atx - Multiple spaces after hash on atx style heading
// MD020 / no - missing - space - closed - atx - No space inside hashes on closed atx style heading
// MD021 / no - multiple - space - closed - atx - Multiple spaces inside hashes on closed atx style heading
// MD022 / blanks - around - headings / blanks - around - headers - Headings should be surrounded by blank lines
// MD023 / heading - start - left / header - start - left - Headings must start at the beginning of the line

// MD024 / no - duplicate - heading / no - duplicate - header - Multiple headings with the same content
config.MD024 = false;

// MD025 / single - title / single - h1 - Multiple top - level headings in the same document

// MD026 / no - trailing - punctuation - Trailing punctuation in heading
config.MD026 = false;

// MD027 / no - multiple - space - blockquote - Multiple spaces after blockquote symbol

// MD028 / no - blanks - blockquote - Blank line inside blockquote
config.MD028 = false;

// MD029 / ol - prefix - Ordered list item prefix
// MD030 / list - marker - space - Spaces after list markers
// MD031 / blanks - around - fences - Fenced code blocks should be surrounded by blank lines
// MD032 / blanks - around - lists - Lists should be surrounded by blank lines

// MD033 / no - inline - html - Inline HTML
config.MD033 = {
    "allowed_elements": [
        "a",
        "abbr",
        "annotation",
        "base",
        "br",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "dd",
        "details",
        "dfn",
        "div",
        "dl",
        "dt",
        "em",
        "figure",
        "figcaption",
        "h4",
        "h5",
        "img",
        "kbd",
        "li",
        "math",
        "menclose",
        "mfenced",
        "mfrac",
        "mfrac",
        "mi",
        "mmultiscripts",
        "mn",
        "mo",
        "mover",
        "mphantom",
        "mprescripts",
        "mroot",
        "mrow",
        "ms",
        "mspace",
        "mspace",
        "msqrt",
        "mstyle",
        "msub",
        "msubsup",
        "msup",
        "mtable",
        "mtd",
        "mtext",
        "mtr",
        "munder",
        "munderover",
        "none",
        "ol",
        "p",
        "pre",
        "q",
        "section",
        "semantics",
        "span",
        "strong",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "tr",
        "tt",
        "ul",
        "var",

        // These are custom React elements, either from Docusaurus, or our own.
        "AcademyLink",
        "CodeBlock",
        "ComponentFileSummary",
        "Tabs",
        "TabItem",
        "TabItems",
        "Since",
        "DeprecatedSince",
        "ValidExample",
        "InvalidExample",
        "ReactPlayer",
        "Link",
        "ProjectSummary",
        "ReleaseNoteIntro",
        "ReleaseDate",
        "ReleaseVersion",
        "VersionPHP",
        "Lib",
        "Lang",
        "DbAccessPHP",
        "SettingsPHP",
        "LocalLib",
        "ReleaseStateSummary",
    ]
};

// MD034 / no - bare - urls - Bare URL used
config.MD034 = false;

// MD035 / hr - style - Horizontal rule style

// MD036 / no - emphasis - as - heading / no - emphasis - as - header - Emphasis used instead of a heading
config.MD036 = false;

// MD037 / no - space -in -emphasis - Spaces inside emphasis markers
config.MD037 = false;

// MD038 / no - space -in -code - Spaces inside code span elements
// MD039 / no - space -in -links - Spaces inside link text

// MD040 / fenced - code - language - Fenced code blocks should have a language specified
config.MD040 = false;

// MD041 / first - line - heading / first - line - h1 - First line in a file should be a top - level heading

// MD042 / no - empty - links - No empty links
config.MD042 = false;

// MD043 / required - headings / required - headers - Required heading structure
// MD044 / proper - names - Proper names should have the correct capitalization

// MD045 / no - alt - text - Images should have alternate text(alt text)
config.MD045 = false;

// MD046 / code - block - style - Code block style
config.MD046 = {
    style: 'fenced',
}

// MD047 / single - trailing - newline - Files should end with a single newline character
// MD048 / code - fence - style - Code fence style

// MD049 / emphasis - style - Emphasis style should be consistent
config.MD049 = false;

// MD050 / strong - style - Strong style should be consistent
config.MD050 = false;

// MDL051 / link-fragments - Links fragments should be valid
// This rule is not compatible with Docusaurus as Docusaurus generates ids not present in the source.
config.MD051 = false;

// MD052 / reference-links-images - Reference links and images should use a label that is defined
// MD053 / link-image-reference-definitions - Link and image reference definitions should be needed

// Moodle casedWords.
// Used to ensure that casing of some words is correct - for example in Trademarks.
config.casedWords = {
    words: {
        // convert all casing of `javascript` to `JavaScript`, for example Javascript, javascript, javaScript.
        javascript: 'JavaScript',

        // convert all casing of `java script` to `JavaScript`.
        'java script': 'JavaScript',
    },
};

config.renamedLinks = {
    forceRelative: [
        'docs',
        'general',
    ],
    // Note: The following is an example of a migrated file.
    // Normally you will not need to commit changes to this file after moving a file as all changes will be made at the
    // time of the move.
    // An exception to this will be made for heavily references files if there are frequent pull requests referencing
    // the page.
    // Note: You may also want to update the redirects in `static/_redirects`.
    renames: [{
        oldFile: '/docs/apis/plugintypes/tinymce/index.md',
        newFile: '/docs/apis/plugintypes/tiny/legacy.md',
    }, {
        oldFile: '/docs/apis/subsystems/output.md',
        newFile: '/docs/apis/subsystems/output/index.md',
    }, {
        oldFile: '/docs/apis/subsystems/tool/index.md',
        newFile: '/docs/apis/subsystems/admin/index.md',
    }],
};

module.exports = {
    config,
    customRules: [
        path.join(__dirname, '.markdownlint/no-directional-quotation-marks'),
        path.join(__dirname, '.markdownlint/fix-migrated-links'),
        path.join(__dirname, '.markdownlint/find-obsolete-links'),
        path.join(__dirname, '.markdownlint/cased-words'),
        path.join(__dirname, '.markdownlint/fix-renamed-links'),
    ]
};
