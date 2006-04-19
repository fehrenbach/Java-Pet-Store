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
            <f:view>

                <ui:mapViewer id="mapViewerx" center="#{MapBean.mapPoint}" info="#{MapBean.mapMarker}"
                markers="#{MapBean.locations}" zoomLevel="#{MapBean.zoomLevel}" style="height: 500px; width: 700px"/>

            </f:view>



<script type="text/javascript">
    bpui.mapviewer.createMapControl = function() {
      return new GLargeMapControl();
    }    
   
</script>           
<br/><br/>
<!--
<span onclick="bpui.mapviewer.openInfoWindowHtml(mapViewerx, 37.642467, -122.052758, 'Hayward&nbsp;Hills&nbsp;Equestrian&nbsp;Center<br>1275&nbsp;Calhoun,&nbsp;Hayward,&nbsp;CA');">
    Select Hayward
</span>
<br/><br/>
<span onclick="bpui.mapviewer.openInfoWindowHtml(mapViewerx, 37.571037, -121.969899, 'Mission&nbsp;Valley&nbsp;Veterinary&nbsp;Clinic<br>55&nbsp;Mowry&nbsp;Ave,&nbsp;Fremont,&nbsp;CA');">
    Select Fremont
</span>
-->
        </center>
    </body>
</html>
