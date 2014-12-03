Vsf
===

Video Site Framework

Vfs loads class files asynchronously. It adds new SCRIPT tags to the document header. This approach should work in each and every browser out there. But before actual use all classes have to be loaded. Providing dependencies in a class definition is a necesity.

Vfs is a data driven framework. Sort of... It loads an application configuration and feeds it to the top level class instance. This one takes top properties to itself and passes the rest to constructors of other classes. Change the configuration and you'll get maybe a completely different structure of objects.

Vfs generarates zero garbage in the global namespace. There is a Vfs() function that accepts some params, nothing more.

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
