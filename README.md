polymer-threejs
===============

Experimental custom elements using the Polymer framework and the Three.js framework.

All custom elements are in the elements folder (seperated by folder)
three-viewer (the main element) depends on/ makes use of both three-controls and three-stats
a more simple, independant three-viewer will be added down the line.

Notes
=====
- very early stages, highly experimental so not bugs are very likely :)
- uses a custom "wrapped" (generated with browserify) version of Three.js, as the standard build does not get imported correctly from within elements.
