<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="com.sun.javaee.blueprints.petstore.model.CatalogFacade, com.sun.javaee.blueprints.petstore.model.Item, com.sun.javaee.blueprints.petstore.mapviewer.MapBean, com.sun.j2ee.blueprints.ui.mapviewer.MapMarker"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui/14" %>
<%@taglib prefix="ui5" uri="http://java.sun.com/blueprints/ui" %>




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
                    <table border="0">
                        <c:if test="${!empty sessionScope.MapBean.locations}">
                            <tr>
                                <th>
                                    <u>${sessionScope.MapBean.locationCount} Items Displayed</u>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                <ul>
<%
try {
    // need to use scriptlet to preform the reconciliation of items to map coords
    MapBean mapBean=(MapBean)session.getAttribute("MapBean");
    MapMarker[] mapMarkers=(MapMarker[])mapBean.getLocations();
    java.util.List<Item> items=mapBean.getItems();
    for(int ii=0; ii < mapMarkers.length; ii++) {
    
%>
                                        <li>
                                            <a href="javascript:mapViewerx.openInfoWindowHtml(new GPoint(<%= mapMarkers[ii].getLongitude() %>, <%= mapMarkers[ii].getLatitude() %>), '<%= mapMarkers[ii].getMarkup() %>');"  onmouseover="show('pop1', event, '<%= items.get(ii).getItemID() %>')" onmouseout="hide('pop1')">
                                                <%= mapMarkers[ii].getMarkup() %>
                                            </a>
                                        </li>
<%
    }
} catch(Exception ee) {
    ee.printStackTrace();
    
}
%>
                                </ul>
                                <td>
                            </tr>
                        </c:if>
                    </table>
                    </td>
                    <td>
                        <f:view>
                            <ui5:popupTag id="pop1" xmlHttpRequestURL="/petstore/lookup.jsp?itemId=" 
                                elementNamePairs="name=value1,description=value2,price=value3,image=imageId">
                                <!-- Used as spaces to center the table, this could be done programmatically,
                                but browser diff, so I left it in the hands of the component user.  The image is located 
                                in the component jar so for retrieval, push it through the faces servlet -->
                                <img id="spaceImage" height="10px" width="12px" src="/petstore/faces/static/META-INF/popup/images/spacer.gif" align="left">
                                <table border="0" width="270px" bgcolor="#ffffff" cellpadding="5" cellspacing="5">
                                    <tr>
                                        <td align="left" valign="top"><b>Name:</b>
                                        <span id="value1">Loading Data...</span></td>
                                    </tr>
                                    <tr>
                                        <td align="left" valign="top"><b>Description:</b>
                                        <span id="value2">Loading Data...</span></td>
                                    </tr>
                                    <tr>
                                        <td align="left" valign="top"><b>Price:</b>
                                        <span id="value3">Loading Data...</span></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="center"><img name="image" id="imageId" src="" 
                                          alt="[Loading Image...]" border="2"/></td>
                                    </tr>
                                </table>                    
                            </ui5:popupTag>            
                        
        
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
