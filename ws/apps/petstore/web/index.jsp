<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: index.jsp,v 1.11 2006-05-06 21:47:09 inder Exp $ --%>

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
    window.location.href="/petstore/faces/catalog.jsp?catid=" + category;
}
</script>
<table bgcolor="white">
 <tr>
  <td valign="top" width="300"><table id="sidebar" border="0" cellpadding="0">
  <div class="outerbar">

<div class="dojo-FisheyeList"
	dojo:itemWidth="170" dojo:itemHeight="50"
	dojo:itemMaxWidth="340" dojo:itemMaxHeight="100"
	dojo:orientation="verticle"
	dojo:effectUnits="2"
	dojo:itemPadding="10"
	dojo:attachEdge="top"
	dojo:labelEdge="bottom"
	dojo:enableCrappySvgSupport="false">

	<div class="dojo-FisheyeListItem" onClick="browse('Dogs');" 
		dojo:iconsrc="/petstore/images/dogs_icon.gif">
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('Cats');"
		dojo:iconsrc="/petstore/images/cats_icon.gif">
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('Birds');"
		dojo:iconsrc="/petstore/images/birds_icon.gif">
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('Fish');"
		dojo:iconsrc="/petstore/images/fish_icon.gif">
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('Reptiles');"
		dojo:iconsrc="/petstore/images/reptiles_icon.gif">
	</div>
</div>

</div></table></td>
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

        <img src="/petstore/images/splash.gif" 
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

</body>
</html>
