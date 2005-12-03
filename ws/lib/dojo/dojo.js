/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above *//* This is a compiled version of Dojo, designed for deployment and not for development. If would like to modify or work with Dojo, please visit http://dojotoolkit.org for more information and to get the 'source' version of this file. *//**
* @file bootstrap1.js
*
* bootstrap file that runs before hostenv_*.js file.
*
* @author Copyright 2004 Mark D. Anderson (mda@discerning.com)
* @author Licensed under the Academic Free License 2.1 http://www.opensource.org/licenses/afl-2.1.php
*
* $Id: dojo.js,v 1.1 2005-12-03 06:50:53 gmurray71 Exp $
*/

/**
 * The global djConfig can be set prior to loading the library, to override
 * certain settings.  It does not exist under dojo.* so that it can be set
 * before the dojo variable exists. Setting any of these variables *after* the
 * library has loaded does nothing at all. The variables that can be set are
 * as follows:
 */

/**
 * dj_global is an alias for the top-level global object in the host
 * environment (the "window" object in a browser).
 */
var dj_global = this; //typeof window == 'undefined' ? this : window;

function dj_undef(name, obj){
	if(!obj){ obj = dj_global; }
	return (typeof obj[name] == "undefined");
}

if(dj_undef("djConfig")){
	var djConfig = {};
}

/**
 * dojo is the root variable of (almost all) our public symbols.
 */
var dojo;
if(dj_undef("dojo")){ dojo = {}; }

dojo.version = {
	major: 0, minor: 1, patch: 0, flag: "+",
	revision: Number("$Rev: 2212 $".match(/[0-9]+/)[0]),
	toString: function() {
		with (dojo.version) {
			return major + "." + minor + "." + patch + flag + " (" + revision + ")";
		}
	}
};

/*
 * evaluate a string like "A.B" without using eval.
 */
dojo.evalObjPath = function(objpath, create){
	// fast path for no periods
	if(typeof objpath != "string"){ return dj_global; }
	if(objpath.indexOf('.') == -1){
		if(dj_undef(objpath, dj_global)){
			dj_global[objpath] = {};
		}
		return dj_global[objpath];
	}

	var syms = objpath.split(/\./);
	var obj = dj_global;
	for(var i=0;i<syms.length;++i){
		if(!create){
			obj = obj[syms[i]];
			if((typeof obj == 'undefined')||(!obj)){
				return obj;
			}
		}else{
			if(dj_undef(syms[i], obj)){
				obj[syms[i]] = {};
			}
			obj = obj[syms[i]];
		}
	}
	return obj;
};


// ****************************************************************
// global public utils
// ****************************************************************

/*
 * utility to print an Error. 
 * TODO: overriding Error.prototype.toString won't accomplish this?
 * ... since natively generated Error objects do not always reflect such things?
 */
dojo.errorToString = function(excep){
	return ((!dj_undef("message", excep)) ? excep.message : (dj_undef("description", excep) ? excep : excep.description ));
};

/**
* Throws an Error object given the string err. For now, will also do a println
* to the user first.
*/
dojo.raise = function(message, excep){
	if(excep){
		message = message + ": "+dojo.errorToString(excep);
	}
	var he = dojo.hostenv;
	if((!dj_undef("hostenv", dojo))&&(!dj_undef("println", dojo.hostenv))){ 
		dojo.hostenv.println("FATAL: " + message);
	}
	throw Error(message);
};

dj_throw = dj_rethrow = function(m, e){
	dojo.deprecated("dj_throw and dj_rethrow deprecated, use dojo.raise instead");
	dojo.raise(m, e);
};

/**
 * Produce a line of debug output. 
 * Does nothing unless djConfig.isDebug is true.
 * varargs, joined with ''.
 * Caller should not supply a trailing "\n".
 */
dojo.debug = function(){
	if (!djConfig.isDebug) { return; }
	var args = arguments;
	if(dj_undef("println", dojo.hostenv)){
		dojo.raise("dojo.debug not available (yet?)");
	}
	var isJUM = dj_global["jum"] && !dj_global["jum"].isBrowser;
	var s = [(isJUM ? "": "DEBUG: ")];
	for(var i=0;i<args.length;++i){
		if(!false && args[i] instanceof Error){
			var msg = "[" + args[i].name + ": " + dojo.errorToString(args[i]) +
				(args[i].fileName ? ", file: " + args[i].fileName : "") +
				(args[i].lineNumber ? ", line: " + args[i].lineNumber : "") + "]";
		}else{ 
			var msg = args[i];
		}
		s.push(msg);
	}
	if(isJUM){ // this seems to be the only way to get JUM to "play nice"
		jum.debug(s.join(" "));
	}else{
		dojo.hostenv.println(s.join(" "));
	}
}

/**
 * this is really hacky for now - just 
 * display the properties of the object
**/

dojo.debugShallow = function(obj){
	if (!djConfig.isDebug) { return; }
	dojo.debug('------------------------------------------------------------');
	dojo.debug('Object: '+obj);
	for(i in obj){
		dojo.debug(i + ': ' + obj[i]);
	}
	dojo.debug('------------------------------------------------------------');
}

var dj_debug = dojo.debug;

/**
 * We put eval() in this separate function to keep down the size of the trapped
 * evaluation context.
 *
 * Note that:
 * - JSC eval() takes an optional second argument which can be 'unsafe'.
 * - Mozilla/SpiderMonkey eval() takes an optional second argument which is the
 *   scope object for new symbols.
*/
function dj_eval(s){ return dj_global.eval ? dj_global.eval(s) : eval(s); }


/**
 * Convenience for throwing an exception because some function is not
 * implemented.
 */
dj_unimplemented = dojo.unimplemented = function(funcname, extra){
	// FIXME: need to move this away from dj_*
	var mess = "'" + funcname + "' not implemented";
	if((!dj_undef(extra))&&(extra)){ mess += " " + extra; }
	// mess += " (host environment '" + dojo.hostenv.getName() + "')";
	dojo.raise(mess);
}

/**
 * Convenience for informing of deprecated behaviour.
 */
dj_deprecated = dojo.deprecated = function(behaviour, extra, removal){
	var mess = "DEPRECATED: " + behaviour;
	if((!dj_undef(extra))&&(extra)){ mess += " " + extra; }
	if(!dj_undef(removal)){ mess += " -- will be removed in version" + removal; }
	// mess += " (host environment '" + dojo.hostenv.getName() + "')";
	dojo.debug(mess);
}

/**
 * Does inheritance
 */
dojo.inherits = function(subclass, superclass){
	if(typeof superclass != 'function'){ 
		dojo.raise("superclass: "+superclass+" borken");
	}
	subclass.prototype = new superclass();
	subclass.prototype.constructor = subclass;
	subclass.superclass = superclass.prototype;
	// DEPRICATED: super is a reserved word, use 'superclass'
	subclass['super'] = superclass.prototype;
}

dj_inherits = function(subclass, superclass){
	dojo.deprecated("dj_inherits deprecated, use dojo.inherits instead");
	dojo.inherits(subclass, superclass);
}

// an object that authors use determine what host we are running under
dojo.render = (function(){

	function vscaffold(prefs, names){
		var tmp = {
			capable: false,
			support: {
				builtin: false,
				plugin: false
			},
			prefixes: prefs
		};
		for(var x in names){
			tmp[x] = false;
		}
		return tmp;
	}

	return {
		name: "",
		ver: dojo.version,
		os: { win: false, linux: false, osx: false },
		html: vscaffold(["html"], ["ie", "opera", "khtml", "safari", "moz"]),
		svg: vscaffold(["svg"], ["corel", "adobe", "batik"]),
		vml: vscaffold(["vml"], ["ie"]),
		swf: vscaffold(["Swf", "Flash", "Mm"], ["mm"]),
		swt: vscaffold(["Swt"], ["ibm"])
	};
})();

// ****************************************************************
// dojo.hostenv methods that must be defined in hostenv_*.js
// ****************************************************************

/**
 * The interface definining the interaction with the EcmaScript host environment.
*/

/*
 * None of these methods should ever be called directly by library users.
 * Instead public methods such as loadModule should be called instead.
 */
dojo.hostenv = (function(){

	// default configuration options
	var config = {
		isDebug: false,
		allowQueryConfig: false,
		baseScriptUri: "",
		baseRelativePath: "",
		libraryScriptUri: "",
		iePreventClobber: false,
		ieClobberMinimal: true,
		preventBackButtonFix: true,
		searchIds: [],
		parseWidgets: true
	};

	if (typeof djConfig == "undefined") { djConfig = config; }
	else {
		for (var option in config) {
			if (typeof djConfig[option] == "undefined") {
				djConfig[option] = config[option];
			}
		}
	}

	var djc = djConfig;
	function _def(obj, name, def){
		return (dj_undef(name, obj) ? def : obj[name]);
	}

	return {
		// FIXME: why in the heck are we not just naming these the same as the
		// values on djConfig and then allowing mixin?
		/*
		is_debug_: _def(djc, "isDebug", false),
		base_script_uri_: _def(djc, "baseScriptUri", undefined),
		base_relative_path_: _def(djc, "baseRelativePath", ""),
		library_script_uri_: _def(djc, "libraryScriptUri", ""),
		auto_build_widgets_: _def(djc, "parseWidgets", true),
		ie_prevent_clobber_: _def(djc, "iePreventClobber", false),
		ie_clobber_minimal_: _def(djc, "ieClobberMinimal", false),
		*/
		name_: '(unset)',
		version_: '(unset)',
		pkgFileName: "__package__",

		// for recursion protection
		loading_modules_: {},
		loaded_modules_: {},
		addedToLoadingCount: [],
		removedFromLoadingCount: [],
		inFlightCount: 0,
		modulePrefixes_: {
			dojo: {name: "dojo", value: "src"}
		},


		setModulePrefix: function(module, prefix){
			this.modulePrefixes_[module] = {name: module, value: prefix};
		},

		getModulePrefix: function(module){
			var mp = this.modulePrefixes_;
			if((mp[module])&&(mp[module]["name"])){
				return mp[module].value;
			}
			return module;
		},

		getTextStack: [],
		loadUriStack: [],
		loadedUris: [],
		// lookup cache for modules.
		// NOTE: this is partially redundant a private variable in the jsdown
		// implementation, but we don't want to couple the two.
		// modules_ : {},
		post_load_: false,
		modulesLoadedListeners: [],
		/**
		 * Return the name of the hostenv.
		 */
		getName: function(){ return this.name_; },

		/**
		* Return the version of the hostenv.
		*/
		getVersion: function(){ return this.version_; },

		/**
		 * Read the plain/text contents at the specified uri.  If getText() is
		 * not implemented, then it is necessary to override loadUri() with an
		 * implementation that doesn't rely on it.
		 */
		getText: function(uri){
			dojo.unimplemented('getText', "uri=" + uri);
		},

		/**
		 * return the uri of the script that defined this function
		 * private method that must be implemented by the hostenv.
		 */
		getLibraryScriptUri: function(){
			// FIXME: need to implement!!!
			dojo.unimplemented('getLibraryScriptUri','');
		}
	};
})();

/**
 * Display a line of text to the user.
 * The line argument should not contain a trailing "\n"; that is added by the
 * implementation.
 */
//dojo.hostenv.println = function(line) {}

// ****************************************************************
// dojo.hostenv methods not defined in hostenv_*.js
// ****************************************************************

/**
 * Return the base script uri that other scripts are found relative to.
 * It is either the empty string, or a non-empty string ending in '/'.
 */
dojo.hostenv.getBaseScriptUri = function(){
	if(djConfig.baseScriptUri.length){ 
		return djConfig.baseScriptUri;
	}
	var uri = new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
	if (!uri) { dojo.raise("Nothing returned by getLibraryScriptUri(): " + uri); }
	/*
	if((!uri)||(!uri.length)){
		uri = djConfig.libraryScriptUri = this.getLibraryScriptUri();
		if((!uri)||(!uri.length)){
			dojo.raise("Nothing returned by getLibraryScriptUri(): " + uri);
		}
	}
	if (!djConfig.libraryScriptUri) {
		djConfig.libraryScriptUri = this.getLibraryScriptUri();
	}
	var uri = djConfig.libraryScriptUri;

	if (!uri) { dojo.raise("Nothing returned by getLibraryScriptUri(): " + uri); }
	*/

	var lastslash = uri.lastIndexOf('/');
	djConfig.baseScriptUri = djConfig.baseRelativePath;
	return djConfig.baseScriptUri;
}

/**
* Set the base script uri.
*/
// In JScript .NET, see interface System._AppDomain implemented by
// System.AppDomain.CurrentDomain. Members include AppendPrivatePath,
// RelativeSearchPath, BaseDirectory.
dojo.hostenv.setBaseScriptUri = function(uri){ djConfig.baseScriptUri = uri }

/**
 * Loads and interprets the script located at relpath, which is relative to the
 * script root directory.  If the script is found but its interpretation causes
 * a runtime exception, that exception is not caught by us, so the caller will
 * see it.  We return a true value if and only if the script is found.
 *
 * For now, we do not have an implementation of a true search path.  We
 * consider only the single base script uri, as returned by getBaseScriptUri().
 *
 * @param relpath A relative path to a script (no leading '/', and typically
 * ending in '.js').
 * @param module A module whose existance to check for after loading a path.
 * Can be used to determine success or failure of the load.
 */
dojo.hostenv.loadPath = function(relpath, module /*optional*/, cb /*optional*/){
	if((relpath.charAt(0) == '/')||(relpath.match(/^\w+:/))){
		dojo.raise("relpath '" + relpath + "'; must be relative");
	}
	var uri = this.getBaseScriptUri() + relpath;
	try{
		return ((!module) ? this.loadUri(uri, cb) : this.loadUriAndCheck(uri, module, cb));
	}catch(e){
		dojo.debug(e);
		return false;
	}
}

/**
 * Reads the contents of the URI, and evaluates the contents.
 * Returns true if it succeeded. Returns false if the URI reading failed.
 * Throws if the evaluation throws.
 * The result of the eval is not available to the caller.
 */
dojo.hostenv.loadUri = function(uri, cb){
	if(dojo.hostenv.loadedUris[uri]){
		return;
	}
	var contents = this.getText(uri, null, true);
	if(contents == null){ return 0; }
	var value = dj_eval(contents);
	return 1;
}

dojo.hostenv.getDepsForEval = function(contents){
	// FIXME: should probably memoize this!
	if(!contents){ contents = ""; }
	// check to see if we need to load anything else first. Ugg.
	var deps = [];
	var tmp;
	var testExps = [
		/dojo.hostenv.loadModule\(.*?\)/mg,
		/dojo.hostenv.require\(.*?\)/mg,
		/dojo.require\(.*?\)/mg,
		/dojo.requireIf\([\w\w]*?\)/mg,
		/dojo.hostenv.conditionalLoadModule\([\w\W]*?\)/mg
	];
	for(var i=0; i<testExps.length; i++){
		tmp = contents.match(testExps[i]);
		if(tmp){
			for(var x=0; x<tmp.length; x++){ deps.push(tmp[x]); }
		}
	}

	return deps;
}

// FIXME: probably need to add logging to this method
dojo.hostenv.loadUriAndCheck = function(uri, module, cb){
	var ok = true;
	try{
		ok = this.loadUri(uri, cb);
	}catch(e){
		dojo.debug("failed loading ", uri, " with error: ", e);
	}
	return ((ok)&&(this.findModule(module, false))) ? true : false;
}

dojo.loaded = function(){ }

dojo.hostenv.loaded = function(){
	this.post_load_ = true;
	var mll = this.modulesLoadedListeners;
	for(var x=0; x<mll.length; x++){
		mll[x]();
	}
	dojo.loaded();
}

/*
Call styles:
	dojo.addOnLoad(functionPointer)
	dojo.addOnLoad(object, "functionName")
*/
dojo.addOnLoad = function(obj, fcnName) {
	if(arguments.length == 1) {
		dojo.hostenv.modulesLoadedListeners.push(obj);
	} else if(arguments.length > 1) {
		dojo.hostenv.modulesLoadedListeners.push(function() {
			obj[fcnName]();
		});
	}
};

dojo.hostenv.modulesLoaded = function(){
	if(this.post_load_){ return; }
	if((this.loadUriStack.length==0)&&(this.getTextStack.length==0)){
		if(this.inFlightCount > 0){ 
			dojo.debug("files still in flight!");
			return;
		}
		if(typeof setTimeout == "object"){
			setTimeout("dojo.hostenv.loaded();", 0);
		}else{
			dojo.hostenv.loaded();
		}
	}
}

dojo.hostenv.moduleLoaded = function(modulename){
	var modref = dojo.evalObjPath((modulename.split(".").slice(0, -1)).join('.'));
	this.loaded_modules_[(new String(modulename)).toLowerCase()] = modref;
}

/**
* loadModule("A.B") first checks to see if symbol A.B is defined. 
* If it is, it is simply returned (nothing to do).
*
* If it is not defined, it will look for "A/B.js" in the script root directory,
* followed by "A.js".
*
* It throws if it cannot find a file to load, or if the symbol A.B is not
* defined after loading.
*
* It returns the object A.B.
*
* This does nothing about importing symbols into the current package.
* It is presumed that the caller will take care of that. For example, to import
* all symbols:
*
*    with (dojo.hostenv.loadModule("A.B")) {
*       ...
*    }
*
* And to import just the leaf symbol:
*
*    var B = dojo.hostenv.loadModule("A.B");
*    ...
*
* dj_load is an alias for dojo.hostenv.loadModule
*/
dojo.hostenv.loadModule = function(modulename, exact_only, omit_module_check){
	var module = this.findModule(modulename, false);
	if(module){
		return module;
	}

	// protect against infinite recursion from mutual dependencies
	if(dj_undef(modulename, this.loading_modules_)){
		this.addedToLoadingCount.push(modulename);
	}
	this.loading_modules_[modulename] = 1;

	// convert periods to slashes
	var relpath = modulename.replace(/\./g, '/') + '.js';

	var syms = modulename.split(".");
	var nsyms = modulename.split(".");
	for (var i = syms.length - 1; i > 0; i--) {
		var parentModule = syms.slice(0, i).join(".");
		var parentModulePath = this.getModulePrefix(parentModule);
		if (parentModulePath != parentModule) {
			syms.splice(0, i, parentModulePath);
			break;
		}
	}
	var last = syms[syms.length - 1];
	// figure out if we're looking for a full package, if so, we want to do
	// things slightly diffrently
	if(last=="*"){
		modulename = (nsyms.slice(0, -1)).join('.');

		while(syms.length){
			syms.pop();
			syms.push(this.pkgFileName);
			relpath = syms.join("/") + '.js';
			if(relpath.charAt(0)=="/"){
				relpath = relpath.slice(1);
			}
			ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
			if(ok){ break; }
			syms.pop();
		}
	}else{
		relpath = syms.join("/") + '.js';
		modulename = nsyms.join('.');
		var ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
		if((!ok)&&(!exact_only)){
			syms.pop();
			while(syms.length){
				relpath = syms.join('/') + '.js';
				ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
				if(ok){ break; }
				syms.pop();
				relpath = syms.join('/') + '/'+this.pkgFileName+'.js';
				if(relpath.charAt(0)=="/"){
					relpath = relpath.slice(1);
				}
				ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
				if(ok){ break; }
			}
		}

		if((!ok)&&(!omit_module_check)){
			dojo.raise("Could not load '" + modulename + "'; last tried '" + relpath + "'");
		}
	}

	// check that the symbol was defined
	if(!omit_module_check){
		// pass in false so we can give better error
		module = this.findModule(modulename, false);
		if(!module){
			dojo.raise("symbol '" + modulename + "' is not defined after loading '" + relpath + "'"); 
		}
	}

	return module;
}

/**
* startPackage("A.B") follows the path, and at each level creates a new empty
* object or uses what already exists. It returns the result.
*/
dojo.hostenv.startPackage = function(packname){
	var syms = packname.split(/\./);
	if(syms[syms.length-1]=="*"){
		syms.pop();
	}
	return dojo.evalObjPath(syms.join("."), true);
}

/**
 * findModule("A.B") returns the object A.B if it exists, otherwise null.
 * @param modulename A string like 'A.B'.
 * @param must_exist Optional, defualt false. throw instead of returning null
 * if the module does not currently exist.
 */
dojo.hostenv.findModule = function(modulename, must_exist) {
	// check cache
	/*
	if(!dj_undef(modulename, this.modules_)){
		return this.modules_[modulename];
	}
	*/

	if(this.loaded_modules_[(new String(modulename)).toLowerCase()]){
		return this.loaded_modules_[modulename];
	}

	// see if symbol is defined anyway
	var module = dojo.evalObjPath(modulename);
	if((typeof module !== 'undefined')&&(module)){
		return module;
		// return this.modules_[modulename] = module;
	}

	if(must_exist){
		dojo.raise("no loaded module named '" + modulename + "'");
	}
	return null;
}

/**
* @file hostenv_browser.js
*
* Implements the hostenv interface for a browser environment. 
*
* Perhaps it could be called a "dom" or "useragent" environment.
*
* @author Copyright 2004 Mark D. Anderson (mda@discerning.com)
* @author Licensed under the Academic Free License 2.1 http://www.opensource.org/licenses/afl-2.1.php
*/

// make jsc shut up (so we can use jsc to sanity check the code even if it will never run it).
/*@cc_on
@if (@_jscript_version >= 7)
var window; var XMLHttpRequest;
@end
@*/

if(typeof window == 'undefined'){
	dojo.raise("no window object");
}

// attempt to figure out the path to dojo if it isn't set in the config
(function() {
	// before we get any further with the config options, try to pick them out
	// of the URL. Most of this code is from NW
	if(djConfig.allowQueryConfig){
		var baseUrl = document.location.toString(); // FIXME: use location.query instead?
		var params = baseUrl.split("?", 2);
		if(params.length > 1){
			var paramStr = params[1];
			var pairs = paramStr.split("&");
			for(var x in pairs){
				var sp = pairs[x].split("=");
				// FIXME: is this eval dangerous?
				if((sp[0].length > 9)&&(sp[0].substr(0, 9) == "djConfig.")){
					var opt = sp[0].substr(9);
					try{
						djConfig[opt]=eval(sp[1]);
					}catch(e){
						djConfig[opt]=sp[1];
					}
				}
			}
		}
	}

	if(((djConfig["baseScriptUri"] == "")||(djConfig["baseRelativePath"] == "")) &&(document && document.getElementsByTagName)){
		var scripts = document.getElementsByTagName("script");
		var rePkg = /(__package__|dojo)\.js(\?|$)/i;
		for(var i = 0; i < scripts.length; i++) {
			var src = scripts[i].getAttribute("src");
			if(!src) { continue; }
			var m = src.match(rePkg);
			if(m) {
				root = src.substring(0, m.index);
				if(!this["djConfig"]) { djConfig = {}; }
				if(djConfig["baseScriptUri"] == "") { djConfig["baseScriptUri"] = root; }
				if(djConfig["baseRelativePath"] == "") { djConfig["baseRelativePath"] = root; }
				break;
			}
		}
	}

	var dr = dojo.render;
	var drh = dojo.render.html;
	var dua = drh.UA = navigator.userAgent;
	var dav = drh.AV = navigator.appVersion;
	var t = true;
	var f = false;
	drh.capable = t;
	drh.support.builtin = t;

	dr.ver = parseFloat(drh.AV);
	dr.os.mac = dav.indexOf("Macintosh") >= 0;
	dr.os.win = dav.indexOf("Windows") >= 0;
	// could also be Solaris or something, but it's the same browser
	dr.os.linux = dav.indexOf("X11") >= 0;

	drh.opera = dua.indexOf("Opera") >= 0;
	drh.khtml = (dav.indexOf("Konqueror") >= 0)||(dav.indexOf("Safari") >= 0);
	drh.safari = dav.indexOf("Safari") >= 0;
	var geckoPos = dua.indexOf("Gecko");
	drh.mozilla = drh.moz = (geckoPos >= 0)&&(!drh.khtml);
	if (drh.mozilla) {
		// gecko version is YYYYMMDD
		drh.geckoVersion = dua.substring(geckoPos + 6, geckoPos + 14);
	}
	drh.ie = (document.all)&&(!drh.opera);
	drh.ie50 = drh.ie && dav.indexOf("MSIE 5.0")>=0;
	drh.ie55 = drh.ie && dav.indexOf("MSIE 5.5")>=0;
	drh.ie60 = drh.ie && dav.indexOf("MSIE 6.0")>=0;

	dr.vml.capable=drh.ie;
	dr.svg.capable = f;
	dr.svg.support.plugin = f;
	dr.svg.support.builtin = f;
	dr.svg.adobe = f;
	if (document.implementation 
		&& document.implementation.hasFeature
		&& document.implementation.hasFeature("org.w3c.dom.svg", "1.0")
	){
		dr.svg.capable = t;
		dr.svg.support.builtin = t;
		dr.svg.support.plugin = f;
		dr.svg.adobe = f;
	}else{ 
		//	check for ASVG
		if(navigator.mimeTypes && navigator.mimeTypes.length > 0){
			var result = navigator.mimeTypes["image/svg+xml"] ||
				navigator.mimeTypes["image/svg"] ||
				navigator.mimeTypes["image/svg-xml"];
			if (result){
				dr.svg.adobe = result && result.enabledPlugin &&
					result.enabledPlugin.description && 
					(result.enabledPlugin.description.indexOf("Adobe") > -1);
				if(dr.svg.adobe) {
					dr.svg.capable = t;
					dr.svg.support.plugin = t;
				}
			}
		}else if(drh.ie && dr.os.win){
			var result = f;
			try {
				var test = new ActiveXObject("Adobe.SVGCtl");
				result = t;
			} catch(e){}
			if (result){
				dr.svg.capable = t;
				dr.svg.support.plugin = t;
				dr.svg.adobe = t;
			}
		}else{
			dr.svg.capable = f;
			dr.svg.support.plugin = f;
			dr.svg.adobe = f;
		}
	}
})();

dojo.hostenv.startPackage("dojo.hostenv");

