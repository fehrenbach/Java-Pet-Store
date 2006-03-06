/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: scroller.js,v 1.5 2006-03-06 09:45:31 gmurray71 Exp $
*/

function ImageScroller() {
    
    var isIE;
    
    // default sizes
    
    var VIEWPORT_WIDTH = 500;
    var IMAGEPANE_WIDTH = 500;
    var IMAGEPANE_HEIGHT = 360;
    var INFOPANE_DEFAULT_HEIGHT = 50;
    var INFOPANE_EXPAND_HEIGHT = 55;
    var THUMB_WIDTH = 100;
    var THUMB_HEIGHT = 75;
    
    var IMAGE_PANE_ID = "imagePane";
    var IMAGE_PANE_BUFFER_ID = "imageBufferPane";

    var PADDING = 3;
    
    var MINIMIZE_IMG_URI = "images/minimize.gif";
    var MAXIMIZE_IMG_URI = "images/maximize.gif";
    var INDICATOR_IMG_URI = "images/indicator-black.gif";
    var MAXIMIZE_IMG_TOOLTIP = "Show Details";
    var MINIMIZE_IMG_TOOLTIP = "Show Less Details";
    
    // this is an array of the tiles which are divs for each thumb
    var tiles = [];
    
    var injectionPoint;
    
    // for scrolling

    var SCROLL_INCREMENT = 5;
    var INFOPANE_INCREMENT = 3;
    var tileY;
    var tileX;
    // this is the index of the image tile on the far left
    var index = 0;
    // keeps track how for the scroll has gone 
    var offset = 0;
       
    var timeout = 25; // in ms
    var isScrollingRight = false;
    var isScrollingLeft = false;
    
    // large image pane
    var imagePane;
    var loadingPane;
    // images 
    var minimizeImage;

    var indicatorImage;
    var leftButton;
    var rightButton;
    
    // infopane
    var infoPane;
    var infoTable;
    var infoTableName;
    var infoTableShortDescription;
    var infoTableDescription;
    var infoTablePrice;
    var infoTableMinimize;
    var indicatorCell;
    var minimizeLink;
    var infoPaneLoop = 0;
    var maximizing = false;
    var minimizing = false;
    var maximized = false;

    // this is the number of items to fetch at a time
    var chunkSize = 7;
    // prefetch thresh-hold
    var prefetchThreshold = 3;
    // a growing list of items;
    var items = [];
    var map = new Map();
    
    var debug = false;
    // used for debugging when debug is true
    var statusDiv;
    var status2Div;
    var showingBuffer = false;
    var imageBuffer;

    
    // detect a resize of the window
    window.onresize=resized;
    document.addEventListener("DOMContentLoaded", contentLoaded, null);
    
    function contentLoaded() {
        alert("gotSomething");
        statusDiv.innerHTML = "got something";
    }
    
    /**
     *  Insert a script tag in the head of the document which will inter load the flicker photos
     *  and call jsonFlickrFeed(obj) with the corresponding object.
     *
    */
    this.getFlickrPhotos = function(tags) {
        indicatorImage.style.visibility = "visible";
        var tag = "";
        resetTitles()
        tiles = [];
        index = 0;
        offset = 0;
        map.clear();
        leftButton.style.visibility="hidden";
        rightButton.style.visibility="visible";
        for (var l=0; l < tags.length; l++) {

            tag = tag + tags[l];
            if (l < (tags.length -1)) {
                tag = tag + ",";
            }
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://www.flickr.com/services/feeds/photos_public.gne?tags=" + tag + "&format=json";
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    
    this.addFlickr = function(obj) {
        var flickrPhotos = obj;
        // get info from the JSON object
        for (var l=0; l < flickrPhotos.items.length; l++) {
            var itemId = "flickr_" + l;
            var description = flickrPhotos.items[l].description;            
            var start = description.indexOf("src=") + 10;
            var stop =  description.indexOf("_m.jpg");
            var imageBase = description.substring(start,stop);
            var thumbURL = imageBase + "_m.jpg";
            var imageURL = imageBase + ".jpg";
            description = flickrPhotos.items[l].tags;
            var shortDescription = flickrPhotos.items[l].author;
            var price = 0;
            var name = flickrPhotos.items[l].title;
            var i = new Item(itemId ,name, thumbURL, imageURL, description, shortDescription,price);
            items.push(i);
            map.put(itemId, i);
            createTile(i);
            if (l == 0) {
                showImage(itemId);
            }
        }
        drawTiles();
        indicatorImage.style.visibility = "hidden";
    }
    
    function resetTitles() {
        for (var l = 0; l < tiles.length; l++) {
            tiles[l].parentNode.removeChild(tiles[l]);
        }
    } 
    
    // event bound to the mouseOut event of both scroll buttons
    function scrollDone() {
        isScrollingLeft = false;
        isScrollingRight = false;
    }
    
    // looping method for time out 
    function scroll() {
        if (isScrollingRight) scrollRight();
        else if (isScrollingLeft) scrollLeft();
    }
    // do the value list pre-emptive fetching
    function prefetch() {
        if (index >= prefetchThreshold) {
            // find out the batch that is needed
            //   this logic will be generally server based but 
            //   is done here for this example 
            var url;
            if (index == 3 && items.length < 8) url = "catalog-2.xml";
            if (index == 10 && items.length < 15) url = "catalog-3.xml";
            if (index == 16 && items.length < 22) url = "catalog-4.xml";
            
            if (url) {
                showProgressIndicator();
                var ajax = new AJAXInteraction(url, postProcess);
                ajax.doGet();
            } 
        }
    }
    
    function showProgressIndicator() {
        indicatorImage.style.visibility = "visible";
    }
    

    function hideProgressIndicator() {
        indicatorImage.style.visibility = "hidden";
    }
    
    function postImageLoad(loadIntoBuffer) {
        var id;
        if (debug) {
            status2Div.innerHTML = "LOADED " + loadIntoBuffer + " " + url;
        }
        hideProgressIndicator();
        if (loadIntoBuffer) {
            imageLoadingPane.src = imageBuffer.src;
        } else {
           imagePane.src = imageBuffer.src;

        }
        crossFade(0,loadIntoBuffer );
    }

    function showImage(itemId) {
        setTimeout(showProgressIndicator,0);
        var i = map.get(itemId);
        // create the image pane and append the description nodes
        // asumption is that if the imagePane is not set neigher are the info children
        if (!imagePane) {
            imagePane = document.createElement("img");
            imagePane.style.width = IMAGEPANE_WIDTH + "px";
            imagePane.style.height = IMAGEPANE_HEIGHT  + "px";
            imagePane.id = IMAGE_PANE_ID;
            var targetElement = document.getElementById("bodySpace");
            imageLoadingPane = document.createElement("img");
            imageLoadingPane.style.position = "absolute";
            imageLoadingPane.style.visibility = "hidden";
            imageLoadingPane.style.width = IMAGEPANE_WIDTH + "px";
            imageLoadingPane.style.height = IMAGEPANE_HEIGHT  + "px";
            imageLoadingPane.id = IMAGE_PANE_BUFFER_ID;
            targetElement.appendChild(imagePane);
            targetElement.appendChild(imageLoadingPane);
            imageLoadingPane.style.left = tileX + "px";
            
            
            infoTableName.appendChild(document.createTextNode(i.name));
            infoTableShortDescription.appendChild(document.createTextNode(i.shortDescription));
            infoTableDescription.appendChild(document.createTextNode(i.description));
            loadImage(i.image, false);
        } else {
             imageLoadingPane.style.visibility = "visible";
             infoTableName.lastChild.nodeValue = i.name;
             infoTableDescription.lastChild.nodeValue = i.description;
             infoTableShortDescription.lastChild.nodeValue = i.shortDescription;
             
             if (showingBuffer) {

                 showingBuffer = false;
             } else {
                 showingBuffer = true;
             }
             loadImage(i.image, showingBuffer);
        }
    }
    
    function loadImage(url, loadIntoBuffer) {
        imageBuffer = new Image();
        if (loadIntoBuffer) {
            imageBuffer.src = url;
            imageLoadingPane.onLoad = setTimeout(function(){this.url=url;this.loadIntoBuffer = loadIntoBuffer;postImageLoad(loadIntoBuffer,url);},0);
        } else {
            imageBuffer.src = url;
            imageBuffer.onLoad = setTimeout(function(){this.url = url;this.loadIntoBuffer = loadIntoBuffer;postImageLoad(loadIntoBuffer,url);},0);
        }
        
    }
    
    function setOpacity(opacity, id) {
        var target = document.getElementById(id);
        if (isIE) {
            target.style.filter = "alpha(opacity:" + percentage + ")"; 
        } else {
            target.style.opacity = opacity/100;
        }            
    }
    
    function fadeOut(percentage, id) {
        var opacity = Number(percentage);
        setOpacity(percentage, id);
        if (opacity > 10) {
             statusDiv.innerHTML = "fadeOut percentage=" + opacity;
            opacity = opacity - 10;
            setTimeout(function(){this.opacity = opacity;fadeOut(opacity,id);}, 150);
        }
    }
    
    function crossFade(count,loadIntoBuffer) {
       var percentage = Number(count);
        if (loadIntoBuffer) {
            setOpacity(100 - percentage, IMAGE_PANE_ID);
            setOpacity(percentage, IMAGE_PANE_BUFFER_ID);
        } else {
            setOpacity(100 - percentage, IMAGE_PANE_BUFFER_ID);
            setOpacity(percentage, IMAGE_PANE_ID);

        }
       // statusDiv.innerHTML = "crossfade percentage=" + percentage;
       if (percentage < 100) {
            percentage = percentage + 10;
            setTimeout(function(){this.loadIntoBuffer = loadIntoBuffer;this.percentage = percentage;crossFade(percentage,loadIntoBuffer);}, 25);
        }
    }
    
    
    // calling this function will result in the maximizing event being fired
    // if the pane is maximized it will asume the event want to minimize
    function doMaximize() {
        if (!maximizing && !minimizing && !maximized) {
            maximizing = true;
            minimizing = false;
        } else if (!maximizing && !minimizing) {
            minimizing = true;
            maximizing = false;
        }
        setTimeout(changeInfoPane, 0);
    }
    
    // will handle either minimizing or maximing but not both
    // this method is called recursively until the maximinging 
    // or minimizing is done.
    function changeInfoPane() {
        if (maximizing) {
            maxmizeInfoPane();
        } else if (minimizing) {
            minimizeInfoPane();
        }
    }
    
    function maxmizeInfoPane() {
        if (infoPaneLoop < INFOPANE_EXPAND_HEIGHT) {
            infoPaneLoop = infoPaneLoop + INFOPANE_INCREMENT;
            var vHeight = (INFOPANE_EXPAND_HEIGHT + infoPaneLoop);
            var clipMe = 'rect(' + '0px,' + VIEWPORT_WIDTH +  'px,'+  vHeight +'px,' +  0 + 'px)';
            infoPane.style.clip = clipMe;
            infoPane.style.height = vHeight;
            infoPane.style.top = (tileY - PADDING) - vHeight;
            setTimeout(changeInfoPane, 5);
        } else {
            minimizeImage.src= MINIMIZE_IMG_URI;
            minimizeLink.title = MINIMIZE_IMG_TOOLTIP;
            maximized = true;
            maximizing = false;
            minimizing = false;
        }
    }
    
    function minimizeInfoPane() {
       if (infoPaneLoop > (0 - INFOPANE_INCREMENT)) {
            infoPaneLoop = infoPaneLoop - INFOPANE_INCREMENT;
            var vHeight = (INFOPANE_EXPAND_HEIGHT + infoPaneLoop);
            var clipMe = 'rect(' + '0px,' + VIEWPORT_WIDTH +  'px,'+  vHeight +'px,' +  0 + 'px)';
            infoPane.style.clip = clipMe;
            infoPane.style.height = vHeight;
            infoPane.style.top = (tileY - PADDING) - vHeight;
            setTimeout(changeInfoPane, 5);
        } else {
            minimizeImage.src= MAXIMIZE_IMG_URI;
            minimizeLink.title = MAXIMIZE_IMG_TOOLTIP;
            maximizing = false;
            minimizing = false;
            maximized = false;
        }
    }
    
    function scrollRight() {
        isScrollingRight = true;
        if (index >= tiles.length) {
            // hide the rightButton
            rightButton.style.visibility="hidden";
            return;
        } else {
            leftButton.style.visibility="visible";
        }
        offset = offset - SCROLL_INCREMENT;
        drawTiles();
        setTimeout(scroll, timeout);
    }
    
    function getNext() {
        isScrollingRight = true;
        setTimeout(scroll, timeout);
    }
    

    function getPrevious () {
        isScrollingLeft = true;
        setTimeout(scroll, timeout);
    }
    
    function scrollLeft() {
        if (offset >= 0) {
            leftButton.style.visibility="hidden";
            return;
        } else {
            leftButton.style.visibility="visible";
        }
        offset = offset + SCROLL_INCREMENT;
        drawTiles();
        setTimeout(scroll, timeout);
    }
    
    function drawTiles() {
        // draw the first one if its off the screen
        // check if the far right image is out view
        var overHang;
        var temp = offset;
        index = Math.floor((offset)/THUMB_WIDTH); 
        overHang =  offset % THUMB_WIDTH;
        if (overHang < 0) {
            overHang = overHang * -1;
        }
        if (index < 0) {
            index = index * -1;
        }
        // check for next set of images
        prefetch();
        var startIndex = index;
        if (overHang > 0 && index >0) {
            startIndex = index -1;
        }
        var stopIndex = index + Math.round(VIEWPORT_WIDTH / THUMB_WIDTH);    
        if (stopIndex > tiles.length) {
            stopIndex = tiles.length;
        }
        var displayX = 0;
        for (var tl=startIndex; tl < stopIndex; tl++) {
            if (debug) {
             statusDiv.innerHTML = "overhang=" + overHang +  " startIndex=" + startIndex + " stopIndex="  + stopIndex + " offset=" + offset + " displayX=" + displayX;
            }
            if (overHang  > 0 && tl == startIndex) {
                rightButton.style.visibility="visible";
                // clip: rect(top right bottom left) - borders of the clipped area
                // clip the left
                var clipMe = 'rect(' + '0px,' + THUMB_WIDTH +  'px,'+  THUMB_HEIGHT +'px,' +  overHang + 'px)';
                tiles[tl].style.clip = clipMe;
                tiles[tl].style.left = (tileX  - overHang) + "px";
                displayX = displayX + (THUMB_WIDTH - overHang);
            } else if (tl == stopIndex -1) {
                var underHang = VIEWPORT_WIDTH - displayX ;
                if (underHang > 0 && underHang) {
                    var clipMe = 'rect(' + '0px,' + (underHang) + "px," + THUMB_HEIGHT +'px,' +  0 + 'px)';
                    tiles[tl].style.clip = clipMe;
                    tiles[tl].style.left =  tileX + (offset + (tl * THUMB_WIDTH)) + 'px';
                    tiles[tl].style.visibility = "visible";
                    // resize the previous one to its real length
                } else if (underHang < 0 && tl > 0) {
                    var clipMe = 'rect(' + '0px,' + (THUMB_WIDTH + underHang) + "px," + THUMB_HEIGHT +'px,' +  0 + 'px)';
                    tiles[tl-1].style.clip = clipMe;
                    tiles[tl-1].style.visibility = "visible";
                    tiles[tl-1].style.left = tileX + (offset + ((tl -1) * THUMB_WIDTH)) + 'px';
                } else { 
                    tiles[tl].style.left = '0px';
                    tiles[tl].style.visibility = "hidden";
                }
            } else {
                displayX = displayX + THUMB_WIDTH;
                tiles[tl].style.left = tileX + (offset + (tl * THUMB_WIDTH)) + 'px';
                tiles[tl].style.visibility = "visible";
            }	    	
        }
        if (stopIndex < tiles.length) {
            tiles[stopIndex].style.visibility = "hidden";
            tiles[stopIndex].style.left = "0px";
        }
    }
    
    this.load = function () {
        
        var targetRow = document.getElementById("targetRow");
        injectionPoint = document.getElementById("injection_point");
        
        // for status output
        statusDiv = document.getElementById("status");
        status2Div = document.getElementById("status_2");


        layout();
        
        // load the first set of images
        var ajax = new AJAXInteraction("catalog-1.xml", postProcess);
        ajax.doGet();
    }
    
    function layout() {
        var ua = navigator.userAgent.toLowerCase();
        rightButton = document.getElementById("right_button");
        leftButton = document.getElementById("left_button");
        leftButton.style.visibility="hidden";
        // this will need to be generic based on the right and left button image width
        var rightX = findX(rightButton) + VIEWPORT_WIDTH - 20;
        rightButton.style.left = rightX  +  "px";


        // this will need to be made generic depending on the thumb height
        tileY = findY(leftButton)  - 37;
        tileX = findX(targetRow) + 1;
        
        var  buttonY = findY(rightButton) + 12
        rightButton.style.top = buttonY + "px";
        leftButton.style.top = buttonY + "px";
        
        if (ua.indexOf('ie') != -1) {
            isIE = true;
        } else if (ua.indexOf('safari') != -1) {
            tileX = tileX + 17;
            //SCROLL_INCREMENT = SCROLL_INCREMENT + 5;
            timeout = 20;
        } else if (ua.indexOf('firefox')) {
            tileX = tileX + 7;
        }

        if (isIE) {
                rightButton.attachEvent('onmouseover',function(e){scrollDone();getNext();});
                rightButton.attachEvent('onmouseout',function(e){scrollDone();});
                leftButton.attachEvent('onmouseover',function(e){scrollDone();getPrevious();});
                leftButton.attachEvent('onmouseout',function(e){scrollDone();});
            } else {
                rightButton.addEventListener('mouseover',function(e){scrollDone();getNext();}, false);
                rightButton.addEventListener('mouseout',function(e){scrollDone();}, false);
                leftButton.addEventListener('mouseover',function(e){scrollDone();getPrevious();}, false);
                leftButton.addEventListener('mouseout',function(e){scrollDone();}, false);
            }
        drawTiles();
        createInfoPane();
    }
    
    function createInfoPane() {
	    infoPane = document.createElement("div");
        infoPane.className = "infopane";
        infoPane.style.width = VIEWPORT_WIDTH + "px";
        // give room for 4 pixels above and below
        infoPane.style.height = (INFOPANE_DEFAULT_HEIGHT) + "px";
        // give 3px padding for a border
        infoPane.style.top = (tileY - (INFOPANE_DEFAULT_HEIGHT) - 5) + "px";
        infoPane.style.left = tileX + "px";
        infoTable = document.createElement("table");
        infoTable.className = "infopaneTable";
        var row;
        var row2
        var row3;

        if (isIE) {
            row = infoTable.insertRow(0);
            row2 = infoTable.insertRow(1);
            var blankRow = infoTable.insertRow(2);
            blankRow.style.height = "20px";
            row3 = infoTable.insertRow(3);
            var blankCell = blankRow.insertCell(0);
            blankCell.appendChild(document.createTextNode(""));
            infoTableName = row.insertCell(0);
            row.insertCell(1);
            infoTableMinimize = row.insertCell(2);
            infoTableShortDescription = row2.insertCell(0);
            infoTablePrice = row2.insertCell(1);
            indicatorCell = row2.insertCell(2);
            infoTableDescription = row3.insertCell(0);
        } else {
            row = document.createElement("tr");
            row2 = document.createElement("tr");
            
            var blankRow = document.createElement("tr");
            //blankRow.setAttribute("colspan", "2");
            var blankCell = document.createElement("td");
            blankCell.appendChild(document.createTextNode(""));
            blankRow.appendChild(blankCell);
            blankRow.style.height = "20px";
            row3 = document.createElement("tr");
            infoTableName = document.createElement("td");
            row.appendChild(infoTableName);
            infoTableMinimize =  document.createElement("td");
            row.appendChild(infoTableMinimize);
            infoTableShortDescription = document.createElement("td");
            row2.appendChild(infoTableShortDescription);
            infoTablePrice = document.createElement("td");
            row2.appendChild(infoTablePrice);
            
            indicatorCell = document.createElement("td");
            infoTableMinimize.style.paddingLeft = "6px";
            row2.appendChild(indicatorCell);
            
            infoTableDescription =  document.createElement("td");
            row3.appendChild(infoTableDescription);
            
            infoTable.appendChild(row);
            infoTable.appendChild(row2);
            infoTable.appendChild(blankRow);
            infoTable.appendChild(row3);
        }
        
        infoTableName.className = "infopaneTitle";
        infoTableName.style.width = (VIEWPORT_WIDTH - 25) + "px";
        infoTableShortDescription.className = "infopaneText";
        infoTableDescription.className = "infopaneDescriptionText";
        infoTablePrice.className = "infopaneText";
        infoTableMinimize.setAttribute("colspan", "2");

        indicatorCell.style.width = (10) + "px";
        indicatorImage = document.createElement("img");
        indicatorImage.className = "infopaneIndicator";
        indicatorImage.src = INDICATOR_IMG_URI;
        indicatorImage.style.visibility = "hidden";
        indicatorCell.appendChild(indicatorImage);
        
        minimizeLink = document.createElement("a");
        minimizeLink.className = "infopaneLink";
        minimizeLink.title = MAXIMIZE_IMG_TOOLTIP;
        minimizeImage = document.createElement("img");
        minimizeImage.src= MAXIMIZE_IMG_URI;
        minimizeLink.appendChild(minimizeImage);
        infoTableMinimize.appendChild(minimizeLink);
        
        if (isIE) {
            minimizeLink.attachEvent("onclick",function(e){doMaximize();});
        } else {
            minimizeLink.addEventListener("click",function(e){doMaximize();}, true);
        }
        

        
        var clipMe = 'rect(' + '0px,' + VIEWPORT_WIDTH +  'px,'+  INFOPANE_EXPAND_HEIGHT +'px,' +  0 + 'px)';
        infoPane.style.clip = clipMe;


        infoPane.appendChild(infoTable);
        injectionPoint.appendChild(infoPane);
	}
    
    function createTile(i) {
        var div = document.createElement("div");
        div.className = "tile";
        div.id = i.id;
        var link = document.createElement("a");
        var img = document.createElement("img");
        img.title = i.name;
        img.src = i.thumbnail;
        img.className = "tileImage";
        link.appendChild(img);
        link.setAttribute("id", i.id);
        if (isIE) {
            div.attachEvent('onclick',function(e){this.id = div.id; showImage(this.id, false);});
        } else {
            link.addEventListener('click',function(e){this.id = div.id; showImage(this.id, false);}, true);
        }
        div.appendChild(link);
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
            var sDescription =  getElementText("description", item);
            var price = 0;
            var i = new Item(itemId ,name, thumbURL, imageURL,"", sDescription, price);
            items.push(i);
            map.put(itemId, i);
            createTile(i);
            if (loop == 0) {
                showImage(itemId);
            }
        }
        drawTiles();
        indicatorImage.style.visibility = "hidden";
    }
    
    
    this.roll = function(target, imageURL) {
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
    
    function resized() {
        layout();
    }
    
    
    
    function Map() {
        
        var size = 0;
        var keys = [];
        var values = [];
        
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
        
        this.clear = function() {
            size = 0;
            keys = [];
            values = [];
        }
    }
    
    function Item(id,name,thumbnail,image,description,shortDescription,price){
        this.id = id;
        this.name= name;
        this.image = image;
        this.thumbnail = thumbnail;
        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;
        this.price = price;
    }
    
}