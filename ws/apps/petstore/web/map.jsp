<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui/14" %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Map Display</title>
    </head>
    <body>
        <h1>Map Display</h1>
        <f:view>
    
            <ui:mapViewer id="mapViewerx" center="#{MapBean.mapPoint}" info="#{MapBean.mapMarker}"
            markers="#{MapBean.locations}" zoomLevel="#{MapBean.zoomLevel}" style="height: 500px; width: 700px"/>

        </f:view>
    </body>
</html>
