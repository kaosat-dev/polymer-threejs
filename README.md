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
- the view comes pre packaged with the three.js OrbitControls & CombinedCamera : these are both custom versions, with "z-up" instead of
the standard "y-up", since this was originally intended to be used for 3d modeling for 3d printing (that uses z-up)

usage
=====
- as stated above, elements are in the "elements" folder
- you will however need a web server to run polymer.js elements locally : you can install a node-js simple http server for this project
by typing npm install and then npm start (once you have node.js and npm of course!)


examples
========




Include the elements (three-elements itself links to all other elements, for convenience): 


```html
    <link rel="import" href="elements/three-elements.html">
```

- Create a Three.js view default settings 
   

```html  
    <three-viewer></three-viewer>
```

This resuls in :

![Alt text](https://github.com/kaosat-dev/polymer-threejs/raw/master/polymer-three.js-ex0.png)

Create a Three.js view 320*200, with a fov of 50 shadows enabled
   

```html  
    <three-viewer  width=320 height=200 viewAngle=50 showControls showShadows ></three-viewer>
```

This resuls in :

![Alt text](https://github.com/kaosat-dev/polymer-threejs/raw/master/polymer-three.js-ex1.png)


- Create a Three.js view 640*480, with a fov of 50, autorotating camera, with onscreen controls, grid, axes, and shadows enabled,
and a greenish background

```html
    <three-viewer  width=640 height=480 viewAngle=50 bg="#c0ff00" autoRotate showControls showShadows showGrid showAxes></three-viewer>
```

This resuls in :

![Alt text](https://github.com/kaosat-dev/polymer-threejs/raw/master/polymer-three.js-ex2.png)
 

- you can also create multiple views (all independant, but still  a bit buggy sometimes):

```html
    <three-viewer style="right:180px;top:300px;"></three-viewer>
    <three-viewer  viewAngle="25" width=640 height=480  autoRotate showControls showShadows id="viewer1"></three-viewer>
    <three-viewer bg="#c0ff00" viewAngle="45" width=320 height=240  showControls showShadows=false style="left:680px;top:500px;border: 1px solid blue;"></three-viewer>
```


This resuls in :

![Alt text](https://github.com/kaosat-dev/polymer-threejs/raw/master/polymer-three.js-ex3.png)


- editing the scene/add objects to the view 
Polymer components are loaded in an asynch maner (there is callback for that ! as they say :)
So to add a cube to a viewer you could do :

```javascript
window.addEventListener('WebComponentsReady', function() {
	    document.body.style.opacity = 1; // show body now that registration is done.
	    var threeViewer = document.querySelector('three-viewer');
	    console.log("components loaded",threeViewer);
	      
		var cubeGeometry = new THREE.CubeGeometry( 30, 30, 30 ); 
		var material = new THREE.MeshLambertMaterial( {color: 0x0088ff} ); 
		var cube = new THREE.Mesh(cubeGeometry, material);
		cube.position.set(-25, 25, -35); 
			
		cube.castShadow =  true
	    cube.receiveShadow = true
	    
	    //here we add the cube to the scene via the addToScene method
		threeViewer.addToScene(cube);
```

Live Demo
=========
http://kaosat-dev.github.io/polymer-threejs/demo


Licence
=======
MIT
