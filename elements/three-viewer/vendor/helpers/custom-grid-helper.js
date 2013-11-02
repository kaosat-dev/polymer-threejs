
THREE.TextDrawHelper = function () {
}

THREE.TextDrawHelper.prototype.drawText = function(text, displaySize, background, scale) {
  var borderThickness, canvas, context, fontSize, metrics, rect, sprite, spriteMaterial, textWidth, texture;
  fontSize = displaySize || 18;
  background = background || false;
  scale = scale || 1.0;
  canvas = document.createElement('canvas');
  borderThickness = 2;
  context = canvas.getContext('2d');
  context.font = "15px Arial";
  context.textAlign = 'center';
  context.fillStyle = this.textColor;
  context.fillStyle = "rgba(0, 0, 0, 1.0)";
  rect = function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
    return ctx.stroke();
  };
  if (background) {
    metrics = context.measureText(text);
    textWidth = metrics.width;
    context.fillStyle = "rgba(255, 255, 255, 0.55)";
    context.strokeStyle = "rgba(255,255,255,0.55)";
    rect(context, canvas.width / 2 - fontSize, canvas.height / 2 - fontSize, textWidth + borderThickness, fontSize * 1.4 + borderThickness, 6);
  }
  context.strokeStyle = this.textColor;
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.5,
    useScreenCoordinates: false,
    scaleByViewport: false,
    color: 0xffffff
  });
  sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(100 * scale, 50 * scale, 1.0);
  return sprite;
};

THREE.TextDrawHelper.prototype.drawTextOnPlane = function(text, size) {
  var canvas, context, material, plane, texture;
  if (size == null) {
    size = 256;
  }
  canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  context = canvas.getContext('2d');
  context.font = "18px sans-serif";
  context.textAlign = 'center';
  context.fillStyle = this.textColor;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  context.strokeStyle = this.textColor;
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  texture.generateMipmaps = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 0xffffff,
    alphaTest: 0.2
  });
  plane = new THREE.Mesh(new THREE.PlaneGeometry(size / 8, size / 8), material);
  plane.doubleSided = true;
  plane.overdraw = true;
  return plane;
};

THREE.TextDrawHelper.prototype = Object.create( THREE.Object3D.prototype );


THREE.CustomGridHelper = function ( size, step , upVector, color, opacity, text, textColor, textPosition) {
	
      defaults = {
        size: 1000,
        step: 100,
        color: 0xFFFFFF,
        opacity: 0.1,
        addText: true,
        textColor: "#FFFFFF",
        textLocation: "f",
        rootAssembly: null
      };
      THREE.Object3D.call( this );
      
      this.size = size || 1000;
      this.step = step || 100;
      this.color = color ||  0x00baff;
      this.opacity = opacity || 0.2;
      this.text = text || true;
      this.textColor= textColor || "#000000";
      this.textPosition =  "center";
      this.upVector = upVector || new THREE.Vector3(0,1,0);
      
      this.name = "grid";
      
      this._drawGrid();

      //default grid orientation is z up, rotate if not the case
      var upVector = this.upVector;
      this.up = upVector;
      this.lookAt(upVector);
};

THREE.CustomGridHelper.prototype = Object.create( THREE.Object3D.prototype );

