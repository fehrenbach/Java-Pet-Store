/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: account.js,v 1.3 2005-12-03 06:50:47 gmurray71 Exp $
*/


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

function initCreditCard() {
        loadCreditCardData();
        var creditCardPop = $("creditcard-popup");
            var dragme = new Dragable(creditCardPop);
            creditCardPop.style.top="150px";
            creditCardPop.style.left="200px";
}

function showCreditCardDialog() {
    var creditCardPop = $("creditcard-popup");
    creditCardPop.style.visibility='visible';
}

function showCreditCard() {
     var creditCardPop = $("creditcard-popup");
    if (creditCardPop) {
        creditCardPop.style.visibility='visible';
     } else {
            loadCreditCard();
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
                        initCreditCard();
                        showCreditCardDialog();
                    }
                };
                dojo.io.bind(bindArgs);
            }
        };
        dojo.io.bind(accountHTMLArgs);    
}

function loadCreditCardData() {
    //alert("loading account data");
    //updateItem(document.getElementById("creditCardName"), "Gregory Murray");
    //updateItem(document.getElementById("creditCardNumber"), "1234-1234-1234");
    
}

function updateOnServer(itemId, itemValue) {
    var bindArgs = {
       url:  "faces/ajax-dlabel-update",
    method: "post",
   content: {"component-id": itemId, "component-value": itemValue},
       mimetype: "text/xml",
       load: function(type, data) {
               processUpdateResponse(data);
             },
	   backButton: function() {
				alert("Encounterd back button" + itemValue);
			}
     };
    dojo.io.bind(bindArgs);
}

function processUpdateResponse(responseXML) {
    // sync the changes with what is on the server
    var compId = responseXML.getElementsByTagName("component-id")[0].childNodes[0].nodeValue;
    var compValue = "";
    if (responseXML.getElementsByTagName("component-value")[0].childNodes[0])
        compValue = responseXML.getElementsByTagName("component-value")[0].childNodes[0].nodeValue;
    var status = responseXML.getElementsByTagName("status")[0].childNodes[0].nodeValue;
    updateItem(compId, compValue);
}

function loadAccountData() {
    var bindArgs = {
       url:  "faces/ajax-dlabel-load",
       mimetype: "text/xml",
       load: function(type, data) {
               postLoad(data);
             }
     };
    dojo.io.bind(bindArgs);
}

function postLoad(responseXML) {
	var pageElements = responseXML.getElementsByTagName("page-data")[0];
     for (var loop = 0; loop < pageElements.childNodes.length; loop++) {
	    var pageElement = pageElements.childNodes[loop];
        var itemId = pageElement.getElementsByTagName("id")[0];
        var itemValue = pageElement.getElementsByTagName("value")[0];
        updateItem(itemId.childNodes[0].nodeValue, itemValue.childNodes[0].nodeValue);
    }
}

function removeAllChildren(targetElement) {
    if (targetElement && targetElement.childNodes) {
        for (var rloop = targetElement.childNodes.length -1; rloop >= 0 ; rloop--) {
            targetElement.removeChild(targetElement.childNodes[rloop]);
        }
    }
}

function updateItem(itemId, value) {

    var item = document.getElementById(itemId);
    // remove all children
    removeAllChildren(item);
      
    var cellElement = document.createElement("div");
    cellElement.setAttribute("id", itemId + "_dlabel");
    cellElement.className = "plainText";
    if (isIE) {
        cellElement.attachEvent('onclick',preMorph);
        cellElement.attachEvent('onmouseover',function(e){e.srcElement.style.backgroundColor='#FFCC33';});
        cellElement.attachEvent('onmouseout',function(e){e.srcElement.style.backgroundColor='#FFFFFF';});
    } else {
        cellElement.addEventListener('click',preMorph,true);
        cellElement.setAttribute("onmouseover","this.style.backgroundColor='#FFCC33'");
        cellElement.setAttribute("onmouseout","this.style.backgroundColor='#FFFFFF'");
    }  
    cellElement.appendChild(document.createTextNode(value));
    item.appendChild(cellElement);
}

function showUpdateMessage(itemId, value) {

    var item = document.getElementById(itemId);
    // remove all children
    removeAllChildren(item);   
    var cellElement = document.createElement("div");
    cellElement.className = "plainText";   
    cellElement.appendChild(document.createTextNode(value));
    item.appendChild(cellElement);
}

function preMorph(e) {
    var targetId;
    if (isIE) {
        targetId = e.srcElement.getAttribute("id");
    } else {
        targetId = e.currentTarget.getAttribute("id");
    }
   
   var splitme = targetId.split("_dlabel");
   morph(splitme[0]);

}

function postMorph(e) {
    var targetId;
    if (isIE) {
        targetId = e.srcElement.getAttribute("id");
    } else {
        targetId = e.currentTarget.getAttribute("id");
    }
   var splitme = targetId.split("_button");
   targetId = splitme[0];
   var targetValue = document.getElementById(splitme[0] + "_morph").value;
   showUpdateMessage(targetId, "Updating on server....");
   updateOnServer(targetId, targetValue);
   return false;

}

function cancelMorph(e) {
    var targetId;
    if (isIE) {
        targetId = e.srcElement.getAttribute("id");
    } else {
        targetId = e.currentTarget.getAttribute("id");
    }
   var splitme = targetId.split("_button");
   targetId = splitme[0];
   var targetValue = document.getElementById(splitme[0] + '_orig').value;
   updateItem(targetId, targetValue);
   return false;

}

function morph(itemid) {
    var item = document.getElementById(itemid);
    var value = item.childNodes[0].childNodes[0].nodeValue;
    // remove all children
    removeAllChildren(item);
    
    var cellElement = document.createElement("div");
    var formElement = document.createElement("form");
    var originalTextElement = document.createElement("input");
    originalTextElement.setAttribute("type", "hidden");
    originalTextElement.setAttribute("id", itemid + "_orig");
    originalTextElement.setAttribute("value", value);
    var inputElement = document.createElement("input");
    inputElement.setAttribute("id", itemid + "_morph");  
    inputElement.setAttribute("type", "text");  
    inputElement.className = "editText";   
    inputElement.setAttribute("size", "25");
    inputElement.setAttribute("value", value);
    var cancelButtonElement = document.createElement("input");
    cancelButtonElement.setAttribute("id", itemid + "_button");  
    cancelButtonElement.setAttribute("type", "button");
    cancelButtonElement.setAttribute("value", "Cancel");
    var buttonElement = document.createElement("input");
    buttonElement.setAttribute("id", itemid + "_button");  
    buttonElement.setAttribute("type", "button");
    buttonElement.setAttribute("value", "Update Me");
    if (isIE) {
        //prevent a return key from submitting the form
        formElement.onsubmit = function(){return false;};
        cancelButtonElement.attachEvent("onclick",cancelMorph);
        buttonElement.attachEvent("onclick",postMorph);
    } else {
        // don't allow return keys to submit the form
        formElement.setAttribute("onsubmit","return false;");
        cancelButtonElement.addEventListener('click',cancelMorph,true);
        buttonElement.addEventListener('click',postMorph,true);
    }
    formElement.appendChild(originalTextElement);
    formElement.appendChild(inputElement);
    formElement.appendChild(buttonElement);
    formElement.appendChild(cancelButtonElement);

    cellElement.appendChild(formElement);
    item.appendChild(cellElement);
}

