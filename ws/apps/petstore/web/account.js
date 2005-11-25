
function Account() {

    this.id = null;
    this.loggedIn = false;
    
    this.firstName = null;
    this.lastName = null;
    
    this.billingAddress = null;
    this.shippingAddress = null;
    
    this.creditCard = null;
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

function initAccount() {
 var accountPop = $("account-popup");
 if (!account) {
    account = new Account();
    var dragme = new Dragable(accountPop);
    accountPop.style.top="140px";
    accountPop.style.left="200px";
 }
}

function hideAccount() {
 var accountPop = $("account-popup");
 accountPop.style.visibility='hidden';
}

function showAccount() {
 var accountPop = $("account-popup");
 accountPop.style.visibility='visible';
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
    alert("response is " + response);
}
