
/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: accountpane.js,v 1.1 2006-01-03 04:45:19 gmurray71 Exp $
*/

function Account() {
 	this.firstName = null;
    this.lastName = null;   
    this.billingAddress = null;
    this.shippingAddress = null;
    this.creditCard = null;
	
	this.init = function() {

        loadAccountData();
	}

	this.hide = function() {
	}
	
	this.show = function() {
	}

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
    var item = $(itemId);
    if (item) {
        removeAllChildren(item);
        var cellElement = document.createElement("div");
        cellElement.setAttribute("id", itemId + "_dlabel");
        cellElement.className = "plainText";
        if (isIE) {
            cellElement.attachEvent('onclick',preMorph);
            cellElement.attachEvent('onmouseover',function(e){e.srcElement.style.backgroundColor='#FFCC33';});
            cellElement.attachEvent('onmouseout',function(e){e.srcElement.style.backgroundColor='ThreeDFace';});
        } else {
            cellElement.addEventListener('click',preMorph,true);
            cellElement.setAttribute("onmouseover","this.style.backgroundColor='#FFCC33'");
            cellElement.setAttribute("onmouseout","this.style.backgroundColor='ThreeDFace'");
        }  
        cellElement.appendChild(document.createTextNode(value));
        item.appendChild(cellElement);
    }
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

}

dojo.provide("dojo.widget.Accordion");


dojo.require("dojo.widget.*");
dojo.require("dojo.widget.SplitPane");
dojo.require("dojo.animation.Animation");

dojo.widget.Accordion = function(){

	dojo.widget.html.SplitPane.call(this);
	this.widgetType = "Accordion";
	this._super = dojo.widget.AccordionPanel.superclass;
	dojo.event.connect(this, "postCreate", this, "myPostCreate");
	
}
dojo.inherits(dojo.widget.Accordion, dojo.widget.html.SplitPane);
dojo.lang.extend(dojo.widget.Accordion, {
	sizerWidth: 1,
	activeSizing: 1,
	animationInterval: 250,
	openPanel: null,
	myPostCreate: function(args, frag){
		for(var i=0; i<this.sizers.length; i++){
			var sn = this.sizers[i];
			if(sn){
				sn.style.border = "0px";
			}
		}
		for(var i=0; i<this.children.length; i++){
			this.children[i].setMinHeight();
			if(this.children[i].open){
				this.openPanel = this.children[i];
			}
		}
		this.onResized();
	},

	setOpenPanel: function(panel){
		if(!panel){ return; }
		if(!this.openPanel){
			this.openPanel = panel; 
			panel.open = true;
		}else if(panel === this.openPanel){
			// no-op
		}else{
			var closingPanel = this.openPanel;
			var openingPanel = panel;
			this.openPanel.sizeShare = 0;
			this.openPanel.open = false;
			this.openPanel.setMinHeight(true);
			this.openPanel = panel;
			this.openPanel.sizeShare = 100;
			this.openPanel.open = true;
			this.onResized();
			// Don't animate if there is no interval
			if (this.animationInterval == 0){
				openingPanel.sizeShare = 100;
				closingPanel.sizeShare = 0;
				e.animation.accordion.onResized();
			}else{
				var line = new dojo.math.curves.Line([0,0], [0,100]);
				var anim = new dojo.animation.Animation(
					line,
					this.animationInterval,
					new dojo.math.curves.Bezier([[0],[0.05],[0.1],[0.9],[0.95],[1]])
				);
				
				var accordion = this;
	
				anim.handler = function(e) {
					switch(e.type) {
						case "animate":
							openingPanel.sizeShare = parseInt(e.y);
							closingPanel.sizeShare = parseInt(100 - e.y);
							accordion.onResized();
							break;
						case "end":
						break;
					}
				}
				anim.play();
			}
		}
	}
});
dojo.widget.tags.addParseTreeHandler("dojo:Accordion");

dojo.widget.AccordionPanel = function(){
	dojo.widget.html.SplitPanePanel.call(this);
	this.widgetType = "AccordionPanel";
	dojo.event.connect(this, "fillInTemplate", this, "myFillInTemplate");
	dojo.event.connect(this, "postCreate", this, "myPostCreate");
}

dojo.inherits(dojo.widget.AccordionPanel, dojo.widget.html.SplitPanePanel);

dojo.lang.extend(dojo.widget.AccordionPanel, {
	sizeMin:0,
	initialSizeMin: null,
	sizeShare: 0,
	open: false,
	label: "",
	initialContent: "",
	labelNode: null,
	scrollContent: true,
	initalContentNode: null,
	contentNode: null,
	templatePath: dojo.uri.dojoUri("accordion.html"),

	setMinHeight: function(ignoreIC){
		// now handle our setup
		var lh = dojo.style.getContentHeight(this.labelNode);
		if(!ignoreIC){
			lh += dojo.style.getContentHeight(this.initialContentNode);
			this.initialSizeMin = lh;
		}
		this.sizeMin = lh;
	},

	myFillInTemplate: function(args, frag){
		var sn;
		if(this.label.length > 0){
			this.labelNode.innerHTML = this.label;
		}else{
			try{
				sn = frag["dojo:label"][0]["dojo:label"].nodeRef;
				while(sn.firstChild){
					this.labelNode.firstChild.appendChild(sn.firstChild);
				}
			}catch(e){ }
		}
		if(this.initialContent.length > 0){
			this.initialContentNode.innerHTML = this.initialContent;
		}else{
			try{
				sn = frag["dojo:initialcontent"][0]["dojo:initialcontent"].nodeRef;
				while(sn.firstChild){
					this.initialContentNode.firstChild.appendChild(sn.firstChild);
				}
			}catch(e){ }
		}
		sn = frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"];
		while(sn.firstChild){
			this.contentNode.appendChild(sn.firstChild);
		}
		if(this.open){
			this.sizeShare = 100;
		}
	},

	myPostCreate: function(){
	},

	sizeSet: function(size){
		if(!this.scrollContent){
			return;
		}
		if(size <= this.sizeMin){
			this.contentNode.style.display = "none";
		}else{
			// this.domNode.style.overflow = "hidden";
			this.contentNode.style.display = "block";
			this.contentNode.style.overflow = "auto";
			var scrollSize = (size-((this.initialSizeMin) ? this.initialSizeMin : this.sizeMin));
			if(dojo.render.html.ie){
				this.contentNode.style.height =  scrollSize+"px";
			}else{
				dojo.style.setOuterHeight(this.contentNode, scrollSize);
			}
		}
	},

	toggleOpen: function(evt){
		this.parent.setOpenPanel(this);
	}
});
dojo.widget.tags.addParseTreeHandler("dojo:AccordionPanel");


