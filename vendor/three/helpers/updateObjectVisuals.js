updateVisuals = function(rootAssembly, settings) {
	//TODO: clean up coffeescript converted code
    var applyStyle, child, removeRenderHelpers, _i, _len, _ref, _results,
      _this = this;
    console.log("applying visual style to " + rootAssembly);
    removeRenderHelpers = function(child) {
      if (child.renderSubElementsHelper != null) {
        child.remove(child.renderSubElementsHelper);
        return child.renderSubElementsHelper = null;
      }
    };
    applyStyle = function(child) {
      var basicMaterial1, dashMaterial, geom, obj2, obj3, obj4, renderSubElementsHelper, subchild, wireFrameMaterial, _i, _len, _ref, _results;
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
      _ref = child.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subchild = _ref[_i];
        if (subchild.name !== "renderSubs" && subchild.name !== "connectors") {
          _results.push(applyStyle(subchild));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    if (rootAssembly != null) {
      _ref = rootAssembly.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(applyStyle(child));
      }
      return _results;
    }
  };