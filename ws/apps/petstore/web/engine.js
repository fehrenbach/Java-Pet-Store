
function Engine () {

  /**
   * 
   * Load template text aloing with an associated script
   * 
   * Argument p properties are as follows:
   *
   * url :              Not required but used if you want to get the template from
   *                    something other than the injection serlvet. For example if
   *                    you want to load content directly from a a JSP or HTML file.
   *       
   * p.template :       Not required if you specficy a url property Otherewise this
   *                    is the name of the template file.
   *
   * p.initFunction:    Not required. This function or function pointer will be called
   *                    after the template text and script are loaded. The result of 
   *                    the evaluated script will be accessible in the context of
   *                    this function.
   *
   * p.injectionPoint:  Not required. This is the id of an element into. If this is
   *                    not specfied a div will be created under the roon node of
   *                    the document and the template will be injected into it.
   *                    Content is injected by setting the innerHTML property
   *                    of an element to the template text.
   */
  this.inject = function (p) {
        var targetUrl;
        if (!p.url) targetUrl = "controller?command=content&target=/" + p.template;
        else targetUrl = p.url;
        var templateArgs = {
            url:  targetUrl,
            mimetype: "text/html",
            load: function(type, data) {
               //if no parent is given append to the document root
               if (!p.injectionPoint) {
                    var injectionPoint = document.createElement("div");
                    injectionPoint.innerHTML = data;
                    document.firstChild.appendChild(injectionPoint);
               } else {
                    p.injectionPoint.innerHTML = data;
               }
               if (p.script) {
                  // now load the associated JavaScript
                  loadScript(p.script,p.initFunction);
               } else {
                  if ( p.initFunction) p.initFunction();
               }
            }
        };
        dojo.io.bind(templateArgs);
  }

  function loadScript(targetURL,callback) {
        var templateArgs = {
           url:  targetURL,
            mimetype: "text/plain",
            load: callback
        };
        dojo.io.bind(templateArgs);
  }

  /**
   * If were returning an XML document remove any script in the
   * the document and add it to the global scope using a time out.
   */
  function includeEmbeddedScripts(xmlDocument) {
    var items = new Array();
    var xmlDocument = document.getElementsByTagName("script");
  
    for(var loop = 0; loop < targets.length; loop++) {
        var children = targets[loop].childNodes;
        var iScript = "";
        for(var innerLoop = 0; innerLoop < children.length; innerLoop++) {
            iScript += children[innerLoop].data;
        }
        items.add(iScript);
        children[loop].parentNode.removeChild(children[loop]);
    }
    for(var loop = 0; loop < items.length; loop++) {
        setTimeout(items[loop],0);
    }
  }
}
