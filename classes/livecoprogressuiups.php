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
 * 
 * @package    local_livecoprogressuiups
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_livecoprogressuiups;

defined('MOODLE_INTERNAL') || die;

class livecoprogressuiups {
    public static function add_js_dynamics () {
        global $PAGE;
        // Think about to put it in livecoprogressuiups::add_js_dynamics or something. 
            $PAGE->requires->js_call_amd('local_livecoprogressuiups/dynprogress', 'init');           
    }
}
