
<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
  <title>Petstore</title>
  
  <script type="text/javascript" src="dojo.js"></script>
  <script type="text/javascript" src="engine.js"></script>
  <script type="text/javascript" src="ajax-commons.js" ></script>
  <script type="text/javascript" src="main.js"></script>
  <script type="text/javascript" src="model.js" ></script>
 </head>
<body>

<jsp:include page="banner.jsp" />
 
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

	<div class="dojo-FisheyeListItem" onClick="browse('dogs');" 
		dojo:iconsrc="images/dogs_icon.gif">
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('cats');"
		dojo:iconsrc="images/cats_icon.gif" c>
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('birds');"
		dojo:iconsrc="images/birds_icon.gif" >
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('fish');"
		dojo:iconsrc="images/fish_icon.gif" >
	</div>

	<div class="dojo-FisheyeListItem" onClick="browse('reptiles');"
		dojo:iconsrc="images/reptiles_icon.gif"  >
	</div>
</div>

</div></table></td>
  <td valign="top" width="100%">
   <div id="bodyCenter"><h1>Loading....</h1>
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