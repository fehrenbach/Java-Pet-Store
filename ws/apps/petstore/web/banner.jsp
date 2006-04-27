

<script type="text/javascript" src="engine.js"></script>
<script type="text/javascript" src="dojo.js"></script>

<link rel="stylesheet" type="text/css" href="styles.css"></link>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/autocomplete.js"></script>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/ajax-commons.js"></script>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/dojo.js"></script>
<table border="0" bordercolor="gray" cellpadding="0" cellspacing="0" bgcolor="white" width="100%">
 <tr id="injectionPoint">
  <td width="100"><img src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/images/banner_logo.gif" border="0" width="70" height="70"></td>
  <td align="left" colspan="2">
  <div class="banner">Java Pet Store Reference Application, Ver 2.0</div>
  </td>
  <td id="bannerRight">
  </td>
  </td>
 </tr>
  <tr bgcolor="gray">
  <td id="menubar" align="left" width="600" height="30" colspan="2" ></td>
  <td  align="right">
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/fileupload.jsp">Seller</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/search.jsp">Search</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/catalog.jsp">Catalog</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/mapAll.jsp">Map</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/index.jsp">Main</a>
  </td>
 </tr>
 </table>

<div id="autocomplete" class="autocomplete"><table id="autocompleteTable" class="autocompleteTable"></table></div>

<script type="text/javascript">
dojo.event.connect("before", window, "onload", this, "init");

function init() {
    //var rss = new bpui.RSS();
    var engine = new Engine();
    if (document.getElementById("menubarTODO")) {
        engine.inject({url:"/petstore/faces/rssbar.jsp",
                       injectionPoint: document.getElementById("menubar"),
                       initFunction : function() {
                            var handler = function() {
                                //rss.getRssInJson('https://blueprints.dev.java.net/servlets/ProjectRSS?type=news', '4');
                            }
                            setTimeout(handler, 1000);
                       }
        });
    }
    
}
</script>