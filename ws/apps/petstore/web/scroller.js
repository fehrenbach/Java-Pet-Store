/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: scroller.js,v 1.3 2006-03-01 07:50:11 gmurray71 Exp $
*/

var isIE;
var index = 0;
var length = 4;

// scrollable
var tiles = new Array();

// for scrolling
var injectionPoint;
var displayPortTiles = 4;
var displayPortSize=500;
var offset = 0;
var thumbWidth=100;
var thumbHeight=75;
var scrollIncrement = 5;
var tileY;
var tileX;

var timeout = 50; // in ms
var scrollRight = false;
var scrollLeft = false;


// this is the number of items to fetch at a time
var chunkSize = 7;
// prefetch thresh-hold
var prefetchThreshold = 3;
// a growing list of items;
var items = new Array();
var map = new Map();

var debug = false;
// used for debugging when debug is true
var statusDiv;
var status2Div;

 
// event bound to the mouseOut event of both scroll buttons
function scrollDone() {
     scrollLeft = false;
     scrollRight = false;
}

// looping method for time out 
function scroll() {
     if (scrollRight) getNext();
     else if (scrollLeft) getPrevious();
}
 // do the value list pre-emptive fetching
 function prefetch() {
	 if (index >= prefetchThreshold) {
		 // find out the batch that is needed
		 //   this logic will be generally server based but 
		 //   is done here for this example 
		 var url;
		 if (index == 4 && items.length < 8) url = "catalog-2.xml";
		 if (index == 11 && items.length < 15) url = "catalog-3.xml";
		 if (index == 18 && items.length < 22) url = "catalog-4.xml";
	     
	     if (url) {
            var ajax = new AJAXInteraction(url, postProcess);
            ajax.doGet();
          } 
	 }
 }
  
 function showImage(itemId) {
     var i = map.get(itemId);
     var targetElement = document.getElementById("bodySpace");
     bodySpace.innerHTML = "<img src='" + i.image + "' width='500' height='370'>"
 }
 
 function getNext() {
    if (index >= tiles.length -1) return;
    scrollRight = true;
    offset = offset - scrollIncrement;
    drawTiles();
    setTimeout("scroll()", timeout);
 }
 
  function getPrevious() {
    scrollLeft = true;
    if (offset >= 0) return;
    offset = offset + scrollIncrement;
    drawTiles();
    setTimeout("scroll()", timeout);
 }
 
 function drawTiles() {
     // draw the first one if its off the screen
     // check if the far right image is out view
     var overHang;
     var temp = offset;
     index = Math.floor((offset)/thumbWidth); 
     overHang =  offset % thumbWidth;
     if (overHang < 0) overHang = overHang * -1;
     if (index < 0) index = index * -1;
     // check for next set of images
     prefetch();
     var startIndex = index;
     if (overHang > 0 && index >0) startIndex = index -1;
     var stopIndex = index + Math.round(displayPortSize / thumbWidth);    
     if (stopIndex > tiles.length) stopIndex = tiles.length;

     var displayX = 0;
	 for (var tl=startIndex; tl < stopIndex; tl++) {
           if (debug) statusDiv.innerHTML = "overhang=" + overHang +  " startIndex=" + startIndex + " stopIndex="  + stopIndex + " offset=" + offset + " displayX=" + displayX;
          if (overHang  > 0 && tl == startIndex) {
            // clip: rect(top right bottom left) - borders of the clipped area
            // clip the left
            var clipMe = 'rect(' + '0px,' + thumbWidth +  'px,'+  thumbHeight +'px,' +  overHang + 'px)';
            tiles[tl].style.clip = clipMe;
            tiles[tl].style.left = (tileX  - overHang) + "px";
            displayX = displayX + (thumbWidth - overHang);
          } else if (tl == stopIndex -1) {
            var underHang = displayPortSize - displayX ;
            if (underHang > 0 && underHang) {
                var clipMe = 'rect(' + '0px,' + (underHang) + "px," +  thumbHeight +'px,' +  0 + 'px)';
                tiles[tl].style.clip = clipMe;
                tiles[tl].style.left =  tileX + (offset + (tl * thumbWidth)) + 'px';
                tiles[tl].style.visibility = "visible";
                // resize the previous one to its real length
            } else if (underHang < 0 && tl > 0) {
                var clipMe = 'rect(' + '0px,' + (thumbWidth + underHang) + "px," +  thumbHeight +'px,' +  0 + 'px)';
                tiles[tl-1].style.clip = clipMe;
                tiles[tl-1].style.visibility = "visible";
                tiles[tl-1].style.left = tileX + (offset + ((tl -1) * thumbWidth)) + 'px';
            } else { 
                tiles[tl].style.left = '0px';
                tiles[tl].style.visibility = "hidden";
            }
          } else {
            displayX = displayX + thumbWidth;
            tiles[tl].style.left = tileX + (offset + (tl * thumbWidth)) + 'px';
            tiles[tl].style.visibility = "visible";
	      }	    	
	}
    if (stopIndex < tiles.length) {
        tiles[stopIndex].style.visibility = "hidden";
        tiles[stopIndex].style.left = "0px";
    }
 }

  function loadScroller() {
     var ua = navigator.userAgent.toLowerCase();
	 var targetRow = document.getElementById("targetRow");
	 injectionPoint = document.getElementById("injection_point");

     // for status output
     statusDiv = document.getElementById("status");
     status2Div = document.getElementById("status_2");
    
     var rightButton = document.getElementById("right_button");
     // this will need to be generic based on the right and left button image width
     var rightX = findX(rightButton) + displayPortSize - 55;
     rightButton.style.left = rightX  +  "px";   
     
     // this will need to be made generic depending on the thumb height
	 tileY = findY(rightButton)  - 40;
     tileX = findX(targetRow) + 1;
     // change the startX for safari
     if (ua.indexOf('safari') != -1) {
         tileX = tileX + 17;
         scrollIncrement = scrollIncrement + 5;
         timeout = 40;
     } else if (ua.indexOf('firefox')) {
         tileX = tileX + 7;
     }
     
     // load the first set of images
     var ajax = new AJAXInteraction("catalog-1.xml", postProcess);
     ajax.doGet();
 }

 function createTile(i) {
	var link = "javascript:showImage('" + i.id +"');";
    var div = document.createElement("div");
    div.className = "tile";
    div.id = i.id;
    div.innerHTML = "<a href=\"" + link + "\">" +
    				 "<img title='" + i.name + "' src='" + i.thumbnail + "' border='0' width='" + (thumbWidth - 6)+ "' height='" + thumbHeight+"'>" +
    				 "</a>";
	injectionPoint.appendChild(div);
    div.style.top = tileY + "px";
    tiles.push(div);
 }
 
 function postProcess(responseXML) {
     var startLength = items.length;
     var count = responseXML.getElementsByTagName("product").length;
     for (var loop=0; loop < count ; loop++) {
        var item = responseXML.getElementsByTagName("product")[loop];
        var itemId =  getElementText("id", item);
        var name =  getElementText("name", item);
        var thumbURL =  getElementText("img-tb-url", item);
        var imageURL =  getElementText("img-url", item);
        var description =  getElementText("description", item);
        var price = 0;
        var i = new Item(itemId ,name, thumbURL, imageURL, description,price);
        items.push(i);
        map.put(itemId, i);
        createTile(i);
        if (loop == 0) showImage(itemId);
     }
     drawTiles();
 }


function roll(target, imageURL) {
		if(document.images[target]) document.images[target].src = imageURL;
 }
 
function AJAXInteraction(url) {
   AJAXInteraction(url,null);
}

function AJAXInteraction(url, callback, type) {

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
          if (callback) {
              if (type && type == 'text') {
               callback(req.responseText);
              } else {
                  callback(req.responseXML);
              }
           }
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

function Item(id,name,thumbnail,image,description,price){
      this.id = id;
      this.image = image;
      this.thumbnail = thumbnail;
      this.name = name;
      this.description = description;
      this.price = price;
};