dojo.hostenv.name_ = 'browser';
dojo.hostenv.searchIds = [];

// These are in order of decreasing likelihood; this will change in time.
var DJ_XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

dojo.hostenv.getXmlhttpObject = function(){
    var http = null;
	var last_e = null;
	try{ http = new XMLHttpRequest(); }catch(e){}
    if(!http){
		for(var i=0; i<3; ++i){
			var progid = DJ_XMLHTTP_PROGIDS[i];
			try{
				http = new ActiveXObject(progid);
			}catch(e){
				last_e = e;
			}

			if(http){
				DJ_XMLHTTP_PROGIDS = [progid];  // so faster next time
				break;
			}
		}
	}

	if(!http){
		return dojo.raise("XMLHTTP not available", last_e);
	}

	return http;
}

/**
 * Read the contents of the specified uri and return those contents.
 *
 * @param uri A relative or absolute uri. If absolute, it still must be in the
 * same "domain" as we are.
 *
 * @param async_cb If not specified, load synchronously. If specified, load
 * asynchronously, and use async_cb as the progress handler which takes the
 * xmlhttp object as its argument. If async_cb, this function returns null.
 *
 * @param fail_ok Default false. If fail_ok and !async_cb and loading fails,
 * return null instead of throwing.
 */ 
dojo.hostenv.getText = function(uri, async_cb, fail_ok){
	
	var http = this.getXmlhttpObject();

	if(async_cb){
		http.onreadystatechange = function(){ 
			if((4==http.readyState)&&(http["status"])){
				if(http.status==200){
					dojo.debug("LOADED URI: "+uri);
					async_cb(http.responseText);
				}
			}
		}
	}

	http.open('GET', uri, async_cb ? true : false);
	http.send(null);
	if(async_cb){
		return null;
	}
	
	return http.responseText;
}

/*
 * It turns out that if we check *right now*, as this script file is being loaded,
 * then the last script element in the window DOM is ourselves.
 * That is because any subsequent script elements haven't shown up in the document
 * object yet.
 */
function dj_last_script_src() {
    var scripts = window.document.getElementsByTagName('script');
    if(scripts.length < 1){ 
		dojo.raise("No script elements in window.document, so can't figure out my script src"); 
	}
    var script = scripts[scripts.length - 1];
    var src = script.src;
    if(!src){
		dojo.raise("Last script element (out of " + scripts.length + ") has no src");
	}
    return src;
}

if(!dojo.hostenv["library_script_uri_"]){
	dojo.hostenv.library_script_uri_ = dj_last_script_src();
}

dojo.hostenv.defaultDebugContainerId = 'dojoDebug';

dojo.hostenv.println = function (line) {
	try {
		var console = document.getElementById(djConfig.debugContainerId ?
			djConfig.debugContainerId : dojo.hostenv.defaultDebugContainerId);
		if(!console) { console = document.getElementsByTagName("body")[0] || document.body; }

		var div = document.createElement("div");
		div.appendChild(document.createTextNode(line));
		console.appendChild(div);
	} catch (e) {
		try{
			// safari needs the output wrapped in an element for some reason
			document.write("<div>" + line + "</div>");
		}catch(e2){
			window.status = line;
		}
	}
}

function dj_addNodeEvtHdlr (node, evtName, fp, capture){
	var oldHandler = node["on"+evtName] || function(){};
	node["on"+evtName] = function(){
		fp.apply(node, arguments);
		oldHandler.apply(node, arguments);
	}
	return true;
}

dj_addNodeEvtHdlr(window, "load", function(){
	if(dojo.render.html.ie){
		dojo.hostenv.makeWidgets();
	}
	dojo.hostenv.modulesLoaded();
});

dojo.hostenv.makeWidgets = function(){
	// you can put searchIds in djConfig and dojo.hostenv at the moment
	// we should probably eventually move to one or the other
	var sids = [];
	if(djConfig.searchIds && djConfig.searchIds.length > 0) {
		sids = sids.concat(djConfig.searchIds);
	}
	if(dojo.hostenv.searchIds && dojo.hostenv.searchIds.length > 0) {
		sids = sids.concat(dojo.hostenv.searchIds);
	}

	if((djConfig.parseWidgets)||(sids.length > 0)){
		if(dojo.evalObjPath("dojo.widget.Parse")){
			// we must do this on a delay to avoid:
			//	http://www.shaftek.org/blog/archives/000212.html
			// IE is such a tremendous peice of shit.
			try{
				var parser = new dojo.xml.Parse();
				if(sids.length > 0){
					for(var x=0; x<sids.length; x++){
						var tmpNode = document.getElementById(sids[x]);
						if(!tmpNode){ continue; }
						var frag = parser.parseElement(tmpNode, null, true);
						dojo.widget.getParser().createComponents(frag);
					}
				}else if(djConfig.parseWidgets){
					var frag  = parser.parseElement(document.getElementsByTagName("body")[0] || document.body, null, true);
					dojo.widget.getParser().createComponents(frag);
				}
			}catch(e){
				dojo.debug("auto-build-widgets error:", e);
			}
		}
	}
}

dojo.hostenv.modulesLoadedListeners.push(function(){
	if(!dojo.render.html.ie) {
		dojo.hostenv.makeWidgets();
	}
});

// we assume that we haven't hit onload yet. Lord help us.
try {
	if (!window["djConfig"] || !window.djConfig["preventBackButtonFix"]){
		document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+'iframe_history.html')+"'></iframe>");
	}
	if (dojo.render.html.ie) {
		document.write('<style>v\:*{ behavior:url(#default#VML); }</style>');
		document.write('<xml:namespace ns="urn:schemas-microsoft-com:vml" prefix="v"/>');
	}
} catch (e) { }

// stub, over-ridden by debugging code. This will at least keep us from
// breaking when it's not included
dojo.hostenv.writeIncludes = function(){} 

dojo.hostenv.byId = dojo.byId = function(id, doc){
	if(typeof id == "string" || id instanceof String){
		if(!doc){ doc = document; }
		return doc.getElementById(id);
	}
	return id; // assume it's a node
}

dojo.hostenv.byIdArray = dojo.byIdArray = function(){
	var ids = [];
	for(var i = 0; i < arguments.length; i++){
		if((arguments[i] instanceof Array)||(typeof arguments[i] == "array")){
			for(var j = 0; j < arguments[i].length; j++){
				ids = ids.concat(dojo.hostenv.byIdArray(arguments[i][j]));
			}
		}else{
			ids.push(dojo.hostenv.byId(arguments[i]));
		}
	}
	return ids;
}

/*
 * bootstrap2.js - runs after the hostenv_*.js file.
 */

/*
 * This method taks a "map" of arrays which one can use to optionally load dojo
 * modules. The map is indexed by the possible dojo.hostenv.name_ values, with
 * two additional values: "default" and "common". The items in the "default"
 * array will be loaded if none of the other items have been choosen based on
 * the hostenv.name_ item. The items in the "common" array will _always_ be
 * loaded, regardless of which list is chosen.  Here's how it's normally
 * called:
 *
 *	dojo.hostenv.conditionalLoadModule({
 *		browser: [
 *			["foo.bar.baz", true, true], // an example that passes multiple args to loadModule()
 *			"foo.sample.*",
 *			"foo.test,
 *		],
 *		default: [ "foo.sample.*" ],
 *		common: [ "really.important.module.*" ]
 *	});
 */
dojo.hostenv.conditionalLoadModule = function(modMap){
	var common = modMap["common"]||[];
	var result = (modMap[dojo.hostenv.name_]) ? common.concat(modMap[dojo.hostenv.name_]||[]) : common.concat(modMap["default"]||[]);

	for(var x=0; x<result.length; x++){
		var curr = result[x];
		if(curr.constructor == Array){
			dojo.hostenv.loadModule.apply(dojo.hostenv, curr);
		}else{
			dojo.hostenv.loadModule(curr);
		}
	}
}

dojo.hostenv.require = dojo.hostenv.loadModule;
dojo.require = function(){
	dojo.hostenv.loadModule.apply(dojo.hostenv, arguments);
}

