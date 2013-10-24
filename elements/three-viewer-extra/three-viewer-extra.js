Polymer('three-viewer-extra', {
	
	captureRequest:function()
	{
		console.log("screen capture requested");
		var name = "screenshot.png";
		function screenCapDone(imgData)
		{
			/*function downloadWithName(uri, name) {
				function eventFire(el, etype){
				    if (el.fireEvent) {
				        (el.fireEvent('on' + etype));
				    } else {
				        var evObj = document.createEvent('Events');
				        evObj.initEvent(etype, true, false);
				        el.dispatchEvent(evObj);
				    }
				}

				var link = document.createElement("a");
				link.download = name;
				link.href = uri;
				eventFire(link, "click");

			}*/
		
			//downloadWithName(imgData, "screenshot.png")
			var link = this.$.downloadAutoLink.impl;
			link.download = name;
			link.href = imgData;
			link.click();
			console.log("this.$.downloadAutoLink",this.$.downloadAutoLink,"link", link);
			/*var link = document.createElement("a");
			link.download = name;
			link.href = imgData;
			link.click();*/
		}
		this.captureScreen(screenCapDone.bind(this));
	}
});


			

