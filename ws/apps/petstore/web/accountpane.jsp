<%-- Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: accountpane.jsp,v 1.1 2006-01-03 04:45:19 gmurray71 Exp $ --%>

<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib prefix="dl" uri="http://java.sun.com/blueprints/dl" %>

<%@ taglib prefix="a" uri="http://java.sun.com/blueprints/ajax" %>
<f:view>

<a:ajax  name="Accordion" script="accordion.js">
<f:verbatim>
<div dojoType="Accordion"
	orientation="vertical"
	activeSizing="1"
	style="border: 2px solid black; float: left; margin-right: 5px;  width: 500px; height: 400px;"
>
	<div dojoType="AccordionPanel" open="true">
		<div dojoType="Label">
			Account Main
		</div>
</f:verbatim>
   <h:panelGrid cellpadding="5" cellspacing="0" columns="2" style="margin-bottom: 20px">
      <h:outputText styleClass="plainText" value="Name:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.name}" />
      <h:outputText styleClass="plainText" value="Street:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.street}" />
      <h:outputText styleClass="plainText" value="City:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.city}" />
      <h:outputText styleClass="plainText" value="State:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.state}" />
      <h:outputText styleClass="plainText" value="Zip:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.zip}" />   
   </h:panelGrid>
<f:verbatim>
		
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
</f:verbatim>
</a:ajax>

 </f:view>