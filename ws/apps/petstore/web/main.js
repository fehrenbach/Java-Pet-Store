var isIE;
var gcats = new Map();
var chunkSize = 3;

var bodyRowText;
var itemsElement;

// internal objects
var account;
var cart;
var signin;
var account;
var creditCard;
var progressbar;

var checkingOut = false;

window.onresize=resized;

// register this to give us a way to turn off the autocomplete when
// a user clicks somewhere on the screen.
window.onclick = handleMouseClick;

dojo.require("dojo.widget.FisheyeList");

dojo.hostenv.writeIncludes();
dojo.addOnLoad(function () {
init();
showMain();});

function handleMouseClick() {
    clearAutocompletionResults();
    return true;
}

function browse(category) {
    window.location.href="catalog.html?catid=" + category;
}

function loadPetstore() {
    init();
    showMain();
}

function init() {
    engine = new Engine();
    if (navigator.userAgent.indexOf("IE") != -1) isIE = true;
    var completeField = document.getElementById("complete-field");
    var autorow = document.getElementById("menu-popup");
    autorow.style.top = findY(completeField) + completeField.offsetHeight +  "px";
    autorow.style.left = findX(completeField)  +  "px";
    // load the cart
    var cartArgs = {
            template: "cart.htmf",
            script: "cart.js",
            initFunction : cartCallback
    };
    engine.inject(cartArgs);
    // load signin
    var signinArgs = {
           template: "signin.htmf",
           script: "signin.js",
           initFunction: signinCallback
    };
    engine.inject(signinArgs);  
}

function resized() {
    // reposition the autocomplete
    var completeField = $("complete-field");
    var autorow = $("menu-popup");
    if (autorow && completeField) {
        autorow.style.top = findY(completeField) + completeField.offsetHeight +  "px";
        autorow.style.left = findX(completeField)  +  "px";
    }
    // reposition the cart to the right
    var cartPop = $("cart-popup");
    if (cartPop) {
        var winX = 430;
        if (!isIE) winX = window.innerWidth - 228;
        else winX = document.body.offsetWidth - 228;
        cartPop.style.top="140px";
        cartPop.style.left= winX +"px";
    }
}

function checkout() {
 	showProgressbar();
}

function processCheckoutCallback(responseXML) {
    var item = responseXML.getElementsByTagName("message")[0];
    showProgressBar(item.firstChild.nodeValue);
}

function showMain() {
    engine.inject({template: "main.htmf", injectionPoint: $("bodyCenter")});
}

function progressbarCallback(type,data) {
	window.eval(data);
	progressbar = new Progressbar();
    progressbar.init();
    progressbar.show();
    progressbar.start();
}

function showProgressbar() {
    injectArgs = {
             template: "progressbar.htmf",
             script: "progressbar.js",
             initFunction: progressbarCallback
    }
    engine.inject(injectArgs);
}

function cartCallback(type, data) {
   eval(data);
   cart = new Cart();
   cart.init();
   cart.show();
}

function signinCallback(type, data) {
   window.eval(data);
   signin = new Signin();
   signin.init();
}

function accountCallback(type, data) {
   window.eval(data);
   account = new Account();
   account.init();
   account.show();
}

function creditCardCallback(type,data) {
	window.eval(data);
    creditCard = new CreditCard();
    creditCard.init();
    creditCard.show();
}

function loadCreditCard() {
    var creditCardArgs = {
            template: "creditcard.htmf",
            script: "creditcard.js",
            initFunction: creditCardCallback
    };
    engine.inject(creditCardArgs);
}

function loadAccount() {
	signin.hide();
    var accountArgs = {
            url: "faces/address.jsp",
            script: "account.js",
            initFunction: accountCallback
    };
    engine.inject(accountArgs);
}

function showAccount() {
    if (signin && signin.isSignedIn()) {
	    if (account) {
		   account.show();
		} else {
		    loadAccount();	
		}
	} else {
	    signin.show();
	}
}

