const visit = require('unist-util-visit');

/**
 * Get the AST for a link pointing to the Moodle Tracker for the specified issue number.
 *
 * @param {String} issueNumber
 * @returns {Tree}
 */
const getLinkFromIssueNumber = issueNumber => {
    return {
        type: 'link',
        url: `https://tracker.moodle.org/browse/${issueNumber}`,
        children: [{
            type: 'text',
            value: issueNumber,
        }],
    };
};


const plugin = (options) => {
    const transformer = async (ast) => {
        visit(ast, 'text', (node, index, parent) => {
            updateTextLink(node, index, parent);
            updateInlineLink(node, index, parent);
        });
    };
    return transformer;
};

/**
 * Update a text representation of a tracker issue into a link to that issue.
 *
 * These are in the format:
 *
 *     {tracker MDL-12345}
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 */
const updateTextLink = (node, index, parent) => {
    value = node.value;
    const tokenStart = value.indexOf('{tracker ');
    if (tokenStart === -1) {
        return null;
    }

    const linkStart = tokenStart + '{tracker '.length;
    const linkEnd = value.indexOf('}', linkStart);

    const tokenEnd = linkEnd + 1;
    const issueNumber = value.substring(linkStart, linkEnd);

    const link = getLinkFromIssueNumber(issueNumber);

    parent.children.splice(index, 1, {
        type: 'text',
        value: node.value.substring(0, tokenStart),
    }, link, {
        type: 'text',
        value: node.value.substring(tokenEnd),
    });
};

/**
 * Update an inline representation of a tracker issue into a link to that issue.
 *
 * These are in the format:
 *
 *     {tracker}`MDL-12345`
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 */
const updateInlineLink = (node, index, parent) => {
    const tokenStart = node.value.indexOf('{tracker}');
    if (tokenStart === -1) {
        return null;
    }

    if (parent.children.length < index + 2) {
        return null;
    }

    const followingNode = parent.children[index + 1];
    if (followingNode.type !== 'inlineCode') {
        return null;
    }

    const issueNumber = followingNode.value;
    const link = getLinkFromIssueNumber(issueNumber);

    parent.children.splice(index, 2, {
        type: 'text',
        value: node.value.substring(0, tokenStart),
    }, link);
}

module.exports = plugin;
