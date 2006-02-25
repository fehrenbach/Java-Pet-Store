/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: accordion.js,v 1.1 2006-02-25 01:29:08 gmurray71 Exp $
*/

var isIE;

var displayPortWidth = 100;
var displayPortHeight=400;

var itemWidth=100;
var itemHeight=75;
var increment = 4;

var timeout = 30; // in ms

var accordion;
var divs;
var titleRow;
var titleSize = 200;
var oExpandedIndex = -1;
var nExpandedIndex = -1;
var oHeight = 65;
var nHeight = 65;
var tHeight = 200;
var expanding = false;
var categories;

var topX = 100;
var topY = 50;

// looping method for time out 
function scroll() {
     if (scrollRight) getNext();
     else if (scrollLeft) getPrevious();
}
 // do the value list pre-emptive fetching

  function loadAccordion() {
     divs = new Array();
     accordion = document.getElementById("accordion");
     // load the first set of images
     var ajax = new AJAXInteraction("categories.js", postProcessAccordion, 'text');
     ajax.doGet();
 }
 
 function postProcessAccordion(responseText) {
     categories = eval(responseText);
     // create title row
     titleRow = createRow("accordionTitle");
     titleRow.innerHTML = "Pets";
     //accordion.appendChild(titleRow);
     // now create all the rows
     for (var l=0; l < categories.length; l++) {
         var row = createRow( "accordionRow");
         createLinks(row, categories[l].name, l, "accordionLink");
         //accordion.appendChild(row);
         divs.push(row);
     }
    // layoutDivs();
 }
 
 function layoutDivs() {
     // layout the title
     titleRow.style.top = topY + "px";
     
     for (var i=0; i < divs.length; i++) {
         divs[i].style.top = topY + 200 + (i*55) + "px";
     }
 }
 

 function expandRow(id) {
    //alert("expanding " + id);
    // jump out if we are in progress
    if (!expanding && oExpandedIndex != Number(id)) {
        expanding = true;
        nExpandedIndex = Number(id);
        if (oExpandedIndex != -1) {
            // remove the listeners
            divs[oExpandedIndex].innerHTML = "";
            createLinks(divs[oExpandedIndex], categories[oExpandedIndex].name, oExpandedIndex, "accordionLink");
        }
    }
    
    if (expanding) {
        if (nHeight < 145) {
          nHeight = nHeight + increment;         
          divs[nExpandedIndex].style.height = nHeight + "px";

          if (oExpandedIndex != -1) {
              // split between the old and new expanded 
              if (tHeight > 30)  {
                oHeight = oHeight - increment /2;
                tHeight = tHeight - increment / 2;
                titleRow.style.height = tHeight + "px";
              // take all out of the old expanded
              } else {
                  oHeight = oHeight - increment;
              }
              divs[oExpandedIndex].style.height = oHeight + "px";
              //moveDivUp(divs[oExpandedIndex], increment);
          } else {
              tHeight = tHeight - increment;
              titleRow.style.height = tHeight + "px";   
          }
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
            divs[nExpandedIndex].innerHTML = productContent;
            expanding = false;
            oExpandedIndex = nExpandedIndex;
            nExpandedIndex = -1;
            oHeight = nHeight;
            nHeight = 30;
            return;
        }
        setTimeout("expandRow('" + id + "')", timeout);
    }
 }
 
 function moveDivUp(tDiv, increment) {
   var divTops = split(tDiv.style.top, "px");
   var divTop = 0;
   if (divTops) divTop = Number(divTops[0]);
   divs[i].style.top = (divTop - increment) + "px";
 }
 
 function createLinks(tDiv, text, id, linkStyle) {
    var link =document.createElement("a");
    link.className = linkStyle;  
    link.appendChild(document.createTextNode(text));
    link.setAttribute("id", id);
    if (isIE) {
        link.attachEvent('onmouseover',function(e){expandRow(e.srcElement.getAttribute("id"));});
    } else {
        link.addEventListener('mouseover',function(e){expandRow(e.currentTarget.getAttribute("id"));}, true);
    }
    tDiv.appendChild(link);
 }
 
 function createRow(rowStyle) {
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
    return nDiv;
 }
 