function accountCallback2(type, data) {
   window.eval(data);
   dojo.require("dojo.widget.Accordion");
   dojo.hostenv.makeWidgets();
   account = new Account();
   account.init();
}

function loadAccount2() {
	signin.hide();
    var accountArgs = {
            url: "faces/accountpane.jsp",
            script: "accountpane.js",
            injectionPoint: $("bodyCenter"),
            initFunction: accountCallback2
    };
    engine.inject(accountArgs);
}

function showAccount2() {
   loadAccount2();
}

function showCreditCard() {
	account.hide();
    if (!creditCard) {
	    loadCreditCard();    
	} else {
	    creditCard.show();
	}
}

function doSearch() {
	var completeTable = $("completeTable");
	var completeField = $("complete-field");
    if (completeField.value == "") {
    } else {
       var bindArgs = {
            url:  "autocomplete?action=complete&id=" + encodeURI(completeField.value),
            mimetype: "text/xml",
            load: function(type, data) {
               processSearch(data);
             }
        };
        dojo.io.bind(bindArgs);
    }
    clearAutocompletionResults();
}

function doCompletion() {
    var completeField = $("complete-field");
    if (completeField && completeField.value == "") {
        clearAutocompletionResults();
    } else {
        clearAutocompletionResults();
        var bindArgs = {
            url:  "autocomplete?action=complete&id=" + encodeURI(completeField.value),
            mimetype: "text/xml",
            load: function(type, data) {
               autocompleteCallback(data);
             }
        };
        dojo.io.bind(bindArgs);
    }
}

function autocompleteCallback(responseXML) {
    var items = responseXML.getElementsByTagName("id");
    var completeText = "";
    if (items.length <= 0) {
        clearAutocompletionResults();
        clearNodes("completeTable");
    }  else {
        clearNodes("completeTable");
        for (loop = 0; loop < items.length; loop++) {
            var id = responseXML.getElementsByTagName("id")[loop].childNodes[0].nodeValue;
            var name = responseXML.getElementsByTagName("name")[loop].childNodes[0].nodeValue;
            completeText += "<tr>" +
                        "<td class=\"popupRow\" onmouseover=\"this.className='popupRowHover'\"" +
                        " onmouseout=\"this.className='popupRow'\"" +
                        "<a onclick=\"showSearchItem('" + id + "');return false;\">" + name + "</a>" +
                       "</td></tr>";
        }
        var completeTable = $("completeTable");
        completeTable.innerHTML = completeText;
        completeTable.style.visibility='visible';
    }
}

function clearAutocompletionResults() {
    var popUp = $("menu-popup");
    var completeTable = $("completeTable");
    completeTable.style.visibility='hidden';
    clearNodes("completeTable");
}


function loadCategoriesCallback(responseXML) {
	var categories = responseXML.getElementsByTagName("id");
    var id = responseXML.getElementsByTagName("id")[0].childNodes[0].nodeValue;
    for (var loop = 0; loop < categories.length; loop++) {
      var itemId = responseXML.getElementsByTagName("id")[loop];
      var itemValue = responseXML.getElementsByTagName("name")[loop];
      var itemSrc = responseXML.getElementsByTagName("image-url")[loop];
      addCategory(itemId.childNodes[0].nodeValue, itemValue.childNodes[0].nodeValue, itemSrc.childNodes[0].nodeValue);
    }
}

function loadCategory(catid) {
    if (gcats.get(catid) == null) {
        var bindArgs = {
            url:  "catalog?command=category&catid=" + catid,
            mimetype: "text/xml",
            load: function(type, data) {
               loadCategoryCallback(catid,data);
             }
        };
        dojo.io.bind(bindArgs);
    } else {
        showCategoryItems(catid,0,chunkSize);
    }
}

