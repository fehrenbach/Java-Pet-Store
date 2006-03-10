<%@ taglib prefix="a" uri="http://java.sun.com/blueprints/ajax-jsf-wrapper" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>

<h2>Dojo Tree Test</h2>
<hr>
<f:view>
<a:ajax type="dojo" name="DatePicker">
<div dojoType="datepicker"></div>
</a:ajax>
</f:view>