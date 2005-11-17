/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: ajax-commons.js,v 1.1 2005-11-17 23:11:53 gmurray71 Exp $
*/

var isIE;


function Map() {

    var size = 0;
    var keys = new Array();
    var values = new Array();
    
    this.put = function(key,value) {
      if (this.get(key) == null) {
          keys[size] = key; values[size] = value;
          size++;
      } else {
        for (i=0; i < size; i++) {
            if (keys[i] == key) {
                values[i] = value;
            }
        }
      }
    }
    
    this.get = function(key) {
        for (i=0; i < size; i++) {
            if (keys[i] == key) {
               return values[i];
            }
        }
        return null;
    }
}

function AJAXInteraction(url) {
   AJAXInteraction(url,null);
}

function AJAXInteraction(url, callback) {

    var req = init();
    req.onreadystatechange = processRequest;
        
    function init() {
      if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        isIE = true;
        return new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    
    function processRequest () {
      if (req.readyState == 4) {
        if (req.status == 200) {
          if (callback) callback(req.responseXML);
        }
      }
    }

    this.doGet = function() {
      req.open("GET", url, true);
      req.send(null);
    }
    
    this.doPost = function(body) {
      req.open("POST", url, true);
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      req.send(body);
    }
}

function getElementText(local, parent) {
  return getElementTextNS(null, local, parent, 0);
}

function getElementTextNS(prefix, local, parent, index) {
    var result = "";
    if (prefix && isIE) {
        result = parent.getElementsByTagName(prefix + ":" + local)[index];
    } else {
        result = parent.getElementsByTagName(local)[index];
    }
    if (result) {
        if (result.childNodes.length > 1) {
            return result.childNodes[1].nodeValue;
        } else {
            return result.firstChild.nodeValue;    		
        }
    } else {
        return "";
    }
}

function getElementY(element){
	var targetTop = 0;
	if (element.offsetParent) {
		while (element.offsetParent) {
			targetTop += element.offsetTop;
            element = element.offsetParent;
		}
	} else if (element.y) {
		targetTop += element.y;
    }
	return targetTop;
}

function $(targetElement){
    if (targetElement instanceof Array) {
        // build an array here
    } else {
        return document.getElementById(targetElement);
    }
}
function Dragable(element) {
    init();

    var anchor;
    var offset;
    
    function Point(x,y) {
      this.x = x;
      this.y = y;
    }
    
    function init() {
       element.style.cursor = "move";
       element.onmouseover = mouseOver;
       element.onmousedown = mouseDown;
       element.onmouseup  = done;
       element.onmousemove = mouseMove;


    }
    
    function mouseOver(e) {
        over = true;
        //element.setAttribute("style", "cursor:hand");
    }
    
    function mouseDown(e) {
        anchor = new Point( e.clientX + window.scrollX, e.clientY + window.scrollY);
        var ox  = parseInt(element.style.left, 10);
        var oy   = parseInt(element.style.top,  10);
        if (isNaN(ox)) ox = 0;
        if (isNaN(oy))  oy  = 0;
        offset = new Point(ox,oy);
    }

    function mouseMove(e) {
        if (anchor) {
        var x;
        var y;
        x = e.clientX + window.scrollX;
        y = e.clientY + window.scrollY;
        element.style.left =
            (offset.x + x - anchor.x) + "px";
        element.style.top  =
            (offset.y  + y - anchor.y) + "px";
        e.preventDefault();
        }
    }

    
    function done(e) {
         anchor = null;
         offset = null;
        // alert("done!!!");
    }
    
    function getMousePosition(e){
        var lx = 0;
        var ly = 0;
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
            lx = e.pageX;
            ly = e.pageY;
        } else if (e.clientX || e.clientY) {
            lx = e.clientX;
            ly = e.clientY;
        }
        return new Point(lx,ly);
    }
}


    function findX(element) {
        var l = 0;
        if (element.offsetParent) {
            while (element.offsetParent) {
                l += element.offsetLeft
                element = element.offsetParent;
            }
        } else if (element.x)
            l += element.x;
        return l;
    }

    function findY(element) {
        var t = 0;
        if (element.offsetParent) {
            while (element.offsetParent) {
                t += element.offsetTop
                element = element.offsetParent;
            }
        } else if (element.y) {
         t += element.y;
        }
        return t;
    }