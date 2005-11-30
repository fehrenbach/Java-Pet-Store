/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: support.js,v 1.1 2005-11-30 00:43:39 gmurray71 Exp $
*/

var req;
var isIE;
var uderId;
var msgIndex = 0;
var chatTable;
var chatIFrame;
var timeout = 3000;
var scroller;
var scollerY = 0;

function initSupport() {
 disableSubmitBtn();
 chat = $("chit-chat");
 if (!$("chatFrame")) {
   var dragme = new Dragable(chat);
   chat.style.top="140px";
 }
}


function hideSupport() {
 var chat = $("chit-chat");
 chat.style.visibility='hidden';
}

function initRequest(url) {
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        isIE = true;
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function validateUserId() {
    var url = "chat?action=valid-register";
    initRequest(url);
    req.onreadystatechange = processRequest;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var target = document.getElementById("userid");
    req.send("userid=" + escape(target.value));
}

function register() {
    var url = "chat?action=register";
    initRequest(url);
    req.onreadystatechange = processRegistration;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var target = document.getElementById("userid");
    req.send("userid=" + escape(target.value) + "&icon=default");
}

function sendMessage() {
    var url = "chat?action=add-message";
    initRequest(url);
    req.onreadystatechange = processMessagePost;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var messageText = document.getElementById("messageText");
    req.send("message=" + encodeURI(messageText.value) + "&userid=" + userId);
    // clear the message field
    var messageText = document.getElementById("messageText");
    if (messageText) messageText.value = "";
    // do an immediate fetch
    getMessages();
}

function getMessages() {
    var url = "chat?action=get-messages&index=" + msgIndex + "&userid=" + userId;
    initRequest(url);
    req.onreadystatechange = processMessages;
    req.open("GET", url, true);
    req.send(null);
    setTimeout("getMessages()", timeout);
}

function processMessagePost() {
    if (req.readyState == 4) {
        if (req.status == 200) {
           var errorMsg = "<message>invalid</message>";
           var msg = req.responseText;
           if (msg == errorMsg){
               var mdiv = document.getElementById("statusMessage");
               mdiv.innerHTML = "<font color=\"red\">Error Posting Message</font>";
               submitBtn.disabled = true;
            } else {
               mdiv = document.getElementById("statusMessage");
               mdiv.innerHTML = "<font color=\"green\">Meessage Sent</font>";
            }  
         }
    }
}

function processRegistration() {
    if (req.readyState == 4) {
        if (req.status == 200) {
           var errorMsg = "<message>invalid</message>";
           var msg = req.responseText;
           if (msg == errorMsg){
               var mdiv = document.getElementById("statusMessage");
               mdiv.innerHTML = "<font color=\"red\">Invalid User Id</font>";
               submitBtn.disabled = true;
            } else {
               mdiv = document.getElementById("statusMessage");
               mdiv.innerHTML = "<font color=\"green\">Valid User Id</font>";
               var submitBtn = document.getElementById("login_btn");
               submitBtn.disabled = true;
               var target = document.getElementById("userid");
               userId = target.value;
               postRegister();
               getMessages();
            }  
         }
    }
}

function processRequest() {
    if (req.readyState == 4) {
        if (req.status == 200) {
           var errorMsg = "<message>invalid</message>";
           var msg = req.responseText;
           if (msg == errorMsg){
               var mdiv = document.getElementById("statusMessage");
               mdiv.innerHTML = "<font color=\"red\">Invalid Handle</font>";
               var submitBtn = document.getElementById("login_btn");
               submitBtn.disabled = true;
            } else {
               mdiv = document.getElementById("statusMessage");
               mdiv.innerHTML = "<font color=\"green\">Valid Handle</font>";
               var submitBtn = document.getElementById("login_btn");
               submitBtn.disabled = false;
            }  
         }
    }
}

function processMessages() {
    if (req.readyState == 4) {
        if (req.status == 200) {
           parseMessages();
         }
    }
}

function parseMessages() {
    var messageList = document.getElementById("messageList");
	var messages = req.responseXML.getElementsByTagName("messages")[0];
     for (loop = 0; loop < messages.childNodes.length; loop++) {
	    var message = messages.childNodes[loop];
        var messagesText = message.getElementsByTagName("text")[0];
        var messageSender = message.getElementsByTagName("sender")[0];
        var message = messageSender.childNodes[0].nodeValue + " - " + messagesText.childNodes[0].nodeValue;
        appendMessage(messageSender.childNodes[0].nodeValue,messagesText.childNodes[0].nodeValue);
    }
    msgIndex = msgIndex + messages.childNodes.length;
}

function appendMessage(sender,message) {
    var doc;
    if (isIE) {
       doc = chatIFrame.contentWindow.document;
    } else {
       doc =  document;
    }
    var senderCell;
    var messageCell;
    if (isIE) {
        row = chatTable.insertRow(chatTable.rows.length);
        senderCell = row.insertCell(0);
        messageCell = row.insertCell(1);
    } else {
        row = doc.createElement("tr");
        senderCell = doc.createElement("td");
        messageCell = doc.createElement("td");
        row.appendChild(senderCell);
        row.appendChild(messageCell);
        chatTable.appendChild(row);
    }
    senderCell.setAttribute("width", "100");
    senderCell.setAttribute("align", "left");
    var senderFontElement = doc.createElement("font");
    senderFontElement.setAttribute("size", "+1");
    senderFontElement.setAttribute("color", "green");
    senderFontElement.appendChild(doc.createTextNode(sender));
    senderCell.appendChild(senderFontElement);
    messageCell.setAttribute("width", "150");
    var messageFontElement = doc.createElement("font");
    messageFontElement.setAttribute("size", "+2");
    messageFontElement.setAttribute("size", "+2");
    messageFontElement.appendChild(doc.createTextNode(message));
    messageCell.appendChild(messageFontElement);
    setTimeout("scrollChatIFrame()",0);
}

function scrollChatIFrame(target) {
    if (chatIFrame.contentWindow) {
        chatIFrame.contentWindow.scrollBy(0,50);
    } else {
        chatIFrame.self.scrollBy(0,50);
    }
}

function postRegister() {
   var south = document.getElementById("south");
   south.innerHTML = "<input type=\"text\" size=\"30\" id=\"messageText\" name=\"message\">" +
                   "<input onclick=\"sendMessage()\" id=\"message_btn\" type=\"Button\" value=\"Send\" name=\"Send\">";

   var north = document.getElementById("north");
   north.innerHTML = "";
   //reset chat form action
   var chatForm = document.getElementById("chatForm");
   chatForm.setAttribute("onsubmit", "sendMessage();return false;");
   var status = document.getElementById("statusMessage");
   status.innerHTML = "";
   // insert iframe for chat panel
   var center = $("center");
   var tempIFrame = document.createElement("iframe");
   tempIFrame.setAttribute("id", "chatIFrame");
   tempIFrame.setAttribute("scrolling", "yes");
   tempIFrame.setAttribute("style", "width:350px; height:150px; border: 0px"); 

   chatIFrame = center.appendChild(tempIFrame);   
   var doc;
   if (isIE) {
     doc = chatIFrame.contentWindow.document;
   } else {
       doc =  document;
   }
   chatTable = doc.createElement("table");
   chatTable.setAttribute("id", "chatTable");
   chatTable.setAttribute("width", "340");

   if (isIE) {
       var row = chatTable.insertRow(0);
       var cell = row.insertCell(0);
       cell.appendChild(doc.createTextNode(userId + "has joined"));
   } else {
       var chatRow = doc.createElement("tr");
       var chatCell = doc.createElement("td");
       chatCell.appendChild(doc.createTextNode(userId + " has joined"));
       chatRow.appendChild(chatCell);
       chatTable.appendChild(chatRow);
   }
   // do a delayed insertion because some browers skip ahead
   setTimeout("insertChatTable()",0);
}

function insertChatTable() {
   var tscroller = document.createElement("div");
   tscroller.setAttribute("id", "scroller");
   tscroller.setAttribute("style", "position: absolute;width: 300");
   if (isIE) {
     scroller = chatIFrame.contentWindow.document.appendChild(tscroller);
     scroller.appendChild(chatTable);
     //chatIFrame.contentWindow.document.appendChild(chatTable);
   } else {
       if (chatIFrame.document) {
          scroller = chatIFrame.document.appendChild(tscroller);
          scroller.appendChild(chatTable);
          //chatIFrame.document.appendChild(chatTable);
       } else {
          //chatIFrame.contentWindow.document.body.appendChild(chatTable);
          scroller = chatIFrame.contentWindow.document.body.appendChild(tscroller);
          scroller.appendChild(chatTable);
       }
   }  
}

function disableSubmitBtn() {
    var submitBtn = document.getElementById("login_btn");
    submitBtn.disabled = true;
}

