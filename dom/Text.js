Vsf(function(u) { return {
meta: {
	className: 'dom.Text'
}, 
members: {
	init: function(options) {
		
		if (typeof options.text === 'undefined') {
			throw 'DOM text node content is not specified';
		}
		this.text = options.text;
		
		this.node = null;
		this.buildNode();
		
	}, 
	getDomNode: function() {

		return this.node;
		
	},
	changeValue: function(newValue) {
	
		this.node.nodeValue = newValue;
		
	},
	buildNode: function() {
		
		this.node = document.createTextNode(this.text);

	}
}}});
