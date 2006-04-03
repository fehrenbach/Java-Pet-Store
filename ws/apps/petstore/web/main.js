var isIE;
var bodyRowText;

dojo.require("dojo.widget.FisheyeList");

dojo.hostenv.writeIncludes();
dojo.addOnLoad(function () {
loadPetstore();
});



function browse(category) {
    window.location.href="catalog.html?catid=" + category;
}

function loadPetstore() {
    init();
    showMain();
}

function init() {
    
    if (navigator.userAgent.indexOf("IE") != -1) isIE = true;
}


function showMain() {
    var engine = new Engine();
    engine.inject({template: "main.htmf", injectionPoint: $("bodyCenter")});
}

function resetBody() {
    var body = $("bodyCenter");
    body.innerHTML = "";
}


function clearNodes(id) {
    var target = document.getElementById(id);
    if (target) target.innerHTML = "";
}
