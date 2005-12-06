<%-- Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: address.jsp,v 1.3 2005-12-06 10:34:54 gmurray71 Exp $ --%>

<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib prefix="dl" uri="http://java.sun.com/blueprints/dl" %>


<div id="account-popup" class="account">
<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
<tr id="address-drag-target">
 <td colspan="2" bgcolor="gray" align="center" class="plainText">Billing Details</td>
 <td bgcolor="gray" align="right" ><a onclick="hideAccount();" style="{cursor:pointer;}"><img src="images/cbutton.gif" border="0"></a>&nbsp;</td>
 </tr>
<tr>
 <td colspan="3">
<f:view>
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
 </f:view>
</td>
</tr>
<tr>
<td colspan="3" align="left">
<span class="plainText">Ship to Billing Address:</span><form><input id="accountShipToBilling" type="checkbox" checked></form>
</td>
</tr>

<tr>
<td colspan="3" align="right">
<input type="button" onclick="showCreditCard();" value="Continue">&nbsp;&nbsp;
</td>
</tr>
<tr>
<td height="25" colspan="3" align="right">
&nbsp;
</td>
</tr>
</table>
</div>
