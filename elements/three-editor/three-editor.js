Polymer('three-editor', {

  enteredView:function()
  {
    this.super();
    console.log("editor entered view");
    /*    
     #if mousedown PLUS move NOT over object : rotate/pan, do not deselect current obect
      
      ###TRANSFORM CONTROLS###
      @transformControls = new THREE.TransformControls(@camera, @renderer.domElement)
      #@transformControls.scale = 0.65
      
      onControlsChange=(ev)=>
        @controls.enabled = true
        if @transformControls.axis then @controls.enabled = false
        #if (editor.selected) signals.objectChanged.dispatch( editor.selected )
        @onObjectSelected({type:'selected',selection:@selectionHelper.currentSelect} )

        @_render()
        
      @transformControls.addEventListener( 'change', onControlsChange)
      @on("selectionChange",@_onSelectionChange)*/
  }
  });
