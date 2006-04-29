//window.onload = init;

var ac;
var is;
var listener;

function initCatalog() {

    is = new ImageScroller();
    is.load();
    listener = new CatalogController();
    // wire in a listener for the rating component
    dojo.event.connect("before", bpui.rating, "doClick", listener, "modifyState");
    listener.initialize();    
    ac = new AccordionMenu();
    ac.load();
}

function CatalogController() {
  dojo.event.topic.subscribe("/catalog", this, handleEvent);
  
  var CHUNK_SIZE=6;
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
                var i = is.getItems().get(args.id);
                infoName.innerHTML = i.name;
                infoPrice.innerHTML = i.price;
                infoShortDescription.innerHTML = i.shortDescription;
                infoDescription.innerHTML = i.description;
                // update the paypal
                buyNowAmount.value = i.price;
                buyNowItemName.value = i.name;
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
      }  else if (args.type == "showProducts") {
          this.setProducts(args.productId);
      }
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
        var url = "/petstore/catalog?command=items&pid=" + pid + "&start=" + 0 + "&length=" + CHUNK_SIZE;
        is.showProgressIndicator();
        var ajax = new AJAXInteraction(url, postProcess, function(){this.id = pid;is.setGroupId(this.id);}, true);
        ajax.doGet(); 
    }
  
  // do the value list pre-emptive fetching
  function getChunck(args) {           
      var url = "/petstore/catalog?command=items&pid=" + args.id+ "&start=" + args.index + "&length=" + CHUNK_SIZE;
      is.showProgressIndicator(); 
      alert("getting a chunck " + url);
      var ajax = new AJAXInteraction(url, postProcess);
      ajax.doGet(); 
  }
  
   function postProcess(responseXML, postProcessHandler, showImage) {
        var items = [];
        var count = responseXML.getElementsByTagName("item").length;
        for (var loop=0; loop < count ; loop++) {
            var item = responseXML.getElementsByTagName("item")[loop];
            var itemId =  getElementText("id", item);
            var name =  getElementText("name", item);
            var thumbURL =  getElementText("image-tb-url", item);
            var imageURL =  getElementText("image-url", item);
            var description =  getElementText("description", item);
            var price = getElementText("price", item);
            var rating = getElementText("rating", item);
            var i = {id: itemId, name: name, image: imageURL, thumbnail: thumbURL, description: description, price:price, rating: rating};
            items.push(i);
        }
        is.addItems(items);
        if (showImage) {
          is.showImage(items[0].id);
        }
        is.hideProgressIndicator();
        if (typeof postProcessHandler != 'undefined') {
            postProcessHandler();
        }
    }
          
    function AJAXInteraction(url, callback, postProcessHandler, showImage) {
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
                        callback(req.responseXML, postProcessHandler, showImage);
                    }
                }
            }
        }
        
        this.doGet = function() {
            req.open("GET", url, true);
            req.send(null);
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
}
