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
 * JS module for the course homepage.
 *
 * @module      local_dynbarpross
 * @copyright   2021 Jun Pataleta <jun@moodle.com>
 * @copyright   2023 Tina John <tina.john@th-luebeck.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as CourseEvents from 'core_course/events';

/**
 * Whether the event listener has already been registered for this module.
 *
 * @type {boolean}
 */
let registered = false;

/**
 * Function to intialise and register event listeners for this module.
 */
export const init = () => {
    if (registered) {
        return;
    }
    // Listen for toggled manual completion states of activities.
    document.addEventListener(CourseEvents.manualCompletionToggled, () => {
        // Create and trigger the custom event
        var cmcompletedEvent = new CustomEvent('cmcompleted',
            { detail: { message: 'a course module completed or scored' } });
        document.dispatchEvent(cmcompletedEvent);
    });
    registered = true;
};
