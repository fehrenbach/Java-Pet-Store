<%-- Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: rssbar.jsp,v 1.3 2006-04-19 22:35:16 gmurray71 Exp $ --%>

<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%@taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@taglib prefix="h" uri="http://java.sun.com/jsf/html"%>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>


    
    <f:view>
        <ui:rssBar url="https://blueprints.dev.java.net/servlets/ProjectRSS?type=news" itemNumber="4"></ui:rssBar>
    </f:view>