dojo.requireIf = function(){
	if((arguments[0] === true)||(arguments[0]=="common")||(dojo.render[arguments[0]].capable)){
		var args = [];
		for (var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
		dojo.require.apply(dojo, args);
	}
}

dojo.conditionalRequire = dojo.requireIf;

dojo.kwCompoundRequire = function(){
	dojo.hostenv.conditionalLoadModule.apply(dojo.hostenv, arguments);
}

dojo.hostenv.provide = dojo.hostenv.startPackage;
dojo.provide = function(){
	return dojo.hostenv.startPackage.apply(dojo.hostenv, arguments);
}

// stub
dojo.profile = { start: function(){}, end: function(){}, dump: function(){} };

dojo.provide("dojo.lang");
dojo.provide("dojo.AdapterRegistry");
dojo.provide("dojo.lang.Lang");

dojo.lang.mixin = function(obj, props){
	var tobj = [];
	for(var x in props){
		if(typeof tobj[x] == "undefined" || tobj[x] != props[x]) {
			obj[x] = props[x];
		}
	}
	return obj;
}

dojo.lang.extend = function(ctor, props){
	this.mixin(ctor.prototype, props);
}

dojo.lang.extendPrototype = function(obj, props){
	this.extend(obj.constructor, props);
}

dojo.lang.anonCtr = 0;
dojo.lang.anon = {};
dojo.lang.nameAnonFunc = function(anonFuncPtr, namespaceObj){
	var nso = (namespaceObj || dojo.lang.anon);
	if((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"] == true)){
		for(var x in nso){
			if(nso[x] === anonFuncPtr){
				return x;
			}
		}
	}
	var ret = "__"+dojo.lang.anonCtr++;
	while(typeof nso[ret] != "undefined"){
		ret = "__"+dojo.lang.anonCtr++;
	}
	nso[ret] = anonFuncPtr;
	return ret;
}

/**
 * Runs a function in a given scope (thisObject), can
 * also be used to preserve scope.
 *
 * hitch(foo, "bar"); // runs foo.bar() in the scope of foo
 * hitch(foo, myFunction); // runs myFunction in the scope of foo
 */
dojo.lang.hitch = function(thisObject, method) {
	if(dojo.lang.isString(method)) {
		var fcn = thisObject[method];
	} else {
		var fcn = method;
	}

	return function() {
		return fcn.apply(thisObject, arguments);
	}
}

/**
 * Sets a timeout in milliseconds to execute a function in a given context
 * with optional arguments.
 *
 * setTimeout (Object context, function func, number delay[, arg1[, ...]]);
 * setTimeout (function func, number delay[, arg1[, ...]]);
 */
dojo.lang.setTimeout = function(func, delay){
	var context = window, argsStart = 2;
	if(!dojo.lang.isFunction(func)){
		context = func;
		func = delay;
		delay = arguments[2];
		argsStart++;
	}

	if(dojo.lang.isString(func)){
		func = context[func];
	}
	
	var args = [];
	for (var i = argsStart; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	return setTimeout(function () { func.apply(context, args); }, delay);
}

/**
 * Partial implmentation of is* functions from
 * http://www.crockford.com/javascript/recommend.html
 * NOTE: some of these may not be the best thing to use in all situations
 * as they aren't part of core JS and therefore can't work in every case.
 * See WARNING messages inline for tips.
 *
 * The following is* functions are fairly "safe"
 */

dojo.lang.isObject = function(wh) {
	return typeof wh == "object" || dojo.lang.isArray(wh) || dojo.lang.isFunction(wh);
}

dojo.lang.isArray = function(wh) {
	return (wh instanceof Array || typeof wh == "array");
}

dojo.lang.isArrayLike = function(wh) {
	if(dojo.lang.isString(wh)){ return false; }
	if(dojo.lang.isArray(wh)){ return true; }
	if(dojo.lang.isNumber(wh.length) && isFinite(wh)){ return true; }
	return false;
}

dojo.lang.isFunction = function(wh) {
	return (wh instanceof Function || typeof wh == "function");
}

dojo.lang.isString = function(wh) {
	return (wh instanceof String || typeof wh == "string");
}

dojo.lang.isAlien = function(wh) {
	return !dojo.lang.isFunction() && /\{\s*\[native code\]\s*\}/.test(String(wh));
}

dojo.lang.isBoolean = function(wh) {
	return (wh instanceof Boolean || typeof wh == "boolean");
}

/**
 * The following is***() functions are somewhat "unsafe". Fortunately,
 * there are workarounds the the language provides and are mentioned
 * in the WARNING messages.
 *
 * WARNING: In most cases, isNaN(wh) is sufficient to determine whether or not
 * something is a number or can be used as such. For example, a number or string
 * can be used interchangably when accessing array items (arr["1"] is the same as
 * arr[1]) and isNaN will return false for both values ("1" and 1). Should you
 * use isNumber("1"), that will return false, which is generally not too useful.
 * Also, isNumber(NaN) returns true, again, this isn't generally useful, but there
 * are corner cases (like when you want to make sure that two things are really
 * the same type of thing). That is really where isNumber "shines".
 *
 * RECOMMENDATION: Use isNaN(wh) when possible
 */
dojo.lang.isNumber = function(wh) {
	return (wh instanceof Number || typeof wh == "number");
}

/**
 * WARNING: In some cases, isUndefined will not behave as you
 * might expect. If you do isUndefined(foo) and there is no earlier
 * reference to foo, an error will be thrown before isUndefined is
 * called. It behaves correctly if you scope yor object first, i.e.
 * isUndefined(foo.bar) where foo is an object and bar isn't a
 * property of the object.
 *
 * RECOMMENDATION: Use `typeof foo == "undefined"` when possible
 *
 * FIXME: Should isUndefined go away since it is error prone?
 */
dojo.lang.isUndefined = function(wh) {
	return ((wh == undefined)&&(typeof wh == "undefined"));
}

// end Crockford functions

dojo.lang.whatAmI = function(wh) {
	try {
		if(dojo.lang.isArray(wh)) { return "array"; }
		if(dojo.lang.isFunction(wh)) { return "function"; }
		if(dojo.lang.isString(wh)) { return "string"; }
		if(dojo.lang.isNumber(wh)) { return "number"; }
		if(dojo.lang.isBoolean(wh)) { return "boolean"; }
		if(dojo.lang.isAlien(wh)) { return "alien"; }
		if(dojo.lang.isUndefined(wh)) { return "undefined"; }
		// FIXME: should this go first?
		for(var name in dojo.lang.whatAmI.custom) {
			if(dojo.lang.whatAmI.custom[name](wh)) {
				return name;
			}
		}
		if(dojo.lang.isObject(wh)) { return "object"; }
	} catch(E) {}
	return "unknown";
}
/*
 * dojo.lang.whatAmI.custom[typeName] = someFunction
 * will return typeName is someFunction(wh) returns true
 */
dojo.lang.whatAmI.custom = {};

dojo.lang.find = function(arr, val, identity){
	// support both (arr, val) and (val, arr)
	if(!dojo.lang.isArray(arr) && dojo.lang.isArray(val)) {
		var a = arr;
		arr = val;
		val = a;
	}
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(identity){
		for(var i=0;i<arr.length;++i){
			if(arr[i] === val){ return i; }
		}
	}else{
		for(var i=0;i<arr.length;++i){
			if(arr[i] == val){ return i; }
		}
	}
	return -1;
}

dojo.lang.indexOf = dojo.lang.find;

dojo.lang.findLast = function(arr, val, identity) {
	// support both (arr, val) and (val, arr)
	if(!dojo.lang.isArray(arr) && dojo.lang.isArray(val)) {
		var a = arr;
		arr = val;
		val = a;
	}
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(identity){
		for(var i = arr.length-1; i >= 0; i--) {
			if(arr[i] === val){ return i; }
		}
	}else{
		for(var i = arr.length-1; i >= 0; i--) {
			if(arr[i] == val){ return i; }
		}
	}
	return -1;
}

dojo.lang.lastIndexOf = dojo.lang.findLast;

dojo.lang.inArray = function(arr, val){
	return dojo.lang.find(arr, val) > -1;
}

dojo.lang.getNameInObj = function(ns, item){
	if(!ns){ ns = dj_global; }

	for(var x in ns){
		if(ns[x] === item){
			return new String(x);
		}
	}
	return null;
}

// FIXME: Is this worthless since you can do: if(name in obj)
// is this the right place for this?
dojo.lang.has = function(obj, name){
	return (typeof obj[name] !== 'undefined');
}

dojo.lang.isEmpty = function(obj) {
	if(dojo.lang.isObject(obj)) {
		var tmp = {};
		var count = 0;
		for(var x in obj){
			if(obj[x] && (!tmp[x])){
				count++;
				break;
			} 
		}
		return (count == 0);
	} else if(dojo.lang.isArray(obj) || dojo.lang.isString(obj)) {
		return obj.length == 0;
	}
}

dojo.lang.forEach = function(arr, unary_func, fix_length){
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	var il = arr.length;
	for(var i=0; i< ((fix_length) ? il : arr.length); i++){
		if(unary_func(arr[i], i, arr) == "break"){
			break;
		}
	}
}

dojo.lang.map = function(arr, obj, unary_func){
	var isString = dojo.lang.isString(arr);
	if(isString){
		arr = arr.split("");
	}
	if(dojo.lang.isFunction(obj)&&(!unary_func)){
		unary_func = obj;
		obj = dj_global;
	}else if(dojo.lang.isFunction(obj) && unary_func){
		// ff 1.5 compat
		var tmpObj = obj;
		obj = unary_func;
		unary_func = tmpObj;
	}

	if(Array.map){
	 	var outArr = Array.map(arr, unary_func, obj);
	}else{
		var outArr = [];
		for(var i=0;i<arr.length;++i){
			outArr.push(unary_func.call(obj, arr[i]));
		}
	}

	if(isString) {
		return outArr.join("");
	} else {
		return outArr;
	}
}

dojo.lang.tryThese = function(){
	for(var x=0; x<arguments.length; x++){
		try{
			if(typeof arguments[x] == "function"){
				var ret = (arguments[x]());
				if(ret){
					return ret;
				}
			}
		}catch(e){
			dojo.debug(e);
		}
	}
}

dojo.lang.delayThese = function(farr, cb, delay, onend){
	/**
	 * alternate: (array funcArray, function callback, function onend)
	 * alternate: (array funcArray, function callback)
	 * alternate: (array funcArray)
	 */
	if(!farr.length){ 
		if(typeof onend == "function"){
			onend();
		}
		return;
	}
	if((typeof delay == "undefined")&&(typeof cb == "number")){
		delay = cb;
		cb = function(){};
	}else if(!cb){
		cb = function(){};
		if(!delay){ delay = 0; }
	}
	setTimeout(function(){
		(farr.shift())();
		cb();
		dojo.lang.delayThese(farr, cb, delay, onend);
	}, delay);
}

dojo.lang.shallowCopy = function(obj) {
	var ret = {}, key;
	for(key in obj) {
		if(dojo.lang.isUndefined(ret[key])) {
			ret[key] = obj[key];
		}
	}
	return ret;
}

dojo.lang.every = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.every) {
		return Array.every(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { dojo.raise("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		for(var i = 0; i < arr.length; i++) {
			if(!callback.call(thisObject, arr[i], i, arr)) {
				return false;
			}
		}
		return true;
	}
}

dojo.lang.some = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.some) {
		return Array.some(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { dojo.raise("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		for(var i = 0; i < arr.length; i++) {
			if(callback.call(thisObject, arr[i], i, arr)) {
				return true;
			}
		}
		return false;
	}
}

dojo.lang.filter = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.filter) {
		var outArr = Array.filter(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { dojo.raise("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		var outArr = [];
		for(var i = 0; i < arr.length; i++) {
			if(callback.call(thisObject, arr[i], i, arr)) {
				outArr.push(arr[i]);
			}
		}
	}
	if(isString) {
		return outArr.join("");
	} else {
		return outArr;
	}
}

dojo.AdapterRegistry = function(){
    /***
        A registry to facilitate adaptation.

        Pairs is an array of [name, check, wrap] triples
        
        All check/wrap functions in this registry should be of the same arity.
    ***/
    this.pairs = [];
}

dojo.lang.extend(dojo.AdapterRegistry, {
    register: function (name, check, wrap, /* optional */ override) {
        /***
            The check function should return true if the given arguments are
            appropriate for the wrap function.

            If override is given and true, the check function will be given
            highest priority.  Otherwise, it will be the lowest priority
            adapter.
        ***/

        if (override) {
            this.pairs.unshift([name, check, wrap]);
        } else {
            this.pairs.push([name, check, wrap]);
        }
    },

    match: function (/* ... */) {
        /***
            Find an adapter for the given arguments.
            
            If no suitable adapter is found, throws NotFound.
        ***/
        for(var i = 0; i < this.pairs.length; i++){
            var pair = this.pairs[i];
            if(pair[1].apply(this, arguments)){
                return pair[2].apply(this, arguments);
            }
        }
        dojo.raise("No match found");
    },

    unregister: function (name) {
        /***

            Remove a named adapter from the registry

        ***/
        for (var i = 0; i < this.pairs.length; i++) {
            var pair = this.pairs[i];
            if (pair[0] == name) {
                this.pairs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
});

dojo.lang.reprRegistry = new dojo.AdapterRegistry();
dojo.lang.registerRepr = function(name, check, wrap, /*optional*/ override) {
        /***
            Register a repr function.  repr functions should take
            one argument and return a string representation of it
            suitable for developers, primarily used when debugging.

            If override is given, it is used as the highest priority
            repr, otherwise it will be used as the lowest.
        ***/
        dojo.lang.reprRegistry.register(name, check, wrap, override);
    };

dojo.lang.repr = function(obj){
	/***
		Return a "programmer representation" for an object
	***/

	if(typeof(obj) == "undefined"){
		return "undefined";
	}else if(obj === null){
		return "null";
	}

	try{
		if(typeof(obj["__repr__"]) == 'function'){
			return obj["__repr__"]();
		}else if((typeof(obj["repr"]) == 'function')&&(obj.repr != arguments.callee)){
			return obj["repr"]();
		}
		return dojo.lang.reprRegistry.match(obj);
	}catch(e){
		if(typeof(obj.NAME) == 'string' && (
				obj.toString == Function.prototype.toString ||
				obj.toString == Object.prototype.toString
			)){
			return o.NAME;
		}
	}

	if(typeof(obj) == "function"){
		obj = (obj + "").replace(/^\s+/, "");
		var idx = obj.indexOf("{");
		if(idx != -1){
			obj = obj.substr(0, idx) + "{...}";
		}
	}
	return obj + "";
}

dojo.lang.reprArrayLike = function(arr){
	try{
		var na = dojo.lang.map(arr, dojo.lang.repr);
		return "[" + na.join(", ") + "]";
	}catch(e){ }
};

dojo.lang.reprString = function(str){ 
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"'
		).replace(/[\f]/g, "\\f"
		).replace(/[\b]/g, "\\b"
		).replace(/[\n]/g, "\\n"
		).replace(/[\t]/g, "\\t"
		).replace(/[\r]/g, "\\r");
};

dojo.lang.reprNumber = function(num){
	return num + "";
};

(function(){
	var m = dojo.lang;
	m.registerRepr("arrayLike", m.isArrayLike, m.reprArrayLike);
	m.registerRepr("string", m.isString, m.reprString);
	m.registerRepr("numbers", m.isNumber, m.reprNumber);
	m.registerRepr("boolean", m.isBoolean, m.reprNumber);
	// m.registerRepr("numbers", m.typeMatcher("number", "boolean"), m.reprNumber);
})();

/**
 * Creates a 1-D array out of all the arguments passed,
 * unravelling any array-like objects in the process
 *
 * Ex:
 * unnest(1, 2, 3) ==> [1, 2, 3]
 * unnest(1, [2, [3], [[[4]]]]) ==> [1, 2, 3, 4]
 */
dojo.lang.unnest = function(/* ... */) {
	var out = [];
	for(var i = 0; i < arguments.length; i++) {
		if(dojo.lang.isArrayLike(arguments[i])) {
			var add = dojo.lang.unnest.apply(this, arguments[i]);
			out = out.concat(add);
		} else {
			out.push(arguments[i]);
		}
	}
	return out;
}

dojo.provide("dojo.string");
dojo.require("dojo.lang");

dojo.string.trim = function(str){
	if(!dojo.lang.isString(str)){ return str; }
	if(!str.length){ return str; }
	return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

// Parameterized string function
//  str - formatted string with %{values} to be replaces
//  pairs - object of name: "value" value pairs
//  killExtra - remove all remaining %{values} after pairs are inserted
dojo.string.paramString = function(str, pairs, killExtra) {
	for(var name in pairs) {
		var re = new RegExp("\\%\\{" + name + "\\}", "g");
		str = str.replace(re, pairs[name]);
	}

	if(killExtra) { str = str.replace(/%\{([^\}\s]+)\}/g, ""); }
	return str;
}

/** Uppercases the first letter of each word */
dojo.string.capitalize = function (str) {
	if (!dojo.lang.isString(str)) { return ""; }
	if (arguments.length == 0) { str = this; }
	var words = str.split(' ');
	var retval = "";
	var len = words.length;
	for (var i=0; i<len; i++) {
		var word = words[i];
		word = word.charAt(0).toUpperCase() + word.substring(1, word.length);
		retval += word;
		if (i < len-1)
			retval += " ";
	}
	
	return new String(retval);
}

dojo.string.isBlank = function (str) {
	if(!dojo.lang.isString(str)) { return true; }
	return (dojo.string.trim(str).length == 0);
}

dojo.string.encodeAscii = function(str) {
	if(!dojo.lang.isString(str)) { return str; }
	var ret = "";
	var value = escape(str);
	var match, re = /%u([0-9A-F]{4})/i;
	while((match = value.match(re))) {
		var num = Number("0x"+match[1]);
		var newVal = escape("&#" + num + ";");
		ret += value.substring(0, match.index) + newVal;
		value = value.substring(match.index+match[0].length);
	}
	ret += value.replace(/\+/g, "%2B");
	return ret;
}

// TODO: make an HTML version
dojo.string.summary = function(str, len) {
	if(!len || str.length <= len) {
		return str;
	} else {
		return str.substring(0, len).replace(/\.+$/, "") + "...";
	}
}

dojo.string.escape = function(type, str) {
	switch(type.toLowerCase()) {
		case "xml":
		case "html":
		case "xhtml":
			return dojo.string.escapeXml(str);
		case "sql":
			return dojo.string.escapeSql(str);
		case "regexp":
		case "regex":
			return dojo.string.escapeRegExp(str);
		case "javascript":
		case "jscript":
		case "js":
			return dojo.string.escapeJavaScript(str);
		default:
			return str;
	}
}

dojo.string.escapeXml = function(str) {
	return str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
		.replace(/>/gm, "&gt;").replace(/"/gm, "&quot;").replace(/'/gm, "&#39;");
}

dojo.string.escapeSql = function(str) {
	return str.replace(/'/gm, "''");
}

dojo.string.escapeRegExp = function(str) {
	return str.replace(/\\/gm, "\\\\").replace(/([\f\b\n\t\r])/gm, "\\$1");
}

dojo.string.escapeJavaScript = function(str) {
	return str.replace(/(["'\f\b\n\t\r])/gm, "\\$1");
}

dojo.string.repeat = function(str, count) {
	var out = "";
	for(var i = 0; i < count; i++) {
		out += str;
	}
	return out;
}

// do we even want to offer this? is it worth it?
dojo.string.addToPrototype = function() {
	for(var method in dojo.string) {
		if(dojo.lang.isFunction(dojo.string[method])) {
			var func = (function() {
				var meth = method;
				switch(meth) {
					case "addToPrototype":
						return null;
						break;
					case "escape":
						return function(type) {
							return dojo.string.escape(type, this);
						}
						break;
					default:
						return function() {
							var args = [this];
							for(var i = 0; i < arguments.length; i++) {
								args.push(arguments[i]);
							}
							dojo.debug(args);
							return dojo.string[meth].apply(dojo.string, args);
						}
				}
			})();
			if(func) { String.prototype[method] = func; }
		}
	}
}

dojo.provide("dojo.io.IO");
dojo.require("dojo.string");

/******************************************************************************
 *	Notes about dojo.io design:
 *	
 *	The dojo.io.* package has the unenviable task of making a lot of different
 *	types of I/O feel natural, despite a universal lack of good (or even
 *	reasonable!) I/O capability in the host environment. So lets pin this down
 *	a little bit further.
 *
 *	Rhino:
 *		perhaps the best situation anywhere. Access to Java classes allows you
 *		to do anything one might want in terms of I/O, both synchronously and
 *		async. Can open TCP sockets and perform low-latency client/server
 *		interactions. HTTP transport is available through Java HTTP client and
 *		server classes. Wish it were always this easy.
 *
 *	xpcshell:
 *		XPCOM for I/O. A cluster-fuck to be sure.
 *
 *	spidermonkey:
 *		S.O.L.
 *
 *	Browsers:
 *		Browsers generally do not provide any useable filesystem access. We are
 *		therefore limited to HTTP for moving information to and from Dojo
 *		instances living in a browser.
 *
 *		XMLHTTP:
 *			Sync or async, allows reading of arbitrary text files (including
 *			JS, which can then be eval()'d), writing requires server
 *			cooperation and is limited to HTTP mechanisms (POST and GET).
 *
 *		<iframe> hacks:
 *			iframe document hacks allow browsers to communicate asynchronously
 *			with a server via HTTP POST and GET operations. With significant
 *			effort and server cooperation, low-latency data transit between
 *			client and server can be acheived via iframe mechanisms (repubsub).
 *
 *		SVG:
 *			Adobe's SVG viewer implements helpful primitives for XML-based
 *			requests, but receipt of arbitrary text data seems unlikely w/o
 *			<![CDATA[]]> sections.
 *
 *
 *	A discussion between Dylan, Mark, Tom, and Alex helped to lay down a lot
 *	the IO API interface. A transcript of it can be found at:
 *		http://dojotoolkit.org/viewcvs/viewcvs.py/documents/irc/irc_io_api_log.txt?rev=307&view=auto
 *	
 *	Also referenced in the design of the API was the DOM 3 L&S spec:
 *		http://www.w3.org/TR/2004/REC-DOM-Level-3-LS-20040407/load-save.html
 ******************************************************************************/

// a map of the available transport options. Transports should add themselves
// by calling add(name)
dojo.io.transports = [];
dojo.io.hdlrFuncNames = [ "load", "error" ]; // we're omitting a progress() event for now

dojo.io.Request = function(url, mimetype, transport, changeUrl){
	if((arguments.length == 1)&&(arguments[0].constructor == Object)){
		this.fromKwArgs(arguments[0]);
	}else{
		this.url = url;
		if (arguments.length >= 2) { this.mimetype = mimetype; }
		if (arguments.length >= 3) { this.transport = transport; }
		if (arguments.length >= 4) { this.changeUrl = changeUrl; }
	}
}

dojo.lang.extend(dojo.io.Request, {

	/** The URL to hit */
	url: "",
	
	/** The mime type used to interrpret the response body */
	mimetype: "text/plain",
	
	/** The HTTP method to use */
	method: "GET",
	
	/** An Object containing key-value pairs to be included with the request */
	content: undefined, // Object
	
	/** The transport medium to use */
	transport: undefined, // String
	
	/** If defined the URL of the page is physically changed */
	changeUrl: undefined, // String
	
	/** A form node to use in the request */
	formNode: undefined, // HTMLFormElement
	
	/** Whether the request should be made synchronously */
	sync: false,
	
	bindSuccess: false,
	useCache: false,
	
	// events stuff
	load: function(type, data, evt){ },
	error: function (type, error){ },
	
	// backButton: function(){ },
	// forwardButton: function(){ },
	// handle: function () {},

	fromKwArgs: function(kwArgs){
		// normalize args
		if(kwArgs["url"]){ kwArgs.url = kwArgs.url.toString(); }
		if(!kwArgs["method"] && kwArgs["formNode"] && kwArgs["formNode"].method) {
			kwArgs.method = kwArgs["formNode"].method;
		}
		
		// backwards compatibility
		if(!kwArgs["handle"] && kwArgs["handler"]){ kwArgs.handle = kwArgs.handler; }
		if(!kwArgs["load"] && kwArgs["loaded"]){ kwArgs.load = kwArgs.loaded; }
		if(!kwArgs["changeUrl"] && kwArgs["changeURL"]) { kwArgs.changeUrl = kwArgs.changeURL; }

		// encoding fun!
		if(!kwArgs["encoding"]) {
			if(!dojo.lang.isUndefined(djConfig["bindEncoding"])) {
				kwArgs.encoding = djConfig.bindEncoding;
			} else {
				kwArgs.encoding = "";
			}
		}

		var isFunction = dojo.lang.isFunction;
		for(var x=0; x<dojo.io.hdlrFuncNames.length; x++){
			var fn = dojo.io.hdlrFuncNames[x];
			if(isFunction(kwArgs[fn])){ continue; }
			if(isFunction(kwArgs["handle"])){
				kwArgs[fn] = kwArgs.handle;
			}
			// handler is aliased above, shouldn't need this check
			/* else if(dojo.lang.isObject(kwArgs.handler)){
				if(isFunction(kwArgs.handler[fn])){
					kwArgs[fn] = kwArgs.handler[fn]||kwArgs.handler["handle"]||function(){};
				}
			}*/
		}
		dojo.lang.mixin(this, kwArgs);
	}

});

dojo.io.Error = function(msg, type, num){
	this.message = msg;
	this.type =  type || "unknown"; // must be one of "io", "parse", "unknown"
	this.number = num || 0; // per-substrate error number, not normalized
}

dojo.io.transports.addTransport = function(name){
	this.push(name);
	// FIXME: do we need to handle things that aren't direct children of the
	// dojo.io namespace? (say, dojo.io.foo.fooTransport?)
	this[name] = dojo.io[name];
}

// binding interface, the various implementations register their capabilities
// and the bind() method dispatches
dojo.io.bind = function(request){
	// if the request asks for a particular implementation, use it
	if(!(request instanceof dojo.io.Request)){
		try{
		request = new dojo.io.Request(request);
		}catch(e){ dojo.debug(e); }
	}
	var tsName = "";
	if(request["transport"]){
		tsName = request["transport"];
		if(!this[tsName]){ return request; }
	}else{
		// otherwise we do our best to auto-detect what available transports
		// will handle 
		for(var x=0; x<dojo.io.transports.length; x++){
			var tmp = dojo.io.transports[x];
			if((this[tmp])&&(this[tmp].canHandle(request))){
				tsName = tmp;
			}
		}
		if(tsName == ""){ return request; }
	}
	this[tsName].bind(request);
	request.bindSuccess = true;
	return request;
}

dojo.io.argsFromMap = function(map, encoding){
	var control = new Object();
	var mapStr = "";
	var enc = /utf/i.test(encoding||"") ? encodeURIComponent : dojo.string.encodeAscii;
	for(var x in map){
		if(!control[x]){
			mapStr+= enc(x)+"="+enc(map[x])+"&";
		}
	}

	return mapStr;
}

/*
dojo.io.sampleTranport = new function(){
	this.canHandle = function(kwArgs){
		// canHandle just tells dojo.io.bind() if this is a good transport to
		// use for the particular type of request.
		if(	
			(
				(kwArgs["mimetype"] == "text/plain") ||
				(kwArgs["mimetype"] == "text/html") ||
				(kwArgs["mimetype"] == "text/javascript")
			)&&(
				(kwArgs["method"] == "get") ||
				( (kwArgs["method"] == "post") && (!kwArgs["formNode"]) )
			)
		){
			return true;
		}

		return false;
	}

	this.bind = function(kwArgs){
		var hdlrObj = {};

		// set up a handler object
		for(var x=0; x<dojo.io.hdlrFuncNames.length; x++){
			var fn = dojo.io.hdlrFuncNames[x];
			if(typeof kwArgs.handler == "object"){
				if(typeof kwArgs.handler[fn] == "function"){
					hdlrObj[fn] = kwArgs.handler[fn]||kwArgs.handler["handle"];
				}
			}else if(typeof kwArgs[fn] == "function"){
				hdlrObj[fn] = kwArgs[fn];
			}else{
				hdlrObj[fn] = kwArgs["handle"]||function(){};
			}
		}

		// build a handler function that calls back to the handler obj
		var hdlrFunc = function(evt){
			if(evt.type == "onload"){
				hdlrObj.load("load", evt.data, evt);
			}else if(evt.type == "onerr"){
				var errObj = new dojo.io.Error("sampleTransport Error: "+evt.msg);
				hdlrObj.error("error", errObj);
			}
		}

		// the sample transport would attach the hdlrFunc() when sending the
		// request down the pipe at this point
		var tgtURL = kwArgs.url+"?"+dojo.io.argsFromMap(kwArgs.content);
		// sampleTransport.sendRequest(tgtURL, hdlrFunc);
	}

	dojo.io.transports.addTransport("sampleTranport");
}
*/

dojo.provide("dojo.dom");
dojo.require("dojo.lang");

dojo.dom.ELEMENT_NODE                  = 1;
dojo.dom.ATTRIBUTE_NODE                = 2;
dojo.dom.TEXT_NODE                     = 3;
dojo.dom.CDATA_SECTION_NODE            = 4;
dojo.dom.ENTITY_REFERENCE_NODE         = 5;
dojo.dom.ENTITY_NODE                   = 6;
dojo.dom.PROCESSING_INSTRUCTION_NODE   = 7;
dojo.dom.COMMENT_NODE                  = 8;
dojo.dom.DOCUMENT_NODE                 = 9;
dojo.dom.DOCUMENT_TYPE_NODE            = 10;
dojo.dom.DOCUMENT_FRAGMENT_NODE        = 11;
dojo.dom.NOTATION_NODE                 = 12;
	
dojo.dom.dojoml = "http://www.dojotoolkit.org/2004/dojoml";

/**
 *	comprehensive list of XML namespaces
**/
dojo.dom.xmlns = {
	svg : "http://www.w3.org/2000/svg",
	smil : "http://www.w3.org/2001/SMIL20/",
	mml : "http://www.w3.org/1998/Math/MathML",
	cml : "http://www.xml-cml.org",
	xlink : "http://www.w3.org/1999/xlink",
	xhtml : "http://www.w3.org/1999/xhtml",
	xul : "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
	xbl : "http://www.mozilla.org/xbl",
	fo : "http://www.w3.org/1999/XSL/Format",
	xsl : "http://www.w3.org/1999/XSL/Transform",
	xslt : "http://www.w3.org/1999/XSL/Transform",
	xi : "http://www.w3.org/2001/XInclude",
	xforms : "http://www.w3.org/2002/01/xforms",
	saxon : "http://icl.com/saxon",
	xalan : "http://xml.apache.org/xslt",
	xsd : "http://www.w3.org/2001/XMLSchema",
	dt: "http://www.w3.org/2001/XMLSchema-datatypes",
	xsi : "http://www.w3.org/2001/XMLSchema-instance",
	rdf : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rdfs : "http://www.w3.org/2000/01/rdf-schema#",
	dc : "http://purl.org/dc/elements/1.1/",
	dcq: "http://purl.org/dc/qualifiers/1.0",
	"soap-env" : "http://schemas.xmlsoap.org/soap/envelope/",
	wsdl : "http://schemas.xmlsoap.org/wsdl/",
	AdobeExtensions : "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
};

dojo.dom.isNode = dojo.lang.isDomNode = function(wh){
	if(typeof Element != "undefined") {
		return wh instanceof Element;
	} else {
		// best-guess
		return !isNaN(wh.nodeType);
	}
}
dojo.lang.whatAmI.custom["node"] = dojo.dom.isNode;

dojo.dom.getTagName = function(node){
	var tagName = node.tagName;
	if(tagName.substr(0,5).toLowerCase()!="dojo:"){
		
		if(tagName.substr(0,4).toLowerCase()=="dojo"){
			// FIXME: this assuumes tag names are always lower case
			return "dojo:" + tagName.substring(4).toLowerCase();
		}

		// allow lower-casing
		var djt = node.getAttribute("dojoType")||node.getAttribute("dojotype");
		if(djt){
			return "dojo:"+djt.toLowerCase();
		}
		
		if((node.getAttributeNS)&&(node.getAttributeNS(this.dojoml,"type"))){
			return "dojo:" + node.getAttributeNS(this.dojoml,"type").toLowerCase();
		}
		try{
			// FIXME: IE really really doesn't like this, so we squelch
			// errors for it
			djt = node.getAttribute("dojo:type");
		}catch(e){ /* FIXME: log? */ }
		if(djt){
			return "dojo:"+djt.toLowerCase();
		}

		if((!dj_global["djConfig"])||(!djConfig["ignoreClassNames"])){
			// FIXME: should we make this optionally enabled via djConfig?
			var classes = node.className||node.getAttribute("class");
			if((classes)&&(classes.indexOf("dojo-") != -1)){
				var aclasses = classes.split(" ");
				for(var x=0; x<aclasses.length; x++){
					if((aclasses[x].length>5)&&(aclasses[x].indexOf("dojo-")>=0)){
						return "dojo:"+aclasses[x].substr(5).toLowerCase();
					}
				}
			}
		}

	}
	return tagName.toLowerCase();
}

dojo.dom.getUniqueId = function(){
	do {
		var id = "dj_unique_" + (++arguments.callee._idIncrement);
	}while(document.getElementById(id));
	return id;
}
dojo.dom.getUniqueId._idIncrement = 0;

dojo.dom.firstElement = dojo.dom.getFirstChildElement = function(parentNode){
	var node = parentNode.firstChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE){
		node = node.nextSibling;
	}
	return node;
}

dojo.dom.lastElement = dojo.dom.getLastChildElement = function(parentNode){
	var node = parentNode.lastChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE) {
		node = node.previousSibling;
	}
	return node;
}

dojo.dom.nextElement = dojo.dom.getNextSiblingElement = function(node){
	if(!node) { return null; }
	do {
		node = node.nextSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);
	return node;
}

dojo.dom.prevElement = dojo.dom.getPreviousSiblingElement = function(node){
	if(!node) { return null; }
	do {
		node = node.previousSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);
	return node;
}

// TODO: hmph
/*this.forEachChildTag = function(node, unaryFunc) {
	var child = this.getFirstChildTag(node);
	while(child) {
		if(unaryFunc(child) == "break") { break; }
		child = this.getNextSiblingTag(child);
	}
}*/

dojo.dom.moveChildren = function(srcNode, destNode, trim){
	var count = 0;
	if(trim) {
		while(srcNode.hasChildNodes() &&
			srcNode.firstChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.firstChild);
		}
		while(srcNode.hasChildNodes() &&
			srcNode.lastChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.lastChild);
		}
	}
	while(srcNode.hasChildNodes()){
		destNode.appendChild(srcNode.firstChild);
		count++;
	}
	return count;
}

dojo.dom.copyChildren = function(srcNode, destNode, trim){
	var clonedNode = srcNode.cloneNode(true);
	return this.moveChildren(clonedNode, destNode, trim);
}

dojo.dom.removeChildren = function(node){
	var count = node.childNodes.length;
	while(node.hasChildNodes()){ node.removeChild(node.firstChild); }
	return count;
}

dojo.dom.replaceChildren = function(node, newChild){
	// FIXME: what if newChild is an array-like object?
	dojo.dom.removeChildren(node);
	node.appendChild(newChild);
}

dojo.dom.removeNode = function(node){
	if(node && node.parentNode){
		// return a ref to the removed child
		return node.parentNode.removeChild(node);
	}
}

dojo.dom.getAncestors = function(node, filterFunction, returnFirstHit) {
	var ancestors = [];
	var isFunction = dojo.lang.isFunction(filterFunction);
	while(node) {
		if (!isFunction || filterFunction(node)) {
			ancestors.push(node);
		}
		if (returnFirstHit && ancestors.length > 0) { return ancestors[0]; }
		
		node = node.parentNode;
	}
	if (returnFirstHit) { return null; }
	return ancestors;
}

dojo.dom.getAncestorsByTag = function(node, tag, returnFirstHit) {
	tag = tag.toLowerCase();
	return dojo.dom.getAncestors(node, function(el){
		return ((el.tagName)&&(el.tagName.toLowerCase() == tag));
	}, returnFirstHit);
}

dojo.dom.getFirstAncestorByTag = function(node, tag) {
	return dojo.dom.getAncestorsByTag(node, tag, true);
}

dojo.dom.isDescendantOf = function(node, ancestor, guaranteeDescendant){
	// guaranteeDescendant allows us to be a "true" isDescendantOf function
	if(guaranteeDescendant && node) { node = node.parentNode; }
	while(node) {
		if(node == ancestor){ return true; }
		node = node.parentNode;
	}
	return false;
}

dojo.dom.innerXML = function(node){
	if(node.innerXML){
		return node.innerXML;
	}else if(typeof XMLSerializer != "undefined"){
		return (new XMLSerializer()).serializeToString(node);
	}
}

dojo.dom.createDocumentFromText = function(str, mimetype){
	if(!mimetype) { mimetype = "text/xml"; }
	if(typeof DOMParser != "undefined") {
		var parser = new DOMParser();
		return parser.parseFromString(str, mimetype);
	}else if(typeof ActiveXObject != "undefined"){
		var domDoc = new ActiveXObject("Microsoft.XMLDOM");
		if(domDoc) {
			domDoc.async = false;
			domDoc.loadXML(str);
			return domDoc;
		}else{
			dojo.debug("toXml didn't work?");
		}
	/*
	}else if((dojo.render.html.capable)&&(dojo.render.html.safari)){
		// FIXME: this doesn't appear to work!
		// from: http://web-graphics.com/mtarchive/001606.php
		// var xml = '<?xml version="1.0"?>'+str;
		var mtype = "text/xml";
		var xml = '<?xml version="1.0"?>'+str;
		var url = "data:"+mtype+";charset=utf-8,"+encodeURIComponent(xml);
		var req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.overrideMimeType(mtype);
		req.send(null);
		return req.responseXML;
	*/
	}else if(document.createElement){
		// FIXME: this may change all tags to uppercase!
		var tmp = document.createElement("xml");
		tmp.innerHTML = str;
		if(document.implementation && document.implementation.createDocument) {
			var xmlDoc = document.implementation.createDocument("foo", "", null);
			for(var i = 0; i < tmp.childNodes.length; i++) {
				xmlDoc.importNode(tmp.childNodes.item(i), true);
			}
			return xmlDoc;
		}
		// FIXME: probably not a good idea to have to return an HTML fragment
		// FIXME: the tmp.doc.firstChild is as tested from IE, so it may not
		// work that way across the board
		return tmp.document && tmp.document.firstChild ?
			tmp.document.firstChild : tmp;
	}
	return null;
}

// referenced for backwards compatibility
//this.extractRGB = function(color) { return dojo.graphics.color.extractRGB(color); }
//this.hex2rgb = function(hex) { return dojo.graphics.color.hex2rgb(hex); }
//this.rgb2hex = function(r, g, b) { return dojo.graphics.color.rgb2hex(r, g, b); }

dojo.dom.insertBefore = function(node, ref, force){
	if (force != true &&
		(node === ref || node.nextSibling === ref)){ return false; }
	var parent = ref.parentNode;
	parent.insertBefore(node, ref);
	return true;
}

dojo.dom.insertAfter = function(node, ref, force){
	var pn = ref.parentNode;
	if(ref == pn.lastChild){
		if((force != true)&&(node === ref)){
			return false;
		}
		pn.appendChild(node);
	}else{
		return this.insertBefore(node, ref.nextSibling, force);
	}
	return true;
}

dojo.dom.insertAtPosition = function(node, ref, position){
	if((!node)||(!ref)||(!position)){ return false; }
	switch(position.toLowerCase()){
		case "before":
			return dojo.dom.insertBefore(node, ref);
		case "after":
			return dojo.dom.insertAfter(node, ref);
		case "first":
			if(ref.firstChild){
				return dojo.dom.insertBefore(node, ref.firstChild);
			}else{
				ref.appendChild(node);
				return true;
			}
			break;
		default: // aka: last
			ref.appendChild(node);
			return true;
	}
}

dojo.dom.insertAtIndex = function(node, containingNode, insertionIndex){
	var siblingNodes = containingNode.childNodes;

	// if there aren't any kids yet, just add it to the beginning

	if (!siblingNodes.length){
		containingNode.appendChild(node);
		return true;
	}

	// otherwise we need to walk the childNodes
	// and find our spot

	var after = null;

	for(var i=0; i<siblingNodes.length; i++){

		var sibling_index = siblingNodes.item(i)["getAttribute"] ? parseInt(siblingNodes.item(i).getAttribute("dojoinsertionindex")) : -1;

		if (sibling_index < insertionIndex){
			after = siblingNodes.item(i);
		}
	}

	if (after){
		// add it after the node in {after}

		return dojo.dom.insertAfter(node, after);
	}else{
		// add it to the start

		return dojo.dom.insertBefore(node, siblingNodes.item(0));
	}
}
	
/**
 * implementation of the DOM Level 3 attribute.
 * 
 * @param node The node to scan for text
 * @param text Optional, set the text to this value.
 */
dojo.dom.textContent = function(node, text){
	if (text) {
		dojo.dom.replaceChildren(node, document.createTextNode(text));
		return text;
	} else {
		var _result = "";
		if (node == null) { return _result; }
		for (var i = 0; i < node.childNodes.length; i++) {
			switch (node.childNodes[i].nodeType) {
				case 1: // ELEMENT_NODE
				case 5: // ENTITY_REFERENCE_NODE
					_result += dojo.dom.textContent(node.childNodes[i]);
					break;
				case 3: // TEXT_NODE
				case 2: // ATTRIBUTE_NODE
				case 4: // CDATA_SECTION_NODE
					_result += node.childNodes[i].nodeValue;
					break;
				default:
					break;
			}
		}
		return _result;
	}
}

dojo.dom.collectionToArray = function(collection){
	var array = new Array(collection.length);
	for (var i = 0; i < collection.length; i++) {
		array[i] = collection[i];
	}
	return array;
}

dojo.provide("dojo.io.BrowserIO");

dojo.require("dojo.io");
dojo.require("dojo.lang");
dojo.require("dojo.dom");

try {
	if((!djConfig.preventBackButtonFix)&&(!dojo.hostenv.post_load_)){
		document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+'iframe_history.html')+"'></iframe>");
	}
} catch (e) { }

dojo.io.checkChildrenForFile = function(node){
	var hasFile = false;
	var inputs = node.getElementsByTagName("input");
	dojo.lang.forEach(inputs, function(input){
		if(hasFile){ return; }
		if(input.getAttribute("type")=="file"){
			hasFile = true;
		}
	});
	return hasFile;
}

dojo.io.formHasFile = function(formNode){
	return dojo.io.checkChildrenForFile(formNode);
}

// TODO: Move to htmlUtils
dojo.io.encodeForm = function(formNode, encoding){
	if((!formNode)||(!formNode.tagName)||(!formNode.tagName.toLowerCase() == "form")){
		dojo.raise("Attempted to encode a non-form element.");
	}
	var enc = /utf/i.test(encoding||"") ? encodeURIComponent : dojo.string.encodeAscii;
	var values = [];

	for(var i = 0; i < formNode.elements.length; i++) {
		var elm = formNode.elements[i];
		if(elm.disabled || elm.tagName.toLowerCase() == "fieldset" || !elm.name){
			continue;
		}
		var name = enc(elm.name);
		var type = elm.type.toLowerCase();

		if(type == "select-multiple"){
			for(var j = 0; j < elm.options.length; j++) {
				if(elm.options[j].selected) {
					values.push(name + "=" + enc(elm.options[j].value));
				}
			}
		}else if(dojo.lang.inArray(type, ["radio", "checkbox"])){
			if(elm.checked){
				values.push(name + "=" + enc(elm.value));
			}
		}else if(!dojo.lang.inArray(type, ["file", "submit", "reset", "button"])) {
			values.push(name + "=" + enc(elm.value));
		}
	}

	// now collect input type="image", which doesn't show up in the elements array
	var inputs = formNode.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if(input.type.toLowerCase() == "image" && input.form == formNode) {
			var name = enc(input.name);
			values.push(name + "=" + enc(input.value));
			values.push(name + ".x=0");
			values.push(name + ".y=0");
		}
	}
	return values.join("&") + "&";
}

dojo.io.setIFrameSrc = function(iframe, src, replace){
	try{
		var r = dojo.render.html;
		// dojo.debug(iframe);
		if(!replace){
			if(r.safari){
				iframe.location = src;
			}else{
				frames[iframe.name].location = src;
			}
		}else{
			var idoc;
			// dojo.debug(iframe.name);
			if(r.ie){
				idoc = iframe.contentWindow.document;
			}else if(r.moz){
				idoc = iframe.contentWindow;
			}
			idoc.location.replace(src);
		}
	}catch(e){ 
		dojo.debug(e); 
		dojo.debug("setIFrameSrc: "+e); 
	}
}

dojo.io.XMLHTTPTransport = new function(){
	var _this = this;

	this.initialHref = window.location.href;
	this.initialHash = window.location.hash;

	this.moveForward = false;

	var _cache = {}; // FIXME: make this public? do we even need to?
	this.useCache = false; // if this is true, we'll cache unless kwArgs.useCache = false
	this.historyStack = [];
	this.forwardStack = [];
	this.historyIframe = null;
	this.bookmarkAnchor = null;
	this.locationTimer = null;

	/* NOTES:
	 *	Safari 1.2: 
	 *		back button "works" fine, however it's not possible to actually
	 *		DETECT that you've moved backwards by inspecting window.location.
	 *		Unless there is some other means of locating.
	 *		FIXME: perhaps we can poll on history.length?
	 *	IE 5.5 SP2:
	 *		back button behavior is macro. It does not move back to the
	 *		previous hash value, but to the last full page load. This suggests
	 *		that the iframe is the correct way to capture the back button in
	 *		these cases.
	 *	IE 6.0:
	 *		same behavior as IE 5.5 SP2
	 * Firefox 1.0:
	 *		the back button will return us to the previous hash on the same
	 *		page, thereby not requiring an iframe hack, although we do then
	 *		need to run a timer to detect inter-page movement.
	 */

	// FIXME: Should this even be a function? or do we just hard code it in the next 2 functions?
	function getCacheKey(url, query, method) {
		return url + "|" + query + "|" + method.toLowerCase();
	}

	function addToCache(url, query, method, http) {
		_cache[getCacheKey(url, query, method)] = http;
	}

	function getFromCache(url, query, method) {
		return _cache[getCacheKey(url, query, method)];
	}

	this.clearCache = function() {
		_cache = {};
	}

	// moved successful load stuff here
	function doLoad(kwArgs, http, url, query, useCache) {
		if((http.status==200)||(location.protocol=="file:" && http.status==0)) {
			var ret;
			if(kwArgs.method.toLowerCase() == "head"){
				var headers = http.getAllResponseHeaders();
				ret = {};
				ret.toString = function(){ return headers; }
				var values = headers.split(/[\r\n]+/g);
				for(var i = 0; i < values.length; i++) {
					var pair = values[i].match(/^([^:]+)\s*:\s*(.+)$/i);
					if(pair) {
						ret[pair[1]] = pair[2];
					}
				}
			}else if(kwArgs.mimetype == "text/javascript"){
				try{
					ret = dj_eval(http.responseText);
				}catch(e){
					dojo.debug(e);
					ret = null;
				}
			}else if(kwArgs.mimetype == "text/json"){
				try{
					ret = dj_eval("("+http.responseText+")");
				}catch(e){
					dojo.debug(e);
					ret = false;
				}
			}else if((kwArgs.mimetype == "application/xml")||
						(kwArgs.mimetype == "text/xml")){
				ret = http.responseXML;
				if(!ret || typeof ret == "string") {
					ret = dojo.dom.createDocumentFromText(http.responseText);
				}
			}else{
				ret = http.responseText;
			}

			if(useCache){ // only cache successful responses
				addToCache(url, query, kwArgs.method, http);
			}
			if(typeof kwArgs.load == "function"){
				kwArgs.load("load", ret, http);
			}
		}else{
			var errObj = new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
			if(typeof kwArgs.error == "function"){
				kwArgs.error("error", errObj, http);
			}
		}
	}

	// set headers (note: Content-Type will get overriden if kwArgs.contentType is set)
	function setHeaders(http, kwArgs){
		if(kwArgs["headers"]) {
			for(var header in kwArgs["headers"]) {
				if(header.toLowerCase() == "content-type" && !kwArgs["contentType"]) {
					kwArgs["contentType"] = kwArgs["headers"][header];
				} else {
					http.setRequestHeader(header, kwArgs["headers"][header]);
				}
			}
		}
	}

	this.addToHistory = function(args){
		var callback = args["back"]||args["backButton"]||args["handle"];
		var hash = null;
		if(!this.historyIframe){
			this.historyIframe = window.frames["djhistory"];
		}
		if(!this.bookmarkAnchor){
			this.bookmarkAnchor = document.createElement("a");
			(document.body||document.getElementsByTagName("body")[0]).appendChild(this.bookmarkAnchor);
			this.bookmarkAnchor.style.display = "none";
		}
		if((!args["changeUrl"])||(dojo.render.html.ie)){
			var url = dojo.hostenv.getBaseScriptUri()+"iframe_history.html?"+(new Date()).getTime();
			this.moveForward = true;
			dojo.io.setIFrameSrc(this.historyIframe, url, false);
		}
		if(args["changeUrl"]){
			hash = "#"+ ((args["changeUrl"]!==true) ? args["changeUrl"] : (new Date()).getTime());
			setTimeout("window.location.href = '"+hash+"';", 1);
			this.bookmarkAnchor.href = hash;
			if(dojo.render.html.ie){
				// IE requires manual setting of the hash since we are catching
				// events from the iframe
				var oldCB = callback;
				var lh = null;
				var hsl = this.historyStack.length-1;
				if(hsl>=0){
					while(!this.historyStack[hsl]["urlHash"]){
						hsl--;
					}
					lh = this.historyStack[hsl]["urlHash"];
				}
				if(lh){
					callback = function(){
						if(window.location.hash != ""){
							setTimeout("window.location.href = '"+lh+"';", 1);
						}
						oldCB();
					}
				}
				// when we issue a new bind(), we clobber the forward 
				// FIXME: is this always a good idea?
				this.forwardStack = []; 
				var oldFW = args["forward"]||args["forwardButton"];;
				var tfw = function(){
					if(window.location.hash != ""){
						window.location.href = hash;
					}
					if(oldFW){ // we might not actually have one
						oldFW();
					}
				}
				if(args["forward"]){
					args.forward = tfw;
				}else if(args["forwardButton"]){
					args.forwardButton = tfw;
				}
			}else if(dojo.render.html.moz){
				// start the timer
				if(!this.locationTimer){
					this.locationTimer = setInterval("dojo.io.XMLHTTPTransport.checkLocation();", 200);
				}
			}
		}

		this.historyStack.push({"url": url, "callback": callback, "kwArgs": args, "urlHash": hash});
	}

	this.checkLocation = function(){
		var hsl = this.historyStack.length;

		if((window.location.hash == this.initialHash)||(window.location.href == this.initialHref)&&(hsl == 1)){
			// FIXME: could this ever be a forward button?
			// we can't clear it because we still need to check for forwards. Ugg.
			// clearInterval(this.locationTimer);
			this.handleBackButton();
			return;
		}
		// first check to see if we could have gone forward. We always halt on
		// a no-hash item.
		if(this.forwardStack.length > 0){
			if(this.forwardStack[this.forwardStack.length-1].urlHash == window.location.hash){
				this.handleForwardButton();
				return;
			}
		}
		// ok, that didn't work, try someplace back in the history stack
		if((hsl >= 2)&&(this.historyStack[hsl-2])){
			if(this.historyStack[hsl-2].urlHash==window.location.hash){
				this.handleBackButton();
				return;
			}
		}
	}

	this.iframeLoaded = function(evt, ifrLoc){
		var isp = ifrLoc.href.split("?");
		if(isp.length < 2){ 
			// alert("iframeLoaded");
			// we hit the end of the history, so we should go back
			if(this.historyStack.length == 1){
				this.handleBackButton();
			}
			return;
		}
		var query = isp[1];
		if(this.moveForward){
			// we were expecting it, so it's not either a forward or backward
			// movement
			this.moveForward = false;
			return;
		}

		var last = this.historyStack.pop();
		// we don't have anything in history, so it could be a forward button
		if(!last){ 
			if(this.forwardStack.length > 0){
				var next = this.forwardStack[this.forwardStack.length-1];
				if(query == next.url.split("?")[1]){
					this.handleForwardButton();
				}
			}
			// regardless, we didnt' have any history, so it can't be a back button
			return;
		}
		// put it back on the stack so we can do something useful with it when
		// we call handleBackButton()
		this.historyStack.push(last);
		if(this.historyStack.length >= 2){
			if(isp[1] == this.historyStack[this.historyStack.length-2].url.split("?")[1]){
				// looks like it IS a back button press, so handle it
				this.handleBackButton();
			}
		}else{
			this.handleBackButton();
		}
	}

	this.handleBackButton = function(){
		var last = this.historyStack.pop();
		if(!last){ return; }
		if(last["callback"]){
			last.callback();
		}else if(last.kwArgs["backButton"]){
			last.kwArgs["backButton"]();
		}else if(last.kwArgs["back"]){
			last.kwArgs["back"]();
		}else if(last.kwArgs["handle"]){
			last.kwArgs.handle("back");
		}
		this.forwardStack.push(last);
	}

	this.handleForwardButton = function(){
		// FIXME: should we build in support for re-issuing the bind() call here?
		// alert("alert we found a forward button call");
		var last = this.forwardStack.pop();
		if(!last){ return; }
		if(last.kwArgs["forward"]){
			last.kwArgs.forward();
		}else if(last.kwArgs["forwardButton"]){
			last.kwArgs.forwardButton();
		}else if(last.kwArgs["handle"]){
			last.kwArgs.handle("forward");
		}
		this.historyStack.push(last);
	}

	this.inFlight = [];
	this.inFlightTimer = null;

	this.startWatchingInFlight = function(){
		if(!this.inFlightTimer){
			this.inFlightTimer = setInterval("dojo.io.XMLHTTPTransport.watchInFlight();", 10);
		}
	}

	this.watchInFlight = function(){
		for(var x=this.inFlight.length-1; x>=0; x--){
			var tif = this.inFlight[x];
			if(!tif){ this.inFlight.splice(x, 1); continue; }
			if(4==tif.http.readyState){
				// remove it so we can clean refs
				this.inFlight.splice(x, 1);
				doLoad(tif.req, tif.http, tif.url, tif.query, tif.useCache);
				if(this.inFlight.length == 0){
					clearInterval(this.inFlightTimer);
					this.inFlightTimer = null;
				}
			} // FIXME: need to implement a timeout param here!
		}
	}

	var hasXmlHttp = dojo.hostenv.getXmlhttpObject() ? true : false;
	this.canHandle = function(kwArgs){
		// canHandle just tells dojo.io.bind() if this is a good transport to
		// use for the particular type of request.

		// FIXME: we need to determine when form values need to be
		// multi-part mime encoded and avoid using this transport for those
		// requests.
		return hasXmlHttp
			&& dojo.lang.inArray((kwArgs["mimetype"]||"".toLowerCase()), ["text/plain", "text/html", "application/xml", "text/xml", "text/javascript", "text/json"])
			&& dojo.lang.inArray(kwArgs["method"].toLowerCase(), ["post", "get", "head"])
			&& !( kwArgs["formNode"] && dojo.io.formHasFile(kwArgs["formNode"]) );
	}

	this.bind = function(kwArgs){
		if(!kwArgs["url"]){
			// are we performing a history action?
			if( !kwArgs["formNode"]
				&& (kwArgs["backButton"] || kwArgs["back"] || kwArgs["changeUrl"] || kwArgs["watchForURL"])
				&& (!djConfig.preventBackButtonFix)) {
				this.addToHistory(kwArgs);
				return true;
			}
		}

		// build this first for cache purposes
		var url = kwArgs.url;
		var query = "";
		if(kwArgs["formNode"]){
			var ta = kwArgs.formNode.getAttribute("action");
			if((ta)&&(!kwArgs["url"])){ url = ta; }
			var tp = kwArgs.formNode.getAttribute("method");
			if((tp)&&(!kwArgs["method"])){ kwArgs.method = tp; }
			query += dojo.io.encodeForm(kwArgs.formNode, kwArgs.encoding);
		}

		if(!kwArgs["method"]) {
			kwArgs.method = "get";
		}

		if(kwArgs["content"]){
			query += dojo.io.argsFromMap(kwArgs.content, kwArgs.encoding);
		}

		if(kwArgs["postContent"] && kwArgs.method.toLowerCase() == "post") {
			query = kwArgs.postContent;
		}

		if(kwArgs["backButton"] || kwArgs["back"] || kwArgs["changeUrl"]){
			this.addToHistory(kwArgs);
		}

		// kwArgs.Connection = "close";

		var async = kwArgs["sync"] ? false : true;

		var useCache = kwArgs["useCache"] == true ||
			(this.useCache == true && kwArgs["useCache"] != false );

		if(useCache){
			var cachedHttp = getFromCache(url, query, kwArgs.method);
			if(cachedHttp){
				doLoad(kwArgs, cachedHttp, url, query, false);
				return;
			}
		}

		// much of this is from getText, but reproduced here because we need
		// more flexibility
		var http = dojo.hostenv.getXmlhttpObject();
		var received = false;

		// build a handler function that calls back to the handler obj
		if(async){
			// FIXME: setting up this callback handler leaks on IE!!!
			this.inFlight.push({
				"req":		kwArgs,
				"http":		http,
				"url":		url,
				"query":	query,
				"useCache":	useCache
			});
			this.startWatchingInFlight();
		}

		if(kwArgs.method.toLowerCase() == "post"){
			// FIXME: need to hack in more flexible Content-Type setting here!
			http.open("POST", url, async);
			setHeaders(http, kwArgs);
			http.setRequestHeader("Content-Type", kwArgs["contentType"] || "application/x-www-form-urlencoded");
			http.send(query);
		}else{
			var tmpUrl = url;
			if(query != "") {
				tmpUrl += (url.indexOf("?") > -1 ? "&" : "?") + query;
			}
			http.open(kwArgs.method.toUpperCase(), tmpUrl, async);
			setHeaders(http, kwArgs);
			http.send(null);
		}

		if( !async ) {
			doLoad(kwArgs, http, url, query, useCache);
		}

		kwArgs.abort = function(){
			return http.abort();
		}

		return;
	}
	dojo.io.transports.addTransport("XMLHTTPTransport");
}

dojo.require("dojo.lang");
dojo.provide("dojo.event");

dojo.event = new function(){

	this.canTimeout = dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);

	this.nameAnonFunc = dojo.lang.nameAnonFunc;

	this.createFunctionPair = function(obj, cb) {
		var ret = [];
		if(typeof obj == "function"){
			ret[1] = dojo.event.nameAnonFunc(obj, dj_global);
			ret[0] = dj_global;
			return ret;
		}else if((typeof obj == "object")&&(typeof cb == "string")){
			return [obj, cb];
		}else if((typeof obj == "object")&&(typeof cb == "function")){
			ret[1] = dojo.event.nameAnonFunc(cb, obj);
			ret[0] = obj;
			return ret;
		}
		return null;
	}

	// FIXME: where should we put this method (not here!)?
	this.matchSignature = function(args, signatureArr){

		var end = Math.min(args.length, signatureArr.length);

		for(var x=0; x<end; x++){
			// FIXME: this is naive comparison, can we do better?
			if(compareTypes){
				if((typeof args[x]).toLowerCase() != (typeof signatureArr[x])){
					return false;
				}
			}else{
				if((typeof args[x]).toLowerCase() != signatureArr[x].toLowerCase()){
					return false;
				}
			}
		}

		return true;
	}

	// FIXME: where should we put this method (not here!)?
	this.matchSignatureSets = function(args){
		for(var x=1; x<arguments.length; x++){
			if(this.matchSignature(args, arguments[x])){
				return true;
			}
		}
		return false;
	}

	function interpolateArgs(args){
		var ao = {
			srcObj: dj_global,
			srcFunc: null,
			adviceObj: dj_global,
			adviceFunc: null,
			aroundObj: null,
			aroundFunc: null,
			adviceType: (args.length>2) ? args[0] : "after",
			precedence: "last",
			once: false,
			delay: null,
			rate: 0,
			adviceMsg: false
		};

		switch(args.length){
			case 0: return;
			case 1: return;
			case 2:
				ao.srcFunc = args[0];
				ao.adviceFunc = args[1];
				break;
			case 3:
				if((typeof args[0] == "object")&&(typeof args[1] == "string")&&(typeof args[2] == "string")){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((typeof args[1] == "string")&&(typeof args[2] == "string")){
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((typeof args[0] == "object")&&(typeof args[1] == "string")&&(typeof args[2] == "function")){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					var tmpName  = dojo.event.nameAnonFunc(args[2], ao.adviceObj);
					ao.adviceObj[tmpName] = args[2];
					ao.adviceFunc = tmpName;
				}else if((typeof args[0] == "function")&&(typeof args[1] == "object")&&(typeof args[2] == "string")){
					ao.adviceType = "after";
					ao.srcObj = dj_global;
					var tmpName  = dojo.event.nameAnonFunc(args[0], ao.srcObj);
					ao.srcObj[tmpName] = args[0];
					ao.srcFunc = tmpName;
					ao.adviceObj = args[1];
					ao.adviceFunc = args[2];
				}
				break;
			case 4:
				if((typeof args[0] == "object")&&(typeof args[2] == "object")){
					// we can assume that we've got an old-style "connect" from
					// the sigslot school of event attachment. We therefore
					// assume after-advice.
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((typeof args[1]).toLowerCase() == "object"){
					ao.srcObj = args[1];
					ao.srcFunc = args[2];
					ao.adviceObj = dj_global;
					ao.adviceFunc = args[3];
				}else if((typeof args[2]).toLowerCase() == "object"){
					ao.srcObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else{
					ao.srcObj = ao.adviceObj = ao.aroundObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
					ao.aroundFunc = args[3];
				}
				break;
			case 6:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundFunc = args[5];
				ao.aroundObj = dj_global;
				break;
			default:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundObj = args[5];
				ao.aroundFunc = args[6];
				ao.once = args[7];
				ao.delay = args[8];
				ao.rate = args[9];
				ao.adviceMsg = args[10];
				break;
		}

		if((typeof ao.srcFunc).toLowerCase() != "string"){
			ao.srcFunc = dojo.lang.getNameInObj(ao.srcObj, ao.srcFunc);
		}

		if((typeof ao.adviceFunc).toLowerCase() != "string"){
			ao.adviceFunc = dojo.lang.getNameInObj(ao.adviceObj, ao.adviceFunc);
		}

		if((ao.aroundObj)&&((typeof ao.aroundFunc).toLowerCase() != "string")){
			ao.aroundFunc = dojo.lang.getNameInObj(ao.aroundObj, ao.aroundFunc);
		}

		if(!ao.srcObj){
			dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
		}
		if(!ao.adviceObj){
			dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
		}
		return ao;
	}

	this.connect = function(){
		var ao = interpolateArgs(arguments);

		// FIXME: just doing a "getForMethod()" seems to be enough to put this into infinite recursion!!
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc);
		if(ao.adviceFunc){
			var mjp2 = dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj, ao.adviceFunc);
		}

		mjp.kwAddAdvice(ao);

		return mjp;	// advanced users might want to fsck w/ the join point
					// manually
	}

	this.connectBefore = function() {
		var args = ["before"];
		for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
		return this.connect.apply(this, args);
	}

	this.connectAround = function() {
		var args = ["around"];
		for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
		return this.connect.apply(this, args);
	}

	this.kwConnectImpl_ = function(kwArgs, disconnect){
		var fn = (disconnect) ? "disconnect" : "connect";
		if(typeof kwArgs["srcFunc"] == "function"){
			kwArgs.srcObj = kwArgs["srcObj"]||dj_global;
			var tmpName  = dojo.event.nameAnonFunc(kwArgs.srcFunc, kwArgs.srcObj);
			kwArgs.srcFunc = tmpName;
		}
		if(typeof kwArgs["adviceFunc"] == "function"){
			kwArgs.adviceObj = kwArgs["adviceObj"]||dj_global;
			var tmpName  = dojo.event.nameAnonFunc(kwArgs.adviceFunc, kwArgs.adviceObj);
			kwArgs.adviceFunc = tmpName;
		}
		return dojo.event[fn](	(kwArgs["type"]||kwArgs["adviceType"]||"after"),
									kwArgs["srcObj"]||dj_global,
									kwArgs["srcFunc"],
									kwArgs["adviceObj"]||kwArgs["targetObj"]||dj_global,
									kwArgs["adviceFunc"]||kwArgs["targetFunc"],
									kwArgs["aroundObj"],
									kwArgs["aroundFunc"],
									kwArgs["once"],
									kwArgs["delay"],
									kwArgs["rate"],
									kwArgs["adviceMsg"]||false );
	}

	this.kwConnect = function(kwArgs){
		return this.kwConnectImpl_(kwArgs, false);

	}

	this.disconnect = function(){
		var ao = interpolateArgs(arguments);
		if(!ao.adviceFunc){ return; } // nothing to disconnect
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc);
		return mjp.removeAdvice(ao.adviceObj, ao.adviceFunc, ao.adviceType, ao.once);
	}

	this.kwDisconnect = function(kwArgs){
		return this.kwConnectImpl_(kwArgs, true);
	}
}

// exactly one of these is created whenever a method with a joint point is run,
// if there is at least one 'around' advice.
dojo.event.MethodInvocation = function(join_point, obj, args) {
	this.jp_ = join_point;
	this.object = obj;
	this.args = [];
	for(var x=0; x<args.length; x++){
		this.args[x] = args[x];
	}
	// the index of the 'around' that is currently being executed.
	this.around_index = -1;
}

dojo.event.MethodInvocation.prototype.proceed = function() {
	// dojo.hostenv.println("in MethodInvocation.proceed()");
	this.around_index++;
	if(this.around_index >= this.jp_.around.length){
		return this.jp_.object[this.jp_.methodname].apply(this.jp_.object, this.args);
		// return this.jp_.run_before_after(this.object, this.args);
	}else{
		var ti = this.jp_.around[this.around_index];
		var mobj = ti[0]||dj_global;
		var meth = ti[1];
		return mobj[meth].call(mobj, this);
	}
} 


dojo.event.MethodJoinPoint = function(obj, methname){
	this.object = obj||dj_global;
	this.methodname = methname;
	this.methodfunc = this.object[methname];
	this.before = [];
	this.after = [];
	this.around = [];
}

dojo.event.MethodJoinPoint.getForMethod = function(obj, methname) {
	// if(!(methname in obj)){
	if(!obj){ obj = dj_global; }
	if(!obj[methname]){
		// supply a do-nothing method implementation
		obj[methname] = function(){};
	}else if((!dojo.lang.isFunction(obj[methname]))&&(!dojo.lang.isAlien(obj[methname]))){
		return null; // FIXME: should we throw an exception here instead?
	}
	// we hide our joinpoint instance in obj[methname + '$joinpoint']
	var jpname = methname + "$joinpoint";
	var jpfuncname = methname + "$joinpoint$method";
	var joinpoint = obj[jpname];
	if(!joinpoint){
		var isNode = false;
		if(dojo.event["browser"]){
			if( (obj["attachEvent"])||
				(obj["nodeType"])||
				(obj["addEventListener"]) ){
				isNode = true;
				dojo.event.browser.addClobberNodeAttrs(obj, [jpname, jpfuncname, methname]);
			}
		}
		obj[jpfuncname] = obj[methname];
		// joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, methname);
		joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, jpfuncname);
		obj[methname] = function(){ 
			var args = [];

			if((isNode)&&(!arguments.length)&&(window.event)){
				args.push(dojo.event.browser.fixEvent(window.event));
			}else{
				for(var x=0; x<arguments.length; x++){
					if((x==0)&&(isNode)&&(dojo.event.browser.isEvent(arguments[x]))){
						args.push(dojo.event.browser.fixEvent(arguments[x]));
					}else{
						args.push(arguments[x]);
					}
				}
			}
			// return joinpoint.run.apply(joinpoint, arguments); 
			return joinpoint.run.apply(joinpoint, args); 
		}
	}
	// dojo.hostenv.println("returning joinpoint");
	return joinpoint;
}

dojo.event.MethodJoinPoint.prototype.unintercept = function() {
	this.object[this.methodname] = this.methodfunc;
}

dojo.event.MethodJoinPoint.prototype.run = function() {
	// FIXME: need to add support here for rates!

	// dojo.hostenv.println("in run()");
	var obj = this.object||dj_global;
	var args = arguments;

	// optimization. We only compute once the array version of the arguments
	// pseudo-arr in order to prevent building it each time advice is unrolled.
	var aargs = [];
	// NOTE: alex: I think this is safe since we apply() these args anyway, so
	// primitive types will be copied at the call boundary anyway, and
	// references to objects would be mutable anyway.
	for(var x=0; x<args.length; x++){
		aargs[x] = args[x];
	}
	/*
	try{
		if((dojo.render.html.ie)&&(aargs.length == 1)&&(aargs[0])&&(!dojo.lang.isUndefined(aargs[0]["clientX"]))){
			aargs[0] = document.createEventObject(aargs[0]);
		}
	}catch(e){ }
	*/

	var unrollAdvice  = function(marr){ 
		if(!marr){
			dojo.debug("Null argument to unrollAdvice()");
			return;
		}
	  
		// dojo.hostenv.println("in unrollAdvice()");
		var callObj = marr[0]||dj_global;
		var callFunc = marr[1];
		
		if(!callObj[callFunc]){
			throw new Error ("function \"" + callFunc + "\" does not exist on \"" + callObj + "\"");
		}
		
		var aroundObj = marr[2]||dj_global;
		var aroundFunc = marr[3];
		var msg = marr[6];
		var undef;

		var to = {
			args: [],
			jp_: this,
			object: obj,
			proceed: function(){
				return callObj[callFunc].apply(callObj, to.args);
			}
		};
		to.args = aargs;

		var delay = parseInt(marr[4]);
		var hasDelay = ((!isNaN(delay))&&(marr[4]!==null)&&(typeof marr[4] != "undefined"));
		if(marr[5]){
			var rate = parseInt(marr[5]);
			var cur = new Date();
			var timerSet = false;
			if((marr["last"])&&((cur-marr.last)<=rate)){
				// this should only happen if we don't otherwise deliver the event
				if(dojo.event.canTimeout){
					// FIXME: how much overhead does this all add?
					if(marr["delayTimer"]){
						// dojo.debug("clearing:", marr.delayTimer);
						clearTimeout(marr.delayTimer);
					}
					// dojo.debug("setting delay");
					var tod = parseInt(rate*2); // is rate*2 naive?
					var mcpy = dojo.lang.shallowCopy(marr);
					marr.delayTimer = setTimeout(function(){
						// FIXME: on IE at least, event objects from the
						// browser can go out of scope. How (or should?) we
						// deal with it?
						mcpy[5] = 0;
						unrollAdvice(mcpy);
					}, tod);
					// dojo.debug("setting:", marr.delayTimer);
				}
				return;
			}else{
				marr.last = cur;
			}
		}

		// FIXME: need to enforce rates for a connection here!

		/*
		// FIXME: how slow is this? Is there a better/faster way to get this
		// done?
		// FIXME: is it necessaray to make this copy every time that
		// unrollAdvice gets called? Would it be better/possible to handle it
		// in run() where we make args in the first place?
		for(var x=0; x<args.length; x++){
			to.args[x] = args[x];
		}
		*/

		if(aroundFunc){
			// NOTE: around advice can't delay since we might otherwise depend
			// on execution order!
			aroundObj[aroundFunc].call(aroundObj, to);
		}else{
			// var tmjp = dojo.event.MethodJoinPoint.getForMethod(obj, methname);
			if((hasDelay)&&((dojo.render.html)||(dojo.render.svg))){  // FIXME: the render checks are grotty!
				dj_global["setTimeout"](function(){
					if(msg){
						callObj[callFunc].call(callObj, to); 
					}else{
						callObj[callFunc].apply(callObj, args); 
					}
				}, delay);
			}else{ // many environments can't support delay!
				if(msg){
					callObj[callFunc].call(callObj, to); 
				}else{
					callObj[callFunc].apply(callObj, args); 
				}
			}
		}
	}

	if(this.before.length>0){
		dojo.lang.forEach(this.before, unrollAdvice, true);
	}

	var result;
	if(this.around.length>0){
		var mi = new dojo.event.MethodInvocation(this, obj, args);
		result = mi.proceed();
	}else if(this.methodfunc){
		// dojo.hostenv.println("calling: "+this.methodname)
		result = this.object[this.methodname].apply(this.object, args);
	}

	if(this.after.length>0){
		dojo.lang.forEach(this.after, unrollAdvice, true);
	}

	return (this.methodfunc) ? result : null;
}

dojo.event.MethodJoinPoint.prototype.getArr = function(kind){
	var arr = this.after;
	// FIXME: we should be able to do this through props or Array.in()
	if((typeof kind == "string")&&(kind.indexOf("before")!=-1)){
		arr = this.before;
	}else if(kind=="around"){
		arr = this.around;
	}
	return arr;
}

dojo.event.MethodJoinPoint.prototype.kwAddAdvice = function(args){
	this.addAdvice(	args["adviceObj"], args["adviceFunc"], 
					args["aroundObj"], args["aroundFunc"], 
					args["adviceType"], args["precedence"], 
					args["once"], args["delay"], args["rate"], 
					args["adviceMsg"]);
}

dojo.event.MethodJoinPoint.prototype.addAdvice = function(	thisAdviceObj, thisAdvice, 
															thisAroundObj, thisAround, 
															advice_kind, precedence, 
															once, delay, rate, asMessage){
	var arr = this.getArr(advice_kind);
	if(!arr){
		dojo.raise("bad this: " + this);
	}

	var ao = [thisAdviceObj, thisAdvice, thisAroundObj, thisAround, delay, rate, asMessage];
	
	if(once){
		if(this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr) >= 0){
			return;
		}
	}

	if(precedence == "first"){
		arr.unshift(ao);
	}else{
		arr.push(ao);
	}
}

dojo.event.MethodJoinPoint.prototype.hasAdvice = function(thisAdviceObj, thisAdvice, advice_kind, arr){
	if(!arr){ arr = this.getArr(advice_kind); }
	var ind = -1;
	for(var x=0; x<arr.length; x++){
		if((arr[x][0] == thisAdviceObj)&&(arr[x][1] == thisAdvice)){
			ind = x;
		}
	}
	return ind;
}

dojo.event.MethodJoinPoint.prototype.removeAdvice = function(thisAdviceObj, thisAdvice, advice_kind, once){
	var arr = this.getArr(advice_kind);
	var ind = this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr);
	if(ind == -1){
		return false;
	}
	while(ind != -1){
		arr.splice(ind, 1);
		if(once){ break; }
		ind = this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr);
	}
	return true;
}

