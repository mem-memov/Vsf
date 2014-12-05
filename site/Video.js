Vsf(function(u) { return {
meta: {
	className: 'site.Video',
	requiredClasses: ['dom.Document']
}, 
members: {
	init: function(options) {

		this.isPlaying = false;
		this.title = options.title ? options.title : '';
		this.link = options.link;
		this.source = options.source;
		this.player = options.player;
		this.loop = typeof options.loop === 'undefined' ? false : (!!options.loop);
		this.subtitles = typeof options.subtitles === 'undefined' ? false : options.subtitles;

	},
	play: function() {

		this.isPlaying = true;
		
		this.player.play(this.title, this.source, this.subtitles, this.loop);

	},
	stop: function() {

		this.isPlaying = false;
		return this.link;
		
	}
}}});
