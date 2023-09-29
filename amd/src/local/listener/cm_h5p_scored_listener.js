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
 * Dynamic Progressbar and more - JS code cm_h5p_scored_listener
 *
 * @module     local_livecoprogressuiups/cm_h5p_scored_listener
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @copyright  Institut fuer interaktive Systeme der TH Lübeck
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

//import {get_H5P_ActivityInformation_InnerHTML} from './repository';


let registered = false;

/**
 * Function to intialise and register event listeners for this module.
 */
export const init = () => {
    if (registered) {
        return;
    }
    registered = true;


    /**
    * USED for handleXAPIEvent
    * Add progress whenever context.id module was not completed on inital load.
    * @param {event} event from Dispatcher.
    */
    const handleXAPIEvent = function (event) {
        if (event && event.data && event.data.statement && event.data.statement.result) {
            if (event.data.statement.result.score && event.data.statement.result.score.scaled) {
                // window.console.log('lcprogessuiups-- --externalDispatcher-handleXAPIEvent-', event);
                const theiframe = this.frameElement;
                // Create and trigger the cmcompleted event listened by dynprogress.
                var cmcompletedEvent = new CustomEvent('cmcompleted',
                    {
                        detail: {
                            completionType: 'H5Pscored',
                            framedin: theiframe,
                            message: 'a course module completed or scored'
                        }
                    });
                document.dispatchEvent(cmcompletedEvent);
            }
        }
    };


    // Listen to H5P iframe message to get H5P completion statements.
    window.addEventListener('message', function (e) {
        // window.console.log('lcprogessuiups-- ---got mail from iframe---', e.data);
        // iframe is loaded and all namesspaces are load
        if (e.data && e.data.context) {
            if (e.data.context == "h5p" && e.data.action == "hello") {
                addsh5pdispatcherlistener();
            }
        }
    });


    /**
    * addsh5pdispatcherlistener
    * Add progress whenever context.id module was not completed on inital load.
    */
    function addsh5pdispatcherlistener() {
        // FOLLOWING  WORKING BUT TO early in the event lists - setTimeout is a workaround
        // document.onreadystatechange: iframe is loaded and all namesspaces are loaded
        // DOES NOT work for single H5P in a course, thus allow multiple listeners to be removed again

        // The single H5P.
        if (window.document.h5player
            && window.document.h5player.H5P && window.document.h5player.H5P.externalDispatcher) {
            // window.console.log('lcprogessuiups-- livecoprogressuiups--externalDispatcher-single-gefunden-aka_docready-');

            var h5pextlDispatcher = window.document.h5player.H5P.externalDispatcher;
            // delete all listeners from H5P.externalDispatcher to get rid of double executions
            // without function due to error with given function as argument
            window.document.h5player.H5P.externalDispatcher.off('xAPI');
            window.document.h5player.H5P.externalDispatcher.on('xAPI', handleXAPIEvent.bind(window.document.h5player));
        } else {
            // Access the h5pplayer within each window.
            for (var i = 0; i < window.length; i++) {
                var currentWindow = window[i];
                h5pextlDispatcher = currentWindow.H5P.externalDispatcher;
                if (h5pextlDispatcher) {
                    // window.console.log("lcprogessuiups-----found h5p in window ---", h5pextlDispatcher);
                    // Delete all listeners from H5P.externalDispatcher to get rid of double executions
                    // without function due to error with given function as argument
                    // tried a lot to make it work with function - no success.
                    currentWindow.H5P.externalDispatcher.off('xAPI');
                    currentWindow.H5P.externalDispatcher.on('xAPI', handleXAPIEvent.bind(currentWindow));
                } else {
                    // window.console.log('lcprogessuiups-- livecoprogressuiups--h5playerElement not found');
                }
            }
        }
    }

};
