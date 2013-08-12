Polymer('three-viewer', {
		applyAuthorStyles: true,
		width:320,
		height:240,
		bg: "#ffffff",
		
		viewAngle: 40,
		projection: "perspective",
		
		meshStyle:'shaded',
		meshOutlines: true,
		autoRotate:false,
		shadows:
		{
			show:false,
			resolution:128,
			self:true
		},
		grid:{
			show:false,
        	size: 200,
        	steps: 10,
        	autoSize:false,
        	color : "0x00baff",
        	opacity: 0.1,
        	numbering: true,
        	numberingPosition : 'center'
		},
		cameraConf:{
			defaultPosition: [100,100,200],
        	position     : "diagonal",
        	projection   : "perspective",
        	viewAngle : 40,
        	autoRotate   : false
      	},
		showStats: false,
		showControls: false,
		ready: function() {
			
			/*this.shadows= this.shadows || {
				show:false,
				resolution:128,
				self:true};*/
			this.scene=new THREE.Scene();
			this.clock = new THREE.Clock();
			this.init();
			this.animate();
		},
		init: function()
		{
			this.setupRenderer();
			this.setupScene();
			this.setupControls();
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
				if(this.$.stats !== undefined)
				{
					this.$.stats.update();
				}
			}
		},
		render: function() 
		{	
			this.renderer.render( this.scene, this.camera );
		},
		setupRenderer:function()
		{
			/*if ( Detector.webgl )
				renderer = new THREE.WebGLRenderer( {antialias:true} );
			else
			*/
			renderer = new THREE.WebGLRenderer( {antialias:true} );
			//renderer = new THREE.CanvasRenderer(); 
			renderer.setSize(this.width, this.height);
			renderer.setClearColor( this.convertColor(this.bg), 1 );
			this.$.viewer.appendChild( renderer.domElement );
			this.renderer = renderer;
		},
		setupScene:function()
		{
			cameraSettings = this.cameraConf;
			defaultPosition = cameraSettings.defaultPosition;
			this.defaultCameraPosition = new THREE.Vector3(defaultPosition[0],defaultPosition[1],defaultPosition[2]);
			
		    ASPECT = this.width / this.height;
		      this.NEAR = 0.1;
		      this.FAR = 20000;
		      this.camera = new THREE.CombinedCamera(
		          this.width,
		          this.height,
		          this.viewAngle,
		          this.NEAR,
		          this.FAR,
		          this.NEAR,
		          this.FAR);
		
			console.log("this.defaultCameraPosition",this.defaultCameraPosition)
		      this.camera.up = new THREE.Vector3( 0, 0, 1 );
		      this.camera.position.copy(this.defaultCameraPosition);
		      this.camera.defaultPosition.copy(this.defaultCameraPosition);
		      
		      
		      this.camera = new THREE.PerspectiveCamera(  this.viewAngle, ASPECT, this.NEAR, this.FAR);
		    this.camera.position.set(defaultPosition[0],defaultPosition[1],defaultPosition[2]);
		    this.camera.lookAt(this.scene.position);	
		      
		      this.scene.add(this.camera);
		      

		      // create a light
				var light = new THREE.PointLight(0xffffff);
				light.position.set(0,250,0);
				this.scene.add(light);
				var ambientLight = new THREE.AmbientLight(0x111111);
				this.scene.add(ambientLight);
	
				// Sphere parameters: radius, segments along width, segments along height
				var sphereGeometry = new THREE.SphereGeometry( 50, 32, 16 ); 
				var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x8888ff} ); 
				var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
				sphere.position.set(100, 50, -50); 
				this.scene.add(sphere);
		      console.log("scene setup ok",this.scene);
		},
		setupControls: function()
		{
			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			this.controls.autoRotate = this.autoRotate;	
		},
		convertColor: function(hex)
		{
	        hex = parseInt("0x"+hex.split('#').pop(),16)
	        return  hex 
		},
		bgChanged: function() {
			console.log("bg changed");
  		},
  		shadowsChanged:function()
  		{
  			console.log("shadowsChanged", this.shadows);
  		},
  		autoRotateChanged:function()
  		{
  			console.log("autoRotateChanged", this.autoRotate);
  			this.controls.autoRotate = this.autoRotate;
  		}
  });