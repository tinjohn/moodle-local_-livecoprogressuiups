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
import { get_customcert_Activity_InnerHTML } from './local/dynprogress/repository';
import { get_format_mooin4_Progressbar_InnerHTML } from './local/dynprogress/repository';
//import toggleManualCompletionState from 'core_course/manual_completion_toggle';

import selectors from 'local_livecoprogressuiups/local/dynprogress/selectors';


/**
 * Gets the course id from body tag.
 *
 * @returns courseid or false.
 */
function getCourseIdFromBody() {
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
    return async function onResolve(innerHTML) {
        const elementToReplace = element.getElementsByClassName(selectorclass)[0];
        if (elementToReplace) {
            // window.console.log("---replaceDOM--", selectorclass);
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
        // window.console.log("---modifyDOM--", selectorq);
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
    try {
        let response;
        if (options.cmid) {
            response = await getinnerhtmlfunc(course_id, options.cmid);
            // window.console.log(response);
        } else {
            response = await getinnerhtmlfunc(course_id);
        }
        if (response && response.innerHTML) {
            return response.innerHTML;
        } else {
            var errMsg = `in Webservice - no response.innerHTML found.`;
            throw errMsg;
        }
    } catch (error) {
        var errMsg = `${error} in Webservice: - servicefunc: ${getinnerhtmlfunc}, 
        error - get_InnerHTML: , coursid: ${course_id} , ${options.cmid}`;
        throw errMsg;
    }
}

/**
 * Puts an error message to console.
 * @param {*} err
 */
function onError(err) {
    window.console.log("--ERROR ", err);
}

/**
 * Gets the innerHTML from the given (service) function (servicefunc).
 * Replaces the DOM element based on the selector given.
 * @param {*} course_id
 * @param {*} servicefunc
 * @param {*} selector
 */
export const letthemagicbedone = async (course_id, servicefunc, selector) => {
    const domthere = document.getElementsByClassName(selector)[0];
    if (!domthere) {
       // window.console.log("modify by magic - DOM not found");
        return true;
    }
    try {
        const innerHTML = await get_InnerHTML(servicefunc, course_id);
        // window.console.log(servicefunc + " " + innerHTML);
        // window.console.log(servicefunc);
        await replaceDOM(selector)(innerHTML);
    } catch (error) {
        const errMsg = `Something went wrong rewriting a DOM Element - servicefunc: ${servicefunc}, error: ${error}`;
        onError(errMsg);
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
        // window.console.log("lcprogessuiups-- cmid------", courseid);
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
                //window.console.log("lcprogessuiups-- no DOM for ActivityInformation in event");
            }
        } else {
            //window.console.log("lcprogessuiups-- no H5Pscored completionType in event");
        }
    }
    return true;
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
const modify_Mooin4Progressbar = async (course_id, event) => {
    if (event && event.detail) {
        if (event.detail.completionType && event.detail.completionType == 'H5Pscored') {
            if (event.detail.framedin) {
                const eventtarget = event.detail.framedin;
                // window.console.log('lcprogessuiups-- eventtarget', eventtarget);
                //var element = eventtarget.closest('li > div');
                const cmid = getCmid(eventtarget.closest('li'));
                try {
                    // get_InnerHTML unglücklicher Name - hole das Ergebnis des Webservices passte besser
                    const innerHTML = await get_InnerHTML(get_format_mooin4_Progressbar_InnerHTML, course_id, { cmid: cmid });
                    // get_format_mooin4_Progressbar_InnerHTML holt jetzt mal nur die percentage

                    const sectionProgress = innerHTML.progress; // Access by key
                    const sectionId = innerHTML.sectionId; // Access by key
                    const warnings = warnings; // Access warnings array

                    // Fixed concatenation of the `barselector` string
                    const barselector = 'mooin4ection' + sectionId; // Use string concatenation correctly
                    const bartextselector = 'mooin4ection-text-' + sectionId; // Use string concatenation correctly

                    // Fixed method to get element by id
                    //const elementTomod = document.querySelectorAll('[id^="mooin4ection"]')[0];
                    const elementTomodbar = document.getElementById(barselector); // Fixed `getElementById`
                    const elementTomodtext = document.getElementById(bartextselector); // Fixed `getElementById`

                    if (elementTomodbar) {
                        elementTomodbar.style.width = sectionProgress + '%';
                        elementTomodtext.innerHTML = sectionProgress + '% ';
                    } else {
                        window.console.log(`Element with id mooin4ection not found.`);
                    }
                    //await modifyDOM(selectors.mooin4progressbar.class, element)(innerHTML);


                    //await replaceDOM(selectors.mooin4progressbar.class)(innerHTML);

                } catch (error) {
                    onError(error);
                }
            } else {
                //window.console.log("lcprogessuiups-- no DOM for ActivityInformation in event");
            }
        } else {
            //window.console.log("lcprogessuiups-- no H5Pscored completionType in event");
        }
    }
    return true;
};


/**
 * Gets cmid.
 * Gets the innerHTML from the given (service) function (servicefunc).
 * Replaces the DOM element based on the selector given.
 * @param {*} course_id
 * @param {*} servicefunc
 * @param {*} selector
 */
const modify_Activity = async (course_id, servicefunc, selector) => {
    const domthere = document.getElementsByClassName(selector)[0];
    if (!domthere) {
        //window.console.log("modify_Activity - DOM not found");
        return true;
    }

    const cmid = getCmid(domthere);
    // window.console.log("CMID: " + cmid + "servicefunc" + servicefunc);
    try {
        const innerHTML = await get_InnerHTML(servicefunc, course_id, { cmid: cmid });
        // window.console.log("modify_Activity" + innerHTML);
        // window.console.log("modify_Activity");
        await replaceDOM(selector)(innerHTML);

    } catch (error) {
        onError(error);
    }
    return true;
};








/**
 * Gets cmid.
 * Gets the innerHTML from the given (service) function (servicefunc).
 * Replaces the DOM element based on the selector given.
 * @param {*} course_id
 * @param {*} servicefunc
 * @param {*} selectorq
 */
const prepareNtrigger_pseudolabel = async (course_id, servicefunc, selectorq) => {
    const domthere = window.document.querySelector(selectorq);
    if (!domthere) {
        //window.console.log("prepareNtrigger_pseudolabel - DOM not found" + selectorq);
        return true;
    }

    const cmid = getCmid(domthere.closest('li'));
    // window.console.log("CMID: " + cmid + "servicefunc" + servicefunc);
    try {
        const innerHTML = await get_InnerHTML(servicefunc, course_id, { cmid: cmid });
        // window.console.log("modify_Activity" + innerHTML);
        // window.console.log("modify_Activity");
        await modifyDOM(selectorq)(innerHTML);

    } catch (error) {
        onError(error);
    }
    trigger_pseudolabel_mancompl(selectors.pseudolabel.qselector);
    return true;
};



const trigger_pseudolabel_mancompl = (selectorq) => {
    // pseudolabel activity
    const domthere = window.document.querySelector(selectorq);
    if (!domthere) {
        window.console.log("pseudolabel_activity - DOM not found" + selectorq);
        return true;
    } else {
        window.console.log("pseudolabel_activity - DOM found");
    }
    const mancomplbutt = domthere.querySelector(selectors.pseudolabelsmancomplbutt.qselector);
    if (!mancomplbutt) {
        window.console.log("pseudolabel_activity - DOM not found" + selectorq);
        return true;
    } else {
        window.console.log("pseudolabel_activity - DOM found" + selectors.pseudolabelsmancomplbutt.qselector);
    }
    //const cmid = getCmid(domthere.closest('li'));
    // window.console.log("CMID: " + cmid + "servicefunc" + servicefunc);
    mancomplbutt.click();
    //toggleManualCompletionState(mancomplbutt);
};


/*
* This is the real dynprogress that calls all available UI updates.
*/
export const init = () => {

    // theme learn_r progressbar
    const prbar1 = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    // format mooin4
    const prbar2 = document.getElementsByClassName('progressbar')[0];
    const course_id = getCourseIdFromBody();
    if ((prbar1 || prbar2) && course_id) {
        // Add listener that dispatch cmcompleted events when a progress bar exists.
        listener();
        window.console.log('local_livecoprogressuiups----load listener');
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
                // For customcert activity.
                modify_Activity(course_id, get_customcert_Activity_InnerHTML, selectors.customcertactivity.class);
                // An available pseudolabel.
                // trigger_pseudolabel_mancompl(selectors.pseudolabel.qselector);
                // For not available pseudolabel.
                prepareNtrigger_pseudolabel(course_id, get_customcert_Activity_InnerHTML, selectors.pseudolabel.qselector);

                // The theme_learnr_progressbar.
                modify_Mooin4Progressbar(course_id, event) ;
            }, 300);
        });
    });
};