dojo.require("dojo.event");
dojo.provide("dojo.event.topic");

dojo.event.topic = new function(){
	this.topics = {};

	this.getTopic = function(topicName){
		if(!this.topics[topicName]){
			this.topics[topicName] = new this.TopicImpl(topicName);
		}
		return this.topics[topicName];
	}

	this.registerPublisher = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.registerPublisher(obj, funcName);
	}

	this.subscribe = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.subscribe(obj, funcName);
	}

	this.unsubscribe = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.unsubscribe(obj, funcName);
	}

	this.publish = function(topic, message){
		var topic = this.getTopic(topic);
		// if message is an array, we treat it as a set of arguments,
		// otherwise, we just pass on the arguments passed in as-is
		var args = [];
		if((arguments.length == 2)&&(message.length)&&(typeof message != "string")){
			args = message;
		}else{
			var args = [];
			for(var x=1; x<arguments.length; x++){
				args.push(arguments[x]);
			}
		}
		topic.sendMessage.apply(topic, args);
	}
}

dojo.event.topic.TopicImpl = function(topicName){
	this.topicName = topicName;
	var self = this;

	self.subscribe = function(listenerObject, listenerMethod){
		dojo.event.connect("before", self, "sendMessage", listenerObject, listenerMethod);
	}

	self.unsubscribe = function(listenerObject, listenerMethod){
		dojo.event.disconnect("before", self, "sendMessage", listenerObject, listenerMethod);
	}

	self.registerPublisher = function(publisherObject, publisherMethod){
		dojo.event.connect(publisherObject, publisherMethod, self, "sendMessage");
	}

	self.sendMessage = function(message){
		// The message has been propagated
	}
}


