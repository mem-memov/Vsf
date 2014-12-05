Vsf(function(u) { return {
meta: {
	className: 'site.Player',
	requiredClasses: ['dom.Document', 'dom.Element']
}, 
members: {
	init: function(options) {
		var me = this;
		var videoSrc = '';
		var posterSrc = '';

		this.listeners = {};

		
		this.element = u('create')('dom.Element', {
			name: 'div',
			exports: {
				getDomNode: null
			},
			attributes: {
				className: 'video-player-container'
			},
			children: [
				{
					name: 'video',
					instanceId: 'playerElement',
					attributes: {
						poster: posterSrc,
						width: 640,
						height: 360
					},
					children: [
						{
							name: 'source',
							attributes: {
								src: videoSrc,
								type: 'video/mp4'
							}
						},
						{
							name: 'track',
							instanceId: 'subtitleElement',
							attributes: {
								src: '',
								kind: 'subtitles',
								srclang: 'ru',
								label: 'Russian',
								'default': 'default',
								enabled: 'true',
								type: 'text/vtt'
							}
						},
						{
							name: 'object',
							attributes: {
								type: 'application/x-shockwave-flash',
								data: '../flash/flowplayer-3.2.1.swf',
								width: 640,
								height: 360
							},
							children: [
								{
									name: 'param',
									attributes: {
										name: 'movie',
										value: '../flash/flowplayer-3.2.1.swf'
									}
								},
								{
									name: 'param',
									attributes: {
										name: 'allowFullScreen',
										value: 'true'
									}
								},
								{
									name: 'param',
									attributes: {
										name: 'wmode',
										value: 'transparent'
									}
								},
								{
									name: 'param',
									attributes: {
										name: 'flashVars',
										value: "config={'playlist':['" + encodeURIComponent(posterSrc) + "',{'url':'" + encodeURIComponent(videoSrc) + "','autoPlay':false}]}"
									}
								},
								{
									name: 'img',
									attributes: {
										'title': 'No Flash found',
										'src': '../poster/big-buck-bunny_poster.jpg',
										width: 640,
										height: 360
									}
								},
							]
						}
					]
				},
				{
					name: 'div',
					instanceId: 'overlayElement',
					animated: true,
					attributes: {
						className: 'overlay'
					},
					listeners: {
						mousewheel: function(event) {
							var delta = 0;
							if (!event) // For IE.
								event = window.event;
							if (event.wheelDelta) { // IE/Opera.
								delta = event.wheelDelta/120;
							} else if (event.detail) { // Mozilla case. 
								// In Mozilla, sign of delta is different than in IE.
								// Also, delta is multiple of 3.
								delta = -event.detail/3;
							}
							if (delta < 0) {
								u('create')('tool.PubSub').publish('next-video');
							} else {
								u('create')('tool.PubSub').publish('previous-video');
							}
						},
						click: function() {
							me.playerElement.getDomNode().pause();
							u('create')('tool.PubSub').publish('series-down');
						},
						contextmenu: function(event) {
							if (event.preventDefault) { 
								event.preventDefault();
							} else {
								event.returnValue = false; 
							}
							u('create')('tool.PubSub').publish('series-up');
						}
					},
					children: [
						{
							name: 'div',
							instanceId: 'videoTitleElementContainer',
							animated: true,
							attributes: {
								className: 'title'
							},
							children: [
								{
									text: 'Меню сайта',
									instanceId: 'videoTitleElement'
								}
							]
						}
					]
				}
			]
		});

		this.videoTitleElement = u('retrieve')('videoTitleElement');
		this.overlayElement = u('retrieve')('overlayElement');
		this.videoTitleElementContainer = u('retrieve')('videoTitleElementContainer');
		this.playerElement = u('retrieve')('playerElement');
		this.subtitleElement = u('retrieve')('subtitleElement');
		
		u('create')('dom.Document').appendToBody(this.element);
		
	},
	play: function(title, source, subtitles, loop) {
	
		this.videoTitleElement.changeValue(title);
		this.overlayElement.animation.fadeOut();
		this.videoTitleElementContainer.animation.fadeOut();
		this.videoTitleElementContainer.animation.increaseFont();
		
		this.subtitleElement.getDomNode().src = '';
		if (typeof subtitles !== 'undefined' && subtitles !== false) {
			this.subtitleElement.getDomNode().src = subtitles;
		}

		var videoNode = this.playerElement.getDomNode();
		videoNode.muted = true;
		videoNode.src = source;
		videoNode.play();
		
		if (typeof loop !== 'undefined' && loop) {
			this.listeners['ended'] = function() {
				this.play();
			};
			this.playerElement.addListener('ended', this.listeners['ended']);
		} else {
			if (this.listeners['ended']) {
				this.playerElement.removeListener('ended', this.listeners['ended']);
				this.listeners['ended'] = null;
			}
		}
		
	},
	stop: function() {
		
	}
}}});
