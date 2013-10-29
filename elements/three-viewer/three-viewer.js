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
		showControls: false,
		showAxes:true,
		projection:"perspective",
		orientation:"diagonal",

		//TODO:add option to set camera up (z/y)
		cameraUp : [0,0,1],

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
			/*this.shadows= this.shadows || {
				show:false,
				resolution:128,
				self:true};*/
			this.scene = new THREE.Scene();
			this.clock = new THREE.Clock();
			this.rootAssembly = new THREE.Object3D();
		},
    enteredView: function() {
			console.log("entered view");
			this.setInitialStyle();
			this.init();
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
		init: function()
		{
			this.setupRenderer();
			this.setupLights();
			this.setupScene();
			this.setupControls();
			
			//move these ???
      this.scene.add(this.rootAssembly); //entry point to store meshes


			this.selectionHelper = new SelectionHelper({camera:this.camera,color:0x000000,textColor:0xffffff})
      /*@selectionHelper.addEventListener( 'selected',  @onObjectSelected)
      @selectionHelper.addEventListener( 'unselected', @onObjectUnSelected)*/
      this.selectionHelper.addEventListener( 'hoverIn', this.onObjectHover);
      this.selectionHelper.addEventListener( 'hoverOut', this.onObjectHover);
			
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
			renderer.shadowMapType = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
			
			this.convertColor(this.bg)
			renderer.setClearColor( this.bg, 1 );
			this.$.viewer.appendChild( renderer.domElement );
			this.renderer = renderer;
		},
		setupLights: function()
		{
			mainScene = 	this.scene
		  	pointLight = new THREE.PointLight(0x333333,4)
		  	pointLight.position.x = -2500
		  	pointLight.position.y = -2500
		  	pointLight.position.z = 2200
			  
		  	pointLight2 = new THREE.PointLight(0x333333,3)
		  	pointLight2.position.x = 2500
		  	pointLight2.position.y = 2500
		  	pointLight2.position.z = -5200
			
		  	ambientColor = 0x565595
		  	ambientLight = new THREE.AmbientLight(ambientColor)
			  
		  	spotLight = new THREE.SpotLight( 0xbbbbbb, 1.5)  ;  
		  	spotLight.position.x = 50;
		  	spotLight.position.y = 50;
		  	spotLight.position.z = 150;
		  	
			spotLight.shadowCameraNear = 1;
			spotLight.shadowCameraFov =60;
			spotLight.shadowMapBias = 0.0039;
			spotLight.shadowMapDarkness = 0.5;
			shadowResolution = 512 //parseInt(@settings.shadowResolution.split("x")[0])
			spotLight.shadowMapWidth = shadowResolution
			spotLight.shadowMapHeight = shadowResolution
			spotLight.castShadow = true
			  
			lights = [ambientLight,pointLight, pointLight2, spotLight]
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
		
			console.log("this.defaultCameraPosition",this.defaultCameraPosition)
	      	this.camera.up = new THREE.Vector3( 0, 0, 1 );
	      	this.camera.position.copy(this.defaultCameraPosition);
	      	this.camera.defaultPosition.copy(this.defaultCameraPosition);
		    this.scene.add(this.camera);
		    
		    //add grid
		    this.grid = new THREE.CustomGridHelper(200,10)
		    this.scene.add(this.grid);
		    //add axes
		    this.axes = new THREE.LabeledAxes()
		    this.scene.add(this.axes);
		    
		    /* 
		    var t1 = new THREE.TextDrawHelper();
		    var plane = t1.drawTextOnPlane("Hello world");
		    this.scene.add(plane);
		    console.log("scene setup ok",this.scene);*/
		},
		setupControls: function()
		{
			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			this.controls.userPanSpeed = 8.0;
			this.controls.userZoomSpeed = 2.0;
    	this.controls.userRotateSpeed = 2.0;

			this.controls.autoRotate = this.autoRotate;
			this.controls.autoRotateSpeed = 4.0;

		},
		resizeHandler: function() {
			var parent =  this.parentNode.host || this.parentNode;
			var cs = window.getComputedStyle(parent);
			var cs = window.getComputedStyle(this);

			var widthReduct= parseInt(cs.marginLeft.replace("px","")) + parseInt(cs.marginRight.replace("px",""));
			var heightReduct= parseInt(cs.marginBottom.replace("px","")) + parseInt(cs.marginTop.replace("px",""));
			this.width = parseInt(cs.getPropertyValue("width").replace("px","")) - widthReduct;
			this.height = parseInt(cs.getPropertyValue("height").replace("px","")) - heightReduct;

			console.log(" oh yeah resize",this.width,this.height);

			if( window.devicePixelRatio!==null )
			{
        		this.dpr = window.devicePixelRatio;
			}
        	
    	//#@width = Math.floor(window.innerWidth*@dpr) - (westWidth + eastWidth)
      
      //BUG in firefox: dpr is not 1 on desktop, scaling issue ensue, so forcing to "1"
      this.dpr=1;
			this.resUpscaler = 1;
      this.hRes = this.width * this.dpr * this.resUpscaler;
      this.vRes = this.height * this.dpr * this.resUpscaler;

			/*this.camera.aspect = this.width / this.height;
  		this.camera.setSize(this.width,this.height);
  		this.renderer.setSize(this.hRes, this.vRes);
  		this.camera.updateProjectionMatrix();*/

      
			this.camera.aspect = this.width / this.height;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize( this.width,this.height );
			
		},
		setInitialStyle:function()
		{
			//setup width & height
			//console.log("style", this.style, window.getComputedStyle(this));
			var cs = window.getComputedStyle(this);
			var widthReduct= parseInt(cs.marginLeft.replace("px","")) + parseInt(cs.marginRight.replace("px","")) ;
			var heightReduct= parseInt(cs.marginBottom.replace("px","")) + parseInt(cs.marginTop.replace("px",""));
			this.width = parseInt(cs.getPropertyValue("width").replace("px","")) - widthReduct;
			this.height = parseInt(cs.getPropertyValue("height").replace("px","")) - heightReduct;
			console.log("width",this.width,"height",this.height);
			
			//setup backround color
			this.bg = cs.getPropertyValue("background-color");
			console.log("background color", this.bg);

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
		bgChanged: function() {
			console.log("bg changed");
  	},
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
			this.grid.plane.receiveShadow = this.showShadows;
			
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
          //@camera.setZoom(1);
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
		onObjectHover:function()
		{
      //this.render()
			console.log("object hover");
    },
		keyDown:function(event)
		{
			console.log("key pressed",event);

			if(event.impl.keyCode == 46 ) //supr
			{
				if(this.selectedObject!=null && this.selectedObject!=undefined)
				{
					this.rootAssembly.remove(this.selectedObject);
					this.selectedObject = null;
					
				}
			}
		},
    pointerMove:function(event)
    {
      //TODO: bingo ! the issue with picking comes from auto rotate!  why ?? investigate !
      //console.log("I moved",event);
      var x = event.impl.offsetX;
      var y = event.impl.offsetY;

      var intersects, projector, raycaster, v;
      v = new THREE.Vector3((x / this.width) * 2 - 1, -(y / this.height) * 2 + 1, 1);
      //bug somewhere : values of v seem correct (map to -1.0->1.0 in both directions, so perhaps camera issue?
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
      
       /*#timer to ensure we don't unselect things 
      if @controlChangeTimeOut?
        clearTimeout(@controlChangeTimeOut)
      
      @actionInProgress = true
      @pushStart = new Date().getTime()
      @oldX = x
      @oldY = y
      @controlChangeTimeOut = null  
      @controlChangeTimeOut = setTimeout ( =>
        @noControlChange = true
            
      ), 600
      
      event.preventDefault()
      return false
      */

			//set focus so keyboard binding works
			if( document.activeElement != this.impl)
			{
				console.log("document.activeElement",document.activeElement);
				this.focus();
				console.log("document.activeElement",document.activeElement,this);
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

        if(_elapsed <= 125)
        {
          //simple, fast click
          //console.log("simple, fast click");
          this._longAction = false;
        }
        else
        {
          //console.log("long click/move etc");
          this._longAction = true;
        }

        this.selectionHelper.viewWidth=this.width;
        this.selectionHelper.viewHeight=this.height;
        var selected = this.selectionHelper.getObjectAt(x,y);

        //console.log("selected",selected);
      
        if( selected != null && selected != undefined)
        {
          this.selectionHelper.selectObjectAt(x,y)
          /*if( this.selectedObject  == null || this.selectedObject == undefined)
          {*/
              this.selectedObject = selected
          /*}
          else
          {
            oldSelect = @currentSelection
            @currentSelection = selected
            @trigger("selectionChange",oldSelect,@currentSelection)*/
        }
        else
        {
          if (this._longAction == false)
          {
            this.selectedObject = null;
						this.selectionHelper._unSelect();
            
            //@trigger("selectionChange",@currentSelection,null)
            //@selectionHelper._unSelect()
            //@onObjectUnSelected()
            //@currentSelection = null 
          }
        }
    }

  });
