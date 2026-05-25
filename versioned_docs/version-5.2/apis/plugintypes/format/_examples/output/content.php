
namespace format_pluginname\output\courseformat;

use core_courseformat\output\local\content as content_base;

class content extends content_base {

    /**
     * Returns the output class template path.
     *
     * This method redirects the default template when the course content is rendered.
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'format_pluginname/local/content';
    }
}
