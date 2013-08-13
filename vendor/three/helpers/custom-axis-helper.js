THREE.ArrowHelper2 = function (direction, origin, length, color) {
	THREE.Object3D.call( this );
	
	this.direction = direction || new THREE.Vector3(1,0,0);
	this.origin = origin || new THREE.Vector3(0,0,0);
	this.length = length || 50;
	this.color = color || "#FF0000";
	
	//dir, origin, length, hex
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push(this.origin);
	lineGeometry.vertices.push(this.direction.setLength(this.length));
	this.line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color: this.color } ) );
	this.add(this.line);
	  
	this.arrowHeadRootPosition = this.origin.clone().add(this.direction);
	this.arrowHead = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 5, 10, 10, false), new THREE.MeshBasicMaterial({color:this.color}));
	this.arrowHead.position = this.arrowHeadRootPosition;
	this.add( this.arrowHead );
	
}
THREE.ArrowHelper2.prototype = Object.create( THREE.Object3D.prototype );


      
THREE.LabeledAxes = function (size, xColor, yColor, zColor, textColor, addLabels, addArrows) { 
	 THREE.Object3D.call( this );
	
      this.size = size || 50 ;
      this.xColor = xColor || "0xFF7700" ;
      this.yColor = yColor || "0x77FF00" ;
      this.zColor = zColor || "0x0077FF" ;
      this.textColor = textColor  || "#FFFFFF" ;
      addLabels = addLabels || true ;
      addArrows = addArrows || true ;
      
      this.xColor = new THREE.Color().setHex( this.xColor );
      this.yColor = new THREE.Color().setHex( this.yColor );
      this.zColor = new THREE.Color().setHex( this.zColor );
	
	
	var bla = this._drawText("X",18,true, 1);
	this.add(bla);
	
	if ( addLabels == true )
      {
        var s = this.size * 1.1;
        var fontSize = 18 ;
        var scale = 50;//0.008 ;
        
        this.xLabel=this._drawText("X",fontSize,true, scale);
        //this.xLabel.position.set(s,0,0);
        
        this.yLabel=this._drawText("Y",fontSize,false, scale);
        this.yLabel.position.set(0,s,0);
        
        this.zLabel=this._drawText("Z",fontSize,false, scale);
        this.zLabel.position.set(0,0,s);
      }  
      if ( addArrows == true )
      {
        s = this.size / 1.25; // THREE.ArrowHelper arrow length
        this.xArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,0),s, this.xColor);
        this.yArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0),s, this.yColor);
        this.zArrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0),s, this.zColor);
        this.add( this.xArrow );
        this.add( this.yArrow );
        this.add( this.zArrow );
      }
      else
      {
      	this._buildAxes()
      }
      
      this.add( this.xLabel );
      this.add( this.yLabel );
      this.add( this.zLabel );
      this.name = "axes";
}

THREE.LabeledAxes.prototype = Object.create( THREE.Object3D.prototype );

THREE.LabeledAxes.prototype.toggle = function(toggle) {
	
	//apply visibility settings to all children 
      this.traverse( function( child ) {
      	child.visible = toggle;
      });
};


THREE.LabeledAxes.prototype._buildAxes = function() {
      
    lineGeometryX = new THREE.Geometry();
	  lineGeometryX.vertices.push( new THREE.Vector3(-this.size, 0, 0 ));
	  lineGeometryX.vertices.push( new THREE.Vector3( this.size, 0, 0 ));
	  xLine = new THREE.Line( lineGeometryX, new THREE.LineBasicMaterial( { color: this.xColor } ) );
	  
	  lineGeometryY = new THREE.Geometry();
	  lineGeometryY.vertices.push( new THREE.Vector3(0, -this.size, 0 ));
	  lineGeometryY.vertices.push( new THREE.Vector3( 0, this.size, 0 ));
	  yLine = new THREE.Line( lineGeometryY, new THREE.LineBasicMaterial( { color: this.yColor } ) );
	  
	  lineGeometryZ = new THREE.Geometry();
	  lineGeometryZ.vertices.push( new THREE.Vector3(0, 0, -this.size ));
	  lineGeometryZ.vertices.push( new THREE.Vector3(0, 0, this.size ));
	  zLine = new THREE.Line( lineGeometryZ, new THREE.LineBasicMaterial( { color: this.zColor } ) );
	  
	  this.add( xLine );
	  this.add( yLine );
	  this.add( zLine );    
}

THREE.LabeledAxes.prototype._drawText = function(text, displaySize, background, scale) {
  var borderThickness, canvas, context, fontSize, metrics, rect, sprite, spriteMaterial, textWidth, texture;
  var fontSize = displaySize || 18;
  var fontFace = "Arial"
  var background = background || false;
  var scale = scale || 1.0;
  
  
  	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontSize + "px " + fontFace;
  
  	context.fillStyle = "rgba(0, 0, 0, 1.0)";
	context.fillText( text, borderThickness , fontSize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.topLeft } );
 	var sprite = new THREE.Sprite(spriteMaterial);
  	sprite.scale.set(100 * scale, 50 * scale, 1.0);
  	return sprite;
 
};
      