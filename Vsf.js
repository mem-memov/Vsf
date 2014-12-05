(function(namespace) {
	/**
	 * 1. Load site configuration
	 * 2. Load class for interpreting the loaded site configuration 
	 * 3. Load required classes
	 * 4. After last class is loaded make component instances
	 * 5. Initialize instance properties inside the init method
	 */
	var rootUrl = 'js/Vsf/';

	var classFunctions = {};
	var constructors = {};
	var singletons = {};
	var instances = {};

	var loadingClasses = {};
	var loadingClassesCount = 0;
	
	var currentConfig = null;
	var currentInterpreterClassName = null;

	var classMetadata = {};
	var classMembers = {};
	
	function loadScript(url, callback) {
	
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
		
	}
	
	function buildPathToClassFile(className) {
		return rootUrl + className.replace('.', '/') + '.js';
	}
	
	function applyConfiguration(config) {
		
		if (typeof config.className === 'undefined') {
			throw 'Configuration doesn`t specify a className parameter';
		}
		
		currentInterpreterClassName = config.className;
		currentConfig = config;
		
		loadClass(currentInterpreterClassName);
	
	}

	function loadClass(className) {
	
		if (classExists(className) || loadingClasses[className] === true) {
			return;
		}
		
		loadingClassesCount++;
		loadingClasses[className] = true;
		loadScript(buildPathToClassFile(className));
		
	}
	
	function classExists(className) {
		return typeof classMetadata[className] !== 'undefined';
	}
	
	function loadRequiredClasses(requiredClasses) {
		
		for (var i=0, iMax=requiredClasses.length; i<iMax; i++) {
			var className = requiredClasses[i];
			loadClass(className);
		}
		
	}
	
	function getUtilityFunction(key) {
		switch (key) {
			case 'create':
				return create;
				break;
			case 'retrieve':
				return retrieve;
				break;
		}
	}
	
	function defineClass (classDefinitionFunction) {
		
		if (typeof classDefinitionFunction !== 'function') {
			throw 'Class definition must be a function: Vsf(function(u) { return {meta: {}, mambers: {}}});';
		}
		
		var classDefinitionObject = classDefinitionFunction(getUtilityFunction);
		
		if (typeof classDefinitionObject.meta === 'undefined') {
			throw 'Class definition object must have a meta key containing information about the class';
		}
		var meta = classDefinitionObject.meta;
		
		if (typeof classDefinitionObject.members === 'undefined') {
			throw 'Class definition object must have a members key containing class methods and properties';
		}
		var members = classDefinitionObject.members;
		
		if (typeof meta.className === 'undefined') {
			throw 'Class meta data without className parameter detected';
		}
	
		// set class meta defaults
		if (typeof meta.init === 'undefined') { 
			meta.init = function() {};
		}
		if (typeof meta.singleton === 'undefined') {
			meta.singleton = false;
		}
		if (typeof meta.requiredClasses === 'undefined') {
			meta.requiredClasses = [];
		}

		// store class definition
		classMetadata[meta.className] = meta;
		classMembers[meta.className] = members;
		
		// hiding instance members
		constructors[meta.className] = makeClassConstructor(meta.className);

		loadRequiredClasses(meta.requiredClasses);
		
		checkIfItWasLastClassToLoad(meta.className);

	}
	
	function checkIfItWasLastClassToLoad(className) {
		
		loadingClassesCount--;
		loadingClasses[className] = false;
		
		if (loadingClassesCount === 0) { // when last class is loaded
			loadingClasses = {};
			interpretCurrentConfiguration();
		}
		
	}

	function interpretCurrentConfiguration() {

		create(currentInterpreterClassName, currentConfig);
		
		currentConfig = null;
		currentInterpreterClassName = null;
		
	}
	
	function makeClassConstructor(className) {
 
		return function(options) {
		
			// create constructor function lazily
			var classFunction = provideClassFunction(className);
			
			// create instance
			var o = new classFunction();
			o.init(options);
			o.init = true;
			
			return o;
			
		}

	}
	
	function provideClassFunction(className) {
	
		// use caching
		if (typeof classFunctions[className] !== 'undefined') {
			return classFunctions[className];
		}

		// or create new class function
		classFunction = function() {};
		classFunctions[className] = classFunction;

		// add members to the class function
		var members = classMembers[className];
		for (var memberName in members) {
			if (members.hasOwnProperty(memberName)) {
				classFunction.prototype[memberName] = members[memberName];
			}
		}
		
		return classFunction;

	}
	
	function create(className, options) {

		if (!classExists(className)) {
			throw 'Class ' + className + ' is not defined.';
		}
		
		if (classMetadata[className].singleton && singletons[className]) {
			return singletons[className];
		}
		
		if (typeof options === 'undefined') {
			options = {};
		}
		
		var instance = new constructors[className](options);
		
		if (typeof options.instanceId !== 'undefined') {
			register(options.instanceId, instance);
		}
		
		if (classMetadata[className].singleton) {
			singletons[className] = instance;
		}
		
		return instance;
		
	}

	function register(id, instance) {
		
		if (typeof instances[id] !== 'undefined') {
			throw 'Conflicting instance ids: ' + id;
		}

		instances[id] = instance;
		
	}
	
	function retrieve(id) {

		if (typeof instances[id] === 'undefined') {
			throw 'Error retrieving instance by id: ' + id;
		}
		
		return instances[id];
		
	}
	
	namespace.Vsf = function(input) {
	
		if (typeof input === 'function') {
			defineClass(input);
		} else if (typeof input === 'string') {
			loadScript(input); // load site configuration
		} else if (input.rootUrl) {
			rootUrl = input.rootUrl;
		} else { // it's configuration object
			applyConfiguration(input);
		}

	};
	
})(this);
