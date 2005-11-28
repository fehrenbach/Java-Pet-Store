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

function showAccount() {
    if (account && account.signedIn) {
        var accountPop = $("account-popup");
        if (accountPop) {
            var dragme = new Dragable(accountPop);
            accountPop.style.top="150px";
            accountPop.style.left="200px";
            accountPop.style.visibility='visible';
        } else {
            loadAccount();
        }

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
        showAccount();
    } else {
        alert("invalid signin");
    }
}

function loadAccountData() {
    //alert("loading account data");
    updateItem(document.getElementById("accountFirstName"), "Gregory");
    updateItem(document.getElementById("accountLastName"), "Murray");
    updateItem(document.getElementById("accountStreet1"), "123 Network Circle");
    updateItem(document.getElementById("accountStreet2"), "            ");
    updateItem(document.getElementById("accountCity"), "Santa Clara");
    updateItem(document.getElementById("accountState"), "CA");
    updateItem(document.getElementById("accountZip"), "95054");
    showAccount();
    
}


function loadAccount() {
        // load the sigin html and inject
        var accountHTMLArgs = {
            url:  "controller?command=content&target=/account.htmf",
            mimetype: "text/html",
            load: function(type, data) {
               var injectionPoint = document.createElement("div");
               injectionPoint.innerHTML = data;
               document.firstChild.appendChild(injectionPoint);
               // now load the associated JavaScript
                var bindArgs = {
                    url:  "controller?command=content&target=/account.js",
                    mimetype: "text/javascript",
                    load: function(type, data) {
                        loadAccountData();
                    }
                };
                dojo.io.bind(bindArgs);
            }
        };
        dojo.io.bind(accountHTMLArgs);    
}
