Vsf(function(u) { return {
meta: {
	className: 'site.Series',
	requiredClasses: ['site.Video']
}, 
members: {
	init: function(options) {

		this.title = options.title ? options.title : '';
		
		this.currentVideoIndex = 0;
		this.videoIndexMax = 0;
		
		this.videos = [];
		if (options.videos) {
			for (var i=0, iMax=options.videos.length; i<iMax; i++) {
				options.videos[i].player = options.player;
				options.videos[i].exports = {
					play: null,
					stop: null
				};
				u('create')('site.Video', options.videos[i]);
				this.videos.push(options.videos[i].exports);
				this.videoIndexMax = i;
			}
		}
		
		u('implement')(options.exports, this);

	},
	playNext: function() {
	
		this.videos[this.currentVideoIndex].stop();
		this.currentVideoIndex++;
		if (this.currentVideoIndex > this.videoIndexMax) {
			this.currentVideoIndex = 0;
		}
		this.videos[this.currentVideoIndex].play();
	
	},
	playPrevious: function() {
	
		this.videos[this.currentVideoIndex].stop();
		this.currentVideoIndex--;
		if (this.currentVideoIndex < 0) {
			this.currentVideoIndex = this.videoIndexMax;
		}
		this.videos[this.currentVideoIndex].play();
	
	},
	playCurrent: function() {

		this.videos[this.currentVideoIndex].play();
	
	},
	stopCurrent: function() {
	
		return this.videos[this.currentVideoIndex].stop();
	
	},
	hasTitle: function(title) {
		
		return title === this.title;
	
	}
}}});
