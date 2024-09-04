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
//require_once('$CFG->libdir/course/format/mooin4/locallib.php');


if (!class_exists('local_livecoprogressuiups_external')) {
    require_once("$CFG->libdir/local/livecoprogressuiups/external.php");
}


class local_livecoprogressuiups_external_format_mooin4_progressbar extends local_livecoprogressuiups_external {

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 2.9
     */
    public static function get_mooin4_progressbar_innerhtml_parameters() {
        return new external_function_parameters(
            array(
                'courseid' => new external_value(PARAM_INT, 'Course ID'),
                'cmid' => new external_value(PARAM_INT, 'cm ID'),
               // 'userid'   => new external_value(PARAM_INT, 'User ID'),
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
    public static function get_mooin4_progressbar_innerhtml($courseid, $cmid) {
        global $CFG, $USER, $PAGE, $COURSE;

//return("<div class=Tina></div>");  
        
        require_once($CFG->dirroot . '/course/format/mooin4/locallib.php');
        require_once($CFG->libdir . '/grouplib.php');

            $warnings = [];
            $arrayparams = array(
                'courseid' => $courseid,
                'cmid' => $cmid,
            );

            $params = self::validate_parameters(self::get_mooin4_progressbar_innerhtml_parameters(), $arrayparams);

            $course = get_course($params['courseid']);

            $context = context_course::instance($course->id);
            self::validate_context($context);

            // es gibt keinen renderer für moiins Section progressbar
            // from externallib
            list($course, $cm) = get_course_and_cm_from_cmid($cmid);
            $format = course_get_format($course);
            $renderer = $format->get_renderer($PAGE);
           // $cmitemhtml = $renderer->course_section_updated_cm_item($course_format, $sectioninfo, $cminfo);

            $modinfo = $format->get_modinfo();
            $section = $modinfo->get_section_info($cm->sectionnum);
            // in mooin4 ist es $thissection = $modinfo->get_section_info(0);

            //$cm = $modinfo->get_cm($id);
//            $result = $renderer->course_section_updated_cm_item($format, $section, $cm);

//            $renderer = new format_mooin4\output\core_renderer($PAGE,$USER->id);
                // // Page layout not set in Web Service, Servoice was called from the Course, 
                // // thus it is save setting it to course. 
                // $PAGE->set_pagelayout('course');

                // $progressBar = $renderer->courseprogressbar();
           
            // aus locallib.php mooin4
            $section_progress = get_section_progress($course->id, $section->id, $USER->id);
            $progressBar =  get_progress_bar($section_progress, 100, $section->id);
                
            $results = array(
                'innerHTML' => array(
                    'progress' => $section_progress,
                    'sectionId' => $section->id
                ),
                'warnings' => $warnings
            );
            return $results;

            //            return json_encode($results);
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.9
     */
    public static function get_mooin4_progressbar_innerhtml_returns() {
        return new external_single_structure(
            array(
                'innerHTML' => new external_single_structure( // Define the structure for the innerHTML field
                    array(
                        'progress' => new external_value(PARAM_INT, 'Progress percentage'),
                        'sectionId' => new external_value(PARAM_INT, 'Section ID'),
                    ),
                    'InnerHTML for mooin progressbar'
                ),
                'warnings' => new external_warnings() // Assuming this is an array of warnings as per Moodle standards
            )
        );
    }
/*     public static function get_mooin4_progressbar_innerhtml_returns() {
        return new external_single_structure(
            array(
                'innerHTML' => new external_value(PARAM_RAW, 'innerHTML for mooin progressbar'),
                'warnings' => new external_warnings()
            )
        );
    }
 */

}