dojo.provide("dojo.event.browser");
dojo.require("dojo.event");

dojo_ie_clobber = new function(){
	this.clobberArr = ['data', 
		'onload', 'onmousedown', 'onmouseup', 
		'onmouseover', 'onmouseout', 'onmousemove', 
		'onclick', 'ondblclick', 'onfocus', 
		'onblur', 'onkeypress', 'onkeydown', 
		'onkeyup', 'onsubmit', 'onreset',
		'onselect', 'onchange', 'onselectstart', 
		'ondragstart', 'oncontextmenu'];

	this.exclusions = [];
	
	this.clobberList = {};
	this.clobberNodes = [];

	this.addClobberAttr = function(type){
		if(dojo.render.html.ie){
			if(this.clobberList[type]!="set"){
				this.clobberArr.push(type);
				this.clobberList[type] = "set"; 
			}
		}
	}

	this.addExclusionID = function(id){
		this.exclusions.push(id);
	}

	if(dojo.render.html.ie){
		for(var x=0; x<this.clobberArr.length; x++){
			this.clobberList[this.clobberArr[x]] = "set";
		}
	}

	function nukeProp(node, prop){
		// try{ node.removeAttribute(prop); 	}catch(e){ /* squelch */ }
		try{ node[prop] = null; 			}catch(e){ /* squelch */ }
		try{ delete node[prop]; 			}catch(e){ /* squelch */ }
		// FIXME: JotLive needs this, but I'm not sure if it's too slow or not
		try{ node.removeAttribute(prop);	}catch(e){ /* squelch */ }
	}

	this.clobber = function(nodeRef){
		for(var x=0; x< this.exclusions.length; x++){
			try{
				var tn = document.getElementById(this.exclusions[x]);
				tn.parentNode.removeChild(tn);
			}catch(e){
				// this is fired on unload, so squelch
			}
		}

		var na;
		var tna;
		if(nodeRef){
			tna = nodeRef.getElementsByTagName("*");
			na = [nodeRef];
			for(var x=0; x<tna.length; x++){
				if(!djConfig.ieClobberMinimal){
					na.push(tna[x]);
				}else{
					// if we're gonna be clobbering the thing, at least make sure
					// we aren't trying to do it twice
					if(tna[x]["__doClobber__"]){
						na.push(tna[x]);
					}
				}
			}
		}else{
			try{ window.onload = null; }catch(e){}
			na = (this.clobberNodes.length) ? this.clobberNodes : document.all;
		}
		tna = null;
		var basis = {};
		for(var i = na.length-1; i>=0; i=i-1){
			var el = na[i];
			if(djConfig.ieClobberMinimal){
				if(el["__clobberAttrs__"]){
					for(var j=0; j<el.__clobberAttrs__.length; j++){
						nukeProp(el, el.__clobberAttrs__[j]);
					}
					nukeProp(el, "__clobberAttrs__");
					nukeProp(el, "__doClobber__");
				}
			}else{
				for(var p = this.clobberArr.length-1; p>=0; p=p-1){
					var ta = this.clobberArr[p];
					nukeProp(el, ta);
				}
			}
		}
		na = null;
	}
}

if((dojo.render.html.ie)&&((!dojo.hostenv.ie_prevent_clobber_)||(djConfig.ieClobberMinimal))){
	window.onunload = function(){
		dojo_ie_clobber.clobber();
		try{
			if((dojo["widget"])&&(dojo.widget["manager"])){
				dojo.widget.manager.destroyAll();
			}
		}catch(e){}
		try{ window.onload = null; }catch(e){}
		try{ window.onunload = null; }catch(e){}
		dojo_ie_clobber.clobberNodes = [];
		// CollectGarbage();
	}
}

dojo.event.browser = new function(){

	var clobberIdx = 0;

	this.clean = function(node){
		if(dojo.render.html.ie){ 
			dojo_ie_clobber.clobber(node);
		}
	}

	this.addClobberAttr = function(type){
		dojo_ie_clobber.addClobberAttr(type);
	}

	this.addClobberAttrs = function(){
		for(var x=0; x<arguments.length; x++){
			this.addClobberAttr(arguments[x]);
		}
	}

	this.addClobberNode = function(node){
		if(djConfig.ieClobberMinimal){
			if(!node["__doClobber__"]){
				node.__doClobber__ = true;
				dojo_ie_clobber.clobberNodes.push(node);
				// this might not be the most efficient thing to do, but it's
				// much less error prone than other approaches which were
				// previously tried and failed
				node.__clobberAttrs__ = [];
			}
		}
	}

	this.addClobberNodeAttrs = function(node, props){
		this.addClobberNode(node);
		if(djConfig.ieClobberMinimal){
			for(var x=0; x<props.length; x++){
				node.__clobberAttrs__.push(props[x]);
			}
		}else{
			this.addClobberAttrs.apply(this, props);
		}
	}

	/*
	this.eventAroundAdvice = function(methodInvocation){
		var evt = this.fixEvent(methodInvocation.args[0]);
		return methodInvocation.proceed();
	}
	*/

	this.removeListener = function(node, evtName, fp, capture){
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)=="on"){ evtName = evtName.substr(2); }
		// FIXME: this is mostly a punt, we aren't actually doing anything on IE
		if(node.removeEventListener){
			node.removeEventListener(evtName, fp, capture);
		}
	}

	this.addListener = function(node, evtName, fp, capture, dontFix){
		if(!node){ return; } // FIXME: log and/or bail?
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)!="on"){ evtName = "on"+evtName; }

		if(!dontFix){
			// build yet another closure around fp in order to inject fixEvent
			// around the resulting event
			var newfp = function(evt){
				if(!evt){ evt = window.event; }
				var ret = fp(dojo.event.browser.fixEvent(evt));
				if(capture){
					dojo.event.browser.stopEvent(evt);
				}
				return ret;
			}
		}else{
			newfp = fp;
		}

		if(node.addEventListener){ 
			node.addEventListener(evtName.substr(2), newfp, capture);
			return newfp;
		}else{
			if(typeof node[evtName] == "function" ){
				var oldEvt = node[evtName];
				node[evtName] = function(e){
					oldEvt(e);
					return newfp(e);
				}
			}else{
				node[evtName]=newfp;
			}
			if(dojo.render.html.ie){
				this.addClobberNodeAttrs(node, [evtName]);
			}
			return newfp;
		}
	}

	this.isEvent = function(obj){
		// FIXME: event detection hack ... could test for additional attributes if necessary
		return (typeof Event != "undefined")&&(obj.eventPhase);
		// Event does not support instanceof in Opera, otherwise:
		//return (typeof Event != "undefined")&&(obj instanceof Event);
	}

	this.currentEvent = null;
	
	this.callListener = function(listener, curTarget){
		if(typeof listener != 'function'){
			dojo.raise("listener not a function: " + listener);
		}
		dojo.event.browser.currentEvent.currentTarget = curTarget;
		return listener.call(curTarget, dojo.event.browser.currentEvent);
	}

	this.stopPropagation = function(){
		dojo.event.browser.currentEvent.cancelBubble = true;
	}

	this.preventDefault = function(){
	  dojo.event.browser.currentEvent.returnValue = false;
	}

	this.keys = {
		KEY_BACKSPACE: 8,
		KEY_TAB: 9,
		KEY_ENTER: 13,
		KEY_SHIFT: 16,
		KEY_CTRL: 17,
		KEY_ALT: 18,
		KEY_PAUSE: 19,
		KEY_CAPS_LOCK: 20,
		KEY_ESCAPE: 27,
		KEY_SPACE: 32,
		KEY_PAGE_UP: 33,
		KEY_PAGE_DOWN: 34,
		KEY_END: 35,
		KEY_HOME: 36,
		KEY_LEFT_ARROW: 37,
		KEY_UP_ARROW: 38,
		KEY_RIGHT_ARROW: 39,
		KEY_DOWN_ARROW: 40,
		KEY_INSERT: 45,
		KEY_DELETE: 46,
		KEY_LEFT_WINDOW: 91,
		KEY_RIGHT_WINDOW: 92,
		KEY_SELECT: 93,
		KEY_F1: 112,
		KEY_F2: 113,
		KEY_F3: 114,
		KEY_F4: 115,
		KEY_F5: 116,
		KEY_F6: 117,
		KEY_F7: 118,
		KEY_F8: 119,
		KEY_F9: 120,
		KEY_F10: 121,
		KEY_F11: 122,
		KEY_F12: 123,
		KEY_NUM_LOCK: 144,
		KEY_SCROLL_LOCK: 145
	};

	// reverse lookup
	this.revKeys = [];
	for(var key in this.keys){
		this.revKeys[this.keys[key]] = key;
	}

	this.fixEvent = function(evt){
		if((!evt)&&(window["event"])){
			var evt = window.event;
		}
		
		if((evt["type"])&&(evt["type"].indexOf("key") == 0)){ // key events
			evt.keys = this.revKeys;
			// FIXME: how can we eliminate this iteration?
			for(var key in this.keys) {
				evt[key] = this.keys[key];
			}
			if((dojo.render.html.ie)&&(evt["type"] == "keypress")){
				evt.charCode = evt.keyCode;
			}
		}
	
		if(dojo.render.html.ie){
			if(!evt.target){ evt.target = evt.srcElement; }
			if(!evt.currentTarget){ evt.currentTarget = evt.srcElement; }
			if(!evt.layerX){ evt.layerX = evt.offsetX; }
			if(!evt.layerY){ evt.layerY = evt.offsetY; }
			// mouseover
			if(evt.fromElement){ evt.relatedTarget = evt.fromElement; }
			// mouseout
			if(evt.toElement){ evt.relatedTarget = evt.toElement; }
			this.currentEvent = evt;
			evt.callListener = this.callListener;
			evt.stopPropagation = this.stopPropagation;
			evt.preventDefault = this.preventDefault;
		}
		return evt;
	}

	this.stopEvent = function(ev) {
		if(window.event){
			ev.returnValue = false;
			ev.cancelBubble = true;
		}else{
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.event", "dojo.event.topic"],
	browser: ["dojo.event.browser"]
});
dojo.hostenv.moduleLoaded("dojo.event.*");

dojo.provide("dojo.alg.Alg");
dojo.require("dojo.lang");
dj_deprecated("dojo.alg.Alg is deprecated, use dojo.lang instead");

dojo.alg.find = function(arr, val){ return dojo.lang.find(arr, val); }

dojo.alg.inArray = function(arr, val){
	return dojo.lang.inArray(arr, val);
}
dojo.alg.inArr = dojo.alg.inArray; // for backwards compatibility

dojo.alg.getNameInObj = function(ns, item){
	return dojo.lang.getNameInObj(ns, item);
}

// is this the right place for this?
dojo.alg.has = function(obj, name){
	return dojo.lang.has(obj, name);
}

dojo.alg.forEach = function(arr, unary_func, fix_length){
	return dojo.lang.forEach(arr, unary_func, fix_length);
}

dojo.alg.for_each = dojo.alg.forEach; // burst compat

dojo.alg.map = function(arr, obj, unary_func){
	return dojo.lang.map(arr, obj, unary_func);
}

dojo.alg.tryThese = function(){
	return dojo.lang.tryThese.apply(dojo.lang, arguments);
}

dojo.alg.delayThese = function(farr, cb, delay, onend){
	return dojo.lang.delayThese.apply(dojo.lang, arguments);
}

dojo.alg.for_each_call = dojo.alg.map; // burst compat

dojo.require("dojo.alg.Alg", false, true);
dojo.hostenv.moduleLoaded("dojo.alg.*");

dojo.provide("dojo.uri.Uri");

dojo.uri = new function() {
	this.joinPath = function() {
		// DEPRECATED: use the dojo.uri.Uri object instead
		var arr = [];
		for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); }
		return arr.join("/").replace(/\/{2,}/g, "/").replace(/((https*|ftps*):)/i, "$1/");
	}
	
	this.dojoUri = function (uri) {
		// returns a Uri object resolved relative to the dojo root
		return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(), uri);
	}
		
	this.Uri = function (/*uri1, uri2, [...]*/) {
		// An object representing a Uri.
		// Each argument is evaluated in order relative to the next until
		// a conanical uri is producued. To get an absolute Uri relative
		// to the current document use
		//      new dojo.uri.Uri(document.baseURI, uri)

		// TODO: support for IPv6, see RFC 2732

		// resolve uri components relative to each other
		var uri = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			if(!arguments[i]) { continue; }

			// Safari doesn't support this.constructor so we have to be explicit
			var relobj = new dojo.uri.Uri(arguments[i].toString());
			var uriobj = new dojo.uri.Uri(uri.toString());

			if (relobj.path == "" && relobj.scheme == null &&
				relobj.authority == null && relobj.query == null)
			{
				if (relobj.fragment != null) { uriobj.fragment = relobj.fragment; }
				relobj = uriobj;
			}
			else if (relobj.scheme == null) {
				relobj.scheme = uriobj.scheme;
			
				if (relobj.authority == null) {
					relobj.authority = uriobj.authority;
					
					if (relobj.path.charAt(0) != "/") {
						var path = uriobj.path.substring(0,
							uriobj.path.lastIndexOf("/") + 1) + relobj.path;

						var segs = path.split("/");
						for (var j = 0; j < segs.length; j++) {
							if (segs[j] == ".") {
								if (j == segs.length - 1) { segs[j] = ""; }
								else { segs.splice(j, 1); j--; }
							} else if (j > 0 && !(j == 1 && segs[0] == "") &&
								segs[j] == ".." && segs[j-1] != "..")
							{
								if (j == segs.length - 1) { segs.splice(j, 1); segs[j - 1] = ""; }
								else { segs.splice(j - 1, 2); j -= 2; }
							}
						}
						relobj.path = segs.join("/");
					}
				}
			}

			uri = "";
			if (relobj.scheme != null) { uri += relobj.scheme + ":"; }
			if (relobj.authority != null) { uri += "//" + relobj.authority; }
			uri += relobj.path;
			if (relobj.query != null) { uri += "?" + relobj.query; }
			if (relobj.fragment != null) { uri += "#" + relobj.fragment; }
		}

		this.uri = uri.toString();

		// break the uri into its main components
		var regexp = "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
	    var r = this.uri.match(new RegExp(regexp));

		this.scheme = r[2] || (r[1] ? "" : null);
		this.authority = r[4] || (r[3] ? "" : null);
		this.path = r[5]; // can never be undefined
		this.query = r[7] || (r[6] ? "" : null);
		this.fragment  = r[9] || (r[8] ? "" : null);
		
		if (this.authority != null) {
			// server based naming authority
			regexp = "^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
			r = this.authority.match(new RegExp(regexp));
			
			this.user = r[3] || null;
			this.password = r[4] || null;
			this.host = r[5];
			this.port = r[7] || null;
		}
	
		this.toString = function () { return this.uri; }
	}
};

dojo.provide("dojo.math");

dojo.math.degToRad = function (x) { return (x*Math.PI) / 180; }
dojo.math.radToDeg = function (x) { return (x*180) / Math.PI; }

dojo.math.factorial = function (n) {
	if(n<1){ return 0; }
	var retVal = 1;
	for(var i=1;i<=n;i++){ retVal *= i; }
	return retVal;
}

//The number of ways of obtaining an ordered subset of k elements from a set of n elements
dojo.math.permutations = function (n,k) {
	if(n==0 || k==0) return 1;
	return (dojo.math.factorial(n) / dojo.math.factorial(n-k));
}

//The number of ways of picking n unordered outcomes from r possibilities
dojo.math.combinations = function (n,r) {
	if(n==0 || r==0) return 1;
	return (dojo.math.factorial(n) / (dojo.math.factorial(n-r) * dojo.math.factorial(r)));
}

dojo.math.bernstein = function (t,n,i) {
	return (dojo.math.combinations(n,i) * Math.pow(t,i) * Math.pow(1-t,n-i));
}

/**
 * Returns random numbers with a Gaussian distribution, with the mean set at
 * 0 and the variance set at 1.
 *
 * @return A random number from a Gaussian distribution
 */
 // FIXME: this doesn't always range from -1 to 1 (fails ant test sometimes!)
dojo.math.gaussianRandom = function () {
	var k = 2;
	do {
		var i = 2 * Math.random() - 1;
		var j = 2 * Math.random() - 1;
		k = i * i + j * j;
	} while (k >= 1);
	k = Math.sqrt((-2 * Math.log(k)) / k);
	return i * k;
}

/**
 * Calculates the mean of an Array of numbers.
 *
 * @return The mean of the numbers in the Array
 */
dojo.math.mean = function () {
	var array = dojo.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	var mean = 0;
	for (var i = 0; i < array.length; i++) { mean += array[i]; }
	return mean / array.length;
}

/**
 * Extends Math.round by adding a second argument specifying the number of
 * decimal places to round to.
 *
 * @param number The number to round
 * @param places The number of decimal places to round to
 * @return The rounded number
 */
// TODO: add support for significant figures
dojo.math.round = function (number, places) {
	if (!places) { var shift = 1; }
	else { var shift = Math.pow(10, places); }
	return Math.round(number * shift) / shift;
}

/**
 * Calculates the standard deviation of an Array of numbers
 *
 * @return The standard deviation of the numbers
 */
dojo.math.sd = function () {
	var array = dojo.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	return Math.sqrt(dojo.math.variance(array));
}

/**
 * Calculates the variance of an Array of numbers
 *
 * @return The variance of the numbers
 */
dojo.math.variance = function () {
	var array = dojo.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	var mean = 0, squares = 0;
	for (var i = 0; i < array.length; i++) {
		mean += array[i];
		squares += Math.pow(array[i], 2);
	}
	return (squares / array.length)
		- Math.pow(mean / array.length, 2);
}


dojo.provide("dojo.graphics.color");
dojo.require("dojo.lang");
dojo.require("dojo.math");

// TODO: rewrite the "x2y" methods to take advantage of the parsing
//       abilities of the Color object. Also, beef up the Color
//       object (as possible) to parse most common formats

