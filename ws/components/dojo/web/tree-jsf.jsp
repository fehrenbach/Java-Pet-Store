<%@ taglib prefix="a" uri="http://java.sun.com/blueprints/ajax-jsf-wrapper" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>

<h2>Dojo Tree Test</h2>
<hr>
<f:view>
<a:ajax type="dojo" name="Tree">
<div dojoType="Tree" publishSelectionTopic="treeSelected" toggle="fade">

 <div dojoType="TreeNode" title="Item 1">
  <div dojoType="TreeNode" title="Item 1.1"><br/></div>
  <div dojoType="TreeNode" title="Item 1.2">
  <div dojoType="TreeNode" title="Item 1.2.1"></div>
  <div dojoType="TreeNode" title="Item 1.2.2"></div>
 </div>

 <div dojoType="TreeNode" title="Item 1.3">
  <div dojoType="TreeNode" title="Item 1.3.1"></div>
  <div dojoType="TreeNode" title="Item 1.3.2"></div>
 </div>
 
 <div dojoType="TreeNode" title="Item 1.4">
  <div dojoType="TreeNode" title="Item 1.4.1"></div>
 </div>
 
</div>
</a:ajax>
</f:view>