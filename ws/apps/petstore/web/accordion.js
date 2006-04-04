/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: accordion.js,v 1.13 2006-04-04 05:57:07 gmurray71 Exp $
*/


function AccordionMenu () {
    
    var displayPortWidth = 100;
    var HEIGHT =500;
    
    var EXPANDED_HEIGHT = 135;
    var ITEM_HEIGHT = 55;
    var INCREMENT = 10;
    
    var timeout = 5; // in ms
    
    var accordion;
    var divs;
    var titleRow;
    var oExpandedIndex = -1;
    var nExpandedIndex = -1;
    var oHeight = ITEM_HEIGHT;
    var nHeight = ITEM_HEIGHT;
    var tHeight = 165;
    var expanding = false;
    var categories;
       
    // while control the inline debug statements
    var debug = false;
    var status;
    
    function Row(id, div, defaultHeight) {
        this.id = id;
        this.div = div;
        //this.height = height;
       this.h = defaultHeight;
       this.div.style.height = defaultHeight + "px"
    }
    
    Row.prototype.setHeight = function(nH) {
        this.h = nH;
        this.div.style.height = nH + "px";
        // re-adjust for ie in that it does not follow the boxmodel
        if (this.div.offsetHeight > nH) {
            this.div.style.height = (nH - (this.div.offsetHeight - nH)) + 'px';
        }
    }
    
    Row.prototype.getTotalHeight = function() {
        return this.div.offsetHeight;
    }
    
    Row.prototype.getHeight = function() {
            return this.h;
    }
    
    this.load = function() {
        var agent = navigator.userAgent;
        if (agent.indexOf("Safari") != -1) {
            timeout = 0;
        }
        divs = [];
        status = document.getElementById("status");
        accordion = document.getElementById("accordion");
        // go out and get the categories
        // this should be made more geric
        var bindArgs = {
            url:  "catalog?command=categories&format=json",
            mimetype: "text/json",
            load: function(type,json) {
               postProcessAccordion(json);
             }
        };
        dojo.io.bind(bindArgs);
    }
    
    function postProcessAccordion(lcategories) {
        categories = lcategories;
        // create title row
        titleRow = createRow(0, "accordionTitle", 200);
        titleRow.div.appendChild(document.createTextNode("Pets"));
        if (titleRow.setHeight) {
            titleRow.setHeight(265);
        }
        // now create all the rows
        for (var l=0; l < categories.length; l++) {
            var row = createRow(l,"accordionRow", ITEM_HEIGHT);
            createLinks(row.div, categories[l].name, l, "accordionLink");
            divs.push(row);
        }
        initiateExpansion(0);
    }
    
    function showStatus() {
        if (debug) {
            var stat = "oExpandedIndex=" + oExpandedIndex + " titleRow=" + titleRow.getHeight() + " ";
            for (var i=0; i < divs.length; i++) {
                stat = stat + i + "=" + divs[i].getTotalHeight() + " ";
            }
            status.innerHTML = stat +  " total height=" + accordion.offsetHeight;
            var totalH = 0;
            var tH = 0;
            for (var i=0; i < divs.length; i++) {
                totalH = totalH + divs[i].getHeight();
                tH = tH + divs[i].getTotalHeight();
            }
            totalH = totalH + titleRow.getHeight();
            tH = tH + titleRow.getTotalHeight();
            var s2 = document.getElementById("status_2");
            s2.innerHTML =  "totalH=" + totalH + " tH=" + tH;   
        }
    }
    
    function initiateExpansion(id) {
               
        // jump out if we are in progress
        if (!expanding && oExpandedIndex != Number(id)) {
            expanding = true;
            nExpandedIndex = Number(id);
            if (oExpandedIndex != -1) {
                var targetDiv = divs[oExpandedIndex].div;
                if (targetDiv && targetDiv.childNodes) {
                    for (var l = targetDiv.childNodes.length -1; l >= 0 ; l--) {
                      targetDiv.removeChild(targetDiv.childNodes[l]);
                    }
                }
                createLinks(divs[oExpandedIndex].div, categories[oExpandedIndex].name, oExpandedIndex, "accordionLink");
            }
            expandRow(id);
        }
    }
    
    function expandRow() {
        if (expanding) {
         showStatus();
            //
            if (nHeight < EXPANDED_HEIGHT) {
                nHeight = nHeight + INCREMENT;         
                divs[nExpandedIndex].setHeight(nHeight);
                if (oExpandedIndex != -1) {
                    if (tHeight >= ITEM_HEIGHT)  {
                        oHeight = oHeight - INCREMENT;
                        // take all out of the old expanded
                    } else {
                        oHeight = oHeight - INCREMENT;
                    }
                    divs[oExpandedIndex].setHeight(oHeight);
                    // take equal from the title row
                } else {
                    tHeight = tHeight - INCREMENT;
                    titleRow.setHeight(tHeight);   
                }
            // default exapnd here    
            // take out of the old and apply to the title
            } else if (oExpandedIndex != -1 && oHeight > ITEM_HEIGHT) {
                oHeight = oHeight - INCREMENT;
                //tHeight = tHeight + INCREMENT;
                //titleRow.setHeight(tHeight);
                // take all out of the old expanded
                divs[oExpandedIndex].setHeight(oHeight);
            } else {
                // set the contents of the new menu
                var targetDiv = divs[nExpandedIndex].div;
                if (targetDiv && targetDiv.childNodes) {
                    for (var l = targetDiv.childNodes.length -1; l >= 0 ; l--) {
                      targetDiv.removeChild(targetDiv.childNodes[l]);
                    }
                }
                divs[nExpandedIndex].div.appendChild(document.createTextNode(categories[nExpandedIndex].name));
                divs[nExpandedIndex].div.appendChild(document.createElement("p"));
                for (var l= 0; l < categories[nExpandedIndex].products.length; l++) {
                    var span = document.createElement("span");
                    span.className = "accordionProduct";
                    var link = document.createElement("a");
                    link.className = "accordionLink";
                    var target = categories[nExpandedIndex].products[l].id;
                    dojo.event.connect(link, "onclick", function(evt){
                        this.target = target;
                        dojo.event.topic.publish("/scroller", target);
                    });
                    link.appendChild(document.createTextNode(categories[nExpandedIndex].products[l].name));
                    span.appendChild(link);
                    divs[nExpandedIndex].div.appendChild(span);
                    if (l < categories[nExpandedIndex].products.length - 1) {
                        divs[nExpandedIndex].div.appendChild(document.createElement("p"));
                    }
                }
                expanding = false;
                oExpandedIndex = nExpandedIndex;
                nExpandedIndex = -1;
                oHeight = nHeight;
                nHeight = ITEM_HEIGHT;
                return;
            }

            setTimeout(expandRow, timeout);
        }
    }
    
    function createLinks(tDiv, text, id, linkStyle) {
        var link = document.createElement("a");
        link.className = linkStyle;  
        link.appendChild(document.createTextNode(text));
        link.setAttribute("id", id);
        if (link.attachEvent) {
            link.attachEvent('onmouseover',function(e){initiateExpansion(e.srcElement.getAttribute("id"));});
        } else if (link.addEventListener) {
            link.addEventListener('mouseover',function(e){initiateExpansion(e.currentTarget.getAttribute("id"));}, true);
        }
        tDiv.appendChild(link);
    }
    
    function createRow(id, rowStyle, height) {
        var nDiv =document.createElement("div");
        nDiv.className = rowStyle;
        var row;
        var cell;
        if (accordion.insertRow) {
            row = accordion.insertRow(accordion.rows.length);
            
        } else {
            row = document.createElement("tr");
            accordion.appendChild(row);
        }
        if (row.inserCell) {
            cell = row.insertCell(0);
        } else {
            cell = document.createElement("td");
            row.appendChild(cell);     
        }
        cell.appendChild(nDiv);
        return new Row(id, nDiv, height);
    }
}
