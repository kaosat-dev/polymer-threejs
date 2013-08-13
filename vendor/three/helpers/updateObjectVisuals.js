updateVisuals = function(rootAssembly, settings) {
	//TODO: clean up coffeescript converted code
	console.log("applying visual style to " + rootAssembly);

	rootAssembly.traverse( function( child ) {
		
		removeRenderHelpers = function(child) {
			//remove any visual helpers along the way
			if (child.renderSubElementsHelper != null) {
	        	child.remove(child.renderSubElementsHelper);
	        	return child.renderSubElementsHelper = null;
	      	}
    	};
      	
      	//apply styling provided by settings
      	child.castShadow = settings.shadows;
      	child.receiveShadow = settings.selfShadows && settings.shadows;
      	
		if (child.material != null) {
	        child.material.vertexColors = THREE.VertexColors;
	    }

		switch (settings.objectViewMode) {
        case "shaded":
          removeRenderHelpers(child);
          if (child.material != null) {
            child.material.wireframe = false;
          }
          break;
        case "wireframe":
          removeRenderHelpers(child);
          if (child.material != null) {
            child.material.wireframe = true;
          }
          break;
        case "structural":
          if (child.material != null) {
            child.material.wireframe = false;
          }
          if (child.geometry != null) {
            removeRenderHelpers(child);
            basicMaterial1 = new THREE.MeshBasicMaterial({
              color: 0xccccdd,
              side: THREE.DoubleSide,
              depthTest: true,
              polygonOffset: true,
              polygonOffsetFactor: 1,
              polygonOffsetUnits: 1
            });
            dashMaterial = new THREE.LineDashedMaterial({
              color: 0x000000,
              dashSize: 2,
              gapSize: 3,
              depthTest: false,
              polygonOffset: true,
              polygonOffsetFactor: 1,
              polygonOffsetUnits: 1
            });
            wireFrameMaterial = new THREE.MeshBasicMaterial({
              color: 0x000000,
              depthTest: true,
              polygonOffset: true,
              polygonOffsetFactor: 1,
              polygonOffsetUnits: 1,
              wireframe: true
            });
            renderSubElementsHelper = new THREE.Object3D();
            renderSubElementsHelper.name = "renderSubs";
            geom = child.geometry;
            obj2 = new THREE.Mesh(geom.clone(), basicMaterial1);
            obj3 = new THREE.Line(geometryToline(geom.clone()), dashMaterial, THREE.LinePieces);
            obj4 = new THREE.Mesh(geom.clone(), wireFrameMaterial);
            renderSubElementsHelper.add(obj2);
            renderSubElementsHelper.add(obj3);
            renderSubElementsHelper.add(obj4);
            child.add(renderSubElementsHelper);
            child.renderSubElementsHelper = renderSubElementsHelper;
          }
      }	
	});
};