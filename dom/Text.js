Vsf(function(u) { return {
meta: {
	className: 'dom.Text',
	publicMethodNames: ['getNode']
}, 
members: {
	init: function(options) {
		
		if (typeof options.text === 'undefined') {
			throw 'DOM text node content is not specified';
		}
		this.text = options.text;
		
		this.node = null;
		this.buildNode();
		
		if (typeof options.export !== 'undefined') {
			var me = this;
			options.export.changeValue = function(value) {
				me.node.nodeValue = value;
			}
		}
		
	}, 
	getNode: function() {
		
		return this.node;
		
	},
	buildNode: function() {
		
		this.node = document.createTextNode(this.text);

	}
}}});
