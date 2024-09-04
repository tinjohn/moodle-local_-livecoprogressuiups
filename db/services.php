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
 * Core external functions and service definitions.
 *
 * The functions and services defined on this file are
 * processed and registered into the Moodle DB after any
 * install or upgrade operation. All plugins support this.
 *
 * For more information, take a look to the documentation available:
 *     - Webservices API: {@link http://docs.moodle.org/dev/Web_services_API}
 *     - External API: {@link http://docs.moodle.org/dev/External_functions_API}
 *     - Upgrade API: {@link http://docs.moodle.org/dev/Upgrade_API}
 *
 * @package    core_webservice
 * @category   webservice
 * @copyright  2023 Tina John
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 // livecoprogressuiups services 
$functions = array(
    'local_livecoprogressuiups_get_progress_percentage' => array(
        'classname' => 'local_livecoprogressuiups_external',
        'methodname' => 'get_progress_percentage',
        'description' => 'Return the progress.',
        'type' => 'read',
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE),
        'ajax' => true,
    ),

    'local_livecoprogressuiups_get_progressbar_innerhtml' => array(
        'classname' => 'local_livecoprogressuiups_external_theme_learnr_progressbar',
        'methodname' => 'get_progressbar_innerhtml',
        'description' => 'Return the progressbar html.',
        'type' => 'read',
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE),
        'ajax' => true,
    ),

    'local_livecoprogressuiups_get_game_innerhtml' => array(
        'classname' => 'local_livecoprogressuiups_external_block_game',
        'methodname' => 'get_game_innerhtml',
        'description' => 'Return the game html.',
        'type' => 'read',
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE),
        'ajax' => true,
    ),

    'local_livecoprogressuiups_get_activity_information_innerhtml' => array(
        'classname' => 'local_livecoprogressuiups_external_h5p_activityinformation',
        'methodname' => 'get_activity_information_innerhtml',
        'description' => 'Return the game html.',
        'type' => 'read',
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE),
        'ajax' => true,
    ),   

    'local_livecoprogressuiups_get_activity_innerhtml' => array(
        'classname' => 'local_livecoprogressuiups_external_customcert_activity',
        'methodname' => 'get_activity_innerhtml',
        'description' => 'Return the activity html.',
        'type' => 'read',
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE),
        'ajax' => true,
    ),    
     
    'local_livecoprogressuiups_get_mooin4_progressbar_innerhtml' => array(
        'classname' => 'local_livecoprogressuiups_external_format_mooin4_progressbar',
        'methodname' => 'get_mooin4_progressbar_innerhtml',
        'description' => 'Return the format mooin4 section progressbar html.',
        'type' => 'read',
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE),
        'ajax' => true,
    ),    

    
);
