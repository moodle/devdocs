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
// https://github.com/DavidAnson/markdownlint-cli2#markdownlint-cli2cjs

const config = require('../../.markdownlint-cli2.cjs');

// Disable all rules by default.
// Note: Cannot use the `default: false` option here because the default config in the root directory overrides this.
Object.keys(config.config).forEach((key) => {
    config.config[key] = false;
});

// Create an empty list of custom rules.
config.customRules = [];

// Apply the fix by default;
config.fix = true;

const getMigrationConfig = async (rulesToAdd = [], ruleConfigs = []) => {
    const ruleNames = [];
    await rulesToAdd.forEach(async (rulePath) => {
        const rule = await require(rulePath);
        config.customRules.push(rulePath);
        ruleNames.push(rule.names[0]);
    });

    ruleNames.forEach((ruleName, index) => {
        if (ruleConfigs[index]) {
            config.config[ruleName] = ruleConfigs[index];
        } else {
            config.config[ruleName] = true;
        }
    });

    return config;
};

module.exports = {
    config,
    getMigrationConfig,
};
