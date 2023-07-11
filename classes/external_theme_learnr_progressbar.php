<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * local livecoprogressuiups external API
 *
 * @package    local_livecoprogressuiups
 * @category   external
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      Moodle 4.1
 */

defined('MOODLE_INTERNAL') || die;

require_once("$CFG->libdir/externallib.php");
require_once("$CFG->libdir/completionlib.php");

if (!class_exists('local_livecoprogressuiups_external')) {
    require_once("$CFG->libdir/local/livecoprogressuiups/external.php");
}


class local_livecoprogressuiups_external_theme_learnr_progressbar extends local_livecoprogressuiups_external {

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 2.9
     */
    public static function get_progressbar_innerhtml_parameters() {
        return new external_function_parameters(
            array(
                'courseid' => new external_value(PARAM_INT, 'Course ID'),
            )
        );
    }

    /**
     * Get new innerhtml for progressbar of theme_learnr
     *
     * @param int $courseid ID of the Course
     * @return int progress in percentage
     * @throws moodle_exception
     * @since Moodle 4.1
     * @throws moodle_exception
     */
    public static function get_progressbar_innerhtml($courseid) {
        global $CFG, $USER, $PAGE, $COURSE;

        
            require_once($CFG->libdir . '/grouplib.php');

            $warnings = [];
            $arrayparams = array(
                'courseid' => $courseid,
                //'userid'   => $userid,
            );

            $params = self::validate_parameters(self::get_progress_percentage_parameters(), $arrayparams);

            $course = get_course($params['courseid']);

            $context = context_course::instance($course->id);
            self::validate_context($context);

            // needs to be an option
            $renderer = new theme_learnr\output\core_renderer($PAGE,$USER->id);
            $progressBar = $renderer->courseprogressbar();
                
            $results = array(
                'innerHTML' => $progressBar,
                'warnings' => $warnings
            );
            return $results;
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.9
     */
    public static function get_progressbar_innerhtml_returns() {
        return new external_single_structure(
            array(
                'innerHTML' =>  new external_value(PARAM_RAW, 'innerHTML for progressbar'),
                'warnings' => new external_warnings()
            )
        );
    }

}


