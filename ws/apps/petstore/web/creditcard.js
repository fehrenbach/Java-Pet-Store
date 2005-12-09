/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: creditcard.js,v 1.2 2005-12-09 00:57:29 gmurray71 Exp $
*/

function CreditCard() {

	this.completePurchase = function() {
    	this.hide();
    	// checkout will need to move here
    	checkout();
	}

	this.hide = function () {
    	var creditCardPop = $("creditcard-popup");
    	creditCardPop.style.visibility='hidden';
    	var shadow= $("creditcard-popup_shadow");
    	if (shadow) {
        	shadow.style.visibility='hidden';
    	}
	}

	this.init = function() {
    	var creditCardPop = $("creditcard-popup");
    	var dragme = new Dragable(creditCardPop);
    	creditCardPop.style.top="165px";
    	centerX(creditCardPop);
	}

	this.show = function() {
    	var checkoutDiv = $("checkoutDiv");
   	 	if (checkingOut) {
        	checkoutDiv.innerHTML = "<form><input type='button' onclick='creditCard.completePurchase();' value='Complete Order'></from>";
    	} else {
        checkoutDiv.innerHTML = "<form><input type='button' onclick='creditCard.hide();' value='Close'></form>";
    	}
    	var creditCardPop = $("creditcard-popup");
    	creditCardPop.style.visibility='visible';
    	var shadow= $("creditcard-popup_shadow");
    	if (shadow) {
        	shadow.style.visibility='visible';
    	}
	}
}
