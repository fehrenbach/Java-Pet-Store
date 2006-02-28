/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: accordion.js,v 1.6 2006-02-28 08:41:20 gmurray71 Exp $
*/

var isIE;

var displayPortWidth = 100;
var displayPortHeight=400;

var itemWidth=100;
var itemHeight=75;
var increment = 5;

var timeout = 25; // in ms

var accordion;
var divs;
var titleRow;
var titleSize = 200;
var oExpandedIndex = -1;
var nExpandedIndex = -1;
var oHeight = 40;
var nHeight = 40;
var tHeight = 200;
var expanding = false;
var categories;

var topX = 100;
var topY = 50;


var debug = false;

var status;

function Row(id, div, height) {
     this.id = id;
     this.div = div;
     this.height = height;
     this.setHeight = function (height) {
         this.height = height;
         this.div.style.height = height + "px";
     }
}


  function loadAccordion() {
     var agent = navigator.userAgent;
     if (agent.indexOf("IE") != -1) {
       isIE = true;
     }
     divs = [];
     status = document.getElementById("status");
     accordion = document.getElementById("accordion");
     // load the first set of images
     var ajax = new AJAXInteraction("categories.js", postProcessAccordion, 'text');
     ajax.doGet();
 }
 
 function postProcessAccordion(responseText) {
     categories = eval(responseText);
     // create title row
     titleRow = createRow(0, "accordionTitle",200);
     titleRow.div.innerHTML = "Pets";
     if (isIE) {
         titleRow.setHeight(265);
     }
     // now create all the rows
     for (var l=0; l < categories.length; l++) {
         var row = createRow(l,"accordionRow", 35);
         createLinks(row.div, categories[l].name, l, "accordionLink");
         divs.push(row);
     }
 }
 
 function showStatus() {
     if (debug) {
        var stat = "oExpandedIndex=" + oExpandedIndex + " titleRow=" + titleRow.height + " ";
     
        for (var i=0; i < divs.length; i++) {
            stat = stat + i + "=" + divs[i].height + " ";
        }
        status.innerHTML = stat;
     }
 }
 
 function initiateExpansion(id) {
     // jump out if we are in progress
    if (!expanding && oExpandedIndex != Number(id)) {
        expanding = true;
        nExpandedIndex = Number(id);
        if (oExpandedIndex != -1) {
            // remove the listeners
            divs[oExpandedIndex].div.innerHTML = "";
            createLinks(divs[oExpandedIndex].div, categories[oExpandedIndex].name, oExpandedIndex, "accordionLink");
        }
        expandRow(id);
    }
 }
 

 function expandRow(id) {   
    if (expanding) {
        if (nHeight < 150) {
          nHeight = nHeight + increment;         
          divs[nExpandedIndex].div.style.height = nHeight + "px";

          if (oExpandedIndex != -1) {
              // split between the old and new expanded 
              if (tHeight >= 40)  {
                oHeight = oHeight - increment /2;
                tHeight = tHeight - increment / 2;
                titleRow.setHeight(tHeight);
              // take all out of the old expanded
              } else {
                  oHeight = oHeight - increment;
              }
              divs[oExpandedIndex].setHeight(oHeight);
              // take equal from the title row
          } else {
              tHeight = tHeight - increment;
              titleRow.setHeight(tHeight);   
          }
        // take out of the old and apply to the title
        } else if (oExpandedIndex != -1 && oHeight >= 40) {
            oHeight = oHeight - increment /2;
            tHeight = tHeight + increment / 2;
            titleRow.setHeight(tHeight);
            // take all out of the old expanded
            divs[oExpandedIndex].setHeight(oHeight);
            // do this for ie only?
            
        } else if (tHeight < 155 && isIE) {
            tHeight = tHeight + increment;
            titleRow.setHeight(tHeight);	        
        } else {
            // set the contents of the new menu
            var productContent =  categories[nExpandedIndex].name + "<br><br>";
    
            for (var l= 0; l < categories[nExpandedIndex].products.length; l++) {
                productContent = productContent +  "<span class='accordionProduct'>" + 
                    "<a class='accordionLink' href=\"" + categories[nExpandedIndex].products[l].href + "\">"  +
                     categories[nExpandedIndex].products[l].name + "</a></span>";
                     if (l < categories[nExpandedIndex].products.length - 1) {
                        productContent = productContent + "<br><br>";
                     }
            }
            productContent = productContent;
            // detach all events from the div
            divs[nExpandedIndex].div.innerHTML = productContent;
            expanding = false;
            oExpandedIndex = nExpandedIndex;
            nExpandedIndex = -1;
            oHeight = nHeight;
            nHeight = 40;
            return;
        }
        showStatus();
        setTimeout("expandRow('" + id + "')", timeout);
    }
 }
 
 function createLinks(tDiv, text, id, linkStyle) {
    var link =document.createElement("a");
    link.className = linkStyle;  
    link.appendChild(document.createTextNode(text));
    link.setAttribute("id", id);
    if (isIE) {
        link.attachEvent('onmouseover',function(e){initiateExpansion(e.srcElement.getAttribute("id"));});
    } else {
        link.addEventListener('mouseover',function(e){initiateExpansion(e.currentTarget.getAttribute("id"));}, true);
    }
    tDiv.appendChild(link);
 }
 
 function createRow(id, rowStyle, height) {
    var nDiv =document.createElement("div");
    nDiv.className = rowStyle;
    var row;
    var cell;
    if (isIE) {
        row = accordion.insertRow(accordion.rows.length);
        cell = row.insertCell(0);
    } else {
        row = document.createElement("tr");
        cell = document.createElement("td");
        row.appendChild(cell);
        accordion.appendChild(row);
    }
    cell.appendChild(nDiv);
    return new Row(id, nDiv, height);
 }
 