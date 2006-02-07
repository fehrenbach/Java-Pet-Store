<%@ taglib prefix="a" uri="http://java.sun.com/blueprints/ajax-jsf-wrapper" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>

<h2>Dojo Combobx Test</h2>
<hr>

<f:view>
<a:ajax type="dojo" name="ComboBox">
<form action="#" method="GET">
	<input dojoType="combobox" value="this should be replaced!"
		dataUrl="AutocompleteBean-completeCountry.ajax" style="width: 300px;" name="foo.bar">
	<input type="submit">
</form>
</a:ajax>
</f:view>