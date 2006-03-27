/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: accordion.js,v 1.11 2006-03-27 23:08:11 gmurray71 Exp $
*/


function AccordionMenu () {
    var isIE;
    
    var displayPortWidth = 100;
    var displayPortHeight=400;
    
    var EXPANDED_HEIGHT = 135;
    var ITEM_HEIGHT = 40;
    var INCREMENT = 8;
    
    var timeout = 10; // in ms
    
    var accordion;
    var divs;
    var titleRow;
    var titleSize = 200;
    var oExpandedIndex = -1;
    var nExpandedIndex = -1;
    var oHeight = ITEM_HEIGHT;
    var nHeight = ITEM_HEIGHT;
    var tHeight = 200;
    var expanding = false;
    var categories;
    
    var topX = 100;
    var topY = 50;
    
    // while control the inline debug statements
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
    
    
    this.load = function() {
        var agent = navigator.userAgent;
        if (agent.indexOf("IE") != -1) {
            isIE = true;
        } else if (agent.indexOf("Safari") != -1) {
            timeout = 0;
        }
        divs = [];
        status = document.getElementById("status");
        accordion = document.getElementById("accordion");
        // load the first set of images
        var ajax = new AJAXInteraction("catalog?command=categories&format=json", postProcessAccordion, 'text');
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
            var row = createRow(l,"accordionRow", ITEM_HEIGHT);
            createLinks(row.div, categories[l].name, l, "accordionLink");
            divs.push(row);
        }
        initiateExpansion(0);
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
    
    function expandRow() {   
        if (expanding) {
            if (nHeight < EXPANDED_HEIGHT) {
                nHeight = nHeight + INCREMENT;         
                divs[nExpandedIndex].div.style.height = nHeight + "px";
                
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
                // take out of the old and apply to the title
            } else if (oExpandedIndex != -1 && oHeight > ITEM_HEIGHT) {
                oHeight = oHeight - INCREMENT;
                tHeight = tHeight + INCREMENT;
                titleRow.setHeight(tHeight);
                // take all out of the old expanded
                divs[oExpandedIndex].setHeight(oHeight);
                // do this for ie only?
                
            } else if (tHeight < 160 && isIE) {
                tHeight = tHeight + INCREMENT;
                titleRow.setHeight(tHeight);	        
            } else {
                // set the contents of the new menu
                var productContent =  categories[nExpandedIndex].name + "<br><br>";
                
                for (var l= 0; l < categories[nExpandedIndex].products.length; l++) {
                    productContent = productContent +  "<span class='accordionProduct'>" + 
                    "<a class='accordionLink' href=\"javascript:is.setProducts('" + categories[nExpandedIndex].products[l].id + "')\">"  +
                    categories[nExpandedIndex].products[l].name + "</a></span>";
                    if (l < categories[nExpandedIndex].products.length - 1) {
                        productContent = productContent + "<p>";
                    }
                }
                productContent = productContent;
                // detach all events from the div
                divs[nExpandedIndex].div.innerHTML = productContent;
                expanding = false;
                oExpandedIndex = nExpandedIndex;
                nExpandedIndex = -1;
                oHeight = nHeight;
                nHeight = ITEM_HEIGHT;
                return;
            }
            showStatus();
            setTimeout(expandRow, timeout);
        }
    }
    
    function createLinks(tDiv, text, id, linkStyle) {
        var link = document.createElement("a");
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
    function AJAXInteraction(url, callback, type) {
        
        var req = init();
        req.onreadystatechange = processRequest;
        
        function init() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                isIE = true;
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        
        function processRequest () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    if (callback) {
                        if (type && type == 'text') {
                            callback(req.responseText);
                        } else {
                            callback(req.responseXML);
                        }
                    }
                }
            }
        }
        
        this.doGet = function() {
            req.open("GET", url, true);
            req.send(null);
        }
        
        this.doPost = function(body) {
            req.open("POST", url, true);
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            req.send(body);
        }
    }
    
}