function processSearch(responseXML) {
	var categories = responseXML.getElementsByTagName("id");
    var c = new Category("search");
    for (var loop = 0; loop < categories.length; loop++) {
      var id = responseXML.getElementsByTagName("id")[loop].childNodes[0].nodeValue;
      var image = responseXML.getElementsByTagName("image-url")[loop].childNodes[0].nodeValue;
      var name = responseXML.getElementsByTagName("name")[loop].childNodes[0].nodeValue;
      var description = responseXML.getElementsByTagName("description")[loop].childNodes[0].nodeValue;
      var price = responseXML.getElementsByTagName("price")[loop].childNodes[0].nodeValue;
      c.addItem(id,image,name,description,price);
    }
    gcats.put("search", c);
    showCategoryItems("search",0,chunkSize);
}

function showSearchItem(id) {
   resetBody();
   engine.inject({template: "items.htmf", injectionPoint: $("bodyCenter"), initFunction: function(){getSearchItem(id);}});
}

function getSearchItem(id) {
      var c = gcats.get("search");
      var completeTable = $("completeTable");
      if (c != null) {
        var i = c.getItemById(id);
        if (i != null) {
            if (completeTable) completeTable.style.visibility='hidden';
            clearAutocompletionResults();
            addCategoryItem($("items_table"),"search", i.id,i.image,i.name,i.description,i.price);
            return;
        }
      }
      var bindArgs = {
            url:  "catalog?command=item&id=" + id,
            mimetype: "text/xml",
            load: function(type, data) {
            loadItemCallback(data);
        }
     };
    dojo.io.bind(bindArgs);
    if (completeTable) completeTable.style.visibility='hidden';
    clearAutocompletionResults();
}

function loadItemCallback(responseXML) {
      var id = responseXML.getElementsByTagName("id")[0].childNodes[0].nodeValue;
      var image = responseXML.getElementsByTagName("image-url")[0].childNodes[0].nodeValue;
      var name = responseXML.getElementsByTagName("name")[0].childNodes[0].nodeValue;
      var description = responseXML.getElementsByTagName("description")[0].childNodes[0].nodeValue;
      var price = responseXML.getElementsByTagName("price")[0].childNodes[0].nodeValue;
      var c = gcats.get("search");
      if (c == null) {
        c= new Category("search", "Search Results");
        gcats.put("search", c);
      }
      c.addItem(id,image,name,description,price);
      addCategoryItem($("items_table"),"search", id,image,name,description,price);
}

function loadCategoryCallback(catid, responseXML) {
	var categories = responseXML.getElementsByTagName("id");
    var catName = responseXML.getElementsByTagName("cat-name")[0].childNodes[0].nodeValue
    var c = new Category(catid,catName);
    for (var loop = 0; loop < categories.length; loop++) {
      var id = responseXML.getElementsByTagName("id")[loop].childNodes[0].nodeValue;
      var image = responseXML.getElementsByTagName("image-url")[loop].childNodes[0].nodeValue;
      var name = responseXML.getElementsByTagName("name")[loop].childNodes[0].nodeValue;
      var description = responseXML.getElementsByTagName("description")[loop].childNodes[0].nodeValue;
      var price = responseXML.getElementsByTagName("price")[loop].childNodes[0].nodeValue;
      c.addItem(id,image,name,description,price);
    }
    gcats.put(catid, c);
    showCategoryItems(catid,0,chunkSize);
}

function resetBody() {
    var body = $("bodyCenter");
    body.innerHTML = "";
}

function showCategoryItems(catid, index, count) {
   engine.inject({template: "items.htmf", injectionPoint: $("bodyCenter"), initFunction: function(){showItems(catid, index,count);}});
}

