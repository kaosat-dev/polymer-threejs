Polymer('three-viewer-extra', {
	showControls : false,
  enteredView:function()
  {
    this.super();

    var color = color || "blue";
    var element = document.createElement( 'div' );
		element.style.width = 'auto';
		element.style.height = 'auto';
    element.style.fontSize = "130%";
    element.style.textAlign = "center";
    element.style.backgroundColor = 'rgba(250,250,250,0.5)';

    var wowzers = document.createElement("three-controls"); //document.createElement("dummy-element");
    element.appendChild(wowzers);
    wowzers.style.backgroundColor = color;

		var object = new THREE.CSS3DObject( element );//CSS3DSprite
		object.position.x = 0;
		object.position.y = 30;
		object.position.z = 0;
    object.scale.x = 0.2;
	  object.scale.y = 0.2;

    /*var sizeEl = document.createElement( 'div' );
	  sizeEl.className = 'symbol';
	  sizeEl.textContent = size.toFixed(2)+" mm";
    //sizeEl.contentEditable = "true";
	  element.appendChild( sizeEl );*/
    console.log("superDuper");
    this.overlayScene.add( object );

    function addDimention(size, color)
      {
        var color = color || "blue";
        var element = document.createElement( 'div' );
				element.style.width = 'auto';
				element.style.height = 'auto';
        element.style.fontSize = "130%";
        element.style.textAlign = "center";
        element.style.backgroundColor = 'rgba(250,250,250,0.5)';

        var sizeEl = document.createElement( 'div' );
			  sizeEl.className = 'symbol';
			  sizeEl.textContent = size.toFixed(2)+" mm";
        //sizeEl.contentEditable = "true";
			  element.appendChild( sizeEl );

        var wowzers = document.createElement("three-viewer"); //document.createElement("dummy-element");
        element.appendChild(wowzers);
        //wowzers.style.backgroundColor = color;

				var object = new THREE.CSS3DObject( element );//CSS3DSprite
				object.position.x = 0;
				object.position.y = 0;
				object.position.z = 0;
				object.scale.x = 0.2;
				object.scale.y = 0.2;
				
        return [object,wowzers];
      }

      var height = addDimention(80,"orange")[0];
      //height.rotation.x = Math.PI/2;
      height.position.z = 20;
      height.position.y = -40;
      height.position.x = 0;
      this.overlayScene.add( height );

  },
	captureRequest:function()
	{
		console.log("screen capture requested");
		var name = "screenshot.png";
		function screenCapDone(imgData)
		{
			var link = this.$.downloadAutoLink.impl;
			link.download = name;
			link.href = imgData;
			link.click();
			/*var link = document.createElement("a");
			link.download = name;
			link.href = imgData;
			link.click();*/
		}
		this.captureScreen(screenCapDone.bind(this));
	},
	pointerMove2:function(event)
	{
			//this.super(event); //TODO: how to handle these kind of event handlers + inheritance ?
			this.pointerMove(event);
			/*
			var x = event.impl.offsetX;
      var y = event.impl.offsetY;
			function moveOverlay()
			{
				this.$.infoOverlay.impl.style.left = x+"px";
				this.$.infoOverlay.impl.style.top  = y+"px";
				//console.log("this.$.infoOverlay.left",this.$.infoOverlay);
			}
			this.async(moveOverlay);
			//this.$.infoOverlay.impl.style.left = x+"px";
			//this.$.infoOverlay.impl.style.top  = y+"px";*/
	}


});


			

