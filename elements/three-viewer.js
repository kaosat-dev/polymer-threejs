Polymer('three-viewer', {
			open: false,
			width:320,
			height:240,
			bg: "#ffffff",
			showStats: false,
			ready: function() {
				this.clock = new THREE.Clock();
				this.init();
				this.animate();
				console.log("pouet");
			},
			init: function()
			{
				var container, scene, camera, renderer, controls, stats;
				
				scene = new THREE.Scene();
				var SCREEN_WIDTH = this.width;//window.innerWidth, 
				SCREEN_HEIGHT = this.height;//window.innerHeight;	
				// camera attributes
				var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
				// set up camera
				camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
				// add the camera to the scene
				scene.add(camera);
				// the camera defaults to position (0,0,0)
				// 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
				camera.position.set(0,150,400);
				camera.lookAt(scene.position);	
				
				/*if ( Detector.webgl )
					renderer = new THREE.WebGLRenderer( {antialias:true} );
				else
				*/
				renderer = new THREE.WebGLRenderer( {antialias:true} );
				//renderer = new THREE.CanvasRenderer(); 
				renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				renderer.setClearColor( this.convertColor(this.bg), 1 );
				this.$.viewer.appendChild( renderer.domElement );
				
				// automatically resize renderer
				//THREEx.WindowResize(renderer, camera);
				// toggle full-screen on given key press
				//THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				// create a light
				var light = new THREE.PointLight(0xffffff);
				light.position.set(0,250,0);
				scene.add(light);
				var ambientLight = new THREE.AmbientLight(0x111111);
				scene.add(ambientLight);
	
				// Sphere parameters: radius, segments along width, segments along height
				var sphereGeometry = new THREE.SphereGeometry( 50, 32, 16 ); 
				var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x8888ff} ); 
				var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
				sphere.position.set(100, 50, -50); 
				scene.add(sphere);
				
				this.scene = scene;
				this.camera = camera;
				this.renderer = renderer;
				this.controls = controls;
				
				this.controls.autoRotate = true;
				
				// displays current and past frames per second attained by scene
				//TODO: move this to another web component
				/*if(this.showStats == true)
				{
					stats = new Stats();
					stats.domElement.style.position = 'absolute';
					stats.domElement.style.bottom = '0px';
					stats.domElement.style.zIndex = 100;
					this.$.stats.appendChild( stats.domElement );
					this.stats = stats;
				}*/
				
			},
			animate: function() 
			{
				this.render();		
				this.update();
				requestAnimationFrame(this.animate.bind(this))
			},
			update: function()
			{
				// delta = change in time since last call (in seconds)
				var delta = this.clock.getDelta(); 
				this.controls.update(); 
				if(this.showStats == true)
				{
					//this.stats.update();
				}
			},
			render: function() 
			{	
				this.renderer.render( this.scene, this.camera );
			},
			convertColor: function(hex)
			{
		        hex = parseInt("0x"+hex.split('#').pop(),16)
		        return  hex 
			},
			bgChanged: function() {
				console.log("bg changed");
		        //this.$.status.style.backgroundColor = 'hsl(' + h + ', 100%, 50%)';  
      		}
		  });