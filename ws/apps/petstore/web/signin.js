function Account() {
    this.id = null;
    this.signedIn = false;
    this.firstName = null;
    this.lastName = null;   
    this.billingAddress = null;
    this.shippingAddress = null;
    this.creditCard = null;
}

function initSignin() {
    loadAccount();
    var signinPop = $("signin-popup");
    if (!account) {
        var dragme = new Dragable(signinPop);
        signinPop.style.top="140px";
        signinPop.style.left="250px";
    }
}

function hideSignin() {
    var signinPop = $("signin-popup");
    signinPop.style.visibility='hidden';
}

function hideAccount() {
    var accountPop = $("account-popup");
    accountPop.style.visibility='hidden';
}

function showSignin() {
    var signinPop = $("signin-popup");
    signinPop.style.visibility='visible';
}

function initAccount() {
    var accountPop = $("account-popup");
    var dragme = new Dragable(accountPop);

}

function showAccount() {
    var accountPop = $("account-popup");
    if (account && account.signedIn) {
            accountPop.style.top="150px";
            accountPop.style.left="220px";
            accountPop.style.visibility='visible';
    } else {
        var signinPop = $("signin-popup");
        signinPop.style.visibility='visible';
 
    }
}

function signIn() {
    var userId = document.getElementById("userId").value;
    var password = document.getElementById("password").value;
    var bindArgs = {
       url: "account",
    method: "post",
   content: {"action": "signin","userId": userId, "password": password},
       mimetype: "text/xml",
       load: function(type, data) {
               signinCallback(data);
             }
    };
    dojo.io.bind(bindArgs);
}

function signinCallback(responseXML) {
    var response = responseXML.childNodes[0].childNodes[0].nodeValue;
    if (response == 'valid') {
        account = new Account();
        account.signedIn = true;
        hideSignin();
        initAccount();
        showAccount();
    } else {
        alert("invalid signin");
    }
}


function loadAccount() {

    var accountArgs = {
            url: "faces/address.jsp",
            script: "account.js",
            initFunction: function() {

                loadAccountData();
            }
    };
    inject(accountArgs);
}