THREE.CustomGridHelper.prototype._drawGrid = function() {
      var gridGeometry, gridMaterial, mainGridZ, planeFragmentShader, planeGeometry, planeMaterial, subGridGeometry, subGridMaterial, subGridZ;
      
      var size= this.size;
      var step = this.step;
      
      //offset to avoid z fighting
      mainGridZ = -0.05;
      gridGeometry = new THREE.Geometry();
      gridMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHex(this.color),
        opacity: this.opacity,
        linewidth: 2,
        transparent: true
      });
      
      for (var i = -size/2; i <= size/2; i += step)
  	  {
        gridGeometry.vertices.push(new THREE.Vector3(-size / 2, i, mainGridZ));
        gridGeometry.vertices.push(new THREE.Vector3(size / 2, i, mainGridZ));
        gridGeometry.vertices.push(new THREE.Vector3(i, -size / 2, mainGridZ));
        gridGeometry.vertices.push(new THREE.Vector3(i, size / 2, mainGridZ));
      }
      
      this.mainGrid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
      subGridZ = -0.05;
      subGridGeometry = new THREE.Geometry();
      subGridMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHex(this.color),
        opacity: this.opacity / 2,
        transparent: true
      });
      
      for (var i = -size/2; i <= size/2; i += step/10)
      {
        subGridGeometry.vertices.push(new THREE.Vector3(-size / 2, i, subGridZ));
        subGridGeometry.vertices.push(new THREE.Vector3(size / 2, i, subGridZ));
        subGridGeometry.vertices.push(new THREE.Vector3(i, -size / 2, subGridZ));
        subGridGeometry.vertices.push(new THREE.Vector3(i, size / 2, subGridZ));
      }  
      //create sub grid geometry object
      this.subGrid = new THREE.Line(subGridGeometry, subGridMaterial, THREE.LinePieces);

		//create plane for shadow projection      
      planeGeometry = new THREE.PlaneGeometry(-size, size, 5, 5);
      planeFragmentShader = [
      "uniform vec3 diffuse;",
      "uniform float opacity;",
      THREE.ShaderChunk["color_pars_fragment"],
      THREE.ShaderChunk["map_pars_fragment"],
      THREE.ShaderChunk["lightmap_pars_fragment"],
      THREE.ShaderChunk["envmap_pars_fragment"],
      THREE.ShaderChunk["fog_pars_fragment"], 
      THREE.ShaderChunk["shadowmap_pars_fragment"], 
      THREE.ShaderChunk["specularmap_pars_fragment"], 
      "void main() {",
      	"gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );",
      	THREE.ShaderChunk["map_fragment"],
      	THREE.ShaderChunk["alphatest_fragment"], 
      	THREE.ShaderChunk["specularmap_fragment"], 
      	THREE.ShaderChunk["lightmap_fragment"], 
      	THREE.ShaderChunk["color_fragment"], 
      	THREE.ShaderChunk["envmap_fragment"], 
      	THREE.ShaderChunk["shadowmap_fragment"], 
      	THREE.ShaderChunk["linear_to_gamma_fragment"], 
      	THREE.ShaderChunk["fog_fragment"], 
      	"gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 - shadowColor.x );",
      	"}"
      	].join("\n");
      	
      planeMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.ShaderLib['basic'].uniforms,
        vertexShader: THREE.ShaderLib['basic'].vertexShader,
        fragmentShader: planeFragmentShader,
        color: 0x0000FF,
        transparent: true
      });
      
      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = Math.PI;
      this.plane.position.z = -0.8;
      this.plane.name = "workplane";
      this.plane.receiveShadow = true;
      
      //add all grids, subgrids, and plane
      this.add(this.mainGrid);
      this.add(this.subGrid);
      this.add(this.plane);
      this._drawNumbering();
};


THREE.CustomGridHelper.prototype.toggle = function(toggle) {
	
	//apply visibility settings to all children 
      this.traverse( function( child ) {
      	child.visible = toggle;
      });
};

THREE.CustomGridHelper.prototype.setOpacity = function(opacity) {
      this.opacity = opacity;
      this.mainGrid.material.opacity = opacity;
      this.subGrid.material.opacity = opacity;
};

THREE.CustomGridHelper.prototype.setColor = function(color) {
      this.color = color;
      this.mainGrid.material.color = new THREE.Color().setHex(this.color);
      this.subGrid.material.color = new THREE.Color().setHex(this.color);
};


THREE.CustomGridHelper.prototype.toggleText = function(toggle) {
  this.text = toggle;
  var labels = this.labels.children;
  for (var i = 0; i < this.labels.children.length; i++) {
    var label = labels[i];
    label.visible = toggle;
  }
};

THREE.CustomGridHelper.prototype.setTextColor = function(color) {
  this.textColor = color;
  return this._drawNumbering();
};

THREE.CustomGridHelper.prototype.setTextLocation = function(location) {
  this.textLocation = location;
  return this._drawNumbering();
};

THREE.CustomGridHelper.prototype.resize = function(size) {
  if (size !== this.size) {
    this.size = size;
    this.remove(this.mainGrid);
    this.remove(this.subGrid);
    this.remove(this.plane);
    return this._drawGrid();
  }
};

