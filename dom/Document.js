Vsf(function(u) { return {
meta: {
	className: 'dom.Document',
	singleton: true,
	requiredClasses: ['dom.Element'],
	publicMethodNames: ['appendToBody']
}, 
members: {
	init: function(options) {
		this.body = document.getElementsByTagName('body')[0];
	},
	appendToBody: function(element) {
		this.body.appendChild(element.getNode());
	}
}}});
