Vsf(function(u) { return {
meta: {
	className: 'dom.Animation'
}, 
members: {
	init: function(options) {
		
		this.node = options.node;

		this.fadeOutAnimationId;
		this.fontSizeAnimationId;
		this.fontSize = 50;
		
	},
	fadeOut: function() {
		if (typeof this.fadeOutAnimationId !== 'undefined') {
			cancelAnimationFrame(this.fadeOutAnimationId);
		}
		this.node.style.opacity = 1;
		this.reduceOpacity();
	},
	reduceOpacity: function() { // TODO: make cross browser
		var me = this;
		me.fadeOutAnimationId = requestAnimationFrame(function() {me.reduceOpacity()});
		if (me.node.style.opacity < 1 && me.node.style.opacity >= 0.8) {
			me.node.style.opacity -= 0.003;
		} else if (me.node.style.opacity , 0.8 && me.node.style.opacity > 0) {
			me.node.style.opacity -= 0.02;
		} else {
			me.node.style.opacity = 0;
			cancelAnimationFrame(me.fadeOutAnimationId);
		}
	},
	increaseFont: function() {
		if (typeof this.fontSizeAnimationId !== 'undefined') {
			cancelAnimationFrame(this.fontSizeAnimationId);
		}
		this.fontSize = 50;
		this.node.style.fontSize = this.fontSize + 'pt';
		this.increaseFontSize();
	},
	increaseFontSize: function() {
		var me = this;
		me.fontSizeAnimationId = requestAnimationFrame(function() {me.increaseFontSize()});
		if (me.fontSize < 60) {
			me.fontSize += 1;
		} else {
			me.fontSize = 60;
			cancelAnimationFrame(me.fontSizeAnimationId);
		}
		me.node.style.fontSize = me.fontSize + 'pt';
		
	}
}}});

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
