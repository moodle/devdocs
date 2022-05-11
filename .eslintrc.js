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

// This configuration is largely based on the upstream Docusaurus configuration but with our own customisations.

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    root: true,
    ignorePatterns: [
    // Ignore code examples.
        'docs/**/_examples/*',
        'general/**/_examples/*',
        '!.markdownlint',
    ],
    env: {
        browser: true,
        commonjs: true,
        jest: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        allowImportExportEverywhere: true,
    },
    globals: {
        JSX: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        'plugin:jest/recommended',
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'plugin:regexp/recommended',
        'plugin:mdx/recommended',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    reportUnusedDisableDirectives: true,
    plugins: ['react-hooks', 'header', 'jest', '@typescript-eslint', 'regexp'],
    rules: {
        'array-callback-return': WARNING,
        camelcase: WARNING,
        'class-methods-use-this': OFF, // It's a way of allowing private variables.
        curly: [WARNING, 'all'],
        'global-require': WARNING,
        indent: [
            ERROR,
            4,
        ],
        'react/jsx-indent': [
            ERROR,
            4,
        ],
        'react/jsx-indent-props': [
            ERROR,
            4,
        ],
        'lines-between-class-members': OFF,
        'max-classes-per-file': OFF,
        'max-len': [
            WARNING,
            {
                code: 120,
                tabWidth: 4,
                comments: 120,
                ignoreUrls: true,
                ignorePattern: '(eslint-disable|@)',
            },
        ],
        'no-await-in-loop': OFF,
        'no-case-declarations': WARNING,
        'no-console': OFF,
        'no-continue': OFF,
        'no-control-regex': WARNING,
        'no-else-return': [WARNING, { allowElseIf: true }],
        'no-empty': [WARNING, { allowEmptyCatch: true }],
        'no-lonely-if': WARNING,
        'no-nested-ternary': WARNING,
        'no-param-reassign': [WARNING, { props: false }],
        'no-prototype-builtins': WARNING,
        'no-restricted-exports': OFF,
        'no-restricted-properties': [
            ERROR,
            ...[
                // TODO: TS doesn't make Boolean a narrowing function yet,
                // so filter(Boolean) is problematic type-wise
                // ['compact', 'Array#filter(Boolean)'],
                ['concat', 'Array#concat'],
                ['drop', 'Array#slice(n)'],
                ['dropRight', 'Array#slice(0, -n)'],
                ['fill', 'Array#fill'],
                ['filter', 'Array#filter'],
                ['find', 'Array#find'],
                ['findIndex', 'Array#findIndex'],
                ['first', 'foo[0]'],
                ['flatten', 'Array#flat'],
                ['flattenDeep', 'Array#flat(Infinity)'],
                ['flatMap', 'Array#flatMap'],
                ['fromPairs', 'Object.fromEntries'],
                ['head', 'foo[0]'],
                ['indexOf', 'Array#indexOf'],
                ['initial', 'Array#slice(0, -1)'],
                ['join', 'Array#join'],
                // Unfortunately there's no great alternative to _.last yet
                // Candidates: foo.slice(-1)[0]; foo[foo.length - 1]
                // Array#at is ES2022; could replace _.nth as well
                // ['last'],
                ['map', 'Array#map'],
                ['reduce', 'Array#reduce'],
                ['reverse', 'Array#reverse'],
                ['slice', 'Array#slice'],
                ['take', 'Array#slice(0, n)'],
                ['takeRight', 'Array#slice(-n)'],
                ['tail', 'Array#slice(1)'],
            ].map(([property, alternative]) => ({
                object: '_',
                property,
                message: `Use ${alternative} instead.`,
            })),
            ...[
                'readdirSync',
                'readFileSync',
                'statSync',
                'lstatSync',
                'existsSync',
                'pathExistsSync',
                'realpathSync',
                'mkdirSync',
                'mkdirpSync',
                'mkdirsSync',
                'writeFileSync',
                'writeJsonSync',
                'outputFileSync',
                'outputJsonSync',
                'moveSync',
                'copySync',
                'copyFileSync',
                'ensureFileSync',
                'ensureDirSync',
                'ensureLinkSync',
                'ensureSymlinkSync',
                'unlinkSync',
                'removeSync',
                'emptyDirSync',
            ].map((property) => ({
                object: 'fs',
                property,
                message: 'Do not use sync fs methods.',
            })),
        ],
        'no-restricted-syntax': [
            WARNING,
            // Copied from airbnb, removed for...of statement, added export all
            {
                selector: 'ForInStatement',
                message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. '
                + 'Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
            {
                selector: 'ExportAllDeclaration',
                message:
          "Export all doesn't work well if imported in ESM due to how they are transpiled, "
                + 'and they can also lead to unexpected exposure of internal methods.',
            },
            ...['path', 'fs-extra', 'webpack', 'lodash'].map((m) => ({
                selector: 'ImportDeclaration[importKind=value]'
                    + `:has(Literal[value=${m}]) > ImportSpecifier[importKind=value]`,
                message:
          'Default-import this, both for readability and interoperability with ESM',
            })),
        ],
        'no-template-curly-in-string': WARNING,
        'no-unused-expressions': [WARNING, { allowTaggedTemplates: true }],
        'no-useless-escape': WARNING,
        'prefer-destructuring': WARNING,
        'prefer-named-capture-group': WARNING,
        'prefer-template': WARNING,
        yoda: WARNING,

        'header/header': [
            ERROR,
            'block',
            [
                '*',
                ' * Copyright (c) Moodle Pty Ltd.',
                ' *',
                ' * Moodle is free software: you can redistribute it and/or modify',
                ' * it under the terms of the GNU General Public License as published by',
                ' * the Free Software Foundation, either version 3 of the License, or',
                ' * (at your option) any later version.',
                ' *',
                ' * Moodle is distributed in the hope that it will be useful,',
                ' * but WITHOUT ANY WARRANTY; without even the implied warranty of',
                ' * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the',
                ' * GNU General Public License for more details.',
                ' *',
                ' * You should have received a copy of the GNU General Public License',
                ' * along with Moodle.  If not, see <http://www.gnu.org/licenses/>.',
                ' ',
            ],
        ],

        'import/extensions': OFF,
        // Ignore certain webpack aliases because they can't be resolved
        'import/no-unresolved': [
            ERROR,
            {
                ignore: [
                    '^@theme',
                    '^@docusaurus',
                    '^@generated',
                    '^@site',
                    '^@testing-utils',
                ],
            },
        ],
        'import/order': OFF,
        'import/prefer-default-export': OFF,

        'jest/consistent-test-it': WARNING,
        'jest/expect-expect': OFF,
        'jest/no-large-snapshots': [
            WARNING,
            { maxSize: Infinity, inlineMaxSize: 10 },
        ],
        'jest/no-test-return-statement': ERROR,
        'jest/prefer-expect-resolves': WARNING,
        'jest/prefer-lowercase-title': [WARNING, { ignore: ['describe'] }],
        'jest/prefer-spy-on': WARNING,
        'jest/prefer-to-be': WARNING,
        'jest/prefer-to-have-length': WARNING,
        'jest/require-top-level-describe': ERROR,
        'jest/valid-title': [
            ERROR,
            {
                mustNotMatch: {
                    it: [
                        '^should|\\.$',
                        'Titles should not begin with "should" or end with a full-stop',
                    ],
                },
            },
        ],

        'jsx-a11y/click-events-have-key-events': WARNING,
        'jsx-a11y/no-noninteractive-element-interactions': WARNING,
        'jsx-a11y/html-has-lang': OFF,

        'react-hooks/rules-of-hooks': ERROR,
        'react-hooks/exhaustive-deps': ERROR,

        // Sometimes we do need the props as a whole, e.g. when spreading
        'react/destructuring-assignment': OFF,
        'react/function-component-definition': [
            WARNING,
            {
                namedComponents: 'function-declaration',
                unnamedComponents: 'arrow-function',
            },
        ],
        'react/jsx-filename-extension': OFF,
        'react/jsx-key': [ERROR, { checkFragmentShorthand: true }],
        'react/jsx-no-useless-fragment': [ERROR, { allowExpressions: true }],
        'react/jsx-props-no-spreading': OFF,
        'react/no-array-index-key': OFF, // We build a static site, and nearly all components don't change.
        'react/no-unstable-nested-components': [WARNING, { allowAsProps: true }],
        'react/prefer-stateless-function': WARNING,
        'react/prop-types': OFF,
        'react/require-default-props': [ERROR, { ignoreFunctionalComponents: true }],

        '@typescript-eslint/ban-ts-comment': [
            ERROR,
            { 'ts-expect-error': 'allow-with-description' },
        ],
        '@typescript-eslint/consistent-indexed-object-style': [
            WARNING,
            'index-signature',
        ],
        '@typescript-eslint/consistent-type-imports': [
            WARNING,
            { disallowTypeAnnotations: false },
        ],
        '@typescript-eslint/explicit-module-boundary-types': WARNING,
        '@typescript-eslint/method-signature-style': ERROR,
        '@typescript-eslint/no-empty-function': OFF,
        '@typescript-eslint/no-empty-interface': [
            ERROR,
            {
                allowSingleExtends: true,
            },
        ],
        '@typescript-eslint/no-inferrable-types': OFF,
        '@typescript-eslint/no-namespace': [WARNING, { allowDeclarations: true }],
        'no-use-before-define': OFF,
        '@typescript-eslint/no-use-before-define': [
            ERROR,
            { functions: false, classes: false, variables: true },
        ],
        '@typescript-eslint/no-non-null-assertion': OFF,
        'no-redeclare': OFF,
        '@typescript-eslint/no-redeclare': ERROR,
        'no-shadow': OFF,
        '@typescript-eslint/no-shadow': ERROR,
        'no-unused-vars': OFF,
        // We don't provide any escape hatches for this rule. Rest siblings and
        // function placeholder params are always ignored, and any other unused
        // locals must be justified with a disable comment.
        '@typescript-eslint/no-unused-vars': [ERROR, { ignoreRestSiblings: true }],
        '@typescript-eslint/prefer-optional-chain': ERROR,
    },
    overrides: [
        {
            files: ['*.d.ts'],
            rules: {
                'import/no-duplicates': OFF,
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'no-undef': OFF,
                'import/no-import-module-exports': OFF,
            },
        },
        {
            files: ['*.js', '*.mjs', '.cjs'],
            rules: {
                // Make JS code directly runnable in Node.
                '@typescript-eslint/no-var-requires': OFF,
                '@typescript-eslint/explicit-module-boundary-types': OFF,
            },
        },
    ],
};
