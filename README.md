# moodle-local_livecoprogressuiups
+ Goal: Make any progressbar and information updated in real-time
+ Status: 
  + theme_learnr progress bar 
  + block_game progress
  + activity information
  + actvity for mod_customcert 
     + usable for all activities with adaption of the selector
     + necessary for availability condition activities only
  + Pseudolabel
     + a Pseudolabel is used to act as an anchor for some availability conditions
     + if marked complete - conditions are re-read by moodle core
     + mark as complete is done by the plugin on activity completion 
     + a Pseudolabel is an Text- and Media activity (aka label) with the first characters (due to missing activity name)
     ```
     _________________________________________________ ...
     ``` 
     + use background color to make it invisible - but it needs to be in the DOM
     