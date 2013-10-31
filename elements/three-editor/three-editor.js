//operation "class"
Operation = function ( type, value, target)
{
  this.type = type;
  this.value = value;
  this.target = target;
}

Translation = function ( value, target)
{
  Operation.call( this );
  this.type = "translation";
  this.value = value;
  this.target = target;
}
Translation.prototype = Object.create( Operation.prototype );

Translation.prototype.undo = function()
{
    this.target.position.sub(this.value);
}

Translation.prototype.redo = function()
{
    this.target.position.add(this.value);
}

Rotation = function ( value, target)
{
  Operation.call( this );
  this.type = "rotation";
  this.value = value;
  this.target = target;
}
Rotation.prototype = Object.create( Operation.prototype );

Rotation.prototype.undo = function()
{
    //this.target.position.sub(this.value);
    this.target.rotation.x -= this.value.x;
    this.target.rotation.y -= this.value.y;
    this.target.rotation.z -= this.value.z;
}

Rotation.prototype.redo = function()
{
    this.target.rotation.x += this.value.x;
    this.target.rotation.y += this.value.y;
    this.target.rotation.z += this.value.z;
}

//

Polymer('three-editor', {
  undos:[],//for undo redo
  redos:[],
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
