
var initialized = false;

window.onresize=resized;

// register this to give us a way to turn off the autocomplete when
// a user clicks somewhere on the screen.
window.onclick = handleMouseClick;

function handleMouseClick() {
    clearAutocompletionResults();
    return true;
}


function init() {
    var completeField = document.getElementById("complete-field");
    var autorow = document.getElementById("autocomplete");
    autorow.style.top = (findY(completeField) + completeField.offsetHeight +  5) + "px";
    autorow.style.left = findX(completeField)  +  "px";
}

function resized() {
    // reposition the autocomplete
    var completeField = document.getElementById("complete-field");
    var autorow = document.getElementById("autocomplete");
    if (autorow && completeField) {
        autorow.style.top = findY(completeField) + completeField.offsetHeight +  "px";
        autorow.style.left = findX(completeField)  +  "px";
    }
}

function doSearch() {
	var autocompleteTable = document.getElementById("autocompleteTable");
	var completeField = document.getElementById("complete-field");
    if (completeField.value == "") {
    } else {
       
       var bindArgs = {
            url:  "autocomplete?action=complete&id=" + encodeURIComponent(completeField.value),
            mimetype: "text/xml",
            load: function(type, data) {
               processSearch(data);
             }
        };
        dojo.io.bind(bindArgs);
    }
    clearAutocompletionResults();
}

function doCompletion() {
    if (!initialized) {
        init();
    }
    var completeField = document.getElementById("complete-field");
    if (completeField && completeField.value == "") {
        clearAutocompletionResults();
    } else {
        clearAutocompletionResults();
        var bindArgs = {
            url:  "autocomplete?action=complete&id=" + encodeURIComponent(completeField.value),
            mimetype: "text/xml",
            load: function(type, data) {
               autocompleteCallback(data);
             }
        };
        dojo.io.bind(bindArgs);
    }
}

function autocompleteCallback(responseXML) {
    var items = responseXML.getElementsByTagName("id");
    var completeText = "";
    if (items.length <= 0) {
        clearAutocompletionResults();
        clearNodes("autocompleteTable");
    }  else {
        clearNodes("autocompleteTable");
        for (loop = 0; loop < items.length; loop++) {
            var id = responseXML.getElementsByTagName("id")[loop].childNodes[0].nodeValue;
            var name = responseXML.getElementsByTagName("name")[loop].childNodes[0].nodeValue;
            var rowStyle = "popupRow";
            if ((loop % 2) == 0 ) {
                rowStyle = "popupRowEven";
            }
            completeText += "<tr>" +
                        "<td class=\"" + rowStyle +"\" onmouseover=\"this.className='popupRowHover'\"" +
                        " onmouseout=\"this.className='" + rowStyle + "'\"" +
                        "<a onclick=\"showSearchItem('" + id + "');return false;\">" + name + "</a>" +
                       "</td></tr>";
        }
        var autocompleteTable = document.getElementById("autocompleteTable");
        autocompleteTable.innerHTML = completeText;
        autocompleteTable.style.visibility='visible';
    }
}

function clearAutocompletionResults() {
    var popUp = document.getElementById("autocomplete");
    var autocompleteTable = document.getElementById("autocompleteTable");
    autocompleteTable.style.visibility='hidden';
    clearNodes("autocompleteTable");
}


function processSearch(responseXML) {
    
	var categories = responseXML.getElementsByTagName("id");
    var c = new Category("search");
    for (var loop = 0; loop < categories.length; loop++) {
      var id = responseXML.getElementsByTagName("id")[loop].childNodes[0].nodeValue;
      var image = responseXML.getElementsByTagName("image-url")[loop].childNodes[0].nodeValue;
      var name = responseXML.getElementsByTagName("name")[loop].childNodes[0].nodeValue;
      var description = responseXML.getElementsByTagName("description")[loop].childNodes[0].nodeValue;
      var price = responseXML.getElementsByTagName("price")[loop].childNodes[0].nodeValue;
      c.addItem(id,image,name,description,price);
    }
    gcats.put("search", c);
    showCategoryItems("search",0,chunkSize);
}

function showSearchItem(id) {
   resetBody();
   engine.inject({template: "items.htmf", injectionPoint: document.getElementById("bodyCenter"), initFunction: function(){getSearchItem(id);}});
}

function getSearchItem(id) {
      var c = gcats.get("search");
      var autocompleteTable = document.getElementById("autocompleteTable");
      if (c != null) {
        var i = c.getItemById(id);
        if (i != null) {
            if (autocompleteTable) autocompleteTable.style.visibility='hidden';
            clearAutocompletionResults();
            addCategoryItem(document.getElementById("items_table"),"search", i.id,i.image,i.name,i.description,i.price);
            return;
        }
      }
      var bindArgs = {
            url:  "catalog?command=item&id=" + id,
            mimetype: "text/xml",
            load: function(type, data) {
            loadItemCallback(data);
        }
     };
    dojo.io.bind(bindArgs);
    if (autocompleteTable) autocompleteTable.style.visibility='hidden';
    clearAutocompletionResults();
}


function clearNodes(id) {
    var target = document.getElementById(id);
    if (target) target.innerHTML = "";
}
