Vsf(function(u) { return {
meta: {
	className: 'site.Site',
	requiredClasses: ['site.Series', 'site.Player', 'tool.PubSub']
}, 
members: {
	init: function(options) {

		this.defaultSeries = options.defaultSeries;
		this.currentSeriesIndex = this.defaultSeries;
		
		this.stack = [this.defaultSeries];
		var player = u('create')('site.Player');

		this.series = [];
		if (options.series) {
			for (var i=0, iMax=options.series.length; i<iMax; i++) {
				options.series[i].player = player;
				this.series.push( u('create')('site.Series', options.series[i]) );
			}
		}

		u('create')('tool.PubSub').subscribe('next-video', function(info) {
			this.series[this.currentSeriesIndex].playNext();
		}, this);
		
		u('create')('tool.PubSub').subscribe('previous-video', function(info) {
			this.series[this.currentSeriesIndex].playPrevious();
		}, this);
		
		u('create')('tool.PubSub').subscribe('series-down', function() {
			var link = this.series[this.currentSeriesIndex].stopCurrent();
			if (link.indexOf('http') === 0) {
				window.location.href = link;
				return;
			}
			var newSeriesIndex = this.findSeriesIndexByTitle(link);
			if (newSeriesIndex !== null) {
				this.currentSeriesIndex = newSeriesIndex;
				this.stack.push(newSeriesIndex);
			}
			this.series[this.currentSeriesIndex].playCurrent();
		}, this);
		
		u('create')('tool.PubSub').subscribe('series-up', function() {
			this.series[this.currentSeriesIndex].stopCurrent();
			if (this.stack.length > 1) {
				this.currentSeriesIndex = this.stack.pop();
			}
			this.currentSeriesIndex = this.stack[this.stack.length - 1];
			this.series[this.currentSeriesIndex].playCurrent();
		}, this);

		this.series[this.currentSeriesIndex].playCurrent();
		
	},
	findSeriesIndexByTitle: function(title) {
	
		for (var i=0, iMax=this.series.length; i<iMax; i++) {
		
			if (this.series[i].hasTitle(title)) {
				return i;
			}
		}
		
		return null;
	
	}
}}});