// takes an r, g, b, a(lpha) value, [r, g, b, a] array, "rgb(...)" string, hex string (#aaa, #aaaaaa, aaaaaaa)
dojo.graphics.color.Color = function(r, g, b, a) {
	if(dojo.lang.isArray(r)) {
		this.r = r[0];
		this.g = r[1];
		this.b = r[2];
		this.a = r[3]||1.0;
	} else if(dojo.lang.isString(r)) {
		var rgb = dojo.graphics.color.extractRGB(r);
		this.r = rgb[0];
		this.g = rgb[1];
		this.b = rgb[2];
		this.a = g||1.0;
	} else if(r instanceof dojo.graphics.color.Color) {
		this.r = r.r;
		this.b = r.b;
		this.g = r.g;
		this.a = r.a;
	} else {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
};

dojo.graphics.color.Color.prototype.toRgb = function(includeAlpha) {
	if(includeAlpha) {
		return this.toRgba();
	} else {
		return [this.r, this.g, this.b];
	}
};

dojo.graphics.color.Color.prototype.toRgba = function() {
	return [this.r, this.g, this.b, this.a];
}

dojo.graphics.color.Color.prototype.toHex = function() {
	return dojo.graphics.color.rgb2hex(this.toRgb());
};

dojo.graphics.color.Color.prototype.toCss = function() {
	return "rgb(" + this.toRgb().join() + ")";
}

dojo.graphics.color.Color.prototype.toString = function() {
	return this.toHex(); // decent default?
}

dojo.graphics.color.Color.prototype.toHsv = function() {
	return dojo.graphics.color.rgb2hsv(this.toRgb());
};

dojo.graphics.color.Color.prototype.toHsl = function() {
	return dojo.graphics.color.rgb2hsl(this.toRgb());
};

dojo.graphics.color.Color.prototype.blend = function(color, weight) {
	return dojo.graphics.color.blend(this.toRgb(), new Color(color).toRgb(), weight);
}

dojo.graphics.color.named = {
	white:      [255,255,255],
	black:      [0,0,0],
	red:        [255,0,0],
	green:	    [0,255,0],
	blue:       [0,0,255],
	navy:       [0,0,128],
	gray:       [128,128,128],
	silver:     [192,192,192]
};

// blend colors a and b (both as RGB array or hex strings) with weight from -1 to +1, 0 being a 50/50 blend
dojo.graphics.color.blend = function(a, b, weight) {
	if(typeof a == "string") { return dojo.graphics.color.blendHex(a, b, weight); }
	if(!weight) { weight = 0; }
	else if(weight > 1) { weight = 1; }
	else if(weight < -1) { weight = -1; }
	var c = new Array(3);
	for(var i = 0; i < 3; i++) {
		var half = Math.abs(a[i] - b[i])/2;
		c[i] = Math.floor(Math.min(a[i], b[i]) + half + (half * weight));
	}
	return c;
}

// very convenient blend that takes and returns hex values
// (will get called automatically by blend when blend gets strings)
dojo.graphics.color.blendHex = function(a, b, weight) {
	return dojo.graphics.color.rgb2hex(dojo.graphics.color.blend(dojo.graphics.color.hex2rgb(a), dojo.graphics.color.hex2rgb(b), weight));
}

// get RGB array from css-style color declarations
dojo.graphics.color.extractRGB = function(color) {
	var hex = "0123456789abcdef";
	color = color.toLowerCase();
	if( color.indexOf("rgb") == 0 ) {
		var matches = color.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
		var ret = matches.splice(1, 3);
		return ret;
	} else {
		var colors = dojo.graphics.color.hex2rgb(color);
		if(colors) {
			return colors;
		} else {
			// named color (how many do we support?)
			return dojo.graphics.color.named[color] || [255, 255, 255];
		}
	}
}

dojo.graphics.color.hex2rgb = function(hex) {
	var hexNum = "0123456789ABCDEF";
	var rgb = new Array(3);
	if( hex.indexOf("#") == 0 ) { hex = hex.substring(1); }
	hex = hex.toUpperCase();
	if(hex.replace(new RegExp("["+hexNum+"]", "g"), "") != "") {
		return null;
	}
	if( hex.length == 3 ) {
		rgb[0] = hex.charAt(0) + hex.charAt(0)
		rgb[1] = hex.charAt(1) + hex.charAt(1)
		rgb[2] = hex.charAt(2) + hex.charAt(2);
	} else {
		rgb[0] = hex.substring(0, 2);
		rgb[1] = hex.substring(2, 4);
		rgb[2] = hex.substring(4);
	}
	for(var i = 0; i < rgb.length; i++) {
		rgb[i] = hexNum.indexOf(rgb[i].charAt(0)) * 16 + hexNum.indexOf(rgb[i].charAt(1));
	}
	return rgb;
}

dojo.graphics.color.rgb2hex = function(r, g, b) {
	if(dojo.lang.isArray(r)) {
		g = r[1] || "00";
		b = r[2] || "00";
		r = r[0] || "00";
	}
	r = "00" + r.toString(16);
	g = "00" + g.toString(16);
	b = "00" + b.toString(16);
	return ["#", r.substr(-2,2), g.substr(-2,2), b.substr(-2,2)].join("");
}

dojo.graphics.color.rgb2hsv = function(r, g, b){

	if (dojo.lang.isArray(r)) {
		b = r[2] || 0;
		g = r[1] || 0;
		r = r[0] || 0;
	}

	// r,g,b, each 0 to 255, to HSV.
	// h = 0.0 to 360.0 (corresponding to 0..360.0 degrees around hexcone)
	// s = 0.0 (shade of gray) to 1.0 (pure color)
	// v = 0.0 (black) to 1.0 {white)
	//
	// Based on C Code in "Computer Graphics -- Principles and Practice,"
	// Foley et al, 1996, p. 592. 
	//
	// our calculatuions are based on 'regular' values (0-360, 0-1, 0-1) 
	// but we return bytes values (0-255, 0-255, 0-255)

	var h = null;
	var s = null;
	var v = null;

	var min = Math.min(r, g, b);
	v = Math.max(r, g, b);

	var delta = v - min;

	// calculate saturation (0 if r, g and b are all 0)

	s = (v == 0) ? 0 : delta/v;

	if (s == 0){
		// achromatic: when saturation is, hue is undefined
		h = 0;
	}else{
		// chromatic
		if (r == v){
			// between yellow and magenta
			h = 60 * (g - b) / delta;
		}else{
			if (g == v){
				// between cyan and yellow
				h = 120 + 60 * (b - r) / delta;
			}else{
				if (b == v){
					// between magenta and cyan
					h = 240 + 60 * (r - g) / delta;
				}
			}
		}
		if (h < 0){
			h += 360;
		}
	}


	h = (h == 0) ? 360 : Math.ceil((h / 360) * 255);
	s = Math.ceil(s * 255);

	return [h, s, v];
}

dojo.graphics.color.hsv2rgb = function(h, s, v){
 
	if (dojo.lang.isArray(h)) {
		v = h[2] || 0;
		s = h[1] || 0;
		h = h[0] || 0;
	}

	h = (h / 255) * 360;
	if (h == 360){ h = 0;}

	s = s / 255;
	v = v / 255;

	// Based on C Code in "Computer Graphics -- Principles and Practice,"
	// Foley et al, 1996, p. 593.
	//
	// H = 0.0 to 360.0 (corresponding to 0..360 degrees around hexcone) 0 for S = 0
	// S = 0.0 (shade of gray) to 1.0 (pure color)
	// V = 0.0 (black) to 1.0 (white)

	var r = null;
	var g = null;
	var b = null;

	if (s == 0){
		// color is on black-and-white center line
		// achromatic: shades of gray
		r = v;
		g = v;
		b = v;
	}else{
		// chromatic color
		var hTemp = h / 60;		// h is now IN [0,6]
		var i = Math.floor(hTemp);	// largest integer <= h
		var f = hTemp - i;		// fractional part of h

		var p = v * (1 - s);
		var q = v * (1 - (s * f));
		var t = v * (1 - (s * (1 - f)));

		switch(i){
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}
	}

	r = Math.ceil(r * 255);
	g = Math.ceil(g * 255);
	b = Math.ceil(b * 255);

	return [r, g, b];
}

dojo.graphics.color.rgb2hsl = function(r, g, b){

	if (dojo.lang.isArray(r)) {
		b = r[2] || 0;
		g = r[1] || 0;
		r = r[0] || 0;
	}

	r /= 255;
	g /= 255;
	b /= 255;

	//
	// based on C code from http://astronomy.swin.edu.au/~pbourke/colour/hsl/
	//

	var h = null;
	var s = null;
	var l = null;


	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;

	l = (min + max) / 2;

	s = 0;

	if ((l > 0) && (l < 1)){
		s = delta / ((l < 0.5) ? (2 * l) : (2 - 2 * l));
	}

	h = 0;

	if (delta > 0) {
		if ((max == r) && (max != g)){
			h += (g - b) / delta;
		}
		if ((max == g) && (max != b)){
			h += (2 + (b - r) / delta);
		}
		if ((max == b) && (max != r)){
			h += (4 + (r - g) / delta);
		}
		h *= 60;
	}

	h = (h == 0) ? 360 : Math.ceil((h / 360) * 255);
	s = Math.ceil(s * 255);
	l = Math.ceil(l * 255);

	return [h, s, l];
}

dojo.graphics.color.hsl2rgb = function(h, s, l){
 
	if (dojo.lang.isArray(h)) {
		l = h[2] || 0;
		s = h[1] || 0;
		h = h[0] || 0;
	}

	h = (h / 255) * 360;
	if (h == 360){ h = 0;}
	s = s / 255;
	l = l / 255;

	//
	// based on C code from http://astronomy.swin.edu.au/~pbourke/colour/hsl/
	//


	while (h < 0){ h += 360; }
	while (h > 360){ h -= 360; }

	if (h < 120){
		r = (120 - h) / 60;
		g = h / 60;
		b = 0;
	}else if (h < 240){
		r = 0;
		g = (240 - h) / 60;
		b = (h - 120) / 60;
	}else{
		r = (h - 240) / 60;
		g = 0;
		b = (360 - h) / 60;
	}

	r = Math.min(r, 1);
	g = Math.min(g, 1);
	b = Math.min(b, 1);

	r = 2 * s * r + (1 - s);
	g = 2 * s * g + (1 - s);
	b = 2 * s * b + (1 - s);

	if (l < 0.5){
		r = l * r;
		g = l * g;
		b = l * b;
	}else{
		r = (1 - l) * r + 2 * l - 1;
		g = (1 - l) * g + 2 * l - 1;
		b = (1 - l) * b + 2 * l - 1;
	}

	r = Math.ceil(r * 255);
	g = Math.ceil(g * 255);
	b = Math.ceil(b * 255);

	return [r, g, b];
}

dojo.provide("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.uri.Uri");
dojo.require("dojo.graphics.color");

// values: content-box, border-box
dojo.style.boxSizing = {
	marginBox: "margin-box",
	borderBox: "border-box",
	paddingBox: "padding-box",
	contentBox: "content-box"
};

dojo.style.getBoxSizing = function(node) 
{
	if (dojo.render.html.ie || dojo.render.html.opera){ 
		var cm = document["compatMode"];
		if (cm == "BackCompat" || cm == "QuirksMode"){ 
			return dojo.style.boxSizing.borderBox; 
		}else{
			return dojo.style.boxSizing.contentBox; 
		}
	}else{
		if(arguments.length == 0){ node = document.documentElement; }
		var sizing = dojo.style.getStyle(node, "-moz-box-sizing");
		if(!sizing){ sizing = dojo.style.getStyle(node, "box-sizing"); }
		return (sizing ? sizing : dojo.style.boxSizing.contentBox);
	}
}

/*

The following several function use the dimensions shown below

    +-------------------------+
    |  margin                 |
    | +---------------------+ |
    | |  border             | |
    | | +-----------------+ | |
    | | |  padding        | | |
    | | | +-------------+ | | |
    | | | |   content   | | | |
    | | | +-------------+ | | |
    | | +-|-------------|-+ | |
    | +-|-|-------------|-|-+ |
    +-|-|-|-------------|-|-|-+
    | | | |             | | | |
    | | | |<- content ->| | | |
    | |<------ inner ------>| |
    |<-------- outer -------->|
    +-------------------------+

    * content-box

    |m|b|p|             |p|b|m|
    | |<------ offset ----->| |
    | | |<---- client --->| | |
    | | | |<-- width -->| | | |

    * border-box

    |m|b|p|             |p|b|m|
    | |<------ offset ----->| |
    | | |<---- client --->| | |
    | |<------ width ------>| |
*/

/*
	Notes:

	General:
		- Uncomputable values are returned as NaN.
		- setOuterWidth/Height return *false* if the outer size could not be computed, otherwise *true*.
		- I (sjmiles) know no way to find the calculated values for auto-margins. 
		- All returned values are floating point in 'px' units. If a non-zero computed style value is not specified in 'px', NaN is returned.

	FF:
		- styles specified as '0' (unitless 0) show computed as '0pt'.

	IE:
		- clientWidth/Height are unreliable (0 unless the object has 'layout').
		- margins must be specified in px, or 0 (in any unit) for any sizing function to work. Otherwise margins detect as 'auto'.
		- padding can be empty or, if specified, must be in px, or 0 (in any unit) for any sizing function to work.

	Safari:
		- Safari defaults padding values to 'auto'.

	See the unit tests for examples of (un)computable values in a given browser.

*/

// FIXME: these work for most elements (e.g. DIV) but not all (e.g. TEXTAREA)

dojo.style.isBorderBox = function(node)
{
	return (dojo.style.getBoxSizing(node) == dojo.style.boxSizing.borderBox);
}

dojo.style.getUnitValue = function (element, cssSelector, autoIsZero){
	var result = { value: 0, units: 'px' };
	var s = dojo.style.getComputedStyle(element, cssSelector);
	if (s == '' || (s == 'auto' && autoIsZero)){ return result; }
	if (dojo.lang.isUndefined(s)){ 
		result.value = NaN;
	}else{
		// FIXME: is regex inefficient vs. parseInt or some manual test? 
		var match = s.match(/([\d.]+)([a-z%]*)/i);
		if (!match){
			result.value = NaN;
		}else{
			result.value = Number(match[1]);
			result.units = match[2].toLowerCase();
		}
	}
	return result;		
}

dojo.style.getPixelValue = function (element, cssSelector, autoIsZero){
	var result = dojo.style.getUnitValue(element, cssSelector, autoIsZero);
	// FIXME: code exists for converting other units to px (see Dean Edward's IE7) 
	// but there are cross-browser complexities
	if (isNaN(result.value) || (result.value && result.units != 'px')) { return NaN; }
	return result.value;
}

dojo.style.getNumericStyle = dojo.style.getPixelValue; // backward compat

dojo.style.isPositionAbsolute = function(node){
	return (dojo.style.getComputedStyle(node, 'position') == 'absolute');
}

dojo.style.getMarginWidth = function(node){
	var autoIsZero = dojo.style.isPositionAbsolute(node);
	var left = dojo.style.getPixelValue(node, "margin-left", autoIsZero);
	var right = dojo.style.getPixelValue(node, "margin-right", autoIsZero);
	return left + right;
}

dojo.style.getBorderWidth = function(node){
	// the removed calculation incorrectly includes scrollbar
	//if (node.clientWidth){
	//	return node.offsetWidth - node.clientWidth;
	//}else
	{
		var left = (dojo.style.getStyle(node, 'border-left-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-left-width"));
		var right = (dojo.style.getStyle(node, 'border-right-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-right-width"));
		return left + right;
	}
}

dojo.style.getPaddingWidth = function(node){
	var left = dojo.style.getPixelValue(node, "padding-left", true);
	var right = dojo.style.getPixelValue(node, "padding-right", true);
	return left + right;
}

dojo.style.getContentWidth = function (node){
	return node.offsetWidth - dojo.style.getPaddingWidth(node) - dojo.style.getBorderWidth(node);
}

dojo.style.getInnerWidth = function (node){
	return node.offsetWidth;
}

dojo.style.getOuterWidth = function (node){
	return dojo.style.getInnerWidth(node) + dojo.style.getMarginWidth(node);
}

dojo.style.setOuterWidth = function (node, pxWidth){
	if (!dojo.style.isBorderBox(node)){
		pxWidth -= dojo.style.getPaddingWidth(node) + dojo.style.getBorderWidth(node);
	}
	pxWidth -= dojo.style.getMarginWidth(node);
	if (!isNaN(pxWidth) && pxWidth > 0){
		node.style.width = pxWidth + 'px';
		return true;
	}else return false;
}

// FIXME: these aliases are actually the preferred names
dojo.style.getContentBoxWidth = dojo.style.getContentWidth;
dojo.style.getBorderBoxWidth = dojo.style.getInnerWidth;
dojo.style.getMarginBoxWidth = dojo.style.getOuterWidth;
dojo.style.setMarginBoxWidth = dojo.style.setOuterWidth;

dojo.style.getMarginHeight = function(node){
	var autoIsZero = dojo.style.isPositionAbsolute(node);
	var top = dojo.style.getPixelValue(node, "margin-top", autoIsZero);
	var bottom = dojo.style.getPixelValue(node, "margin-bottom", autoIsZero);
	return top + bottom;
}

dojo.style.getBorderHeight = function(node){
	// this removed calculation incorrectly includes scrollbar
//	if (node.clientHeight){
//		return node.offsetHeight- node.clientHeight;
//	}else
	{		
		var top = (dojo.style.getStyle(node, 'border-top-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-top-width"));
		var bottom = (dojo.style.getStyle(node, 'border-bottom-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-bottom-width"));
		return top + bottom;
	}
}

dojo.style.getPaddingHeight = function(node){
	var top = dojo.style.getPixelValue(node, "padding-top", true);
	var bottom = dojo.style.getPixelValue(node, "padding-bottom", true);
	return top + bottom;
}

dojo.style.getContentHeight = function (node){
	return node.offsetHeight - dojo.style.getPaddingHeight(node) - dojo.style.getBorderHeight(node);
}

dojo.style.getInnerHeight = function (node){
	return node.offsetHeight; // FIXME: does this work?
}

dojo.style.getOuterHeight = function (node){
	return dojo.style.getInnerHeight(node) + dojo.style.getMarginHeight(node);
}

dojo.style.setOuterHeight = function (node, pxHeight){
	if (!dojo.style.isBorderBox(node)){
			pxHeight -= dojo.style.getPaddingHeight(node) + dojo.style.getBorderHeight(node);
	}
	pxHeight -= dojo.style.getMarginHeight(node);
	if (!isNaN(pxHeight) && pxHeight > 0){
		node.style.height = pxHeight + 'px';
		return true;
	}else return false;
}

dojo.style.setContentWidth = function(node, pxWidth){

	if (dojo.style.isBorderBox(node)){
		pxWidth += dojo.style.getPaddingWidth(node) + dojo.style.getBorderWidth(node);
	}

	if (!isNaN(pxWidth) && pxWidth > 0){
		node.style.width = pxWidth + 'px';
		return true;
	}else return false;
}

dojo.style.setContentHeight = function(node, pxHeight){

	if (dojo.style.isBorderBox(node)){
		pxHeight += dojo.style.getPaddingHeight(node) + dojo.style.getBorderHeight(node);
	}

	if (!isNaN(pxHeight) && pxHeight > 0){
		node.style.height = pxHeight + 'px';
		return true;
	}else return false;
}

// FIXME: these aliases are actually the preferred names
dojo.style.getContentBoxHeight = dojo.style.getContentHeight;
dojo.style.getBorderBoxHeight = dojo.style.getInnerHeight;
dojo.style.getMarginBoxHeight = dojo.style.getOuterHeight;
dojo.style.setMarginBoxHeight = dojo.style.setOuterHeight;

dojo.style.getTotalOffset = function (node, type, includeScroll){
	var typeStr = (type=="top") ? "offsetTop" : "offsetLeft";
	var typeScroll = (type=="top") ? "scrollTop" : "scrollLeft";
	
	var alt = (type=="top") ? "y" : "x";
	var ret = 0;
	if(node["offsetParent"]){
		
		if(includeScroll) {
		  ret -= dojo.style.sumAncestorProperties(node, typeScroll);
		}
		// FIXME: this is known not to work sometimes on IE 5.x since nodes
		// soemtimes need to be "tickled" before they will display their
		// offset correctly
		do {
			ret += node[typeStr];
			node = node.offsetParent;
		} while (node != document.getElementsByTagName("body")[0].parentNode && node != null);
		
	}else if(node[alt]){
		ret += node[alt];
	}
	return ret;
}

dojo.style.sumAncestorProperties = function (node, prop) {
	if (!node) { return 0; } // FIXME: throw an error?
	
	var retVal = 0;
	while (node) {
		var val = node[prop];
		if (val) {
			retVal += val - 0;
		}
		node = node.parentNode;
	}
	return retVal;
}

dojo.style.totalOffsetLeft = function (node, includeScroll){
	return dojo.style.getTotalOffset(node, "left", includeScroll);
}

dojo.style.getAbsoluteX = dojo.style.totalOffsetLeft;

dojo.style.totalOffsetTop = function (node, includeScroll){
	return dojo.style.getTotalOffset(node, "top", includeScroll);
}

dojo.style.getAbsoluteY = dojo.style.totalOffsetTop;

dojo.style.getAbsolutePosition = function(node, includeScroll) {
	var position = [
		dojo.style.getAbsoluteX(node, includeScroll),
		dojo.style.getAbsoluteY(node, includeScroll)
	];
	position.x = position[0];
	position.y = position[1];
	return position;
}

dojo.style.styleSheet = null;

// FIXME: this is a really basic stub for adding and removing cssRules, but
// it assumes that you know the index of the cssRule that you want to add 
// or remove, making it less than useful.  So we need something that can 
// search for the selector that you you want to remove.
dojo.style.insertCssRule = function (selector, declaration, index) {
	if (!dojo.style.styleSheet) {
		if (document.createStyleSheet) { // IE
			dojo.style.styleSheet = document.createStyleSheet();
		} else if (document.styleSheets[0]) { // rest
			// FIXME: should create a new style sheet here
			// fall back on an exsiting style sheet
			dojo.style.styleSheet = document.styleSheets[0];
		} else { return null; } // fail
	}

	if (arguments.length < 3) { // index may == 0
		if (dojo.style.styleSheet.cssRules) { // W3
			index = dojo.style.styleSheet.cssRules.length;
		} else if (dojo.style.styleSheet.rules) { // IE
			index = dojo.style.styleSheet.rules.length;
		} else { return null; } // fail
	}

	if (dojo.style.styleSheet.insertRule) { // W3
		var rule = selector + " { " + declaration + " }";
		return dojo.style.styleSheet.insertRule(rule, index);
	} else if (dojo.style.styleSheet.addRule) { // IE
		return dojo.style.styleSheet.addRule(selector, declaration, index);
	} else { return null; } // fail
}

dojo.style.removeCssRule = function (index){
	if(!dojo.style.styleSheet){
		dojo.debug("no stylesheet defined for removing rules");
		return false;
	}
	if(dojo.render.html.ie){
		if(!index){
			index = dojo.style.styleSheet.rules.length;
			dojo.style.styleSheet.removeRule(index);
		}
	}else if(document.styleSheets[0]){
		if(!index){
			index = dojo.style.styleSheet.cssRules.length;
		}
		dojo.style.styleSheet.deleteRule(index);
	}
	return true;
}

dojo.style.insertCssFile = function (URI, doc, checkDuplicates){
	if(!URI) { return; }
	if(!doc){ doc = document; }
	// Safari doesn't have this property, but it doesn't support
	// styleSheets.href either so it beomces moot
	if(doc.baseURI) { URI = new dojo.uri.Uri(doc.baseURI, URI); }
	if(checkDuplicates && doc.styleSheets){
		// get the host + port info from location
		var loc = location.href.split("#")[0].substring(0, location.href.indexOf(location.pathname));
		for(var i = 0; i < doc.styleSheets.length; i++){
			if(doc.styleSheets[i].href && URI.toString() ==
				new dojo.uri.Uri(doc.styleSheets[i].href.toString())) { return; }
		}
	}
	var file = doc.createElement("link");
	file.setAttribute("type", "text/css");
	file.setAttribute("rel", "stylesheet");
	file.setAttribute("href", URI);
	var head = doc.getElementsByTagName("head")[0];
	if(head){ // FIXME: why isn't this working on Opera 8?
		head.appendChild(file);
	}
}

dojo.style.getBackgroundColor = function (node) {
	var color;
	do{
		color = dojo.style.getStyle(node, "background-color");
		// Safari doesn't say "transparent"
		if(color.toLowerCase() == "rgba(0, 0, 0, 0)") { color = "transparent"; }
		if(node == document.getElementsByTagName("body")[0]) { node = null; break; }
		node = node.parentNode;
	}while(node && dojo.lang.inArray(color, ["transparent", ""]));

	if( color == "transparent" ) {
		color = [255, 255, 255, 0];
	} else {
		color = dojo.graphics.color.extractRGB(color);
	}
	return color;
}

dojo.style.getComputedStyle = function (element, cssSelector, inValue) {
	var value = inValue;
	if (element.style.getPropertyValue) { // W3
		value = element.style.getPropertyValue(cssSelector);
	}
	if(!value) {
		if (document.defaultView) { // gecko
			value = document.defaultView.getComputedStyle(element, "")
				.getPropertyValue(cssSelector);
		} else if (element.currentStyle) { // IE
			value = element.currentStyle[dojo.style.toCamelCase(cssSelector)];
		}
	}
	return value;
}

dojo.style.getStyle = function (element, cssSelector) {
	var camelCased = dojo.style.toCamelCase(cssSelector);
	var value = element.style[camelCased]; // dom-ish
	return (value ? value : dojo.style.getComputedStyle(element, cssSelector, value));
}

dojo.style.toCamelCase = function (selector) {
	var arr = selector.split('-'), cc = arr[0];
	for(var i = 1; i < arr.length; i++) {
		cc += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
	}
	return cc;		
}

dojo.style.toSelectorCase = function (selector) {
	return selector.replace(/([A-Z])/g, "-$1" ).toLowerCase() ;
}

/* float between 0.0 (transparent) and 1.0 (opaque) */
dojo.style.setOpacity = function setOpacity (node, opacity, dontFixOpacity) {
	var h = dojo.render.html;
	if(!dontFixOpacity){
		if( opacity >= 1.0){
			if(h.ie){
				dojo.style.clearOpacity(node);
				return;
			}else{
				opacity = 0.999999;
			}
		}else if( opacity < 0.0){ opacity = 0; }
	}
	if(h.ie){
		if(node.nodeName.toLowerCase() == "tr"){
			// FIXME: is this too naive? will we get more than we want?
			var tds = node.getElementsByTagName("td");
			for(var x=0; x<tds.length; x++){
				tds[x].style.filter = "Alpha(Opacity="+opacity*100+")";
			}
		}
		node.style.filter = "Alpha(Opacity="+opacity*100+")";
	}else if(h.moz){
		node.style.opacity = opacity; // ffox 1.0 directly supports "opacity"
		node.style.MozOpacity = opacity;
	}else if(h.safari){
		node.style.opacity = opacity; // 1.3 directly supports "opacity"
		node.style.KhtmlOpacity = opacity;
	}else{
		node.style.opacity = opacity;
	}
}
	
dojo.style.getOpacity = function getOpacity (node){
	if(dojo.render.html.ie){
		var opac = (node.filters && node.filters.alpha &&
			typeof node.filters.alpha.opacity == "number"
			? node.filters.alpha.opacity : 100) / 100;
	}else{
		var opac = node.style.opacity || node.style.MozOpacity ||
			node.style.KhtmlOpacity || 1;
	}
	return opac >= 0.999999 ? 1.0 : Number(opac);
}

dojo.style.clearOpacity = function clearOpacity (node) {
	var h = dojo.render.html;
	if(h.ie){
		if( node.filters && node.filters.alpha ) {
			node.style.filter = ""; // FIXME: may get rid of other filter effects
		}
	}else if(h.moz){
		node.style.opacity = 1;
		node.style.MozOpacity = 1;
	}else if(h.safari){
		node.style.opacity = 1;
		node.style.KhtmlOpacity = 1;
	}else{
		node.style.opacity = 1;
	}
}

dojo.provide("dojo.html");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.require("dojo.string");

dojo.lang.mixin(dojo.html, dojo.dom);
dojo.lang.mixin(dojo.html, dojo.style);

// FIXME: we are going to assume that we can throw any and every rendering
// engine into the IE 5.x box model. In Mozilla, we do this w/ CSS.
// Need to investigate for KHTML and Opera

dojo.html.clearSelection = function(){
	try{
		if(window["getSelection"]){ 
			if(dojo.render.html.safari){
				// pulled from WebCore/ecma/kjs_window.cpp, line 2536
				window.getSelection().collapse();
			}else{
				window.getSelection().removeAllRanges();
			}
		}else if((document.selection)&&(document.selection.clear)){
			document.selection.clear();
		}
	}catch(e){ dojo.debug(e); }
}

dojo.html.disableSelection = function (element){
	if(arguments.length == 0){ element = dojo.html.body(); }
	var h = dojo.render.html;
	
	if(h.mozilla){
		element.style.MozUserSelect = "none";
	}else if(h.safari){
		element.style.KhtmlUserSelect = "none"; 
	}else if(h.ie){
		element.unselectable = "on";
	}
}

dojo.html.enableSelection = function (element){
	if (arguments.length == 0) { element = dojo.html.body(); }
	
	var h = dojo.render.html;
	if(h.mozilla){ 
		element.style.MozUserSelect = ""; 
	}else if(h.safari){
		element.style.KhtmlUserSelect = "";
	}else if(h.ie){
		element.unselectable = "off";
	}
}

dojo.html.selectElement = function(element){
	if (document.selection && dojo.html.body().createTextRange) { // IE
		var range = dojo.html.body().createTextRange();
		range.moveToElementText(element);
		range.select();
	}else if(window["getSelection"]){
		var selection = window.getSelection();
		if(selection["selectAllChildren"]){ // Mozilla
			selection.selectAllChildren(element);
		}
	}
}

dojo.html.isSelectionCollapsed = function(){
	if(document["selection"]){ // IE
		return document.selection.createRange().text == "";
	}else if(window["getSelection"]){
		var selection = window.getSelection();
		if(dojo.lang.isString(selection)){ // Safari
			return selection == "";
		}else{ // Mozilla/W3
			return selection.isCollapsed;
		}
	}
}

dojo.html.getEventTarget = function(evt){
	if((window["event"])&&(window.event["srcElement"])){
		return window.event.srcElement;
	}else if((evt)&&(evt.target)){
		return evt.target;
	}
}

dojo.html.getScrollTop = function(){
	return document.documentElement.scrollTop || dojo.html.body().scrollTop || 0;
}

dojo.html.getScrollLeft = function(){
	return document.documentElement.scrollLeft || dojo.html.body().scrollLeft || 0;
}

dojo.html.getDocumentWidth = function(){
	dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
	return dojo.html.getViewportWidth();
}

dojo.html.getDocumentHeight = function(){
	dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
	return dojo.html.getViewportHeight();
}

dojo.html.getDocumentSize = function(){
	dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
	return dojo.html.getViewportSize();
}

dojo.html.getViewportWidth = function(){

	var w = 0;

	if(window.innerWidth){
		w = window.innerWidth;
	}

	if(document.documentElement && document.documentElement.clientWidth){
		// IE6 Strict
		var w2 = document.documentElement.clientWidth;
		// this lets us account for scrollbars
		if(!w || w2 && w2 < w) {
			w = w2;
		}
		return w;
	}

	if(document.body){
		// IE
		return document.body.clientWidth;
	}

	return 0;
}

dojo.html.getViewportHeight = function(){

	if (window.innerHeight){
		return window.innerHeight;
	}

	if (document.documentElement && document.documentElement.clientHeight){
		// IE6 Strict
		return document.documentElement.clientHeight;
	}

	if (document.body){
		// IE
		return document.body.clientHeight;
	}

	return 0;
}

dojo.html.getViewportSize = function(){
	return [dojo.html.getViewportWidth(), dojo.html.getViewportHeight()];
}

dojo.html.getScrollOffset = function(){

	if (window.pageYOffset){
		return [window.pageXOffset, window.pageYOffset];
	}
		
	if (document.documentElement && document.documentElement.scrollTop){
		return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
	}

	if (document.body){
		return [document.body.scrollLeft, document.body.scrollTop];
	}

	return [0, 0];
}

dojo.html.getParentOfType = function (node, type){
	var parent = node;
	type = type.toLowerCase();
	while(parent.nodeName.toLowerCase()!=type){
		if((!parent)||(parent==(document["body"]||document["documentElement"]))){
			return null;
		}
		parent = parent.parentNode;
	}
	return parent;
}

// RAR: this function comes from nwidgets and is more-or-less unmodified.
// We should probably look ant Burst and f(m)'s equivalents
dojo.html.getAttribute = function (node, attr){
	// FIXME: need to add support for attr-specific accessors
	if((!node)||(!node.getAttribute)){
		// if(attr !== 'nwType'){
		//	alert("getAttr of '" + attr + "' with bad node"); 
		// }
		return null;
	}
	var ta = typeof attr == 'string' ? attr : new String(attr);

	// first try the approach most likely to succeed
	var v = node.getAttribute(ta.toUpperCase());
	if((v)&&(typeof v == 'string')&&(v!="")){ return v; }

	// try returning the attributes value, if we couldn't get it as a string
	if(v && typeof v == 'object' && v.value){ return v.value; }

	// this should work on Opera 7, but it's a little on the crashy side
	if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
		return (node.getAttributeNode(ta)).value;
	}else if(node.getAttribute(ta)){
		return node.getAttribute(ta);
	}else if(node.getAttribute(ta.toLowerCase())){
		return node.getAttribute(ta.toLowerCase());
	}
	return null;
}
	
/**
 *	Determines whether or not the specified node carries a value for the
 *	attribute in question.
 */
dojo.html.hasAttribute = function(node, attr){
	var v = dojo.html.getAttribute(node, attr);
	return v ? true : false;
}
	
/**
 * Returns the string value of the list of CSS classes currently assigned
 * directly to the node in question. Returns an empty string if no class attribute
 * is found;
 */
dojo.html.getClass = function(node){
	if(node.className){
		return node.className;
	}else if(dojo.html.hasAttribute(node, "class")){
		return dojo.html.getAttribute(node, "class");
	}
	return "";
}

/**
 * Returns whether or not the specified classname is a portion of the
 * class list currently applied to the node. Does not cover cascaded
 * styles, only classes directly applied to the node.
 */
dojo.html.hasClass = function (node, classname){
	var classes = dojo.html.getClass(node).split(/\s+/g);
	for(var x=0; x<classes.length; x++){
		if(classname == classes[x]){ return true; }
	}
	return false;
}

/**
 * Adds the specified class to the beginning of the class list on the
 * passed node. This gives the specified class the highest precidence
 * when style cascading is calculated for the node. Returns true or
 * false; indicating success or failure of the operation, respectively.
 */
dojo.html.prependClass = function(node, classStr){
	if(!node){ return null; }
	if(dojo.html.hasAttribute(node,"class")||node.className){
		classStr += " " + (node.className||dojo.html.getAttribute(node, "class"));
	}
	return dojo.html.setClass(node, classStr);
}

/**
 * Adds the specified class to the end of the class list on the
 *	passed &node;. Returns &true; or &false; indicating success or failure.
 */
dojo.html.addClass = function (node, classStr){
	if (!node) { throw new Error("addClass: node does not exist"); }
	if (dojo.html.hasClass(node, classStr)) {
	  return false;
	}
	if(dojo.html.hasAttribute(node,"class")||node.className){
		classStr = (node.className||dojo.html.getAttribute(node, "class")) + " " + classStr;
	}
	return dojo.html.setClass(node, classStr);
}

/**
 *	Clobbers the existing list of classes for the node, replacing it with
 *	the list given in the 2nd argument. Returns true or false
 *	indicating success or failure.
 */
dojo.html.setClass = function (node, classStr){
	if(!node){ return false; }
	var cs = new String(classStr);
	try{
		if(typeof node.className == "string"){
			node.className = cs;
		}else if(node.setAttribute){
			node.setAttribute("class", classStr);
			node.className = cs;
		}else{
			return false;
		}
	}catch(e){
		dojo.debug("__util__.setClass() failed", e);
	}
	return true;
}

/**
 * Removes the className from the node;. Returns
 * true or false indicating success or failure.
 */ 
dojo.html.removeClass = function(node, classStr, allowPartialMatches){
	if(!node){ return false; }
	var classStr = dojo.string.trim(new String(classStr));

	try{
		var cs = String( node.className ).split(" ");
		var nca	= [];
		if (allowPartialMatches) {
			for(var i = 0; i<cs.length; i++){
				if(cs[i].indexOf(classStr) == -1){ 
					nca.push(cs[i]);
				}
			}
		}
		else {
			for(var i = 0; i<cs.length; i++){
				if(cs[i] != classStr){ 
					nca.push(cs[i]);
				}
			}
		}
		node.className = nca.join(" ");
	}catch(e){
		dojo.debug("__util__.removeClass() failed", e);
	}

	return true;
}

// Enum type for getElementsByClass classMatchType arg:
dojo.html.classMatchType = {
	ContainsAll : 0, // all of the classes are part of the node's class (default)
	ContainsAny : 1, // any of the classes are part of the node's class
	IsOnly : 2 // only all of the classes are part of the node's class
}


/**
 * Returns an array of nodes for the given classStr, children of a
 * parent, and optionally of a certain nodeType
 */
dojo.html.getElementsByClass = function(classStr, parent, nodeType, classMatchType){
	if(!parent){ parent = document; }
	var classes = classStr.split(/\s+/g);
	var nodes = [];
	if( classMatchType != 1 && classMatchType != 2 ) classMatchType = 0; // make it enum
	var reClass = new RegExp("(\\s|^)((" + classes.join(")|(") + "))(\\s|$)");

	// FIXME: doesn't have correct parent support!
	if(false && document.evaluate) { // supports dom 3 xpath
		var xpath = "//" + (nodeType || "*") + "[contains(";
		if(classMatchType != dojo.html.classMatchType.ContainsAny){
			xpath += "concat(' ',@class,' '), ' " +
				classes.join(" ') and contains(concat(' ',@class,' '), ' ") +
				" ')]";
		}else{
			xpath += "concat(' ',@class,' '), ' " +
				classes.join(" ')) or contains(concat(' ',@class,' '), ' ") +
				" ')]";
		}
		//dojo.debug("xpath: " + xpath);

		var xpathResult = document.evaluate(xpath, parent, null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		outer:
		for(var node = null, i = 0; node = xpathResult.snapshotItem(i); i++){
			if(classMatchType != dojo.html.classMatchType.IsOnly){
				nodes.push(node);
			}else{
				if(!dojo.html.getClass(node)){ continue outer; }

				var nodeClasses = dojo.html.getClass(node).split(/\s+/g);
				for(var j = 0; j < nodeClasses.length; j++) {
					if( !nodeClasses[j].match(reClass) ) {
						continue outer;
					}
				}
				nodes.push(node);
			}
		}
	}else{
		if(!nodeType){ nodeType = "*"; }
		var candidateNodes = parent.getElementsByTagName(nodeType);

		outer:
		for(var i = 0; i < candidateNodes.length; i++) {
			var node = candidateNodes[i];
			if( !dojo.html.getClass(node) ) { continue outer; }
			var nodeClasses = dojo.html.getClass(node).split(/\s+/g);
			var matches = 0;

			for(var j = 0; j < nodeClasses.length; j++) {
				if( reClass.test(nodeClasses[j]) ) {
					if( classMatchType == dojo.html.classMatchType.ContainsAny ) {
						nodes.push(node);
						continue outer;
					} else {
						matches++;
					}
				} else {
					if( classMatchType == dojo.html.classMatchType.IsOnly ) {
						continue outer;
					}
				}
			}

			if( matches == classes.length ) {
				if( classMatchType == dojo.html.classMatchType.IsOnly && matches == nodeClasses.length ) {
					nodes.push(node);
				} else if( classMatchType == dojo.html.classMatchType.ContainsAll ) {
					nodes.push(node);
				}
			}
		}
	}
	return nodes;
}
//this.getElementsByClassName = this.getElementsByClass;

/**
 * Calculates the mouse's direction of gravity relative to the centre
 * of the given node.
 * <p>
 * If you wanted to insert a node into a DOM tree based on the mouse
 * position you might use the following code:
 * <pre>
 * if (gravity(node, e) & gravity.NORTH) { [insert before]; }
 * else { [insert after]; }
 * </pre>
 *
 * @param node The node
 * @param e		The event containing the mouse coordinates
 * @return		 The directions, NORTH or SOUTH and EAST or WEST. These
 *						 are properties of the function.
 */
dojo.html.gravity = function(node, e){
	var mousex = e.pageX || e.clientX + dojo.html.body().scrollLeft;
	var mousey = e.pageY || e.clientY + dojo.html.body().scrollTop;
	
	with (dojo.html) {
		var nodecenterx = getAbsoluteX(node) + (getInnerWidth(node) / 2);
		var nodecentery = getAbsoluteY(node) + (getInnerHeight(node) / 2);
	}
	
	with (dojo.html.gravity) {
		return ((mousex < nodecenterx ? WEST : EAST) |
			(mousey < nodecentery ? NORTH : SOUTH));
	}
}

dojo.html.gravity.NORTH = 1;
dojo.html.gravity.SOUTH = 1 << 1;
dojo.html.gravity.EAST = 1 << 2;
dojo.html.gravity.WEST = 1 << 3;
	
dojo.html.overElement = function(element, e){
	var mousex = e.pageX || e.clientX + dojo.html.body().scrollLeft;
	var mousey = e.pageY || e.clientY + dojo.html.body().scrollTop;
	
	with(dojo.html){
		var top = getAbsoluteY(element);
		var bottom = top + getInnerHeight(element);
		var left = getAbsoluteX(element);
		var right = left + getInnerWidth(element);
	}
	
	return (mousex >= left && mousex <= right &&
		mousey >= top && mousey <= bottom);
}

/**
 * Attempts to return the text as it would be rendered, with the line breaks
 * sorted out nicely. Unfinished.
 */
dojo.html.renderedTextContent = function(node){
	var result = "";
	if (node == null) { return result; }
	for (var i = 0; i < node.childNodes.length; i++) {
		switch (node.childNodes[i].nodeType) {
			case 1: // ELEMENT_NODE
			case 5: // ENTITY_REFERENCE_NODE
				switch (dojo.style.getStyle(node.childNodes[i], "display")) {
					case "block": case "list-item": case "run-in":
					case "table": case "table-row-group": case "table-header-group":
					case "table-footer-group": case "table-row": case "table-column-group":
					case "table-column": case "table-cell": case "table-caption":
						// TODO: this shouldn't insert double spaces on aligning blocks
						result += "\n";
						result += dojo.html.renderedTextContent(node.childNodes[i]);
						result += "\n";
						break;
					
					case "none": break;
					
					default:
						result += dojo.html.renderedTextContent(node.childNodes[i]);
						break;
				}
				break;
			case 3: // TEXT_NODE
			case 2: // ATTRIBUTE_NODE
			case 4: // CDATA_SECTION_NODE
				var text = node.childNodes[i].nodeValue;
				switch (dojo.style.getStyle(node, "text-transform")){
					case "capitalize": text = dojo.string.capitalize(text); break;
					case "uppercase": text = text.toUpperCase(); break;
					case "lowercase": text = text.toLowerCase(); break;
					default: break; // leave as is
				}
				// TODO: implement
				switch (dojo.style.getStyle(node, "text-transform")){
					case "nowrap": break;
					case "pre-wrap": break;
					case "pre-line": break;
					case "pre": break; // leave as is
					default:
						// remove whitespace and collapse first space
						text = text.replace(/\s+/, " ");
						if (/\s$/.test(result)) { text.replace(/^\s/, ""); }
						break;
				}
				result += text;
				break;
			default:
				break;
		}
	}
	return result;
}

dojo.html.setActiveStyleSheet = function(title){
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++){
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")){
			a.disabled = true;
			if (a.getAttribute("title") == title) { a.disabled = false; }
		}
	}
}

dojo.html.getActiveStyleSheet = function(){
	var i, a;
	// FIXME: getElementsByTagName returns a live collection. This seems like a
	// bad key for iteration.
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++){
		if (a.getAttribute("rel").indexOf("style") != -1 &&
			a.getAttribute("title") && !a.disabled) { return a.getAttribute("title"); }
	}
	return null;
}

dojo.html.getPreferredStyleSheet = function(){
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++){
		if(a.getAttribute("rel").indexOf("style") != -1
			&& a.getAttribute("rel").indexOf("alt") == -1
			&& a.getAttribute("title")) { return a.getAttribute("title"); }
	}
	return null;
}

dojo.html.body = function(){
	return document.body || document.getElementsByTagName("body")[0];
}

dojo.html.createNodesFromText = function(txt, wrap){
	var tn = document.createElement("div");
	// tn.style.display = "none";
	tn.style.visibility= "hidden";
	document.body.appendChild(tn);
	tn.innerHTML = txt;
	tn.normalize();
	if(wrap){ 
		var ret = [];
		// start hack
		var fc = tn.firstChild;
		ret[0] = ((fc.nodeValue == " ")||(fc.nodeValue == "\t")) ? fc.nextSibling : fc;
		// end hack
		// tn.style.display = "none";
		document.body.removeChild(tn);
		return ret;
	}
	var nodes = [];
	for(var x=0; x<tn.childNodes.length; x++){
		nodes.push(tn.childNodes[x].cloneNode(true));
	}
	tn.style.display = "none";
	document.body.removeChild(tn);
	return nodes;
}

// FIXME: this should be removed after 0.2 release
if(!dojo.evalObjPath("dojo.dom.createNodesFromText")){
	dojo.dom.createNodesFromText = function() {
		dojo.deprecated("dojo.dom.createNodesFromText", "use dojo.html.createNodesFromText instead");
		return dojo.html.createNodesFromText.apply(dojo.html, arguments);
	}
}

dojo.html.getAncestorsByTag = function(node, tag, returnFirstHit){
	tag = tag.toLowerCase();
	return dojo.dom.getAncestors(node, function(el) {
		return el.tagName && (el.tagName.toLowerCase() == tag);
	}, returnFirstHit);
}

dojo.html.getFirstAncestorByTag = function(node, tag){
	return dojo.html.getAncestorsByTag(node, tag, true);
}

dojo.html.isVisible = function(node){
	// FIXME: this should also look at visibility!
	return dojo.style.getComputedStyle(node||this.domNode, "display") != "none";
}

dojo.html.show  = function(node){
	if(node.style){
		node.style.display = dojo.lang.inArray(node.tagName.toLowerCase(), ['tr', 'td', 'th']) ? "" : "block";
	}
}

dojo.html.hide = function(node){
	if(node.style){
		node.style.display = "none";
	}
}


dojo.provide("dojo.math.curves");

dojo.require("dojo.math");

/* Curves from Dan's 13th lib stuff.
 * See: http://pupius.co.uk/js/Toolkit.Drawing.js
 *      http://pupius.co.uk/dump/dojo/Dojo.Math.js
 */

dojo.math.curves = {
	//Creates a straight line object
	Line: function(start, end) {
		this.start = start;
		this.end = end;
		this.dimensions = start.length;

		for(var i = 0; i < start.length; i++) {
			start[i] = Number(start[i]);
		}

		for(var i = 0; i < end.length; i++) {
			end[i] = Number(end[i]);
		}

		//simple function to find point on an n-dimensional, straight line
		this.getValue = function(n) {
			var retVal = new Array(this.dimensions);
			for(var i=0;i<this.dimensions;i++)
				retVal[i] = ((this.end[i] - this.start[i]) * n) + this.start[i];
			return retVal;
		}

		return this;
	},


	//Takes an array of points, the first is the start point, the last is end point and the ones in
	//between are the Bezier control points.
	Bezier: function(pnts) {
		this.getValue = function(step) {
			if(step >= 1) return this.p[this.p.length-1];	// if step>=1 we must be at the end of the curve
			if(step <= 0) return this.p[0];					// if step<=0 we must be at the start of the curve
			var retVal = new Array(this.p[0].length);
			for(var k=0;j<this.p[0].length;k++) { retVal[k]=0; }
			for(var j=0;j<this.p[0].length;j++) {
				var C=0; var D=0;
				for(var i=0;i<this.p.length;i++) {
					C += this.p[i][j] * this.p[this.p.length-1][0]
						* dojo.math.bernstein(step,this.p.length,i);
				}
				for(var l=0;l<this.p.length;l++) {
					D += this.p[this.p.length-1][0] * dojo.math.bernstein(step,this.p.length,l);
				}
				retVal[j] = C/D;
			}
			return retVal;
		}
		this.p = pnts;
		return this;
	},


	//Catmull-Rom Spline - allows you to interpolate a smooth curve through a set of points in n-dimensional space
	CatmullRom : function(pnts,c) {
		this.getValue = function(step) {
			var percent = step * (this.p.length-1);
			var node = Math.floor(percent);
			var progress = percent - node;

			var i0 = node-1; if(i0 < 0) i0 = 0;
			var i = node;
			var i1 = node+1; if(i1 >= this.p.length) i1 = this.p.length-1;
			var i2 = node+2; if(i2 >= this.p.length) i2 = this.p.length-1;

			var u = progress;
			var u2 = progress*progress;
			var u3 = progress*progress*progress;

			var retVal = new Array(this.p[0].length);
			for(var k=0;k<this.p[0].length;k++) {
				var x1 = ( -this.c * this.p[i0][k] ) + ( (2 - this.c) * this.p[i][k] ) + ( (this.c-2) * this.p[i1][k] ) + ( this.c * this.p[i2][k] );
				var x2 = ( 2 * this.c * this.p[i0][k] ) + ( (this.c-3) * this.p[i][k] ) + ( (3 - 2 * this.c) * this.p[i1][k] ) + ( -this.c * this.p[i2][k] );
				var x3 = ( -this.c * this.p[i0][k] ) + ( this.c * this.p[i1][k] );
				var x4 = this.p[i][k];

				retVal[k] = x1*u3 + x2*u2 + x3*u + x4;
			}
			return retVal;

		}


		if(!c) this.c = 0.7;
		else this.c = c;
		this.p = pnts;

		return this;
	},

	// FIXME: This is the bad way to do a partial-arc with 2 points. We need to have the user
	// supply the radius, otherwise we always get a half-circle between the two points.
	Arc : function(start, end, ccw) {
		var center = dojo.math.points.midpoint(start, end);
		var sides = dojo.math.points.translate(dojo.math.points.invert(center), start);
		var rad = Math.sqrt(Math.pow(sides[0], 2) + Math.pow(sides[1], 2));
		var theta = dojo.math.radToDeg(Math.atan(sides[1]/sides[0]));
		if( sides[0] < 0 ) {
			theta -= 90;
		} else {
			theta += 90;
		}
		dojo.math.curves.CenteredArc.call(this, center, rad, theta, theta+(ccw?-180:180));
	},

	// Creates an arc object, with center and radius (Top of arc = 0 degrees, increments clockwise)
	//  center => 2D point for center of arc
	//  radius => scalar quantity for radius of arc
	//  start  => to define an arc specify start angle (default: 0)
	//  end    => to define an arc specify start angle
	CenteredArc : function(center, radius, start, end) {
		this.center = center;
		this.radius = radius;
		this.start = start || 0;
		this.end = end;

		this.getValue = function(n) {
			var retVal = new Array(2);
			var theta = dojo.math.degToRad(this.start+((this.end-this.start)*n));

			retVal[0] = this.center[0] + this.radius*Math.sin(theta);
			retVal[1] = this.center[1] - this.radius*Math.cos(theta);

			return retVal;
		}

		return this;
	},

	// Special case of Arc (start = 0, end = 360)
	Circle : function(center, radius) {
		dojo.math.curves.CenteredArc.call(this, center, radius, 0, 360);
		return this;
	},

	Path : function() {
		var curves = [];
		var weights = [];
		var ranges = [];
		var totalWeight = 0;

		this.add = function(curve, weight) {
			if( weight < 0 ) { dojo.raise("dojo.math.curves.Path.add: weight cannot be less than 0"); }
			curves.push(curve);
			weights.push(weight);
			totalWeight += weight;
			computeRanges();
		}

		this.remove = function(curve) {
			for(var i = 0; i < curves.length; i++) {
				if( curves[i] == curve ) {
					curves.splice(i, 1);
					totalWeight -= weights.splice(i, 1)[0];
					break;
				}
			}
			computeRanges();
		}

		this.removeAll = function() {
			curves = [];
			weights = [];
			totalWeight = 0;
		}

		this.getValue = function(n) {
			var found = false, value = 0;
			for(var i = 0; i < ranges.length; i++) {
				var r = ranges[i];
				//w(r.join(" ... "));
				if( n >= r[0] && n < r[1] ) {
					var subN = (n - r[0]) / r[2];
					value = curves[i].getValue(subN);
					found = true;
					break;
				}
			}

			// FIXME: Do we want to assume we're at the end?
			if( !found ) {
				value = curves[curves.length-1].getValue(1);
			}

			for(j = 0; j < i; j++) {
				value = dojo.math.points.translate(value, curves[j].getValue(1));
			}
			return value;
		}

		function computeRanges() {
			var start = 0;
			for(var i = 0; i < weights.length; i++) {
				var end = start + weights[i] / totalWeight;
				var len = end - start;
				ranges[i] = [start, end, len];
				start = end;
			}
		}

		return this;
	}
};

dojo.provide("dojo.animation");
dojo.provide("dojo.animation.Animation");

dojo.require("dojo.lang");
dojo.require("dojo.math");
dojo.require("dojo.math.curves");

/*
Animation package based off of Dan Pupius' work on Animations:
http://pupius.co.uk/js/Toolkit.Drawing.js
*/

dojo.animation.Animation = function(curve, duration, accel, repeatCount) {
	// public properties
	this.curve = curve;
	this.duration = duration;
	this.repeatCount = repeatCount || 0;
	if(accel) {
		if(dojo.lang.isFunction(accel.getValue)) {
			this.accel = accel;
		} else {
			var i = 0.35*accel+0.5;	// 0.15 <= i <= 0.85
			this.accel = new dojo.math.curves.CatmullRom([[0], [i], [1]], 0.45);
		}
	}
}
dojo.lang.extend(dojo.animation.Animation, {
	// public properties
	curve: null,
	duration: 0,
	repeatCount: 0,
	accel: null,

	// events
	onBegin: null,
	onAnimate: null,
	onEnd: null,
	onPlay: null,
	onPause: null,
	onStop: null,
	handler: null,

	// "private" properties
	_animSequence: null,
	_startTime: null,
	_endTime: null,
	_lastFrame: null,
	_timer: null,
	_percent: 0,
	_active: false,
	_paused: false,
	_startRepeatCount: 0,

	// public methods
	play: function(gotoStart) {
		if( gotoStart ) {
			clearTimeout(this._timer);
			this._active = false;
			this._paused = false;
			this._percent = 0;
		} else if( this._active && !this._paused ) {
			return;
		}

		this._startTime = new Date().valueOf();
		if( this._paused ) {
			this._startTime -= (this.duration * this._percent / 100);
		}
		this._endTime = this._startTime + this.duration;
		this._lastFrame = this._startTime;

		var e = new dojo.animation.AnimationEvent(this, null, this.curve.getValue(this._percent),
			this._startTime, this._startTime, this._endTime, this.duration, this._percent, 0);

		this._active = true;
		this._paused = false;

		if( this._percent == 0 ) {
			if(!this._startRepeatCount) {
				this._startRepeatCount = this.repeatCount;
			}
			e.type = "begin";
			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onBegin == "function") { this.onBegin(e); }
		}

		e.type = "play";
		if(typeof this.handler == "function") { this.handler(e); }
		if(typeof this.onPlay == "function") { this.onPlay(e); }

		if(this._animSequence) { this._animSequence.setCurrent(this); }

		//dojo.lang.hitch(this, cycle)();
		this._cycle();
	},

	pause: function() {
		clearTimeout(this._timer);
		if( !this._active ) { return; }
		this._paused = true;
		var e = new dojo.animation.AnimationEvent(this, "pause", this.curve.getValue(this._percent),
			this._startTime, new Date().valueOf(), this._endTime, this.duration, this._percent, 0);
		if(typeof this.handler == "function") { this.handler(e); }
		if(typeof this.onPause == "function") { this.onPause(e); }
	},

	playPause: function() {
		if( !this._active || this._paused ) {
			this.play();
		} else {
			this.pause();
		}
	},

	gotoPercent: function(pct, andPlay) {
		clearTimeout(this._timer);
		this._active = true;
		this._paused = true;
		this._percent = pct;
		if( andPlay ) { this.play(); }
	},

	stop: function(gotoEnd) {
		clearTimeout(this._timer);
		var step = this._percent / 100;
		if( gotoEnd ) {
			step = 1;
		}
		var e = new dojo.animation.AnimationEvent(this, "stop", this.curve.getValue(step),
			this._startTime, new Date().valueOf(), this._endTime, this.duration, this._percent, Math.round(fps));
		if(typeof this.handler == "function") { this.handler(e); }
		if(typeof this.onStop == "function") { this.onStop(e); }
		this._active = false;
		this._paused = false;
	},

	status: function() {
		if( this._active ) {
			return this._paused ? "paused" : "playing";
		} else {
			return "stopped";
		}
	},

	// "private" methods
	_cycle: function() {
		clearTimeout(this._timer);
		if( this._active ) {
			var curr = new Date().valueOf();
			var step = (curr - this._startTime) / (this._endTime - this._startTime);
			fps = 1000 / (curr - this._lastFrame);
			this._lastFrame = curr;

			if( step >= 1 ) {
				step = 1;
				this._percent = 100;
			} else {
				this._percent = step * 100;
			}
			
			// Perform accelleration
			if(this.accel && this.accel.getValue) {
				step = this.accel.getValue(step);
			}

			var e = new dojo.animation.AnimationEvent(this, "animate", this.curve.getValue(step),
				this._startTime, curr, this._endTime, this.duration, this._percent, Math.round(fps));

			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onAnimate == "function") { this.onAnimate(e); }

			if( step < 1 ) {
				this._timer = setTimeout(dojo.lang.hitch(this, "_cycle"), 10);
			} else {
				e.type = "end";
				this._active = false;
				if(typeof this.handler == "function") { this.handler(e); }
				if(typeof this.onEnd == "function") { this.onEnd(e); }

				if( this.repeatCount > 0 ) {
					this.repeatCount--;
					this.play(true);
				} else if( this.repeatCount == -1 ) {
					this.play(true);
				} else {
					if(this._startRepeatCount) {
						this.repeatCount = this._startRepeatCount;
						this._startRepeatCount = 0;
					}
					if( this._animSequence ) {
						this._animSequence.playNext();
					}
				}
			}
		}
	}
});

dojo.animation.AnimationEvent = function(anim, type, coords, sTime, cTime, eTime, dur, pct, fps) {
	this.type = type; // "animate", "begin", "end", "play", "pause", "stop"
	this.animation = anim;

	this.coords = coords;
	this.x = coords[0];
	this.y = coords[1];
	this.z = coords[2];

	this.startTime = sTime;
	this.currentTime = cTime;
	this.endTime = eTime;

	this.duration = dur;
	this.percent = pct;
	this.fps = fps;
};
dojo.lang.extend(dojo.animation.AnimationEvent, {
	coordsAsInts: function() {
		var cints = new Array(this.coords.length);
		for(var i = 0; i < this.coords.length; i++) {
			cints[i] = Math.round(this.coords[i]);
		}
		return cints;
	}
});

dojo.animation.AnimationSequence = function(repeatCount) {
	this.repeatCount = repeatCount || 0;
}
dojo.lang.extend(dojo.animation.AnimationSequence, {
	repeateCount: 0,

	_anims: [],
	_currAnim: -1,

	onBegin: null,
	onEnd: null,
	onNext: null,
	handler: null,

	add: function() {
		for(var i = 0; i < arguments.length; i++) {
			this._anims.push(arguments[i]);
			arguments[i]._animSequence = this;
		}
	},

	remove: function(anim) {
		for(var i = 0; i < this._anims.length; i++) {
			if( this._anims[i] == anim ) {
				this._anims[i]._animSequence = null;
				this._anims.splice(i, 1);
				break;
			}
		}
	},

	removeAll: function() {
		for(var i = 0; i < this._anims.length; i++) {
			this._anims[i]._animSequence = null;
		}
		this._anims = [];
		this._currAnim = -1;
	},

	clear: function() {
		this.removeAll();
	},

	play: function(gotoStart) {
		if( this._anims.length == 0 ) { return; }
		if( gotoStart || !this._anims[this._currAnim] ) {
			this._currAnim = 0;
		}
		if( this._anims[this._currAnim] ) {
			if( this._currAnim == 0 ) {
				var e = {type: "begin", animation: this._anims[this._currAnim]};
				if(typeof this.handler == "function") { this.handler(e); }
				if(typeof this.onBegin == "function") { this.onBegin(e); }
			}
			this._anims[this._currAnim].play(gotoStart);
		}
	},

	pause: function() {
		if( this._anims[this._currAnim] ) {
			this._anims[this._currAnim].pause();
		}
	},

	playPause: function() {
		if( this._anims.length == 0 ) { return; }
		if( this._currAnim == -1 ) { this._currAnim = 0; }
		if( this._anims[this._currAnim] ) {
			this._anims[this._currAnim].playPause();
		}
	},

	stop: function() {
		if( this._anims[this._currAnim] ) {
			this._anims[this._currAnim].stop();
		}
	},

	status: function() {
		if( this._anims[this._currAnim] ) {
			return this._anims[this._currAnim].status();
		} else {
			return "stopped";
		}
	},

	setCurrent: function(anim) {
		for(var i = 0; i < this._anims.length; i++) {
			if( this._anims[i] == anim ) {
				this._currAnim = i;
				break;
			}
		}
	},

	playNext: function() {
		if( this._currAnim == -1 || this._anims.length == 0 ) { return; }
		this._currAnim++;
		if( this._anims[this._currAnim] ) {
			var e = {type: "next", animation: this._anims[this._currAnim]};
			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onNext == "function") { this.onNext(e); }
			this._anims[this._currAnim].play(true);
		} else {
			var e = {type: "end", animation: this._anims[this._anims.length-1]};
			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onEnd == "function") { this.onEnd(e); }
			if(this.repeatCount > 0) {
				this._currAnim = 0;
				this.repeatCount--;
				this._anims[this._currAnim].play(true);
			} else if(this.repeatCount == -1) {
				this._currAnim = 0;
				this._anims[this._currAnim].play(true);
			} else {
				this._currAnim = -1;
			}
		}
	}
});

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.animation.Animation", false, false]
});
dojo.hostenv.moduleLoaded("dojo.animation.*");

