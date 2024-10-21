namespace format_pluginname\output;

use core_courseformat\base as format_base;
use core_courseformat\output\section_renderer;
use moodle_page;

/**
* Basic renderer for pluginname format.
*
* @copyright 2022 Someone <someone@somewhere.com>
    * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
    */
    class renderer extends section_renderer {
    // Override any necessary renderer method here.

    /**
    * Generate the section title, wraps it in a link to the section page if page is to be displayed on a separate page.
    *
    * This method is required to enable the inplace section title editor.
    *
    * @param section_info|stdClass $section The course_section entry from DB
    * @param stdClass $course The course entry from DB
    * @return string HTML to output.
    */
    public function section_title($section, $course) {
    return $this->render(format_base::instance($course)->inplace_editable_render_section_name($section));
    }

    /**
    * Generate the section title to be displayed on the section page, without a link.
    *
    * This method is required to enable the inplace section title editor.
    *
    * @param section_info|stdClass $section The course_section entry from DB
    * @param int|stdClass $course The course entry from DB
    * @return string HTML to output.
    */
    public function section_title_without_link($section, $course) {
    return $this->render(format_base::instance($course)->inplace_editable_render_section_name($section, false));
    }
    }
