
namespace format_pluginname\output\courseformat\content\section;

use core_courseformat\output\local\content\section\cmitem as cmitem_base;

class cmitem extends cmitem_base {

    /**
     * Returns the output class template path.
     *
     * This method redirects the default template when the section activity item is rendered.
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'format_pluginname/local/content/section/cmitem';
    }
}
