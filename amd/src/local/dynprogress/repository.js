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
 * Dynamic Progressbar and more - JS code repository - moodle default
 *
 * @module     local_livecoprogressuiups/repository
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @copyright  Institut fuer interaktive Systeme der TH Lübeck
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { call as fetchMany } from 'core/ajax';

// DO NOT USE FOR AJAX
export const getActivityCompletion = (
    userid,
    courseid,
) => fetchMany([{
    methodname: 'core_completion_get_activities_completion_status',
    args: {
        userid,
        courseid,
    },
}])[0];

export const getProgressPercentage = (
    courseid,
    //    userid,
) => fetchMany([{
    methodname: 'local_livecoprogressuiups_get_progress_percentage',
    args: {
        courseid,
        //        userid,
    },
}])[0];

export const get_theme_learnr_Progressbar_InnerHTML = (
    courseid,
    //    userid,
) => fetchMany([{
    methodname: 'local_livecoprogressuiups_get_progressbar_innerhtml',
    args: {
        courseid,
        //        userid,
    },
}])[0];

export const get_block_Game_InnerHTML = (
    courseid,
    //    userid,
) => fetchMany([{
    methodname: 'local_livecoprogressuiups_get_progressbar_innerhtml_game',
    args: {
        courseid,
        //        userid,
    },
}])[0];

export const get_H5P_ActivityInformation_InnerHTML = (
    courseid,
    cmid,
) => fetchMany([{
    methodname: 'local_livecoprogressuiups_get_activity_information_innerhtml',
    args: {
        courseid,
        cmid,
    },
}])[0];
