function Signin() {
	
    this.id = null;
    var signedIn = false;

    this.isSignedIn = function() {
	    return signedIn;    
	}

	this.init = function () {
    	var signinPop = $("signin-popup");
   	 	if (!account) {
        	var dragme = new Dragable(signinPop,$("signin-drag-target"));
        	signinPop.style.top="140px";
        	centerX(signinPop);
    	}
	}

	this.hide = function() {
    	var signinPop = $("signin-popup");
    	signinPop.style.visibility='hidden';
   		 var shadow= $("signin-popup_shadow");
   	 	if (shadow) {
        	shadow.style.visibility='hidden';
    	}
	}

	this.show = function() {
    	var signinPop = $("signin-popup");
   	 	centerX(signinPop);
    	signinPop.style.visibility='visible';
    	var shadow= $("signin-popup_shadow");
    	if (shadow) {
        	shadow.style.visibility='visible';
    	}    
	}
	
	this.signIn = function() {
    	var userId = document.getElementById("userId").value;
    	var password = document.getElementById("password").value;
   	 	var bindArgs = {
      		 url: "account",
 		  	 method: "post",
   			 content: {"action": "signin","userId": userId, "password": password},
      	 	 mimetype: "text/xml",
       		 load: function(type, data) {
    			var response = data.childNodes[0].childNodes[0].nodeValue;
    			if (response == 'valid') {
        			signedIn = true;
      			  	loadAccount();
    			} else {
        			alert("invalid signin");
    			}
             }
    	};
    	dojo.io.bind(bindArgs);
	}
}
