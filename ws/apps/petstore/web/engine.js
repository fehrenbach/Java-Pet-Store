function inject(p) {
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

