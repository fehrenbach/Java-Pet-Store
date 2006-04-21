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
        <jsp:include page="banner.jsp" />
        <br>
        <center>
        <table border="1" cellspacing="5px" cellpadding="5px"
            style="border-style:double; border-color:darkgreen; padding:5px">
            <tr>
                <td valign="top" align="center" width="200px">
                    <table border="1">
                        <c:if test="${!empty sessionScope.MapBean.locations}">
                            <tr>
                                <th>
                                    ${sessionScope.MapBean.locationCount} Items Displayed
                                 </th>
                             </tr>
                                <tr>
                                    <td>
                                    <ul>
                                        <c:forEach items="${sessionScope.MapBean.locations}" var="addresses">
                                            <!-- problems with banner, so use google api directly
                                            <li><a href="javascript:bpui.mapviewer.openInfoWindowHtml(mapViewerx, ${addresses.latitude}, ${addresses.longitude}, '${addresses.markup}')">${addresses.markup}</a></li>
                                            -->
                                            <li><a href="javascript:mapViewerx.openInfoWindowHtml(new GPoint(${addresses.longitude}, ${addresses.latitude}), '${addresses.markup}');">${addresses.markup}</a></li>

                                        </c:forEach>
                                    </ul>
                                    <td>
                                </tr>
                        </c:if>
                    </table>
                </td>
                <td>
                    <f:view>
        
                        <ui:mapViewer id="mapViewerx" center="#{MapBean.mapPoint}" info="#{MapBean.mapMarker}"
                        markers="#{MapBean.locations}" zoomLevel="#{MapBean.zoomLevel}" style="height: 500px; width: 700px"/>
        
                    </f:view>
                </td>
            </tr>
        </table>

        
<script type="text/javascript">
    bpui.mapviewer.createMapControl = function() {
      return new GLargeMapControl();
    }    
   
</script>           
<br/><br/>
        </center>
    </body>
</html>
