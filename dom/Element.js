Vsf(function(u) { return {
meta: {
	className: 'dom.Element',
	requiredClasses: ['dom.Text', 'dom.Animation']
}, 
members: {
	init: function(options) {
		
		if (typeof options.name === 'undefined') {
			throw 'DOM node name is not specified';
		}
		this.name = options.name;
		
		if (typeof options.attributes === 'undefined') {
			this.attributes = {};
		} else {
			this.attributes = options.attributes;
		}
		
		if (typeof options.children === 'undefined') {
			this.childConfigs = [];
		} else {
			this.childConfigs = options.children;
		}
		
		if (typeof options.listeners === 'undefined') {
			this.listeners = {};
		} else {
			this.listeners = options.listeners;
		}

		if (typeof options.animated === 'undefined') {
			this.animated = false;
		} else {
			this.animated = (!!options.animated);
		}

		this.children = [];
		this.node = null;
		this.buildNode();
		
		if (this.animated) {
			this.animation = u('create')('dom.Animation', {
				node: this.node,
			});
		}

	}, 
	getDomNode: function() {

		return this.node;
		
	},
	buildNode: function() {

		this.node = document.createElement(this.name);

		for (var attribute in this.attributes) {
			if (!this.attributes.hasOwnProperty(attribute)) {
				continue;
			}
			this.node[attribute] = this.attributes[attribute];
		}
		
		for (var i=0, iMax=this.childConfigs.length; i<iMax; i++) {
			this.appendChild(this.childConfigs[i]);
		}
	
		for (eventType in this.listeners) {
			
			if (!this.listeners.hasOwnProperty(eventType)) {
				continue;
			}
			this.addListener(eventType, this.listeners[eventType]);
		}

	},
	appendChild: function(childConfig) {
		
		var childElement;
		
		if (typeof childConfig.name !== 'undefined') {
			childElement = u('create')('dom.Element', childConfig);
		} else {
			childElement = u('create')('dom.Text', childConfig);
		}
		
		this.children.push(childElement);

		this.node.appendChild(childElement.getDomNode());
		
		return childElement;
		
	},
	removeChild: function(childElement) {
		this.node.removeChild(childElement.getDomNode());
	},
	addListener: function(eventType, listener) {
	
		var eventType = this.normalizeEventType(eventType);
	
		if (this.node.addEventListener) {
			
			this.node.addEventListener(eventType, listener, false);
			
		} else if (this.node.attachEvent) {
			
			this.node.attachEvent(eventType, listener);
			
		} else {
			
			this.node[eventType] = listener;
			
		}
		
	},
	removeListener: function(eventType, listener) {
	
		var eventType = this.normalizeEventType(eventType);
		
        if (this.node.removeEventListener) {
		
            this.node.removeEventListener(eventType, listener, false);
			
        } else if (this.node.detachEvent) {
		
            this.node.detachEvent(eventType, listener);
			
        } else {
		
            this.node[eventType] = null;
			
        }
	
	},
	normalizeEventType: function(eventType) {
	
		if (this.node.addEventListener) {
		
			if (eventType === 'mousewheel') {
				if (this.isFireFox()) {
					return 'DOMMouseScroll';
				}
			}
		
		} else if (this.node.attachEvent) {
		
			return 'on' + eventType;
			
		} else {
		
			return 'on' + eventType;
			
		}
		
		return eventType;
	
	},
	isFireFox: function() {
		return typeof InstallTrigger !== 'undefined';
	}
}}});


