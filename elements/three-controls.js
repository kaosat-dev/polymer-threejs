Polymer('three-controls', {
		
		show: false,
		flag:false,
		ready: function() {
			show = true;
			this.autoRotate = true;
			console.log("show three controls overlay, ",this.show);
		},
		init:function()
		{
		}
});