<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: banner.jsp,v 1.20 2006-05-03 22:00:32 inder Exp $ --%>

<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%@taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@taglib prefix="h" uri="http://java.sun.com/jsf/html"%>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>

<link rel="stylesheet" type="text/css" href="styles.css"></link>
<script type="text/javascript" src="/petstore/dojo.js"></script>
<script type="text/javascript" src="/petstore/faces/static/META-INF/rss/rssbar.js"></script>
<link type="text/css" rel="stylesheet" href="/petstore/faces/static/META-INF/rss/rssbar.css" />
<style type="text/css">

#rss-bar {
    margin: 0 auto 0px;
}

#rss-bar table td#rss-channel {
    background-repeat: no-repeat;
    background-position: top left;
    font-size: 14px;
    font-weight: bold;
    vertical-align: top;
    text-align: center;
    width: 254px;
}

#rss-bar table td#rss-item {
    background-repeat: no-repeat;
    font-size: 14px;
    width: 534px;
    text-align: left;
}
</style>
<script type="text/javascript">
    var rss = new bpui.RSS();
    dojo.addOnLoad(function(){rss.getRssInJson('/petstore/faces/dynamic/bpui_rssfeedhandler/getRssfeed', 'https://blueprints.dev.java.net/servlets/ProjectRSS?type=news', '4');});
</script>

<table border="0" bordercolor="gray" cellpadding="0" cellspacing="0" bgcolor="white" width="100%">
 <tr id="injectionPoint">
  <td width="100"><a class="menuLink" href="/petstore/faces/index.jsp""><img src="/petstore/images/banner_logo.gif" border="0" width="70" height="70"></a></td>
  <td align="left">
   <div class="banner">Java Pet Store</div>
  </td>
  <td id="bannerRight" align="right">
    <a class="menuLink" onmouseover="this.className='menuLinkHover';" onmouseout="this.className='menuLink';" href="/petstore/faces/fileupload.jsp">Seller</a> <span class="menuItem">|</span>
    <a class="menuLink" onmouseover="this.className='menuLinkHover';" onmouseout="this.className='menuLink';" href="/petstore/faces/search.jsp">Search</a> <span class="menuItem">|</span>
    <a class="menuLink" onmouseover="this.className='menuLinkHover';" onmouseout="this.className='menuLink';" href="/petstore/faces/catalog.jsp">Catalog</a> <span class="menuItem">|</span>
    <a class="menuLink" onmouseover="this.className='menuLinkHover';" onmouseout="this.className='menuLink';" href="/petstore/faces/mapAll.jsp">Map</a> <span class="menuItem">|</span>
    <a class="menuLink" onmouseover="this.className='menuLinkHover';" onmouseout="this.className='menuLink';" href="/petstore/index.html">Main</a>
  </td>
  </tr>
 </tr>
  <tr bgcolor="gray">
  <td id="menubar" align="left" colspan="3" height="25" >
    <div id="rss-bar">
    <table border="0" cellpadding="0" cellspacing="0">
        <tr>
        <td id="rss-channel" nowrap="true"></td>
        <td id="rss-item" nowrap="true"></td>
        </tr>
    </table>
    </div>
  </td>
 </tr>
 </table>


