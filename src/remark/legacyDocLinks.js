const visit = require('unist-util-visit');

const plugin = (options) => {
    const transformer = async (ast) => {
        visit(ast, 'linkReference', updateLink);
    };
    return transformer;
};

const getLinkFromString = string => {
    let [linkComponent] = string.split('|');

    // Links never have spaces in them.
    linkComponent = linkComponent.replaceAll(' ', '_');

    if (linkComponent.substring(0, 1) === '#') {
        // This is a relative link in the same page.
        // Update it to meet the correct format.
        return linkComponent.toLowerCase().replaceAll('_', '-');
    }

    // Point to a link on the old docs site.
    return `https://docs.moodle.org/dev/${linkComponent}`;
};

const getDescriptionFromString = string => {
    const [linkComponent, description] = string.split('|');
    if (description) {
        // A description was present.
        return description;
    }

    // No description present.
    // We'll guess one based on the link itself.
    const [page, bookmark] = linkComponent.split('#');
    if (bookmark) {
        // There was a bookmark. Just return a tidied version of that.
        return bookmark.replaceAll('_', ' ');
    }

    // No bookmark. Return a tidied version of the page title.
    return page.replaceAll('_', ' ');
};

/**
 * Update a text representation of a link to legacy docs.
 *
 * These are in the format:
 *
 *     [[Link target|Optional description]]
 *
 * @param {Tree} node
 * @param {Number} index
 * @param {Tree} parent
 */
const updateLink = (node, index, parent) => {
    if (parent.children[index - 1]?.type !== 'text') {
        return null;
    }

    if (parent.children[index - 1]?.value.slice(-1) !== '[') {
        return null;
    }

    if (parent.children[index + 1]?.type !== 'text') {
        return null;
    }

    if (parent.children[index + 1]?.value.substr(0, 1) !== ']') {
        return null;
    }

    const linkNode = {
        type: 'link',
        url: getLinkFromString(node.label),
        children: [{
            type: 'text',
            value: getDescriptionFromString(node.label),
        }],
    };

    parent.children[index - 1].value = parent.children[index - 1].value.slice(0, -1);
    parent.children.splice(index, 1, linkNode);
    parent.children[index + 1].value = parent.children[index + 1].value.slice(1);
};

module.exports = plugin;
