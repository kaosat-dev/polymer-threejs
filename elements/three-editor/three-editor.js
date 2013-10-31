
Polymer('three-editor', {
  undos:[],//for undo redo
  redos:[],
  someValue: 535,//for testing
  ready:function()
  {
    this.super();
    console.log("this.$.selectOverlay",this.$.toto);
    var delegate = {
      getBinding: function(model, path, name, node) {
        //console.log("mlkmlkmlkl",path,name,node);
        // If this function is defined, the syntax can override
        // the default binding behavior
        var twoXPattern = /2x:(.*)/
        var match = path.match(twoXPattern);
        console.log("POOOOP");
        if (match == null) return;

        path = match[1].trim();
        var binding = new CompoundBinding(function(values) {
          return values['value'] * 2;
        });

        binding.bind('value', model, path);
        return binding;

      }
        /*,
      getInstanceModel: function(template, model) {
        // If this function is defined, the syntax can override
        // what model is used for each template instance which is
        // produced.
        console.log("mlkmlkmlkl",template, model);
      }*/
    };
    this.$.toto.bindingDelegate = delegate;
  },
  enteredView:function()
  {
    this.super();
    console.log("editor entered view");
    //if mousedown PLUS move NOT over object : rotate/pan, do not deselect current obect
    this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);

    function onControlsChange(event)
    {
        this.controls.enabled = true;
        if(this.transformControls.axis != undefined)
        {
          this.controls.enabled = false;
        }
    }
    this.transformControls.addEventListener( 'change', onControlsChange.bind(this) )

    function onObjectTranform(event)
    {
      var operation = null;
      switch(event.transform)
      {
        case "rotate":
          console.log("controls rotate",event.value);
          operation = new Rotation(event.value,this.selectedObject);
        break;
        case "translate":
          console.log("controls translate",event.value);
          operation = new Translation(event.value,this.selectedObject);
        break;
      }
      
      if( operation != null)
      {
        this.undos.push(operation);
        this.redos = [];
        console.log("editor operations",this.undos);
      }
    }
    this.transformControls.addEventListener( 'transform', onObjectTranform.bind(this) )
  },
  update: function()
	{
      this.super();
      //TODO: camera position does not get update by reference ???
      try{this.transformControls.update();}catch(error){}
	},
  //attribute change handlers
  highlightedObjectChanged:function()
  {
  },
  selectedObjectChanged:function(oldSelection)
  {
    newSelection = this.selectedObject;
    console.log("selection change");
    if(oldSelection != null && newSelection != null)
    {    
      console.log("SELECTED object changed",this.selectedObject.name,"OLD",oldSelection.name);
    }
    //remove from old selection
    if(oldSelection != null)
    {
      this.transformControls.detach();
      this.scene.remove(this.transformControls);
      oldSelection.controls = null;
    }
    //add to new selection
    if(newSelection != null)
    {
        this.transformControls.attach( newSelection );
        this.scene.add(this.transformControls);
        newSelection.controls = this.transformControls;
    }
  },
  //event handlers
  keyDown:function(event)
	{
    var keyCode = event.impl.keyCode;
    var ctrlPressed = event.impl.ctrlKey;
    var shiftPressed= event.impl.shiftKey;

		//console.log("key pressed",event);
		if(keyCode == 46) //supr
		{
			if(this.selectedObject!=null && this.selectedObject!=undefined)
			{
				this.rootAssembly.remove(this.selectedObject);
				this.selectedObject = null;
			}
		}
    //switch between transform modes : temporary
    if(keyCode == 82)//r
    {
        console.log("set to rotate");
        this.transformControls.setMode("rotate");
    }
    else if (keyCode == 84)
    {
      console.log("set to translate");
      this.transformControls.setMode("translate");
    }
    if(keyCode==90 && ctrlPressed && shiftPressed) {
        console.log("i want to redo");
        var operation = this.redos.pop();
        if(operation === undefined) return;
        operation.redo();
        this.undos.push(operation);

    }  
    else if(keyCode==90 && ctrlPressed) {
        // ctrl+z was typed.
        var operation = this.undos.pop();
        if(operation === undefined) return;
        operation.undo();
        this.redos.push(operation);
        console.log("i want to undo",this.undos);
    }
   
	}
});
