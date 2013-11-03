
Polymer('three-editor', {
  someValue: 535,//for testing
  created:function()
  {
    this.super();
    this.commandManager = new CommandManager();
  },
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
        //console.log("pouet");
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
          //console.log("controls rotate",event.value);
          operation = new Rotation(event.value,this.selectedObject);
        break;
        case "translate":
          //console.log("controls translate",event.value);
          operation = new Translation(event.value,this.selectedObject);
        break;
        case "scale":
          //console.log("controls scale",event.value);
          operation = new Scaling(event.value,this.selectedObject);
        break;
      }
      
      if( operation != null)
      {
        this.commandManager.addOperation( operation );
        //hack, have not found a way to get a template instance (repeat) index, if there is one
        //operation.index = this.undos.length - 1;
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
  highlightedObjectChanged:function(oldHovered)
  {
      this.selectionColor = 0xfffccc;
		  this.outlineColor = 0xffc200;
      function validForOutline(selection)
      {
        return (!(selection.hoverOutline != null) && !(selection.outline != null) && !(selection.name === "hoverOutline") && !(selection.name === "boundingCage") && !(selection.name === "selectOutline"))
      }

      var curHovered = this.highlightedObject;

      if (curHovered != null )
      {
        var hoverEffect = new THREE.Object3D();
        var outline, outlineMaterial;
        curHovered.currentHoverHex = curHovered.material.color.getHex();
        curHovered.material.color.setHex(this.selectionColor);
        outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffc200,
            side: THREE.BackSide
          });
        outline = new THREE.Mesh(curHovered.geometry.clone(), outlineMaterial);
        outline.scale.multiplyScalar(1.03);
        outline.name = "hoverOutline";
        curHovered.hoverOutline = outline;
        curHovered.add(outline);
      }
      if(oldHovered != null)
      {
        if (oldHovered.hoverOutline != null)
        {
          oldHovered.material.color.setHex(oldHovered.currentHoverHex);
          oldHovered.remove(oldHovered.hoverOutline);
          oldHovered.hoverOutline = null;
        }
      }
  },
  selectedObjectChanged:function(oldSelection)
  {
    var newSelection = this.selectedObject;
    this.selectObject(newSelection, oldSelection);
  },
  selectObject:function(newSelection, oldSelection)
  {
    if(oldSelection != null && newSelection != null)
    {    
      console.log("SELECTED object changed",newSelection.name,"OLD",oldSelection.name);
    }
    //remove from old selection
    if(oldSelection != null)
    {
      this.transformControls.detach();
      this.scene.remove(this.transformControls);
      oldSelection.controls = null;

      //oldSelection.remove(oldSelection.cage);
      oldSelection.remove(oldSelection.outline);
      oldSelection.cage = null;
      oldSelection.outline = null;
    }
    //add to new selection
    if(newSelection != null)
    {
        this.transformControls.attach( newSelection );
        this.scene.add(this.transformControls);
        newSelection.controls = this.transformControls;

        var outlineMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,//0xffc200,
          side: THREE.BackSide
        });
        outline = new THREE.Mesh(newSelection.geometry.clone(), outlineMaterial);
        outline.name = "selectOutline";
        outline.scale.multiplyScalar(1.03);
        newSelection.outline = outline;
        newSelection.add(outline);
    }
  },
  undo:function()
  {
    this.commandManager.undo();
  },
  redo:function()
  {
    this.commandManager.redo();
  },
  //attribut change handlers
  //event handlers
  keyDown:function(event)
	{
    var keyCode = event.impl.keyCode;
    var ctrlPressed = event.impl.ctrlKey;
    var shiftPressed= event.impl.shiftKey;

    //TODO: how to handle using modifiers for duplicating objects (shift + drag  ?)
    this.shiftPressed = shiftPressed;

		//console.log("key pressed",event);
		if(keyCode == 46) //supr
		{
			if(this.selectedObject!=null && this.selectedObject!=undefined)
			{
				this.rootAssembly.remove(this.selectedObject);
        //TODO: need a more generic system to publish operation into the history
        this.commandManager.addOperation( new Deletion(this.selectedObject,this.rootAssembly) );
				this.selectedObject = null;
			}
		}
    //switch between transform modes : temporary
    if(keyCode == 82)//r
    {
        console.log("set to rotate");
        this.transformControls.setMode("rotate");
    }
    else if (keyCode == 83)
    {
      console.log("set to scale");
      this.transformControls.setMode("scale");
      this.transformControls.setSpace("local");
    }
    else if (keyCode == 84)
    {
      console.log("set to translate");
      this.transformControls.setMode("translate");
    }
    if(keyCode==90 && ctrlPressed && shiftPressed) {
        this.redo();
    }  
    else if(keyCode==90 && ctrlPressed) {
      // ctrl+z was typed.
      this.undo();
    }
	},
  keyUp:function()
  {
      this.cloningDone = false;
      this.shiftPressed = false;
  },

  //TODO: move this, and the html parts to a different web component
  historyUndo:function(event, detail, sender)
  {
    var model = sender.templateInstance_.model;
    var selectedOperation = model.operation;
    var operationIndex = selectedOperation.index;
    var howMany = (this.commandManager.undos.length-1)-operationIndex+1;

    this.commandManager.undoMultiple(howMany);

    event.preventDefault();
    event.stopPropagation();
  },
  historyRedo:function(event, detail, sender)
  {
    var model = event.target.templateInstance.model;
    var selectedOperation = model.operation;
    var operationIndex = this.commandManager.redos.indexOf(selectedOperation);

    this.commandManager.redoMultiple(operationIndex+1);

    event.preventDefault();
    event.stopPropagation();
  }


});
