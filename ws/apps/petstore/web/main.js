var isIE;
var bodyRowText;

dojo.require("dojo.widget.FisheyeList");
init();

function browse(category) {
    window.location.href="catalog.jsp?catid=" + category;
}

function loadPetstore() {
    init();
    showMain();
}

function init() {
    if (navigator.userAgent.indexOf("IE") != -1) isIE = true;
}
