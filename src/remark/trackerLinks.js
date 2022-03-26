const visit = require('unist-util-visit');

const plugin = (options) => {
  const transformer = async (ast) => {
    let number = 1;
    visit(ast, 'text', (node, index, parent) => {
      // Search for links which match `{tracker ISSUENUMBER}`.
      const linkStart = node.value.indexOf('{tracker ');
      if (linkStart !== -1) {
        const linkEnd = node.value.indexOf('}', linkStart);
        const issueNumber = node.value.substring(linkStart + '{tracker '.length, linkEnd);
        const link = {
          type: 'link',
          url: `https://tracker.moodle.org/browse/${issueNumber}`,
          children: [{
            type: 'text',
            value: issueNumber,
          }],
        };

        parent.children.splice(index, 1, {
          type: 'text',
          value: node.value.substring(0, linkStart),
        }, link, {
          type: 'text',
          value: node.value.substring(linkEnd + 1),
        });
      }
    });
  };
  return transformer;
};

module.exports = plugin;
