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


class local_livecoprogressuiups_external_customcert_activity extends local_livecoprogressuiups_external {

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 2.9
     */
    public static function get_activity_innerhtml_parameters() {
        return new external_function_parameters(
            array(
                'courseid' => new external_value(PARAM_INT, 'Course ID'),
                'cmid' => new external_value(PARAM_INT, 'cm ID'),
               // 'userid'   => new external_value(PARAM_INT, 'User ID'),
            )
        );
    }

    /**
     * Resets the activity via exchange of innerhtml
     *
     * @param int $courseid ID of the Course
     * @return int progress in percentage
     * @throws moodle_exception
     * @since Moodle 4.1
     * @throws moodle_exception
     */
    public static function get_activity_innerhtml($courseid, $cmid) {
        global $CFG, $USER, $PAGE, $COURSE;

        require_once($CFG->libdir . '/completionlib.php');
        require_once($CFG->libdir . '/filelib.php' );


            $warnings = [];
            $arrayparams = array(
                'courseid' => $courseid,
                'cmid' => $cmid,
            );

            $params = self::validate_parameters(self::get_activity_innerhtml_parameters(), $arrayparams);

            $course = get_course($params['courseid']);

            $context = context_course::instance($course->id);
            self::validate_context($context);

            // Make sure we're using a cm_info object.
            $cminfo = get_fast_modinfo($courseid)->get_cm($cmid);
            // Maybe we should use the completion_info class to check for completion initally
            // $complinfo = new completion_info($course);
            // $completionstate = $complinfo->get_core_completion_state($cminfo, $userid);

            $renderer = $PAGE->get_renderer('core', 'course');
            
            // tinjohn 20230923 from base

            // Load the cmlist output from the updated modinfo.
            // $renderer = $this->get_renderer($PAGE);
            // $modinfo = $this->get_modinfo();
            // $coursesections = $modinfo->sections;
            // if (array_key_exists($section->section, $coursesections)) {
            //     foreach ($coursesections[$section->section] as $cmid) {
            //         $cm = $modinfo->get_cm($cmid);
            //         $modules[] = $renderer->course_section_updated_cm_item($this, $section, $cm);
            //     }
            // }
            // in section-rednerer.php
            // public function course_section_updated_cm_item(
            //     course_format $format,
            //     section_info $section,
            //     cm_info $cm,
            //     array $displayoptions = []
            // ) {
            
            // 7 erst mal hardcoded - übernimmt dann $modinfo->get_section_info($cm->sectionnum);
            $sectionnr = 7; 
            $sectioninfo = get_fast_modinfo($courseid)->get_section_info($sectionnr);
             $course_format = course_get_format($courseid);
            // $cmitemhtml = $renderer->course_section_updated_cm_item($course_format, $sectioninfo, $cminfo);

            // from externallib
             list($course, $cm) = get_course_and_cm_from_cmid($cmid);
             $format = course_get_format($course);
             $renderer = $format->get_renderer($PAGE);
            // $cmitemhtml = $renderer->course_section_updated_cm_item($course_format, $sectioninfo, $cminfo);

            $modinfo = $format->get_modinfo();
            $section = $modinfo->get_section_info($cm->sectionnum);
            //$cm = $modinfo->get_cm($id);
            $result = $renderer->course_section_updated_cm_item($format, $section, $cm);


            // $innerhtml = $cmitemhtml;

            //$innerhtml = "<li><div>Service attached</div></li>"; 
            $innerhtml = $result;
            $results = array(
                'innerHTML' => $innerhtml,
                'warnings' => $warnings,
            );
            return $results;
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.9
     */
    public static function get_activity_innerhtml_returns() {
        return new external_single_structure(
            array(
                'innerHTML' =>  new external_value(PARAM_RAW, 'innerHTML for activity used for custom certs'),
                'warnings' => new external_warnings()
            )
        );
    }
}


