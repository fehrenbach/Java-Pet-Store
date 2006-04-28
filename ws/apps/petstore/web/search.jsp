<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="java.util.*, com.sun.javaee.blueprints.petstore.search.SearchIndex, com.sun.javaee.blueprints.petstore.search.IndexDocument, com.sun.javaee.blueprints.petstore.search.UpdateIndex, com.sun.javaee.blueprints.petstore.util.PetstoreConstants"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui/14" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Search Page</title>
    </head>
    <body>   
        <jsp:include page="banner.jsp" />
        <center>

        <script type="text/javascript">
            function checkAll() {
                var elems=dojo.byId("resultsForm").elements;
                for(ii=0; ii < elems.length; ii++) {
                    if(elems[ii].name.indexOf("mapSelectedItems") >= 0) {
                        elems[ii].checked=true;
                    }
                }
                return false;
            }
    
            function uncheckAll() {
                var elems=dojo.byId("resultsForm").elements;
                for(ii=0; ii < elems.length; ii++) {
                    if(elems[ii].name.indexOf("mapSelectedItems") >= 0) {
                        elems[ii].checked=false;
                    }
                }
                return false;
            }
        </script>        
  
        <f:view>
            <h1>Search Page</h1>
            <h:form id="searchForm">
                <table border="1" cellpadding="5" cellspacing="5" style="border-style:double; width:600px; border-color:darkgreen; padding:5px">
                    <tr>
                        <th>Search String</th>
                        <td>
                            <h:inputText size="50" id="searchString" value="#{SearchBean.searchString}"/> 
                            Also Search Tags:<h:selectBooleanCheckbox id="searchTags" value="#{SearchBean.searchTags}"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan="2">
                            <h:commandButton action="#{SearchBean.searchAction}" id="searchSubmit" type="submit" value="Submit"/>
                            <h:commandButton id="searchReset" type="reset" value="Reset"/>
                        </td>
                    </tr>
                </table>
                <h:messages/>
            </h:form>
            <br/>
            
            <h:form id="resultsForm">
                <h:dataTable id="results" border="1" 
                    value="#{SearchBean.hits}" var="item" rendered="#{SearchBean.showResults}"
                    style="border-style:double; width:600px; border-color:darkgreen; padding:5px"
                    cellpadding="5px" cellspacing="5px" >
                
                    <h:column >
                        <f:facet name="header">
                            <h:panelGroup>
                                <h:outputText value="Map"/><br/>
                                <h:commandButton image="../images/check_all.gif" onclick="return checkAll()"/>
                                <h:commandButton image="../images/uncheck_all.gif" onclick="return uncheckAll()"/>
                            </h:panelGroup>
                        </f:facet>
                        
                        <input type="checkbox" name="mapSelectedItems" value="<h:outputText value='#{item.UID}'/>"/>                        
                        
                    </h:column>
                    <h:column>
                        <f:facet name="header">
                            <h:outputText value="Name"/>
                        </f:facet>
                        <h:outputText value="#{item.title}"/>
                    </h:column>
                    <h:column>
                        <f:facet name="header">
                            <h:outputText value="Description"/>
                        </f:facet>
                        <h:outputText value="#{item.summary}"/>
                    </h:column>
                    <h:column>
                        <f:facet name="header">
                            <h:outputText value="Price"/>
                        </f:facet>
			<h:outputText id="price" value="#{item.price}">
                            <f:convertNumber type="currency" pattern="$####.00"/>
                            <h:message for="price"/>
			</h:outputText>                        
                    </h:column>
                    <h:column>
                        <f:facet name="header">
                            <h:outputText value="Tag(s)"/>
                        </f:facet>
                        <h:outputText value="#{item.tag}"/>
                    </h:column>
                    <f:facet name="footer">
                        <h:panelGroup>
                            <br/>
                            <center>
                                <table border=1 cellpadding="5" cellspacing="5">
                                    <tr>
                                        <th align="right">Center Point Address:</th>
                                        <td>
                                            <h:inputText id="centerAddress" value="#{MapBean.centerAddress}" size="50"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th align="right">Area (in Miles):</th>
                                        <td>
                                            <h:inputText id="radius" value="#{MapBean.radius}" size="5"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" colspan="2">
                                            <h:commandButton action="#{MapBean.findAllByIDs}" id="mapSubmit" type="submit" 
                                            value="Map Checked Item(s)" rendered="#{SearchBean.showResults}"/>
                                        </td>
                                    </tr>
                                </table>
                            </center>
                            <br/>
                        </h:panelGroup>
                    </f:facet>
                </h:dataTable>
                
                <h:messages/>
            </h:form>
            <br/><br/><br/>
        </f:view>
        </center>
    </body>
</html>
