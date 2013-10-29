Polymer('three-viewer-extra', {
	
	captureRequest:function()
	{
		console.log("screen capture requested");
		var name = "screenshot.png";
		function screenCapDone(imgData)
		{
			//downloadWithName(imgData, "screenshot.png")
      console.log("ii",imgData);
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


			

