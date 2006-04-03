
<link rel="stylesheet" type="text/css" href="styles.css"></link>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/autocomplete.js"></script>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/ajax-commons.js"></script>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/dojo.js"></script>

<table border="0" bordercolor="gray" cellpadding="0" cellspacing="0" bgcolor="white" width="100%">
 <tr id="injectionPoint">
  <td width="100"><img src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/images/banner_logo.gif" border="0"></td>
  <td>
  <div class="banner">Java Petstore</div>
  </td>
  <td align="right">
      <form name="autofillform" action="autocomplete"  onsubmit="return false;">
        <input type="hidden" name="action" value="lookupbyname"/>
         <input    type="text"
                size="15"
                autocomplete="off"
                  id="complete-field"
				name="id"
             onkeyup="doCompletion();">
             <input    type="button"
                  id="search-button"
				value="Search"
             onclick="doSearch();">
    </form>
  </td>
  </td>
 </tr>
  <tr bgcolor="gray">
  <td colspan="3"  align="right">
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/fileupload.jsp">Seller</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/search.jsp">Search</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/catalog.jsp">Catalog</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/mapAll.jsp">Map</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/index.jsp">Main</a>
  </td>
 </tr>
 </table>

<div id="autocomplete" class="autocomplete"><table id="autocompleteTable" class="autocompleteTable"></table></div>