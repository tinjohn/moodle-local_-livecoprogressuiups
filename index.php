<?php
// Standard GPL and phpdocs
require_once(__DIR__ . '/../../config.php');

$home = new moodle_url('/');
$natpage = new moodle_url('/local/livecoprogressuiups');

echo_readme();


/**
  * livecoprogressuiups.
  *
  */
function echo_readme() {
     global $DB;

     echo "livecoprogressuiups stellt ein js zur Verfügung, dass die Progressbar z.Bsp. im theme learnR dynamisch macht. Das könnte man auch direkt im Theme machen." ;
}
