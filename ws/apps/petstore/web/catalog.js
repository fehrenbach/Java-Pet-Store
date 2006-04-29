
var ac;
var is;
var listener;

function initCatalog() {

    is = new ImageScroller();
    is.load();
    listener = new CatalogListener();
    dojo.event.connect("before", bpui.rating, "doClick", listener, "modifyState");
    listener.initialize();    
    ac = new AccordionMenu();
    ac.load();
}

function CatalogListener() {
  dojo.event.topic.subscribe("/scroller", this, handleEvent);
  
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
                infoPrice.innerHTML = "$" + i.price;
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
}
