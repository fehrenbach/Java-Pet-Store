<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: index.jsp,v 1.14 2006-11-14 01:10:50 basler Exp $ --%>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <title>Java Pet Store Reference Application</title>
</head>
<body>

<jsp:include page="banner.jsp" />
<script>
dojo.require("dojo.widget.FisheyeList");
function browse(category) {
    window.location.href="${pageContext.request.contextPath}/faces/catalog.jsp?catid=" + category;
}
</script>
<table bgcolor="white">
<tr>
    <td valign="top" width="300">
        <table id="sidebar" border="0" cellpadding="0">
            <div class="outerbar">
                
                <div dojoType="FisheyeList"
                     itemWidth="170" itemHeight="50"
                     itemMaxWidth="340" itemMaxHeight="100"
                     orientation="verticle"
                     effectUnits="2"
                     itemPadding="10"
                     attachEdge="top"
                     labelEdge="bottom"
                     enableCrappySvgSupport="false">
                    
                    <div dojoType="FisheyeListItem" onClick="browse('Dogs');" 
                         iconsrc="${pageContext.request.contextPath}/images/dogs_icon.gif">
                    </div>
                    
                    <div dojoType="FisheyeListItem" onClick="browse('Cats');"
                         iconsrc="${pageContext.request.contextPath}/images/cats_icon.gif">
                    </div>
                    
                    <div dojoType="FisheyeListItem" onClick="browse('Birds');"
                         iconsrc="${pageContext.request.contextPath}/images/birds_icon.gif">
                    </div>
                    
                    <div dojoType="FisheyeListItem" onClick="browse('Fish');"
                         iconsrc="${pageContext.request.contextPath}/images/fish_icon.gif">
                    </div>
                    
                    <div dojoType="FisheyeListItem" onClick="browse('Reptiles');"
                         iconsrc="${pageContext.request.contextPath}/images/reptiles_icon.gif">
                    </div>
                </div>
                
            </div>
        </table>
    </td>
    <td valign="top" width="100%">
        <div id="bodyCenter">
            <table valign="top" id="bodyTable" border="0">
                <tr>
                    <td>
                        <map name="petmap">
                            <area onmouseover="javascript:this.style.cursor='pointer';" onclick="browse('Birds')" 
                                  alt="Birds" 
                                  coords="72,2,280,250">
                            <area onmouseover="javascript:this.style.cursor='pointer';" onclick="browse('Fish')" 
                                  alt="Fish" 
                                  coords="2,180,72,250">
                            <area onmouseover="javascript:this.style.cursor='pointer';" onclick="browse('Dogs')" 
                                  alt="Dogs" 
                                  coords="60,250,130,320">
                            <area onmouseover="javascript:this.style.cursor='pointer';" onclick="browse('Reptiles')" 
                                  alt="Reptiles" 
                                  coords="140,270,210,340">
                            <area onmouseover="javascript:this.style.cursor='pointer';" onclick="browse('Cats')" 
                                  alt="Cats" 
                                  coords="225,240,295,310">
                            <area onmouseover="javascript:this.style.cursor='pointer';" onclick="browse('Birds')" 
                                  alt="Birds" 
                                  coords="280,180,350,250">
                        </map>
                        
                        <img src="${pageContext.request.contextPath}/images/splash.gif" 
                             alt="Pet Selection Map"
                             usemap="#petmap" 
                             width="350" 
                             height="355" 
                             border="0">
                    </td>
                </tr>
            </table>
            
        </div>
    </td>
    </td>
</tr>
</table>

<div style="position: absolute; visibility: hidden;z-index:5" id="menu-popup">
    <table id="completeTable" class="popupTable" ></table>
</div>

<br/><br/>
<jsp:include page="footer.jsp" />

</body>
</html>
