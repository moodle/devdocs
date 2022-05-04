defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/repository/lib.php');

class repository_pluginname extends repository {
    /**
     * Get file listing.
     *
     * This is a mandatory method for any repository.
     *
     * See repository::get_listing() for details.
     *
     * @param string $encodedpath
     * @param string $page
     * @return array the list of files, including meta infomation
     */
    public function get_listing($encodedpath = '', $page = '') {
        // This methods
        return array('list' => []);
    }

    /**
     * Is this repository used to browse moodle files?
     *
     * @return boolean
     */
    public function has_moodle_files() {
        return true;
    }

    /**
     * Tells how the file can be picked from this repository.
     *
     * @return int
     */
    public function supported_returntypes() {
        return FILE_INTERNAL | FILE_REFERENCE;
    }

    /**
     * Which return type should be selected by default.
     *
     * @return int
     */
    public function default_returntype() {
        return FILE_INTERNAL;
    }


    /**
     * Optional method for searching files in the repository.
     *
     * @param string $search
     * @param int $page
     * @return array the list of found files.
     */
    public function search($search, $page = 0) {
        $ret = [];
        $ret['nologin'] = true;
        // The found files list.
        $ret['list'] = [];
        return $ret;
    }
}
