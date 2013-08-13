polymer-threejs
===============

Experimental custom elements using the  [Polymer framework](http://www.polymer-project.org/ "Polymer framework") and the [Three.js](http://threejs.org/ "Three.js") framework.

All custom elements are in the elements folder (seperated by folder)
three-viewer (the main element) depends on/ makes use of both three-controls and three-stats
a more simple, independant three-viewer will be added down the line.

Notes
=====
- very early stages, highly experimental so not bugs are very likely :)
- api is neither complete nor as practical as I would like it to be 
- uses a custom "wrapped" (generated with [Browserify](http://browserify.org/ "Browserify") version of Three.js, as the standard build does not get imported correctly from within elements.


usage
=====
- as stated above, elements are in the "elements" folder
- you will however need a web server to run polymer.js elements locally : you can install a node-js simple http server for this project
by typing npm install and then npm start (once you have node.js and npm of course!)


examples
========

Create a Three.js view 320*200, with a fov of 50 shadows enabled
   
   
    <three-viewer  width=320 height=200 viewAngle=50 showControls showShadows ></three-viewer>


Create a Three.js view 640*480, with a fov of 50, autorotating camera, with onscreen controls, grid, axes, and shadows enabled,
and a greenish background


    <three-viewer  width=640 height=480 viewAngle=50 bg="#c0ff00" autoRotate showControls showShadows showGrid showAxes></three-viewer>
 

 

Demo
====
http://kaosat-dev.github.io/polymer-threejs/demo


Licence
=======
MIT
