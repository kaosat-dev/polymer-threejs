Polymer('three-editor', {

  created:function()
  {
    this.super();

    //setup template filters
    function toFixed(fractions) {
      return {
        toDOM: function(value) {
          console.log("yipee");
          return Number(value).toFixed(fractions);
        }
      };
    }

    //does not get updated correctly : path/object.observe issue?
    function rVector(fractions) {
      return {
        toDOM: function(value) {
          if(value != null && value !=undefined)
          {
            console.log("blah");
            return value;
            return "x:"+value.x.toFixed(fractions)+" y:"+value.y.toFixed(fractions)+" z:"+value.y.toFixed(fractions);
          }
          else{console.log("hn"); return "";}
        }
      };
    }


    PolymerExpressions.filters.toFixed = toFixed;
    PolymerExpressions.filters.rVector = rVector;


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
        this.$.commandManager.addOperation( operation );
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
    this.$.commandManager.undo();
  },
  redo:function()
  {
    this.$.commandManager.redo();
  },
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
        var parent = this.selectedObject.parent
        parent.remove(this.selectedObject);
				//this.rootAssembly.remove(this.selectedObject);
        //TODO: need a more generic system to publish operation into the history
        this.$.commandManager.addOperation( new Deletion(this.selectedObject,parent) );
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
    console.log("keyCode", keyCode);
     if(keyCode == 87)//W
    {
      console.log("go fullscreen");
      this.fullScreen= !this.fullScreen;
    }
	},
  keyUp:function()
  {
      this.cloningDone = false;
      this.shiftPressed = false;
  },
  longStaticTap:function(x,y)
  {
        var pickeds = this.selectionHelper.pick(x,y);
        
        if(pickeds.length >0)
        {
          var coords = pickeds[0].point;
          var geometry = new THREE.SphereGeometry( 5, 16, 16 ); 
        }
        else
        {
          var geometry = new THREE.CubeGeometry( 10, 10, 10 ); 
          var coords = this.selectionHelper.getSceneCoords(x,y);
        }
        console.log("blabla long action adding stuff to scene",coords,pickeds);

			  var material = new THREE.MeshLambertMaterial( {color: 0xff0000} ); 
			  var mesh = new THREE.Mesh(geometry, material);
        mesh.name = "pickerCube";
			  
        if(pickeds.length  == 0)
        {
          this.addToScene( mesh );
          mesh.position.set(coords.x,coords.y,coords.z); 
          this.$.commandManager.addOperation(new Creation(mesh,this.rootAssembly));
        }
        else
        {
          var parent = pickeds[0].object;
          parent.add( mesh );
          parent.material.wireframe = true;

          console.log("parent",parent,"current",mesh);

          var rcoords = parent.worldToLocal(coords);
          mesh.position.set(rcoords.x,rcoords.y,rcoords.z); 
          
          /*
          parent.visible = false;
          this.selectedObject = mesh;
          mesh.frustumCulled = false;
          mesh.material.depthTest= false;
          mesh.material.depthWrite= false;
          mesh.material.wireframe= true;*/
          
          //mesh.position.set(0,0,0); 
          //this.rootAssembly.add(mesh);
          console.log("global coords", mesh.localToWorld( mesh.position.clone()  ));
      
          this.$.commandManager.addOperation(new Creation(mesh,parent));
        }
  },
  addShape:function(event, detail, sender)
  {
    console.log("i want to add shapes");
  },
  addAnnotation:function(event, detail, sender)
  {
    console.log("i want to add annotation");
    var x = event.impl.offsetX;
    var y = event.impl.offsetY;
    this.selectionHelper.pick(x,y);
  }

});
