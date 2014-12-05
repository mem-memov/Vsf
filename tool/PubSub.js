Vsf(function(u) { return {
meta: {
	className: 'tool.PubSub',
	publicMethodNames: ['publish', 'subscribe'],
	singleton: true
}, 
members: {
	init: function(options) {
	
		this.topics = {};
		
	},
	publish: function(topic, info) {

		this.provideTopic(topic);
		
		var queue = this.topics[topic];
		
		for (var i=0, iMax=queue.length; i < iMax; i++) {
		
			if (typeof queue[i] !== 'undefined') {
				queue[i](info || {});
			}
			
		}
	
	},
	subscribe: function(topic, listener, scope) {

		if (typeof scope !== 'undefined') {
			listener = this.bindListenerToScope(listener, scope);
		}

		this.provideTopic(topic);

		var queue = this.topics[topic];
		
		var index = queue.push(listener) - 1;
		
		return {
			remove: function() {
				delete queue[index]; // array length unaffected, element changed to undefined
			}
		};
		
	},
	provideTopic: function(topic) {
	
		if(typeof this.topics[topic] === 'undefined')  {
			
			this.topics[topic] = [];
			
		}
		
	},
	bindListenerToScope: function(listener, scope) {
	
		var scope = scope;
		return function() {
			listener.apply(scope, arguments);
		};
	}
}}});