function showItems(catid, index, count) {
    var itemsTable= $("items_table");
    var c = gcats.get(catid);
    if (c.length == 0) {
        itemsTable.innerHTML = "<tr valign='center'><td class='plainText'>No " + c.name + " available at this time.</td></tr>";
    } else {
        var iTitle = $("items_title");
        iTitle.innerHTML = "<span class='plainText'>" + c.name + "</span>";
           var  loopLength = Number(index) + Number(count);
        for (l = index; l  < loopLength; l++) {
           var i = c.getItem(l);
           addCategoryItem(itemsTable, catid, i.id, i.image,i.name,i.description,i.price);
        }
        if (Number(index) >= chunkSize) {
            var prevIndex =  (Number(index) - chunkSize);
            if ((Number(index)  - Number(chunkSize)) < 0) {
               prevIndex = 0;
            }
            var itemsBottomLeft = $("items_bottom_left");
            itemsBottomLeft.innerHTML = "<a class=\"valueListNavigate\" onclick=\"showCategoryItems('" + catid + "','" + prevIndex + "','" + chunkSize + "')\">Previous</a>";
        }
    }
    if (Number(c.length) > (Number(index) + Number(count)) ) {
        cell = document.createElement("td");
        cell.setAttribute("bgcolor", "white");
        cell.setAttribute("nowrap", "true");
        cell.setAttribute("valign", "top");
        cell.setAttribute("align", "right");
        var link = document.createElement("a");
        link.appendChild(document.createTextNode("Next"));
        link.className = "valueListNavigate";
        var nextCount = count;
        if ((Number(index) + Number(count) + Number(chunkSize)) > Number(c.length)) {
            nextCount = Number(c.length) - (Number(index) + Number(count));
        }
        var itemsBottomRight = $("items_bottom_right");
        itemsBottomRight.innerHTML = "<a class=\"valueListNavigate\" onclick=\"showCategoryItems('" + catid + "','" + (Number(index) + chunkSize) + "','" + nextCount + "')\">Next</a>";
   }
}

 function addCategory(id, name, src) {
    var cell;
    var row;
    var sidebar = document.getElementById("sidebar");
    if (isIE) {
    } else {
        row = document.createElement("tr");
        cell = document.createElement("td");
        cell.setAttribute("nowrap", "true");
        cell.setAttribute("valign", "top");
        var img = document.createElement("img");
        img.src = ("images\\" + src);
        img.setAttribute("height", "50");
        img.setAttribute("width", "50");
        var link = document.createElement("a");
        link.className ="category";
        link.appendChild(document.createTextNode(name));
        var url = "loadCategory('" + id + "')";
        link.setAttribute("onClick", url);
        cell.appendChild(img);
        cell.appendChild(link);
        row.appendChild(cell);
        sidebar.appendChild(row);
    }
}

function addCategoryItem(itemsTable, catid, id,image,name,description,price) {
    var cell;
    var cell2;
    var cell3;
    var row;
    if (isIE) {
        // do ie stuff
    } else {
        row = document.createElement("tr");
        row.setAttribute("bgcolor", "white");
        cell = document.createElement("td");
        cell.setAttribute("bgcolor", "white");
        cell.setAttribute("nowrap", "true");
        cell.setAttribute("valign", "top");
        var img = document.createElement("img");
        img.src = ("images\\" + image);
        cell.appendChild(img);
        row.appendChild(cell);
        cell2 = document.createElement("td");
        cell2.setAttribute("valign", "top");
        var dDiv = document.createElement("div")
        dDiv.appendChild(document.createTextNode(name));
        dDiv.className = "itemName";
        cell2.appendChild(dDiv);
        var dDiv2= document.createElement("div");
        dDiv2.appendChild(document.createTextNode(description));
        dDiv2.className = "item";
        cell2.appendChild(dDiv2);
        row.appendChild(cell2);
        var cell3 = document.createElement("td");
        cell3.setAttribute("valign", "top");
        var dDiv3= document.createElement("div");
        dDiv3.appendChild(document.createTextNode("$" + price + "  "));
        dDiv3.className = "item";
        cell3.appendChild(dDiv3);
        var plink = document.createElement("a");
        plink.className ="purchaseItem";
        plink.appendChild(document.createTextNode("Add to Cart"));
        plink.setAttribute("onClick", "cart.purchaseItem('" + catid + "','" + id + "')");
        cell3.appendChild(plink);
        row.appendChild(cell3);
        itemsTable.appendChild(row);
    }
}

function clearNodes(id) {
    var target = document.getElementById(id);
    if (target) target.innerHTML = "";
}