THREE.CustomGridHelper.prototype._drawNumbering = function() {
      var label, sizeLabel, sizeLabel2, xLabelsLeft, xLabelsRight, yLabelsBack, yLabelsFront;
      var size = this.size;
      var step = this.step;
      
      //this fails completely in polymer.js, very weird bug: (in firefox aurora)
      //TypeError: Argument 6 is not valid for any of the 6-argument overloads of WebGLRenderingContext.texImage2D.
      //any attempts at rendering a texture from canvas seem to fail as well (sprite material tested as well)
		      
		/*var totot =  this.drawTextOnPlane("blabla blabla", 32);
	  this.mainGrid.add(totot)	*/
	  
      if (this.labels != null) {
        this.mainGrid.remove(this.labels);
      }
      this.labels = new THREE.Object3D();
      xLabelsLeft = new THREE.Object3D();
      yLabelsFront = new THREE.Object3D();
      
      for (var i = -size/2; i <= size/2; i += step)
  	  {
        sizeLabel = this.drawTextOnPlane("" + i, 32);
        sizeLabel2 = sizeLabel.clone();
        sizeLabel.rotation.z = Math.PI / 2;
        sizeLabel.position.set(i, this.size / 2, 0.1);
        xLabelsLeft.add(sizeLabel);
        if (this.textLocation === "center") {
          if (i !== 0) {
            sizeLabel2.position.set(this.size / 2, i, 0.1);
            sizeLabel2.rotation.z = Math.PI / 2;
            yLabelsFront.add(sizeLabel2);
          }
        } else {
          if (i !== this.size / 2 && i !== -this.size / 2) {
            sizeLabel2.position.set(this.size / 2, i, 0.1);
            sizeLabel2.rotation.z = Math.PI / 2;
            yLabelsFront.add(sizeLabel2);
          }
        }
      }
      if (this.textLocation === "center") {
        xLabelsLeft.translateY(-this.size / 2);
        yLabelsFront.translateX(-this.size / 2);
      } else {
        xLabelsRight = xLabelsLeft.clone().translateY(-this.size);
        yLabelsBack = yLabelsFront.clone().translateX(-this.size);
        this.labels.add(xLabelsRight);
        this.labels.add(yLabelsBack);
      }
      this.labels.add(xLabelsLeft);
      this.labels.add(yLabelsFront);
      
      //apply visibility settings to all labels
      var textVisible = this.text;
      this.labels.traverse( function( child  ) {
      	child.visible = textVisible;
      });
      
      
      this.mainGrid.add(this.labels);
};

THREE.CustomGridHelper.prototype.drawTextOnPlane = function(text, size) {
  var canvas, context, material, plane, texture;
  
  if (size == null) {
    size = 256;
  }
  
  canvas = document.createElement('canvas');
  var size = 128;
  canvas.width = size;
  canvas.height = size;
  context = canvas.getContext('2d');
  context.font = "18px sans-serif";
  context.textAlign = 'center';
  context.fillStyle = this.textColor;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  context.strokeStyle = this.textColor;
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  
  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
      texture.generateMipmaps = true;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
  
  material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 0xffffff,
    alphaTest: 0.3
  });
  plane = new THREE.Mesh(new THREE.PlaneGeometry(size / 8, size / 8), material);
  plane.doubleSided = true
  plane.overdraw = true
  
  return plane;
  
};


//autoresize, disabled for now
/*
THREE.CustomGridHelper.prototype.updateGridSize = function() {
      var max, maxX, maxY, min, minX, minY, size, subchild, _getBounds, _i, _len, _ref,
        _this = this;
      minX = 99999;
      maxX = -99999;
      minY = 99999;
      maxY = -99999;
      _getBounds = function(mesh) {
        var bBox, subchild, _i, _len, _ref, _results;
        if (mesh instanceof THREE.Mesh) {
          mesh.geometry.computeBoundingBox();
          bBox = mesh.geometry.boundingBox;
          minX = Math.min(minX, bBox.min.x);
          maxX = Math.max(maxX, bBox.max.x);
          minY = Math.min(minY, bBox.min.y);
          maxY = Math.max(maxY, bBox.max.y);
          _ref = mesh.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subchild = _ref[_i];
            _results.push(_getBounds(subchild));
          }
          return _results;
        }
      };
      if (this.rootAssembly != null) {
        _ref = this.rootAssembly.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subchild = _ref[_i];
          if (subchild.name !== "renderSubs" && subchild.name !== "connectors") {
            _getBounds(subchild);
          }
        }
      }
      max = Math.max(Math.max(maxX, maxY), 100);
      min = Math.min(Math.min(minX, minY), -100);
      size = (Math.max(max, Math.abs(min))) * 2;
      size = Math.ceil(size / 10) * 10;
      if (size >= 200) {
        return this.resize(size);
      }
};
*/
