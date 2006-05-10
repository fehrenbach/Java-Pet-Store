/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: catalog.js,v 1.12 2006-05-10 19:58:42 gmurray71 Exp $ */

var ac;
var is;
var controller;

function initCatalog() {
    ac = new AccordionMenu();
    is = new ImageScroller();
    is.load();
    controller = new CatalogController();
    // wire in a listener for the rating component
    dojo.event.connect("before", bpui.rating, "doClick", controller, "modifyState");
    controller.initialize();    

}

function CatalogController() {
  dojo.event.topic.subscribe("/catalog", this, handleEvent);
  
  // this object structure contains a list of the products and chunks that have been loaded
  var pList = new ProductList();
  
  var CHUNK_SIZE=5;
  var initalRating;
  var initalItem;
  var originalURL;
  
  // using this for some browsers that do not support innerHTML
  var useDOMInjection = false;
  
  var infoName = document.getElementById("infopaneName");
  var infoRating = document.getElementById("infopaneRating");
  var infoPrice = document.getElementById("infopanePrice");
  var infoBuyNow = document.getElementById("infopaneBuyNow");
  var infoShortDescription =  document.getElementById("infopaneShortDescription");
  var infoDescription =  document.getElementById("infopaneDescription"); 
  // for paypal
  var buyNowAmount = document.getElementById("buyNow1_amount");
  var buyNowItemName = document.getElementById("buyNow1_item_name");
  
  function handleEvent(args) {
      if (args.type == "showingItem") {
        // update the id on the ratring component
        if (typeof bpui != 'undefined') {
            var groupId = is.getGroupId();
      	    window.location.href= originalURL +  "#" + groupId + "," + args.id;
            if (typeof bpui.rating != 'undefined') {
                // update the rating
                bpui.rating.state["rating"].bindings["itemId"]=args.id;
                bpui.rating.modifyDisplay("rating", args.rating, true);
                // get the currrent item
                showItemDetails(args.id);
            } else {
                initalItem = args.id;
                initalRating = args.rating;         
            }
        } else {
            // things haven't been loaded to set the inital rating
            initalItem = args.id;
            initalRating = args.rating;
        }
      } else if (args.type == "getChunck") {
          getChunck(args);
      } else if (args.type == "showItemDetails") {
          showProductDetails(args.productId, args.itemId);
      }  else if (args.type == "showProducts") {
          this.setProducts(args.productId);
      }
  }
  
  function showItemDetails(id) {
      var i = is.getItems().get(id);
      setNodeText(infoName, i.name);
      setNodeText(infoPrice, "$" + i.price);
      setNodeText(infoShortDescription, i.shortDescription);
      setNodeText(infoDescription, i.description);
      // update the paypal
      buyNowAmount.value = i.price;
      buyNowItemName.value = i.name;
  }
  
  function setNodeText(t, text) {
      if (useDOMInjection) {
            t.lastChild.nodeValue = text;
      } else {
          t.innerHTML = text;
      }
  }
  
  this.initialize = function() {
        // check whether the innerHTML changes can be used in the infopane
      infoName.innerHTML = "   ";
      if (!useDOMInjection && infoName.innerHTML != "   ") {
        useDOMInjection = true;
        infoName.appendChild(document.createTextNode("Name"));
        infoPrice.appendChild(document.createTextNode("$0.00"));
        infoShortDescription.appendChild(document.createTextNode("<description>"));
        infoDescription.appendChild(document.createTextNode("<description>"));
      }
      
      var ratingInstance = bpui.rating.state["rating"];
      ratingInstance.grade = initalRating;
      bpui.rating.state["rating"].bindings["itemId"]=initalItem;
      bpui.rating.modifyDisplay("rating", initalRating, true);
      loadAccordion();
  }
  
 
  this.modifyState = function(arg, rating) {
      var itemId = initalItem;
      if (typeof  bpui.rating.state["rating"].bindings["itemId"] != 'undefined') {
          itemId = bpui.rating.state["rating"].bindings["itemId"]; 
      }
      // set the cached rating to the new rating that was set.
      is.getItems().get(itemId).rating  = rating;
  }
  
  function loadAccordion () {
       
        // go out and get the categories
        // this should be made more geric
        var bindArgs = {
            url:  "/petstore/catalog?command=categories&format=json",
            mimetype: "text/json",
            load: function(type,json) {
               ac.load(json);
               processURLParameters();
             }
        };
        dojo.io.bind(bindArgs);
    }
    
    // this needs to happen after we have loaded the accordion data
    function processURLParameters() {
        originalURL = decodeURIComponent(window.location.href);
        var params = {};
        // look for the params
         if (originalURL.indexOf("#") != -1) {
            var qString = originalURL.split('#')[1];
            var args = qString.split(',');
            originalURL = originalURL.split('#')[0];
            ac.loadCategoryItem(args[0], args[1]);
            return;
    	} else if (originalURL.indexOf("?") != -1) {
            var qString = originalURL.split('?')[1];
            // get rid of any bookmarking stuff
            if (qString.indexOf("#") != -1) {
                qString = qString.split('#')[0];
                originalURL = originalURL.split('#')[0];
                window.location.href = originalURL;
            }
            ps = qString.split('&');
            // now go through and create the params map as an object literal
            for (var i in ps) {
                var t = ps[i].split('=');
                params[t[0]] = t[1];
            }
                   // first check for the item in product        
      		if (typeof params.itemId != 'undefined' &&
        	    typeof params.pid != 'undefined') {
         	   ac.loadCategoryItem(params.pid, params.itemId);
        	// next if there is a catid definition then do it
        	} else if (typeof params.catid != 'undefined') {
            	ac.showCategory(params.catid);
        	}
      	 // nothing is selected
        } else {
            ac.showFirstCategory();
        }
    }
  
  this.setProducts = function(pid) {
        is.reset();
        is.showProgressIndicator();
        if (pList.hasChunck(pid, 0)) {
            var items = pList.getChunck(pid, 0);
            is.addItems(items);
            is.setGroupId(pid);
            is.showImage(items[0].id);
        } else {
            var bindArgs = {
                url:  "/petstore/catalog?command=items&pid=" + pid + "&start=" + 0 + "&length=" + CHUNK_SIZE,
                mimetype: "text/xml",
                load: function(type,data,postProcessHandler) {
                    processProductData(data,true, pid, null,0);
                }
            };
            dojo.io.bind(bindArgs);
        }    
    }
    
    function showProductDetails(pid, itemId) {
        is.reset();
        is.showProgressIndicator();
        var bindArgs = {
            url:  "/petstore/catalog?command=itemInChunck&pid=" + pid + "&itemId=" + itemId + "&length=" + CHUNK_SIZE,
            mimetype: "text/xml",
            load: function(type,data,postProcessHandler) {
               processProductData(data,true, pid, itemId);
               showItemDetails(itemId);
               is.doMaximize();
             }
        };
        dojo.io.bind(bindArgs);          
    }
  
  // do the value list pre-emptive fetching
  function getChunck(args) {           
      is.showProgressIndicator(); 
      if (typeof debug != 'undefined') {
          document.getElementById("status").innerHTML = "url=" + "/petstore/catalog?command=items&pid=" + args.id + "&start=" +  args.index + "&length=" + CHUNK_SIZE;
      }
      // load the chunck data if we have it
      if (pList.hasChunck(args.id, args.currentChunck)) {
            if (typeof debug != 'undefined') {
                document.getElementById("status").innerHTML = "chunck from cache=" + args.id + "&currentChunck=" +  args.currentChunck;
            }
            is.addItems(pList.getChunck(args.id, args.currentChunck));
            is.setGroupId(args.id);
      } else {
          var bindArgs = {
                url:  "/petstore/catalog?command=items&pid=" + args.id + "&start=" +  args.index + "&length=" + CHUNK_SIZE,
                mimetype: "text/xml",
                load: function(type,data,postProcessHandler) {
                    processProductData(data,false, args.id, null, args.currentChunck);
                }
          };
          dojo.io.bind(bindArgs);
      }
   }
  
   function processProductData(responseXML, showImage, pid, iId, chunckId) {
        var items = [];
        var count = responseXML.getElementsByTagName("item").length;
        for (var loop=0; loop < count ; loop++) {

            var item = responseXML.getElementsByTagName("item")[loop];
            var itemId =  item.getElementsByTagName("id")[0].firstChild.nodeValue;
            var name =  item.getElementsByTagName("name")[0].firstChild.nodeValue;
            var thumbURL = item.getElementsByTagName("image-tb-url")[0].firstChild.nodeValue;
            var imageURL = item.getElementsByTagName("image-url")[0].firstChild.nodeValue;
            var description = item.getElementsByTagName("description")[0].firstChild.nodeValue;
            var price = item.getElementsByTagName("price")[0].firstChild.nodeValue;
            var rating = item.getElementsByTagName("rating")[0].firstChild.nodeValue;
            var shortDescription;
            if (description.length > 71) {
                shortDescription = description.substring(0,71) + "...";
            } else {
                shortDescription = description;
            }
            var i = {id: itemId, name: name, image: imageURL, thumbnail: thumbURL, shortDescription: shortDescription, description: description, price:price, rating: rating};
            items.push(i);
        }
        // cache the chuncks 
        if (typeof chunckId != 'undefined') {
            pList.addChunck(pid, chunckId, items);
        }
        is.addItems(items);
        if (showImage && iId == null) {
            is.setGroupId(pid);
            is.showImage(items[0].id);
        } else {
            is.setGroupId(pid);
            is.showImage(iId);
        }
        is.hideProgressIndicator();
    }
    
    function ProductList() {
        var _plist = this;
        var map = new Map();
        
        this.addChunck = function(pid, chunkNumber, items) {
            map.put(pid + "_" + chunkNumber, items, true);  
        }
        
        this.getChunck = function(pid, chunkNumber) {
            return map.get(pid + "_" + chunkNumber);  
        }
        
        this.hasChunck = function(pid, chunkNumber) {
            return (map.get(pid + "_" + chunkNumber) != null);  
        }

    }
    
    function Map() {
        
        var size = 0;
        var keys = [];
        var values = [];
        
        this.put = function(key,value, replace) {
            if (this.get(key) == null) {
                keys[size] = key; values[size] = value;
                size++;
            } else if (replace) {
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
}
