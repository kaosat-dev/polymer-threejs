Polymer('three-stats', {
		show:false,
		ready: function() {
			console.log("three stats viewer started",this.$)
			this.init();
		},
		init:function()
		{
			stats = new Stats();
			//stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '100px';
			stats.domElement.style.zIndex = 100;
			this.$.stats.appendChild( stats.domElement );
			this.stats = stats;
		},
		update:function()
		{
			this.stats.update();
		}
		
});