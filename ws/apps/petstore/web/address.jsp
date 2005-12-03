<%-- Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: address.jsp,v 1.1 2005-12-03 06:50:47 gmurray71 Exp $ --%>

<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib prefix="dl" uri="http://java.sun.com/blueprints/dl" %>


<div class="account"  id="account-popup">
<f:view>
   <h:panelGrid cellpadding="5" cellspacing="0" columns="2" style="margin-bottom: 20px">
      <h:outputText styleClass="plainText" value="Name:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.name}" />
      <h:outputText value="Street:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.street}" />
      <h:outputText value="City:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.city}" />
      <h:outputText value="State:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.state}" />
      <h:outputText value="Zip:" />
      <dl:dlabel writeScript="false" size="40" valueBinding="#{AddressBean.zip}" />   
   </h:panelGrid>
 </f:view>
<span class="plainText">Ship to Billing Address:</span><form><input id="accountShipToBilling" type="checkbox" checked></form>

<br>
<input type="button" onclick="showCreditCard();" value="Next">
</div>
