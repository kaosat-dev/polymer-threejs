Polymer('three-stats', {
		
		ready: function() {
			console.log("three stats viewer startedqsd")
			this.init();
		},
		init:function()
		{
			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.bottom = '0px';
			stats.domElement.style.zIndex = 100;
			this.$.stats.appendChild( stats.domElement );
			this.stats = stats;
		},
		update:function()
		{
			
		}
		
		  });