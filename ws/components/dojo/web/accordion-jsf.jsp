<%@ taglib prefix="a" uri="http://java.sun.com/blueprints/ajax-jsf-wrapper" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>

<h2>Dojo Acordion</h2>
<hr>

<f:view>
<a:ajax type="dojo" name="Accordion"  script="accordion.js">
<div dojoType="Accordion"
	orientation="vertical"
	activeSizing="1"
	style="border: 2px solid black; float: left; margin-right: 5px;  width: 500px; height: 400px;">
	<div dojoType="AccordionPanel" open="true">
		<div dojoType="Label">
			Account Main
		</div>
		This is the main screen.
	</div>
	<div dojoType="AccordionPanel" 
		label="Credit Card"
		style="background-color: yellow; border: 3px solid purple;">
		Credit Card Stuff
	</div>
	<div dojoType="AccordionPanel"
		label="Address Book">
		Address Book Here
	</div>
</div>
</a:ajax>
</f:view>