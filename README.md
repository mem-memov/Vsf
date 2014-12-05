Vsf
===

Video Site Framework

Vsf loads class files asynchronously. It adds new SCRIPT tags to the document header. This approach should work in each and every browser out there. But before actual use all classes have to be loaded. Providing dependencies in a class definition is a necesity.

Vsf is a data driven framework. Sort of... It loads an application configuration and feeds it to the top level class instance. This one takes top properties to itself and passes the rest to constructors of other classes. Change the configuration and you'll get maybe a completely different structure of objects.

Vsf generarates zero garbage in the global namespace. There is a Vfs() function that accepts some params, nothing more.

Vsf supports no class inheritance. It favours composition.

Vsf doesn't hide class members.

index.html

	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<script type="text/javascript" src="js/Vsf/Vsf.js"></script>
		</head>
		<body>
			<script type="text/javascript">Vsf('config.js');</script>
		</body>
	</html>

config.js

	Vsf({
		className: 'site.Site',
		defaultSeries: 0,
		series: [
			{
				title: 'Подари овечку',
				videos: [
					{
						source: 'video/mouse_wheel.mp4',
						subtitles: 'subtitles/mouse_wheel.vtt',
						loop: true,
						title: 'Use the wheel',
						link: 'Магазин'
					}
				]
			}
		]
	});

Vsf is developed with the purpurse to be used for creation of video sites. So all other parts are quite specific. This core part of Vsf may be used for building othe applications.

At present a class definition looks like this.

	Vsf(function(u) { return {
	meta: {
		className: 'my.namespace.MyClass',
		requiredClasses: ['my.namespace.MyDependency']
	}, 
	members: {
		init: function(options) {

			this.myProperty = options.myProperty ? options.myProperty : '';
			
			this.myComponent = u('create')('my.namespace.MyComponent', options.myComponentOptions);

		},
		doSomthing: function() {

			alert('I'm doing something');

		}
	}}});
