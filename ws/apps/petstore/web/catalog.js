//window.onload = init;

var ac;
var is;
var controller;

function initCatalog() {

    is = new ImageScroller();
    is.load();
    controller = new CatalogController();
    // wire in a listener for the rating component
    dojo.event.connect("before", bpui.rating, "doClick", controller, "modifyState");
    controller.initialize();    
    ac = new AccordionMenu();
    ac.load();
}

function CatalogController() {
  dojo.event.topic.subscribe("/catalog", this, handleEvent);
  
  var CHUNK_SIZE=4;
  var initalRating;
  var initalItem;
  
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
      infoName.innerHTML = i.name;
      infoPrice.innerHTML = "$" + i.price;
      infoShortDescription.innerHTML = i.shortDescription;
      infoDescription.innerHTML = i.description;
      // update the paypal
      buyNowAmount.value = i.price;
      buyNowItemName.value = i.name;
  }
  
  this.initialize = function() {
      var ratingInstance = bpui.rating.state["rating"];
      ratingInstance.grade = initalRating;
      bpui.rating.state["rating"].bindings["itemId"]=initalItem;
      bpui.rating.modifyDisplay("rating", initalRating, true);
  }
  
  this.modifyState = function(arg, rating) {
      var itemId = initalItem;
      if (typeof  bpui.rating.state["rating"].bindings["itemId"] != 'undefined') {
          itemId = bpui.rating.state["rating"].bindings["itemId"]; 
      }
      // set the cached rating to the new rating that was set.
      is.getItems().get(itemId).rating  = rating;
  }
  
  this.setProducts = function(pid) {
        is.reset();
        is.showProgressIndicator();
        var bindArgs = {
            url:  "/petstore/catalog?command=items&pid=" + pid + "&start=" + 0 + "&length=" + CHUNK_SIZE,
            mimetype: "text/xml",
            load: function(type,data,postProcessHandler) {
               postProcess(data,true, pid);
             }
        };
        dojo.io.bind(bindArgs);    
    }
    
    function showProductDetails(pid, itemId) {
        is.reset();
        is.showProgressIndicator();
        var bindArgs = {
            url:  "/petstore/catalog?command=itemInChunck&pid=" + pid + "&itemId=" + itemId + "&length=" + CHUNK_SIZE,
            mimetype: "text/xml",
            load: function(type,data,postProcessHandler) {
               postProcess(data,true, pid, itemId);
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
      var bindArgs = {
            url:  "/petstore/catalog?command=items&pid=" + args.id + "&start=" +  args.index + "&length=" + CHUNK_SIZE,
            mimetype: "text/xml",
            load: function(type,data,postProcessHandler) {
                postProcess(data,false);
            }
      };
      dojo.io.bind(bindArgs);
   }
  
   function postProcess(responseXML, showImage, pid, iId) {
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
        is.addItems(items);
        if (showImage && !iId) {
            is.showImage(items[0].id);
            is.setGroupId(pid);
        } else {
            is.showImage(iId);
            is.setGroupId(pid);
        }
        is.hideProgressIndicator();
    }
}
