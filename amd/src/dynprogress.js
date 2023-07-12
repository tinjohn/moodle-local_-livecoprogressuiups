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
 * Dynamic Progressbar and more
 *
 * @module     local_livecoprogressuiups/dynprogress
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @copyright  Institut fuer interaktive Systeme der TH Lübeck
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { init as listener } from './listener';

import { get_theme_learnr_Progressbar_InnerHTML } from './local/dynprogress/repository';
import { get_block_Game_InnerHTML } from './local/dynprogress/repository';
import { get_H5P_ActivityInformation_InnerHTML } from './local/dynprogress/repository';

import selectors from 'local_livecoprogressuiups/local/dynprogress/selectors';

/**
 * Gets the course id from body tag.
 *
 * @returns courseid or false.
 */
function getCourseIdFromBody() {
    window.console.log("getCourseIdFromBody-- Coursenumber------", courseid);
    const bodyTag = document.getElementsByTagName('body')[0];
    const attributeNames = bodyTag.getAttributeNames();
    var courseid;
    attributeNames.forEach(attribute => {
        const attributeValue = bodyTag.getAttribute(attribute);
        const regex = /course-(\d+)/;
        const matches = attributeValue.match(regex);
        if (matches) {
            const courseNumber = matches[0];
            courseid = courseNumber.split('-')[1];
            window.console.log("lcprogessuiups-- Coursenumber------", courseid);
            return (courseid);
        }
    });
    if (courseid) {
        return (courseid);
    } else {
        return false;
    }
}

/**
 * Replaces the whole DOM element looked for by the given selectorclass starting from DOMs 'element'.
 * It is not as smooth as just changing a parameter in DOM elements like the width of a progressbar,
 * but the DOM element is correct and overall up-to-date.
 *
 * @param {*} selectorclass
 * @param {*} element by default document
 */
function replaceDOM(selectorclass, element = document) {
    window.console.log("in replaceDOM", selectorclass);
    return async function onResolve(innerHTML) {
        const elementToReplace = element.getElementsByClassName(selectorclass)[0];
        if (elementToReplace) {
            window.console.log("---replaceDOM--", selectorclass);
            const newElement = document.createElement('div');
            newElement.innerHTML = innerHTML;
            const parentElement = elementToReplace.parentNode;
            parentElement.replaceChild(newElement, elementToReplace);
        }
    };
}

/**
* Modifies the whole DOM elements innerHTML looked for by the given selectorq
* and the element to start from.
*
* @param {*} selectorq
* @param {*} element
*/
function modifyDOM(selectorq, element = document) {
    return async function onResolve(innerHTML) {
        window.console.log("---modifyDOM--", selectorq);
        var selelement = element.querySelector(selectorq);
        selelement.innerHTML = innerHTML;
    };
}


/**
 * Takes a function that returns a string, that must contain an innerHTML attribute,
 * that contains a string of an innerHTML.
 * The function is async called due to the fact that the function might be a webservice.
 *
 * @param {*} getinnerhtmlfunc
 * @param {*} course_id
 * @param {*} options
 * @returns innerHTML string
 */
async function get_InnerHTML(getinnerhtmlfunc, course_id, options = {}) {
    window.console.log("get_InnerHTML", getinnerhtmlfunc);
    try {
        let response;
        if (options.cmid) {
            response = await getinnerhtmlfunc(course_id, options.cmid);
        } else {
            response = await getinnerhtmlfunc(course_id);
        }
        window.console.log("get_InnerHTML", response);
        if (response && response.innerHTML) {
            return response.innerHTML;
        } else {
            throw response;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Puts an error message to console.
 * @param {*} err
 */
function onError(err) {
    window.console.log("--ERROR: ", err);
}

/**
 * Gets the innerHTML from the given (service) function (servicefunc).
 * Replaces the DOM element based on the selector given.
 * @param {*} course_id
 * @param {*} servicefunc
 * @param {*} selector
 */
export const letthemagicbedone = async (course_id, servicefunc, selector) => {
    try {
        const innerHTML = await get_InnerHTML(servicefunc, course_id);
        window.console.log("letthemagicbedone:", innerHTML );
        await replaceDOM(selector)(innerHTML);
    } catch (error) {
        onError(error);
    }
};

/**
 * Function extracts cmid from the given DOM elements that holds the information.
 *
 * @param {*} liidelement
 * @returns
 */
const getCmid = (liidelement) => {
    var courseid;
    const attributeValue = liidelement.getAttribute('id');
    const regex = /module-(\d+)/;
    const matches = attributeValue.match(regex);
    if (matches) {
        const courseNumber = matches[0];
        courseid = courseNumber.split('-')[1];
        // window.console.log("lcprogessuiups-- cmid------", courseid); // Output: module-341
        return (courseid);
    }
};

/**
 * The way with more effort for h5p activity information.
 * Analyses the event inforamtion.
 * Gets the innerHTML from the given service function (get_H5P_ActivityInformation_InnerHTML).
 * Modfies the the DOM based on the neareast list element
 * and looks for the selector selectors.activityinfo.body within the list element.
 *
 * @param {*} course_id
 * @param {*} event
 */
const modify_Activityinformation = async (course_id, event) => {
   // window.console.log('lcprogessuiups----themagic_Activityinformation--event', event);
    if (event && event.detail) {
        if (event.detail.completionType && event.detail.completionType == 'H5Pscored') {
            if (event.detail.framedin) {
                const eventtarget = event.detail.framedin;
                // window.console.log('lcprogessuiups-- eventtarget', eventtarget);
                var element = eventtarget.closest('li > div');
                const cmid = getCmid(eventtarget.closest('li'));
                try {
                    const innerHTML = await get_InnerHTML(get_H5P_ActivityInformation_InnerHTML, course_id, { cmid: cmid });
                    await modifyDOM(selectors.activityinfo.qselector, element)(innerHTML);
                } catch (error) {
                    onError(error);
                }
            } else {
                // window.console.log("lcprogessuiups-- no DOM for ActivityInformation in event");
            }
        } else {
            // window.console.log("lcprogessuiups-- no H5Pscored completionType in event");
        }
    }
    return true;
};


/*
* This is the real dynprogress that calls all available UI updates.
*/
export const init = () => {
    const prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    const course_id = getCourseIdFromBody();
    if (prbar && course_id) {
        // Add listener that dispatch cmcompleted events.
        // window.console.log('lcprogessuiups-- livecoprogressuiups----load listener');
        listener();
    } else {
        // window.console.log('lcprogessuiups-- livecoprogressuiups----no listeners loaded due to missing prbar');
    }

    window.addEventListener('load', function () {
        // Add an event listener to handle the cmcompleted - send from the local_livecoprogressuiups/listener.
        document.addEventListener('cmcompleted', function (event) {
            // window.console.log('lcprogessuiups-- cmcompleted----Custom event triggered:', event.detail.message);
            // Implement wait 300 ms to give some time to the core events dealing with the completion.
            setTimeout(function () {
                // The theme_learnr_progressbar.
                letthemagicbedone(course_id, get_theme_learnr_Progressbar_InnerHTML, selectors.progressbar.class);
                // The H5P completion section. Needs some more arguments to do the magic.
                modify_Activityinformation(course_id, event);
                // The block_game.
                letthemagicbedone(course_id, get_block_Game_InnerHTML, selectors.game.class);
            }, 300);
        });
    });
};