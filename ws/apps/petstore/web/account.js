/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: account.js,v 1.2 2005-11-28 07:33:17 gmurray71 Exp $
*/
var isIE = false;
var req;


function CreditCard(nameOnCard, provider, number, expiryMonth, expiryYear){
    this.nameOnCard = nameOnCard;
    this.provider = provider;
    this.number = number;
    this.expiryMonth = expiryMonth;
    this.expiryYear = expiryYear;
}


function Address(street1, street2, city, zip, state) {
    this.street1 = street1;
    this.street2 = street2;
    this.city = city;
    this.state = state;
}

function hideCreditCard() {
    var creditCardPop = $("creditcard-popup");
    creditCardPop.style.visibility='hidden';
}


function showCreditCard() {
    if (account && account.signedIn) {
        var creditCardPop = $("creditcard-popup");
        if (creditCardPop) {
            var dragme = new Dragable(creditCardPop);
            creditCardPop.style.top="150px";
            creditCardPop.style.left="200px";
            creditCardPop.style.visibility='visible';
        } else {
            loadCreditCard();
        }

    } else {
        var signinPop = $("signin-popup");
        signinPop.style.visibility='visible';
    }
}

function loadCreditCard() {
        // load the sigin html and inject
        var accountHTMLArgs = {
            url:  "controller?command=content&target=/creditcard.htmf",
            mimetype: "text/html",
            load: function(type, data) {
               var injectionPoint = document.createElement("div");
               injectionPoint.innerHTML = data;
               document.firstChild.appendChild(injectionPoint);
               // now load the associated JavaScript
                var bindArgs = {
                    url:  "controller?command=content&target=/creditcard.js",
                    mimetype: "text/javascript",
                    load: function(type, data) {
                        hideAccount();
                        loadCreditCardData();
                    }
                };
                dojo.io.bind(bindArgs);
            }
        };
        dojo.io.bind(accountHTMLArgs);    
}

function loadCreditCardData() {
    //alert("loading account data");
    updateItem(document.getElementById("creditCardName"), "Gregory Murray");
    updateItem(document.getElementById("creditCardNumber"), "1234-1234-1234");
    showCreditCard();
    
}

function updateOnServer(itemId, itemValue) {
    var url = "account?action=save";
    initRequest(url);
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("id=" + itemId + "&value=" + escape(itemValue));
}

function getData() {
     var counter=0;
     var qs = "";
     while(true) {
        var target = "dlabel_" + counter;
        if (document.getElementById(target)) {
           var binding = document.getElementById(target).getAttribute("binding");
           if (binding) qs += "b" + counter + "=" + binding + "&";
        } else break;
        counter++;
    }
    // build a list of the data we are really looking for
    var url = "dlabel?action=getData&" + qs;
    initRequest(url);
    req.onreadystatechange = processGetDataRequest;
    req.open("GET", url, true);
    req.send(null);
}

function getItemsBoundToId(targetId) {
    var counter = 0;
    var itemCount=0;
    var items = new Array();
     while(true) {
        var target = "dlabel_" + counter;
        if (document.getElementById(target)) {
            if ((document.getElementById(target).getAttribute("binding")) &&
                document.getElementById(target).getAttribute("binding") == targetId) {
                items[itemCount++] = document.getElementById(target);
                //alert("added " + target);
            }
        } else break;
        counter++;
    }
    return items;
}

function initRequest(url) {
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        isIE = true;
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function processGetDataRequest() {
    if (req.readyState == 4) {
        if (req.status == 200) {
            parseMessages();
        }
    }
}

function parseMessages() {
	var pageElements = req.responseXML.getElementsByTagName("page-data")[0];
     for (var loop = 0; loop < pageElements.childNodes.length; loop++) {
	    var pageElement = pageElements.childNodes[loop];
        var itemId = pageElement.getElementsByTagName("id")[0];
        var itemValue = pageElement.getElementsByTagName("value")[0];
        updateItems(itemId.childNodes[0].nodeValue, itemValue.childNodes[0].nodeValue);
    }
}

function changeField(itemId, target) {
  var valueElement = document.getElementById(target);
  var bindingId = document.getElementById(itemId).getAttribute("binding");
  updateItems(bindingId, valueElement.value);
  updateOnServer(bindingId, valueElement.value);
}

function updateItems(itemId, target) {
    var items = getItemsBoundToId(itemId);
    for (l =0; l < items.length; l++) {
        updateItem(items[l],target);
    }
}

function updateItem(item, value) {
    removeAllChildren(item);
    var divElement = document.createElement("div");
    divElement.setAttribute("onmouseover", "style.backgroundColor='#FFCC33'");
    divElement.setAttribute("onmouseout", "style.backgroundColor='#FFFFFF';");   
    divElement.className=  "plainText"; 
    divElement.setAttribute("onclick", "morph('" + item.getAttribute("id") + "')");
    divElement.appendChild(document.createTextNode(value));
    item.appendChild(divElement);
}

function removeAllChildren(targetElement) {
    if (targetElement && targetElement.childNodes) {
        for (var rloop = targetElement.childNodes.length -1; rloop >= 0 ; rloop--) {
            targetElement.removeChild(targetElement.childNodes[rloop]);
        }
    }
}

function morph(itemid) {
    
    var item = document.getElementById(itemid);
    var value = item.childNodes[0].childNodes[0].nodeValue;
    // remove all children
    removeAllChildren(item);
    var cellElement = document.createElement("td");
    cellElement.setAttribute("nowrap", "nowrap");
    var formElement = document.createElement("form");
    formElement.setAttribute("onsubmit", "changeField('" + itemid + "','" + itemid + "_morph');return false;");
    var inputElement = document.createElement("input");
    inputElement.setAttribute("id", itemid + "_morph");  
    inputElement.setAttribute("type", "text");  
    inputElement.setAttribute("class", "editText");   
    inputElement.setAttribute("size", "25");
    inputElement.setAttribute("value", value);
    var buttonElement = document.createElement("input");
    buttonElement.setAttribute("type", "button");
    buttonElement.setAttribute("onclick", "changeField('" + itemid + "','" + itemid + "_morph');");
    buttonElement.setAttribute("value", "Update");
    formElement.appendChild(inputElement);
    formElement.appendChild(buttonElement);
    cellElement.appendChild(formElement);
    item.appendChild(cellElement);
}

