
namespace format_pluginname\output\courseformat\content;

use core_courseformat\output\local\content\section as section_base;

class section extends section_base {

    /**
     * Returns the output class template path.
     *
     * This method redirects the default template when the course section is rendered.
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'format_pluginname/local/content/section';
    }
}
