
<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%@taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@taglib prefix="h" uri="http://java.sun.com/jsf/html"%>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>


<script type="text/javascript">
    if (typeof dojo == 'undefined') {   
        load("/petstore/dojo.js");
    }
    function load(target) {
        document.write("<script type='text/javascript' src='" + target + "'><" + "/script>");
    }
</script>


<link rel="stylesheet" type="text/css" href="styles.css"></link>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/autocomplete.js"></script>
<script type="text/javascript" src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/ajax-commons.js"></script>

<table border="0" bordercolor="gray" cellpadding="0" cellspacing="0" bgcolor="white" width="100%">
 <tr id="injectionPoint">
  <td width="100"><img src="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/images/banner_logo.gif" border="0" width="70" height="70"></td>
  <td align="left" colspan="1">
  <div class="banner">Java Pet Store</div>
  </td>
  <td id="bannerRight">
  </td>
  </td>
 </tr>
  <tr bgcolor="gray">
  <td id="menubar" align="left" width="650" height="50" colspan="2" >
      <f:view>
        <ui:rssBar url="https://blueprints.dev.java.net/servlets/ProjectRSS?type=news" itemNumber="4"></ui:rssBar>
    </f:view>
  </td>
  <td  align="right">
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/fileupload.jsp">Seller</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/search.jsp">Search</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/catalog.jsp">Catalog</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/mapAll.jsp">Map</a> <span class="menuItem">|</span>
  <a class="menuLink" href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/faces/index.jsp">Main</a>
  </td>
 </tr>
 </table>

<div id="autocomplete" class="autocomplete"><table id="autocompleteTable" class="autocompleteTable"></table></div>

