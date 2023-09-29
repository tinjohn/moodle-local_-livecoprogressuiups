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
 * Module containing the selectors for the forum summary report.
 *
 * @module     local_livecoprogressuiups/selectors
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export default {
    progressbar: {
        class: 'progress courseview',
        qselector: 'div.progress.courseview',
    },
    game: {
        class: 'gameTable',
    },
    activityinfo: {
        qselector: 'div[data-region="activity-information"]',
    },
    customcertactivity: {
        class: 'activity customcert modtype_customcert',
    },
    pseudolabel: {
        qselector: 'div[data-activityname="_________________________________________________ ..."]',
    },
    pseudolabelsmancomplbutt: {
        qselector: 'button[data-action="toggle-manual-completion"][data-toggletype="manual:mark-done"]',
    },
    modtypelabactHerzlich: {
        qselector: 'div[data-activityname="Herzlichen Glückwunsch - du hast den Test bestande..."]',
    },
    modtypelabactFrische: {
        qselector: 'div[data-activityname="Frische Dein Wissen auf!Besuche das folgende Nugge..."]',
    }
};