dojo.provide("dojo.fx.html");

dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.lang");
dojo.require("dojo.animation.*");
dojo.require("dojo.event.*");
dojo.require("dojo.graphics.color");

dojo.fx.html._makeFadeable = function(node){
	if(dojo.render.html.ie){
		// only set the zoom if the "tickle" value would be the same as the
		// default
		if( (node.style.zoom.length == 0) &&
			(dojo.style.getStyle(node, "zoom") == "normal") ){
			// make sure the node "hasLayout"
			// NOTE: this has been tested with larger and smaller user-set text
			// sizes and works fine
			node.style.zoom = "1";
			// node.style.zoom = "normal";
		}
		// don't set the width to auto if it didn't already cascade that way.
		// We don't want to f anyones designs
		if(	(node.style.width.length == 0) &&
			(dojo.style.getStyle(node, "width") == "auto") ){
			node.style.width = "auto";
		}
	}
}

dojo.fx.html.fadeOut = function(node, duration, callback, dontPlay) {
	return dojo.fx.html.fade(node, duration, dojo.style.getOpacity(node), 0, callback, dontPlay);
};

dojo.fx.html.fadeIn = function(node, duration, callback, dontPlay) {
	return dojo.fx.html.fade(node, duration, dojo.style.getOpacity(node), 1, callback, dontPlay);
};

