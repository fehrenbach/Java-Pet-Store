<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: tag.jsp,v 1.1 2006-09-14 01:53:11 basler Exp $ --%>

<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="java.util.*, com.sun.javaee.blueprints.petstore.model.CatalogFacade, com.sun.javaee.blueprints.petstore.model.Tag"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui5" uri="http://java.sun.com/blueprints/ui" %>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Tag Page</title>
<%
    try {
        CatalogFacade cf = (CatalogFacade)config.getServletContext().getAttribute("CatalogFacade");
        Collection<Tag> tags=cf.getTagsInChunk(0, 20);
    
%>
        
    </head>
    <body>   
        <jsp:include page="banner.jsp" />
        <center>
        <h1>Tag Page</h1>
        <table border="0">
            <tr>    
<%
    for(Tag tag : tags) {
        out.println("<td align='center'><font size='+" + (tag.getRefCount() / 10) + "'>" + tag.getTag() + "</font> (" + tag.getRefCount() + ")</td>");
    }
%>
            </tr>
        </table>
        </center>
        <jsp:include page="footer.jsp" />
    </body>
</html>

<%
    } catch(Exception e) {
        e.printStackTrace();
    }
%>