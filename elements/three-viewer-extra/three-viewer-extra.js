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
	}
});


			