dojo.fx.html.fadeHide = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	if(!duration) { duration = 150; } // why not have a default?
	return dojo.fx.html.fadeOut(node, duration, function(node) {
		node.style.display = "none";
		if(typeof callback == "function") { callback(node); }
	});
};

dojo.fx.html.fadeShow = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	if(!duration) { duration = 150; } // why not have a default?
	node.style.display = "block";
	return dojo.fx.html.fade(node, duration, 0, 1, callback, dontPlay);
};

dojo.fx.html.fade = function(node, duration, startOpac, endOpac, callback, dontPlay) {
	node = dojo.byId(node);
	dojo.fx.html._makeFadeable(node);
	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line([startOpac],[endOpac]),
		duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		dojo.style.setOpacity(node, e.x);
	});
	if(callback) {
		dojo.event.connect(anim, "onEnd", function(e) {
			callback(node, anim);
		});
	}
	if(!dontPlay) { anim.play(true); }
	return anim;
};

dojo.fx.html.slideTo = function(node, duration, endCoords, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endCoords;
		endCoords = tmp;
	}
	node = dojo.byId(node);

	var top = node.offsetTop;
	var left = node.offsetLeft;
	var pos = dojo.style.getComputedStyle(node, 'position');

	if (pos == 'relative' || pos == 'static') {
		top = parseInt(dojo.style.getComputedStyle(node, 'top')) || 0;
		left = parseInt(dojo.style.getComputedStyle(node, 'left')) || 0;
	}

	return dojo.fx.html.slide(node, duration, [left, top],
		endCoords, callback, dontPlay);
};

dojo.fx.html.slideBy = function(node, duration, coords, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = coords;
		coords = tmp;
	}
	node = dojo.byId(node);

	var top = node.offsetTop;
	var left = node.offsetLeft;
	var pos = dojo.style.getComputedStyle(node, 'position');

	if (pos == 'relative' || pos == 'static') {
		top = parseInt(dojo.style.getComputedStyle(node, 'top')) || 0;
		left = parseInt(dojo.style.getComputedStyle(node, 'left')) || 0;
	}

	return dojo.fx.html.slideTo(node, duration, [left+coords[0], top+coords[1]],
		callback, dontPlay);
};

dojo.fx.html.slide = function(node, duration, startCoords, endCoords, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endCoords;
		endCoords = startCoords;
		startCoords = tmp;
	}
	node = dojo.byId(node);

	if (dojo.style.getComputedStyle(node, 'position') == 'static') {
		node.style.position = 'relative';
	}

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startCoords, endCoords),
		duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		with( node.style ) {
			left = e.x + "px";
			top = e.y + "px";
		}
	});
	if(callback) {
		dojo.event.connect(anim, "onEnd", function(e) {
			callback(node, anim);
		});
	}
	if(!dontPlay) { anim.play(true); }
	return anim;
};

// Fade from startColor to the node's background color
dojo.fx.html.colorFadeIn = function(node, duration, startColor, delay, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = startColor;
		startColor = tmp;
	}
	node = dojo.byId(node);
	var color = dojo.html.getBackgroundColor(node);
	var bg = dojo.style.getStyle(node, "background-color").toLowerCase();
	var wasTransparent = bg == "transparent" || bg == "rgba(0, 0, 0, 0)";
	while(color.length > 3) { color.pop(); }

	var rgb = new dojo.graphics.color.Color(startColor).toRgb();
	var anim = dojo.fx.html.colorFade(node, duration, startColor, color, callback, true);
	dojo.event.connect(anim, "onEnd", function(e) {
		if( wasTransparent ) {
			node.style.backgroundColor = "transparent";
		}
	});
	if( delay > 0 ) {
		node.style.backgroundColor = "rgb(" + rgb.join(",") + ")";
		if(!dontPlay) { setTimeout(function(){anim.play(true)}, delay); }
	} else {
		if(!dontPlay) { anim.play(true); }
	}
	return anim;
};
// alias for (probably?) common use/terminology
dojo.fx.html.highlight = dojo.fx.html.colorFadeIn;
dojo.fx.html.colorFadeFrom = dojo.fx.html.colorFadeIn;

// Fade from node's background color to endColor
dojo.fx.html.colorFadeOut = function(node, duration, endColor, delay, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endColor;
		endColor = tmp;
	}
	node = dojo.byId(node);
	var color = new dojo.graphics.color.Color(dojo.html.getBackgroundColor(node)).toRgb();

	var rgb = new dojo.graphics.color.Color(endColor).toRgb();
	var anim = dojo.fx.html.colorFade(node, duration, color, rgb, callback, delay > 0 || dontPlay);
	if( delay > 0 ) {
		node.style.backgroundColor = "rgb(" + color.join(",") + ")";
		if(!dontPlay) { setTimeout(function(){anim.play(true)}, delay); }
	}
	return anim;
};
// FIXME: not sure which name is better. an alias here may be bad.
dojo.fx.html.unhighlight = dojo.fx.html.colorFadeOut;
dojo.fx.html.colorFadeTo = dojo.fx.html.colorFadeOut;

// Fade node background from startColor to endColor
dojo.fx.html.colorFade = function(node, duration, startColor, endColor, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endColor;
		endColor = startColor;
		startColor = tmp;
	}
	node = dojo.byId(node);
	var startRgb = new dojo.graphics.color.Color(startColor).toRgb();
	var endRgb = new dojo.graphics.color.Color(endColor).toRgb();
	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startRgb, endRgb),
		duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.backgroundColor = "rgb(" + e.coordsAsInts().join(",") + ")";
	});
	if(callback) {
		dojo.event.connect(anim, "onEnd", function(e) {
			callback(node, anim);
		});
	}
	if( !dontPlay ) { anim.play(true); }
	return anim;
};

dojo.fx.html.wipeIn = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	var savedHeight = dojo.html.getStyle(node, "height");
	var dispType = dojo.lang.inArray(node.tagName.toLowerCase(), ['tr', 'td', 'th']) ? "" : "block";
	node.style.display = dispType;
	var height = node.offsetHeight;
	var anim = dojo.fx.html.wipeInToHeight(node, duration, height, function(e) {
		node.style.height = savedHeight || "auto";
		if(callback) { callback(node, anim); }
	}, dontPlay);
};

dojo.fx.html.wipeInToHeight = function(node, duration, height, callback, dontPlay) {
	node = dojo.byId(node);
	var savedOverflow = dojo.html.getStyle(node, "overflow");
	// FIXME: should we be setting display to something other than "" for the table elements?
	node.style.height = "0px";
	node.style.display = "none";
	if(savedOverflow == "visible") {
		node.style.overflow = "hidden";
	}
	var dispType = dojo.lang.inArray(node.tagName.toLowerCase(), ['tr', 'td', 'th']) ? "" : "block";
	node.style.display = dispType;

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line([0], [height]),
		duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.height = Math.round(e.x) + "px";
	});
	dojo.event.connect(anim, "onEnd", function(e) {
		if(savedOverflow != "visible") {
			node.style.overflow = savedOverflow;
		}
		if(callback) { callback(node, anim); }
	});
	if( !dontPlay ) { anim.play(true); }
	return anim;
}

dojo.fx.html.wipeOut = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	var savedOverflow = dojo.html.getStyle(node, "overflow");
	var savedHeight = dojo.html.getStyle(node, "height");
	var height = node.offsetHeight;
	node.style.overflow = "hidden";

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line([height], [0]),
		duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.height = Math.round(e.x) + "px";
	});
	dojo.event.connect(anim, "onEnd", function(e) {
		node.style.display = "none";
		node.style.overflow = savedOverflow;
		node.style.height = savedHeight || "auto";
		if(callback) { callback(node, anim); }
	});
	if( !dontPlay ) { anim.play(true); }
	return anim;
};

// in: coordinate array [x,y,w,h] or dom node
// return: coordinate array
dojo.fx.html.toCoordinateArray = function(coords) {
	if(dojo.lang.isArray(coords)){
		// coords is already an array (of format [x,y,w,h]), just return it
		while ( coords.length < 4 ) { coords.push(0); }
		while ( coords.length > 4 ) { coords.pop(); }
		var ret = coords;
	} else {
		// coords is an dom object (or dom object id); return it's coordinates
		coords = dojo.byId(coords);
		var ret = [
			dojo.html.getAbsoluteX(coords),
			dojo.html.getAbsoluteY(coords),
			dojo.html.getInnerWidth(coords),
			dojo.html.getInnerHeight(coords)
		];
	}
	ret.x = ret[0];
	ret.y = ret[1];
	ret.w = ret[2];
	ret.h = ret[3];
	return ret;
};

dojo.fx.html.explode = function(start, endNode, duration, callback, dontPlay) {
	var startCoords = dojo.fx.html.toCoordinateArray(start);

	var outline = document.createElement("div");
	with(outline.style) {
		position = "absolute";
		border = "1px solid black";
		display = "none";
	}
	dojo.html.body().appendChild(outline);

	endNode = dojo.byId(endNode);
	with(endNode.style) {
		visibility = "hidden";
		display = "block";
	}
	var endCoords = dojo.fx.html.toCoordinateArray(endNode);

	with(endNode.style) {
		display = "none";
		visibility = "visible";
	}

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startCoords, endCoords),
		duration, 0
	);
	dojo.event.connect(anim, "onBegin", function(e) {
		outline.style.display = "block";
	});
	dojo.event.connect(anim, "onAnimate", function(e) {
		with(outline.style) {
			left = e.x + "px";
			top = e.y + "px";
			width = e.coords[2] + "px";
			height = e.coords[3] + "px";
		}
	});

	dojo.event.connect(anim, "onEnd", function() {
		endNode.style.display = "block";
		outline.parentNode.removeChild(outline);
		if(callback) { callback(endNode, anim); }
	});
	if(!dontPlay) { anim.play(); }
	return anim;
};

dojo.fx.html.implode = function(startNode, end, duration, callback, dontPlay) {
	var startCoords = dojo.fx.html.toCoordinateArray(startNode);
	var endCoords = dojo.fx.html.toCoordinateArray(end);

	startNode = dojo.byId(startNode);
	var outline = document.createElement("div");
	with(outline.style) {
		position = "absolute";
		border = "1px solid black";
		display = "none";
	}
	dojo.html.body().appendChild(outline);

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startCoords, endCoords),
		duration, 0
	);
	dojo.event.connect(anim, "onBegin", function(e) {
		startNode.style.display = "none";
		outline.style.display = "block";
	});
	dojo.event.connect(anim, "onAnimate", function(e) {
		with(outline.style) {
			left = e.x + "px";
			top = e.y + "px";
			width = e.coords[2] + "px";
			height = e.coords[3] + "px";
		}
	});

	dojo.event.connect(anim, "onEnd", function() {
		outline.parentNode.removeChild(outline);
		if(callback) { callback(startNode, anim); }
	});
	if(!dontPlay) { anim.play(); }
	return anim;
};

dojo.fx.html.Exploder = function(triggerNode, boxNode) {
	triggerNode = dojo.byId(triggerNode);
	boxNode = dojo.byId(boxNode);
	var _this = this;

	// custom options
	this.waitToHide = 500;
	this.timeToShow = 100;
	this.waitToShow = 200;
	this.timeToHide = 70;
	this.autoShow = false;
	this.autoHide = false;

	var animShow = null;
	var animHide = null;

	var showTimer = null;
	var hideTimer = null;

	var startCoords = null;
	var endCoords = null;

	this.showing = false;

	this.onBeforeExplode = null;
	this.onAfterExplode = null;
	this.onBeforeImplode = null;
	this.onAfterImplode = null;
	this.onExploding = null;
	this.onImploding = null;

	this.timeShow = function() {
		clearTimeout(showTimer);
		showTimer = setTimeout(_this.show, _this.waitToShow);
	}

	this.show = function() {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		//triggerNode.blur();

		if( (animHide && animHide.status() == "playing")
			|| (animShow && animShow.status() == "playing")
			|| _this.showing ) { return; }

		if(typeof _this.onBeforeExplode == "function") { _this.onBeforeExplode(triggerNode, boxNode); }
		animShow = dojo.fx.html.explode(triggerNode, boxNode, _this.timeToShow, function(e) {
			_this.showing = true;
			if(typeof _this.onAfterExplode == "function") { _this.onAfterExplode(triggerNode, boxNode); }
		});
		if(typeof _this.onExploding == "function") {
			dojo.event.connect(animShow, "onAnimate", this, "onExploding");
		}
	}

	this.timeHide = function() {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		if(_this.showing) {
			hideTimer = setTimeout(_this.hide, _this.waitToHide);
		}
	}

	this.hide = function() {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		if( animShow && animShow.status() == "playing" ) {
			return;
		}

		_this.showing = false;
		if(typeof _this.onBeforeImplode == "function") { _this.onBeforeImplode(triggerNode, boxNode); }
		animHide = dojo.fx.html.implode(boxNode, triggerNode, _this.timeToHide, function(e){
			if(typeof _this.onAfterImplode == "function") { _this.onAfterImplode(triggerNode, boxNode); }
		});
		if(typeof _this.onImploding == "function") {
			dojo.event.connect(animHide, "onAnimate", this, "onImploding");
		}
	}

	// trigger events
	dojo.event.connect(triggerNode, "onclick", function(e) {
		if(_this.showing) {
			_this.hide();
		} else {
			_this.show();
		}
	});
	dojo.event.connect(triggerNode, "onmouseover", function(e) {
		if(_this.autoShow) {
			_this.timeShow();
		}
	});
	dojo.event.connect(triggerNode, "onmouseout", function(e) {
		if(_this.autoHide) {
			_this.timeHide();
		}
	});

	// box events
	dojo.event.connect(boxNode, "onmouseover", function(e) {
		clearTimeout(hideTimer);
	});
	dojo.event.connect(boxNode, "onmouseout", function(e) {
		if(_this.autoHide) {
			_this.timeHide();
		}
	});

	// document events
	dojo.event.connect(document.documentElement || dojo.html.body(), "onclick", function(e) {
		if(_this.autoHide && _this.showing
			&& !dojo.dom.isDescendantOf(e.target, boxNode)
			&& !dojo.dom.isDescendantOf(e.target, triggerNode) ) {
			_this.hide();
		}
	});

	return this;
};

dojo.lang.mixin(dojo.fx, dojo.fx.html);

dojo.hostenv.conditionalLoadModule({
	browser: ["dojo.fx.html"]
});
dojo.hostenv.moduleLoaded("dojo.fx.*");

dojo.provide("dojo.graphics.htmlEffects");
dojo.require("dojo.fx.*");

dj_deprecated("dojo.graphics.htmlEffects is deprecated, use dojo.fx.html instead");

dojo.graphics.htmlEffects = dojo.fx.html;

dojo.hostenv.conditionalLoadModule({
	browser:	["dojo.graphics.htmlEffects"]
});
dojo.hostenv.moduleLoaded("dojo.graphics.*");

