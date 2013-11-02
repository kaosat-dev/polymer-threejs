Polymer('three-viewer', {
		applyAuthorStyles: true,
		noscript:true,
		
		bg: "rgb(255, 255, 255)",
		
		viewAngle: 40,
		projection: "perspective",
		autoRotate:false,
		
		meshStyle:'shaded',
		meshOutlines: true,
		
		showGrid: true,
		showShadows:true,
		showStats: false,
		showAxes:true,

		projection:"perspective",
		orientation:"diagonal",
		cameraUp : [0,0,1],

    //postprocessing
    postProcess:false,

    //for interactions, perhaps move this to a different component
    selectedObject:null,
    highlightedObject : null,
		
		//TODO: find a way to work with the following type of settings, while keeping the API simple 
		//These are NOT used currently
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
		controlsConf:{
			userPanSpeed : 3.0
		},
		//custom elements lifecycle callbacks
		created: function() {
			console.log("created three-viewer");
			this.scene = new THREE.Scene();
			this.clock = new THREE.Clock();
			this.rootAssembly = new THREE.Object3D();
		},
    enteredView: function() {
			console.log("entered view");
			this.setInitialStyle();
			this.setup();
			this.animate();
		},
		ready: function() {
			console.log("ready");
			this.cameraUp = new THREE.Vector3(this.cameraUp[0],this.cameraUp[1],this.cameraUp[2]);
		},
		//basic setup
		enableHandler: function(inEnable, inMethodName, inNode, inEventName, inCapture) {
					var m = 'bound' + inMethodName;
					this[m] = this[m] || this[inMethodName].bind(this);

					inNode[inEnable ? 'addEventListener' : 'removeEventListener'](
						inEventName, this[m], inCapture);
		},
		enableResizeHandler: function(inEnable) {
					this.enableHandler(inEnable, 'resizeHandler', window, 
						'resize');
		},
		setup: function()
		{
			this.setupRenderer();
      this.setupScene();
			this.setupLights();
			this.setupControls();
      this.setupPostProcess();
			
			//move these ???
      this.scene.add(this.rootAssembly); //entry point to store meshes

			this.selectionHelper = new SelectionHelper({camera:this.camera,color:0x000000,textColor:0xffffff})
			this.selectionHelper.hiearchyRoot=this.rootAssembly.children;

		},
    setupRenderer:function()
		{
			if ( Detector.webgl )
				renderer = new THREE.WebGLRenderer( {antialias:true,preserveDrawingBuffer:true} );
			else
				renderer = new THREE.CanvasRenderer(); 
			renderer.setSize(this.width, this.height);
			renderer.shadowMapEnabled = true;
			renderer.shadowMapAutoUpdate = true;
			renderer.shadowMapSoft = true;
			renderer.shadowMapType = THREE.PCFShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
			
			this.convertColor(this.bg)
			renderer.setClearColor( this.bg, 1 );
			this.$.viewer.appendChild( renderer.domElement );
			this.renderer = renderer;
		},
		setupLights: function()
		{
			mainScene = 	this.scene
		  	pointLight = new THREE.PointLight(0x333333,3)
		  	pointLight.position.x = -2500
		  	pointLight.position.y = -2500
		  	pointLight.position.z = 2200
			  
		  	pointLight2 = new THREE.PointLight(0x333333,2)
		  	pointLight2.position.x = 2500
		  	pointLight2.position.y = 2500
		  	pointLight2.position.z = -5200
			
		  	ambientColor = 0x565595
        ambientColor = 0x161515
		  	ambientLight = new THREE.AmbientLight(ambientColor)
			  
    /*
		  	spotLight = new THREE.SpotLight( 0xbbbbbb, 1.5)  ;  
		  	spotLight.position.x = 50;
		  	spotLight.position.y = 50;
		  	spotLight.position.z = 150;
		  	
			spotLight.shadowCameraNear = 1;
			spotLight.shadowCameraFov =60;
			spotLight.shadowMapBias = 0.0039;
			spotLight.shadowMapDarkness = 0.5;
			shadowResolution = 512; //parseInt(this.settings.shadowResolution.split("x")[0])
			spotLight.shadowMapWidth = shadowResolution
			spotLight.shadowMapHeight = shadowResolution
			spotLight.castShadow = true*/

      var SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 2048;
      spotLight = new THREE.SpotLight( 0xbbbbbb, 0.8, 0, Math.PI, 1 );
			spotLight.position.set( 20, 20, 250 );
			spotLight.target.position.set( 0, 0, 0 );

			spotLight.castShadow = true;

			spotLight.shadowCameraNear = 100;
			spotLight.shadowCameraFar = this.camera.far;
			spotLight.shadowCameraFov = 50;

				//light.shadowCameraVisible = true;

			spotLight.shadowBias = 0.0001;
			spotLight.shadowDarkness = 0.5;

			spotLight.shadowMapWidth = SHADOW_MAP_WIDTH;
			spotLight.shadowMapHeight = SHADOW_MAP_HEIGHT;


      //sky color ground color intensity 
      hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
      hemiLight = new THREE.HemisphereLight( 0xffEEEE, 0xffEEEE, 0.2 );
				/*hemiLight.color.setHSV( 0.8, 0.25, 1 );
				hemiLight.groundColor.setHSV( 0.095, 0.2, 1 );*/
				hemiLight.position.set( 0, 1200, 5000 );
			  
      
      dirLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
				//dirLight.color.setHSV( 0.1, 0.1, 1 );
				dirLight.position.set( 0, 50, 300 );
				//dirLight.position.multiplyScalar( 50 );

				dirLight.castShadow = true;

				dirLight.shadowMapWidth = 2048;
				dirLight.shadowMapHeight = 2048;

				var d = 50;

				dirLight.shadowCameraLeft = -d;
				dirLight.shadowCameraRight = d;
				dirLight.shadowCameraTop = d;
				dirLight.shadowCameraBottom = -d;

				dirLight.shadowCameraFar = 3500;
				dirLight.shadowBias = -0.0001;
				dirLight.shadowDarkness = 0.35;
        dirLight.onlyShadow = true;

      var shadowConst = 0.8;
      dirLight.shadowDarkness = shadowConst * dirLight.intensity;

      //3 point lighting test
      var pLigthIntensity = 0.5;
      var pLight = new THREE.DirectionalLight( 0xfcfc7e, pLigthIntensity );
      pLight.position.set( 100, 150, 200 );
      pLight.target.position.set(0,0,0);

      var pLight2 = new THREE.DirectionalLight( 0xfcfc7e, pLigthIntensity );
      pLight2.position.set( 100, -150, 200 );
      pLight2.target.position.set(0,0,0);

      var pLight3 = new THREE.DirectionalLight( 0x86f4eb, pLigthIntensity );
      pLight3.position.set( -100, 0, -200 );
      pLight3.target.position.set(0,0,0);


			lights = [ambientLight,hemiLight,dirLight,pLight,pLight2]
			mainScene.lights = lights
			for (var i=0; i<lights.length; i++)
			{
				var light = lights[i]
			  mainScene.add(light)
			}
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
      this.camera.up = this.cameraUp;
      this.camera.position.copy(this.defaultCameraPosition);
      this.camera.defaultPosition.copy(this.defaultCameraPosition);
      this.scene.add(this.camera);
		    
	    //add grid
	    this.grid = new THREE.CustomGridHelper(200,10,this.cameraUp)
	    this.scene.add(this.grid);
	    //add axes
	    this.axes = new THREE.LabeledAxes()
	    this.scene.add(this.axes);
		},
		setupControls: function()
		{
			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement, this.cameraUp );
			this.controls.userPanSpeed = 8.0;
			this.controls.userZoomSpeed = 2.0;
    	this.controls.userRotateSpeed = 2.0;

			this.controls.autoRotate = this.autoRotate;
			this.controls.autoRotateSpeed = 4.0;
		},
    setupPostProcess:function()
    {
        if(this.renderer instanceof THREE.WebGLRenderer && this.postProcess == true)
        {
          //shaders, post processing etc
          var resolutionBase = 1;
          var resolutionMultiplier = 1.5;

          //various passes and rtts
          var renderPass = new THREE.RenderPass(this.scene, this.camera)
          var copyPass = new THREE.ShaderPass( THREE.CopyShader )
        
          /*this.edgeDetectPass3 = new THREE.ShaderPass(THREE.EdgeShader3)
        
          var contrastPass = new THREE.ShaderPass(THREE.BrightnessContrastShader)
          contrastPass.uniforms['contrast'].value=0.5
          contrastPass.uniforms['brightness'].value=-0.4*/
          
          var vignettePass = new THREE.ShaderPass(THREE.VignetteShader)
          vignettePass.uniforms["offset"].value = 0.4;
          vignettePass.uniforms["darkness"].value = 5;

          this.fxaaResolutionMultiplier = resolutionBase/resolutionMultiplier;
          var composerResolutionMultiplier = resolutionBase*resolutionMultiplier;

          this.finalComposer = new THREE.EffectComposer( this.renderer )

          /*
          var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
          var renderTarget = new THREE.WebGLRenderTarget( this.width , this.height, renderTargetParameters );
        
          this.finalComposer = new THREE.EffectComposer( this.renderer , renderTarget );          
          this.finalComposer.setSize(this.hRes, this.vRes);
          */
          //prepare the final render passes
          this.finalComposer.addPass( renderPass );
          //this.finalComposer.addPass(this.fxAAPass)

          //blend in the edge detection results
          /*
          var effectBlend = new THREE.ShaderPass( THREE.AdditiveBlendShader, "tDiffuse1" );
          effectBlend.uniforms[ 'tDiffuse2' ].value = this.normalComposer.renderTarget2;
          effectBlend.uniforms[ 'tDiffuse3' ].value = this.depthComposer.renderTarget2;
          this.finalComposer.addPass( effectBlend );*/
          this.finalComposer.addPass( vignettePass );
          //make sure the last pass renders to screen
          this.finalComposer.passes[this.finalComposer.passes.length-1].renderToScreen = true;
        }
    },
		resizeHandler: function() {
			var parent =  this.parentNode.host || this.parentNode;
			var cs = window.getComputedStyle(parent);
			var cs = window.getComputedStyle(this);

			var widthReduct= parseInt(cs.marginLeft.replace("px","")) + parseInt(cs.marginRight.replace("px",""));
			var heightReduct= parseInt(cs.marginBottom.replace("px","")) + parseInt(cs.marginTop.replace("px",""));
			this.width = parseInt(cs.getPropertyValue("width").replace("px","")) - widthReduct;
			this.height = parseInt(cs.getPropertyValue("height").replace("px","")) - heightReduct;

			//console.log(" oh yeah resize",this.width,this.height);

			if( window.devicePixelRatio!==null )
			{
        		this.dpr = window.devicePixelRatio;
			}
        	
    	//#this.width = Math.floor(window.innerWidth*this.dpr) - (westWidth + eastWidth)
      
      //BUG in firefox: dpr is not 1 on desktop, scaling issue ensue, so forcing to "1"
      this.dpr=1;
			this.resUpscaler = 1;
      this.hRes = this.width * this.dpr * this.resUpscaler;
      this.vRes = this.height * this.dpr * this.resUpscaler;
      
			this.camera.aspect = this.width / this.height;
      this.camera.setSize(this.width,this.height);
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( this.width,this.height );
		},
		setInitialStyle:function()
		{
			//setup width & height
			var cs = window.getComputedStyle(this);
			var widthReduct= parseInt(cs.marginLeft.replace("px","")) + parseInt(cs.marginRight.replace("px","")) ;
			var heightReduct= parseInt(cs.marginBottom.replace("px","")) + parseInt(cs.marginTop.replace("px",""));
			this.width = parseInt(cs.getPropertyValue("width").replace("px","")) - widthReduct;
			this.height = parseInt(cs.getPropertyValue("height").replace("px","")) - heightReduct;
			
			//setup backround color
			this.bg = cs.getPropertyValue("background-color");
      //console.log("Style initialized: width",this.width,"height",this.height,"background color", this.bg);

			this.enableResizeHandler(true);
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
			
			if(this.showStats == true && this.$.stats !== undefined)
			{
					this.$.stats.update();
			}
		},
		render: function() 
		{	
			
      if (this.renderer instanceof THREE.WebGLRenderer && this.postProcess == true)
      {
        //necessary hack for effectomposer
        THREE.EffectComposer.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
        THREE.EffectComposer.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
        THREE.EffectComposer.scene = new THREE.Scene();
        THREE.EffectComposer.scene.add( THREE.EffectComposer.quad );

        /*
        originalStates = helpers.toggleHelpers(this.scene)#hide helpers from scene
        this.depthComposer.render()
        this.normalComposer.render()
        helpers.enableHelpers(this.scene, originalStates)#show previously shown helpers again
        
        this.finalComposer.passes[this.finalComposer.passes.length-1].uniforms[ 'tDiffuse2' ].value = this.normalComposer.renderTarget2
        this.finalComposer.passes[this.finalComposer.passes.length-1].uniforms[ 'tDiffuse3' ].value = this.depthComposer.renderTarget2*/
        this.finalComposer.render();
      }
      else
      {
        this.renderer.render( this.scene, this.camera );
      }

		},
		//utilities
		convertColor: function(hex)
		{
	        hex = parseInt("0x"+hex.split('#').pop(),16)
	        return  hex 
		},
		//public api
		addToScene: function ( object )
		{
			try
			{
				this.rootAssembly.add( object );
        //this.scene.add(object);
			}
			catch(error)
			{
				console.log("Failed to add object",object, "to scence: error", error)
			}
		},
		captureScreen:function(callback, width, height)
		{
			var width = width || 640;
			var height = height || 480;
			if(callback === undefined)
			{
				throw new Error("no callback provided");
			}
			captureScreen(callback, this.renderer.domElement, width, height);
		},
		//attribute change handlers / various handlers
  	autoRotateChanged:function()
		{
			console.log("autoRotateChanged", this.autoRotate);
			this.controls.autoRotate = this.autoRotate;
		},
		showGridChanged:function()
		{
			console.log("showGridChanged", this.showGrid);
			this.grid.toggle(this.showGrid)
		},
		showShadowsChanged:function()
		{
			console.log("showShadowsChanged", this.showShadows);
			
			//hack for now
			var settings = {};
			settings.shadows = this.showShadows;
			settings.selfShadows =this.showShadows;
			settings.objectViewMode = "shaded";
			updateVisuals(this.rootAssembly, settings);
		},
		showAxesChanged: function()
		{
			console.log("showAxesChanged", this.showAxes);
			this.axes.toggle( this.showAxes ) ;
		},
		projectionChanged:function()
		{
			console.log("projectionChanged", this.projection);
			if(this.projection == "orthographic")
			{
					this.camera.toOrthographic();
					this.selectionHelper.isOrtho = true;
			}
			else
			{
          this.camera.toPerspective();
					this.selectionHelper.isOrtho = false;
          //this.camera.setZoom(1);
			}
		},
		orientationChanged:function()
		{
				console.log("orientation changed");
				//TODO: streamline this
				switch(this.orientation)
				{
					case 'diagonal':
						this.camera.toDiagonalView();
						break;
					case 'top':
						this.camera.toTopView();
						break;
					case 'bottom':
						this.camera.toBottomView();
						break;
					case 'left':
						this.camera.toLeftView();
						break;
					case 'right':
						this.camera.toRightView();
						break;
					case 'front':
						this.camera.toFrontView();
						break;
					case 'back':
						this.camera.toBackView();
						break;
					default:
						this.camera.toDiagonalView();
				}
		},
    highlightedObjectChanged:function()
    {
      console.log("highlighted object changed",this.highlightedObject);
    },
    selectedObjectChanged:function()
    {
       console.log("SELECTED object changed",this.selectedObject);
    },
		keyDown:function(event)
		{//overidable method stand in
		},
    pointerMove:function(event)
    {
      //TODO: bingo ! the issue with picking comes from auto rotate!  why ?? investigate !
      //console.log("I moved",event);
      var x = event.impl.offsetX;
      var y = event.impl.offsetY;

      var intersects, projector, raycaster, v;
      v = new THREE.Vector3((x / this.width) * 2 - 1, -(y / this.height) * 2 + 1, 1);
      //console.log("v",x,y, this.width, this.height);
      /*
      projector = new THREE.Projector();
      projector.unprojectVector(v, this.camera);
      raycaster = new THREE.Raycaster(this.camera.position, v.sub(this.camera.position).normalize());
      
      intersects = raycaster.intersectObjects( this.scene.children, true );// raycaster.intersectObjects(this.rootAssembly, true);     
      //console.log(intersects);
      if (intersects.length > 0) {
       // console.log("intersects!!");
      }*/

      //var pointer = this.pointers[event.pointerId];
      //todo: normalize event ? 
      
      //this.camera.setSize(this.width,this.height);//attempt
      //this.selectionHelper.camera = this.camera;

      //this.selectionHelper.hiearchyRoot=this.rootAssembly.children;//NOT NEEDED ! already has a pointer to the correct data
      this.selectionHelper.viewWidth=this.width;
      this.selectionHelper.viewHeight=this.height;
      this.selectionHelper.highlightObjectAt(x,y);

      var currentObj = this.selectionHelper.getObjectAt(x,y);
      this.highlightedObject = currentObj;
      //console.log("currentObj",currentObj,this.rootAssembly);
    },
    pointerDown:function(event)
    {
        //console.log("pointer down");
        var x = event.impl.offsetX;
        var y = event.impl.offsetY;

        this._actionInProgress = false;
        this._pushStart = new Date().getTime();
      
			//set focus so keyboard binding works
			if( document.activeElement != this.impl)
			{
				this.focus();
			}
    },
    pointerUp:function(event)
    {
        //console.log("pointer up",event);
        var x = event.impl.offsetX;
        var y = event.impl.offsetY;

        this._actionInProgress = false;
        var _pushEnd = new Date().getTime()
        var _elapsed = _pushEnd - this._pushStart;
        this._longAction = !(_elapsed <= 125)

        this.selectionHelper.viewWidth=this.width;
        this.selectionHelper.viewHeight=this.height;
        var selected = this.selectionHelper.getObjectAt(x,y);

        if( selected != null && selected != undefined)
        {
          this.selectionHelper.selectObjectAt(x,y)
          this.selectedObject = selected
        }
        else
        {
          if (this._longAction == false)
          {
            this.selectedObject = null;
						this.selectionHelper._unSelect();
          }
        }
    }
  });
