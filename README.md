polymer-threejs
===============

Experimental custom elements using the  [Polymer framework](http://www.polymer-project.org/ "Polymer framework")and the [Three.js](http://threejs.org/ "Three.js") framework.

All custom elements are in the elements folder (seperated by folder)
three-viewer (the main element) depends on/ makes use of both three-controls and three-stats
a more simple, independant three-viewer will be added down the line.

Notes
=====
- very early stages, highly experimental so not bugs are very likely :)
- uses a custom "wrapped" (generated with [Browserify](http://browserify.org/ "Browserify") version of Three.js, as the standard build does not get imported correctly from within elements.


usage
=====
- as stated above, elements are in the "elements" folder
- you will however need a web server to run polymer.js elements locally : you can install a node-js simple http server for this project
by typing npm install and then npm start (once you have node.js and npm of course!)

Demo
====
http://kaosat-dev.github.io/polymer-threejs/demo


Licence
=======
MIT