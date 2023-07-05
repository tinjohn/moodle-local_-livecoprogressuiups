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
 * @module     local_livecoprogressuiups/dynprbar
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @copyright  Institut fuer interaktive Systeme der TH Lübeck
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {init as listener} from './listener';

import {get_theme_learnr_Progressbar_InnerHTML} from './local/dynprogress/repository';
import {get_block_Game_InnerHTML} from './local/dynprogress/repository';
import {get_H5P_ActivityInformation_InnerHTML} from './local/dynprogress/repository';

import selectors from 'local_livecoprogressuiups/local/dynprogress/selectors';

/**
* USED get course id from body tag.
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
            window.console.log("lcprogessuiups-- Coursenumber------", courseid); // Output: course-64
            return(courseid);
        }
    });
    if(courseid) {
        return(courseid);
    } else {
        return false;
    }
}
/*
* Reloads whole progressbar DOM element - it is not as smooth as just changing width.
* On the other hand - the progress bar is correct and overall up-to-date.
*/
export const changeProgressbar = async() => {
    // ...
    //const prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    //const course_id = prbar.getAttribute('courseid');
    const course_id = getCourseIdFromBody();
    if(course_id) {
        var response = await get_theme_learnr_Progressbar_InnerHTML(course_id);
        if (response && response.innerHTML) {
            window.console.log("lcprogessuiups-- get_theme_learnr_Progressbar_InnerHTML----response", response);
            var innerHTML = response.innerHTML;
            const prcourseview = document.getElementsByClassName(selectors.progressbar.body)[0];
            var elementToReplace = prcourseview;
             // creates additional div but the parent node might have siblings just to be safe
             const newElement = document.createElement('div');
            newElement.innerHTML = innerHTML;
            const parentElement = elementToReplace.parentNode;
            parentElement.replaceChild(newElement, elementToReplace);

        } else {
            window.console.log("lcprogessuiups-- no progressbar update available");
        }
        return true;
    } else {
        window.console.log("lcprogessuiups-- no course id detected");
        return false;
    }
};


/*
* Updates the GAME plugin interface.
*/
export const changeGAME = async() => {
    // ...
    //const prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    //const course_id = prbar.getAttribute('courseid');
    const course_id = getCourseIdFromBody();
    if(course_id) {
        // GAME
        var response = await get_block_Game_InnerHTML(course_id);
         if (response && response.innerHTML) {
            window.console.log("lcprogessuiups-- get_block_Game_InnerHTML----response", response);
             var innerHTML = response.innerHTML;
             const prgame = document.getElementsByClassName(selectors.game.body)[0];
             const elementToReplaceGAME = prgame.parentNode;
             // creates additional div but the parent node might have siblings just to be safe
             const newElementGAME = document.createElement('div');
             newElementGAME.innerHTML = innerHTML;
             const parentElementGAME = elementToReplaceGAME.parentNode;
             parentElementGAME.replaceChild(newElementGAME, elementToReplaceGAME);

         } else {
             window.console.log("lcprogessuiups-- no game update possible");
             window.console.log("lcprogessuiups-- get_block_Game_InnerHTML----response", response);
         }
        return true;
    } else {
        window.console.log("lcprogessuiups-- no course id detected");
        return false;
    }
};

/*
* Function getCmid is called from changeCompletionInfo.
*/
const getCmid = (liidelement) => {
    var courseid;
    const attributeValue = liidelement.getAttribute('id');
    const regex = /module-(\d+)/;
        const matches = attributeValue.match(regex);
        if (matches) {
            const courseNumber = matches[0];
            courseid = courseNumber.split('-')[1];
            window.console.log("lcprogessuiups-- cmid------", courseid); // Output: module-341
            return(courseid);
        }
  };

/*
* Updates the activity completion.
*/
const changeCompletionInfo = async (event) => {
    window.console.log('lcprogessuiups-- --changeCompletionInfo--event',event);
    if (event && event.detail) {
        if(event.detail.completionType && event.detail.completionType == 'H5Pscored') {
            if(event.detail.framedin) {
                const eventtarget = event.detail.framedin;
                window.console.log('lcprogessuiups-- eventtarget',eventtarget);
            // var parentElement = document.querySelector('div[data-region="completion-info"] [id="childElementID"]');
                var element = eventtarget.closest('li > div');
                const cmid = getCmid(eventtarget.closest('li'));
                const course_id = getCourseIdFromBody();
                const response = await get_H5P_ActivityInformation_InnerHTML(course_id, cmid);
                window.console.log("lcprogessuiups-- get_H5P_ActivityInformation_InnerHTML----response", response);
                var element = element.querySelector(selectors.activityinfo.body);
                //var element = element.querySelector('div[data-region="activity-information"]');
                element.innerHTML = response.innerHTML;
            } else {
                window.console.log("lcprogessuiups-- no DOM for ActivityInformation in event");
            }
        } else {
            window.console.log("lcprogessuiups-- no H5Pscored completionType in event");
        }
    }
    return true;
};


/*
* This is the real dynprogress that calls all available UI updates.
*/
const dynprbar_action = changeProgressbar;
const game_action = changeGAME;
const complinfo_action = changeCompletionInfo;

export const init = () => {
    var prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];

    window.console.log('lcprogessuiups-- prbarneusrc' + prbar);
    if(prbar) {
        window.console.log('lcprogessuiups-- livecoprogressuiups----load listener');
        listener();
        } else {
        window.console.log('lcprogessuiups-- livecoprogressuiups----no listeners loaded due to missing prbar');
    }

    window.addEventListener('load', function () {
        //var pr = document.getElementsByClassName('progress')[0];
        var prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
       // alert('pr' + pr);
        window.console.log('lcprogessuiups-- prbarneusrc' + prbar);
        // Add an event listener to handle the cmcompleted - send from the local_livecoprogressuiups/listener.
        document.addEventListener('cmcompleted', function(event) {
            window.console.log('lcprogessuiups-- cmcompleted----Custom event triggered:', event.detail.message);
            // one option to changeProgressbar or the other 2 Variants of dynprbar_action()
            // implement wait 300 ms - to give some time to the core events dealing with the completion
             setTimeout(function() {
                dynprbar_action(); // The theme learnr progressbar.
                complinfo_action(event); // The H5P completion section.
                game_action(); // The GAME.
            }, 300);
        });
    });
};