Polymer('three-controls', {
		show: false,
		flag:false,
		ready: function() {
			show = true;
			this.autoRotate = true;
			this.showGrid = true;
			this.showShadows = true;
			this.showAxes = true;
			this.projection = "perspective";
			this.orientation = "diagonal";
		},
		onCapture:function(){
			this.fire("capture-request");
		}
		
});
