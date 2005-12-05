var messageHash = -1;
var targetId = -1;
var centerCell;
var size=40;
var increment = 100/size;

function initProgressBar() {
    createProgressBar();
    var progress = $("progress-popup");
    progress.style.top="150px";
    progress.style.left="200px";
    messageHash = 0;
    var dragme = new Dragable(progress);
}

function hideProgressBar() {
    var progress = $("progress-popup");
    progress.style.visibility='hidden';
}

function pollTaskmaster() {    
    var bindArgs = {
        url:  "checkout?messageHash=" + encodeURI(messageHash) + "&targetId=" + targetId,
        mimetype: "text/xml",
        load: function(type, data) {
            progressbarCallback(data);
        }
     };
    dojo.io.bind(bindArgs);
}

function progressbarCallback(responseXML) {
    var item = responseXML.getElementsByTagName("message")[0];
    var message = item.firstChild.nodeValue;
    showProgress(message);
    messageHash = message;             
    if (messageHash < 100) {
        setTimeout("pollTaskmaster()", 2000);
    } else {
        setTimeout("complete()", 2500);
    }
}

function complete() {
    var idiv = window.document.getElementById("task_id");
    idiv.innerHTML = "";
    var idiv = window.document.getElementById("progress");
    idiv.innerHTML = "<div class=\"progressItem\">Checkout Complete. Your order number is " + targetId + ".</div><br><input type=\"button\" onclick=\"hideProgressBar()\" value=\"Continue\">";
    cart.empty();
    checkingOut = false;
    showCartItems(0,0);
}


// create the progress bar
function createProgressBar() {
    var centerCellName;
    var tableText = "";
    for (x = 0; x < size; x++) {
      tableText += "<td id=\"progress_" + x + "\" width=\"10\" height=\"10\" bgcolor=\"blue\"/>";
      if (x == (size/2)) {
          centerCellName = "progress_" + x;
      }
    }
    var idiv = window.document.getElementById("progress");
    idiv.innerHTML = "<table with=\"100\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr>" + tableText + "</tr></table>";
    centerCell = window.document.getElementById(centerCellName);
}

// show the current percentage
function showProgress(percentage) {
    var percentageText = "";
    if (percentage < 10) {
        percentageText = "&nbsp;" + percentage;
    } else {
        percentageText = percentage;
    }
    centerCell.innerHTML = "<font color=\"white\">" + percentageText + "%</font>";
    var tableText = "";
    for (x = 0; x < size; x++) {
      var cell = window.document.getElementById("progress_" + x);
      if ((cell) && percentage/x < increment) {
        cell.style.backgroundColor = "blue";
      } else {
        cell.style.backgroundColor = "green";
      }      
    }
}
