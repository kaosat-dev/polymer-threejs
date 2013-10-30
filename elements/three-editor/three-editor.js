Polymer('three-editor', {

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
  },
  update: function()
	{
      this.super();
      //TODO: camera position does not get update by reference ???
      try{this.transformControls.update();}catch(error){}
	},
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
  }

  });
