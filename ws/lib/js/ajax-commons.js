/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: ajax-commons.js,v 1.3 2005-12-06 10:34:56 gmurray71 Exp $
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

function getWindowX() {
    if (!isIE) return window.innerWidth;
    else return document.body.offsetWidth;
}

function centerX(element) {
    var eW = element.offsetWidth;
    var xPos =  (getWindowX() /2) - (eW / 2);
    // reposition
    element.style.left= xPos +"px";
    // create shadow
    var eH = element.offsetHeight;
    var shadow = document.createElement("div");
    var shadowId = element.getAttribute("id") + "_shadow";
    shadow.setAttribute("id", shadowId);
    shadow.className = "shadow";
    shadow.style.width = eW + "px";
    shadow.style.height = eH + "px"
    document.firstChild.appendChild(shadow);
    shadow.style.top = findY(element) + 10;
    shadow.style.left = xPos + 10;
}


function Point(x,y) {
    this.x = x;
    this.y = y;
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

function $(targetElement){
    if (targetElement instanceof Array) {
        // build an array here
    } else {
        return document.getElementById(targetElement);
    }
}

function Dragable(element, dragTarget) {
    init();
    
    var dockable;
    var offset;
    var id;
    var shadow;
    
    function init() {
        id = element.getAttribute("id");
       if (!dragTarget) dragTarget = element;
       dragTarget.style.cursor = "move";
       dragTarget.onmouseout = done;
       dragTarget.onmousedown = mouseDown;
       dragTarget.onmouseup  = done;
       dragTarget.onmousemove = mouseMove;
    }
    
    function mouseOver(e) {
        over = true;
        if (e)e.preventDefault();
        else return false;
    }
    
    function mouseDown(e) {
        if (id) {
            shadow= $(id + "_shadow");
        } 
        var mp = getMousePosition(e);
        var eX = findX(element);
        var eY = findY(element);
        offset = new Point(eX - mp.x, eY - mp.y);
        if (e)e.preventDefault();
        else return false;
    }

    function mouseMove(e) {
        if (offset) {
            var x;
            var y;
            if (e) x = e.clientX + window.scrollX;
            else x = event.x;
            if (e) y = e.clientY + window.scrollY;
            else y = event.y;
            element.style.left = (offset.x + x ) + "px";
            element.style.top  = (offset.y  + y) + "px";
            if (shadow) {
                shadow.style.left = (offset.x + x + 10 ) + "px";
                shadow.style.top  = (offset.y  + y + 10) + "px";            
            }
            if (e)e.preventDefault();
            else return false;
        }
    }
     
    function done(e) {
	  offset = null;
	  if (e)e.preventDefault();
	  else return false;
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
