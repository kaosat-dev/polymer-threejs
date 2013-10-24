class SelectionHelper extends BaseHelper
    #Helper to detect intersection with mouse /touch position (hover and click) and apply effect  
    constructor:(options)->
      super options
      defaults = {hiearchyRoot:null,camera :null ,viewWidth:640, viewHeight:480}
      options = merge defaults, options
      {@hiearchyRoot, @camera, @viewWidth, @viewHeight} = options
      @options = options
      @currentHover = null
      @currentSelect = null
      @selectionColor = 0xfffccc
      @projector = new THREE.Projector()
      
      
      @addEventListener = THREE.EventDispatcher.prototype.addEventListener
      @hasEventListener = THREE.EventDispatcher.prototype.hasEventListener
      @removeEventListener = THREE.EventDispatcher.prototype.removeEventListener
      @dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent
      
    
    _onHover:(selection)=>
      #console.log "currentHover", selection
      if selection?
        @currentHover = selection
        
        if not (selection.hoverOutline?) and not (selection.outline?) and not (selection.name is "hoverOutline") and not (selection.name is "boundingCage") and not (selection.name is "selectOutline")
          selection.currentHoverHex = selection.material.color.getHex()
          selection.material.color.setHex( @selectionColor )
          #
          outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffc200, side: THREE.BackSide } )
          outline = new THREE.Mesh( selection.geometry.clone(), outlineMaterial )
          #outline.position = selection.position
          outline.scale.multiplyScalar(1.03)
          outline.name = "hoverOutline"
          #selection.material.side = THREE.FrontSide
          selection.hoverOutline = outline
          selection.add( outline )
          #console.log "blabli",selection.hoverOutline
          
        @dispatchEvent({type:'hoverIn',selection:selection})
      
    _unHover:=>
      if @currentHover
        if @currentHover.hoverOutline?
          @currentHover.material.color.setHex( @currentHover.currentHoverHex )
          @currentHover.remove(@currentHover.hoverOutline)
          @currentHover.hoverOutline = null
        
        @currentHover = null
        @dispatchEvent({type:'hoverOut',selection:@currentHover})
    
    _onSelect:(selection)=>
      #console.log "currentSelect", selection
      @_unHover()
      @currentSelect = selection
      new BoundingCage({mesh:selection,color:@options.color,textColor:@options.textColor})
      #selection.currentSelectHex = selection.material.color.getHex()
      #selection.material.color.setHex( @selectionColor )
      
      outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffc200, side: THREE.BackSide } )
      outline = new THREE.Mesh( selection.geometry.clone(), outlineMaterial )
      outline.name = "selectOutline"
      #outline.position = selection.position
      outline.scale.multiplyScalar(1.03)
      selection.outline = outline
      selection.add( outline )
      
      @dispatchEvent({type:'selected',selection:selection})
      
    _unSelect:=>
      if @currentSelect
        selection = @currentSelect
        #selection.material.color.setHex( selection.currentSelectHex )
        selection.remove(selection.cage)
        selection.remove(selection.outline)
        selection.cage = null
        selection.outline =null
        @currentSelect = null
        @dispatchEvent({type:'unselected',selection:selection})
      #@currentHover.material = @currentHover.origMaterial if @currentHover.origMaterial
      ###
            newMat = new  THREE.MeshLambertMaterial
                color: 0xCC0000
            @currentHover.origMaterial = @currentHover.material
            @currentHover.material = newMat
            ###
          
    _get3DBB:(object)=>
      #shorthand to get object bounding box
      if object?
        if object.geometry?
          if object.geometry.boundingBox?
            return object.geometry.boundingBox
          else
            object.geometry.computeBoundingBox()
            return object.geometry.boundingBox
      return null
    
    getScreenCoords:(object, width, height)=>
      if object?
        vector = @projector.projectVector( object.position.clone(), @camera )
        result = new THREE.Vector2()
        result.x = Math.round( vector.x * (width/2) ) + width/2
        result.y = Math.round( (0-vector.y) * (height/2) ) + height/2
        return result
      
             
    get2DBB:(object,width,height)=>
      #get the 2d (screen) bounding box of 3d object
      if object?
        bbox3d = @_get3DBB(object)
        min3d = bbox3d.min.clone()
        max3d = bbox3d.max.clone()
        
        objLength = bbox3d.max.x-bbox3d.min.x
        objWidth  = bbox3d.max.y-bbox3d.min.y
        objHeight = bbox3d.max.z-bbox3d.min.z
        
        
        pMin = @projector.projectVector(min3d, @camera) #projectedMin
        pMax = @projector.projectVector(max3d, @camera) #projectedMax
      
        minPercX = (pMin.x + 1) / 2
        minPercY = (-pMin.y + 1) / 2
        # scale these values to our viewport size
        minLeft = minPercX * width
        minTop = minPercY * height
        
        maxPercX = (pMax.x + 1) / 2
        maxPercY = (-pMax.y + 1) / 2
        # scale these values to our viewport size
        maxLeft = maxPercX * width
        maxTop = maxPercY * height
        
        #console.log "min3d",min3d,"pMin",pMin,"max3d", max3d,"pMax" ,pMax
        #,centerX,centerY
        pos = object.position.clone()
        pos = @projector.projectVector(pos, @camera) #projectedMin
        centerPercX = (pos.x + 1) / 2
        centerPercY = (-pos.y + 1) / 2
        centerLeft = centerPercX * width
        centerTop = centerPercY * height
        
        
        #result = [minLeft, minTop, maxLeft, maxTop, centerLeft,centerTop]
        result = [centerLeft,centerTop,objLength,objWidth,objHeight]
        #console.log "selection positions",result
        return result
        
    isThereObjectAt:(x,y)=>
      v = new THREE.Vector3((x/@viewWidth)*2-1, -(y/@viewHeight)*2+1, 0.5)
      @projector.unprojectVector(v, @camera)
      raycaster = new THREE.Raycaster(@camera.position, v.sub(@camera.position).normalize())
      intersects = raycaster.intersectObjects(@hiearchyRoot, true )
      
      if intersects.length > 0
        return true
      return false
    
    getObjectAt:(x,y)=>
      v = new THREE.Vector3((x/@viewWidth)*2-1, -(y/@viewHeight)*2+1, 0.5)
      @projector.unprojectVector(v, @camera)
      raycaster = new THREE.Raycaster(@camera.position, v.sub(@camera.position).normalize())
      intersects = raycaster.intersectObjects(@hiearchyRoot, true )
      
      if intersects.length > 0
        intersected = intersects[0].object
        if intersected.name in ["hoverOutline","selectOutline","boundingCage"]
          intersected=intersected.parent
        return intersected
      else
        return null
      
    selectObjectAt:(x,y)=>
      v = new THREE.Vector3((x/@viewWidth)*2-1, -(y/@viewHeight)*2+1, 0.5)
      @projector.unprojectVector(v, @camera)
      raycaster = new THREE.Raycaster(@camera.position, v.sub(@camera.position).normalize())
      intersects = raycaster.intersectObjects(@hiearchyRoot, true )
      
      if intersects.length > 0
        intersected = intersects[0].object
        if intersected.name in ["hoverOutline","selectOutline","boundingCage"]#is "hoverOutline" or intersected is "selectOutline"
          intersected=intersected.parent
        if intersected != @currentSelect
          @_unSelect()
          @_onSelect( intersected )
          return @currentSelect
        else
          return @currentSelect
      #else if @currentSelect?
      #  return @currentSelect
      else
        console.log "otot"
        @_unSelect()
    
    highlightObjectAt:(x,y)=>
      v = new THREE.Vector3((x/@viewWidth)*2-1, -(y/@viewHeight)*2+1, 0.5)
      @projector.unprojectVector(v, @camera)
      raycaster = new THREE.Raycaster(@camera.position, v.sub(@camera.position).normalize())
      intersects = raycaster.intersectObjects(@hiearchyRoot, true )
      
      if intersects.length > 0
        if intersects[0].object != @currentHover
          if intersects[0].object.name != "workplane"
            @_unHover()
            @_onHover(intersects[0].object)
      else
        @_unHover()
