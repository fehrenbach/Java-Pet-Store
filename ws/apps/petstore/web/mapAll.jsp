<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui/14" %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Map Viewer Page</title>
        
        <script type="text/javascript" src="../dojo.js"></script>
    </head>        
    <body>
        <jsp:include page="banner.jsp" />
        <f:view>

            <h:form id="form1">
                <table>
                    <tr>
                        <td align="center" colspan=2>
                            <b>Select Category to Map</b><br/>
                            <h:selectOneRadio value="#{MapBean.category}" required="yes">
                                <f:selectItem itemLabel="Birds" itemValue="BIRDS"/>
                                <f:selectItem itemLabel="Cats" itemValue="CATS"/>
                                <f:selectItem itemLabel="Dogs" itemValue="DOGS"/>
                            </h:selectOneRadio>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h:commandButton action="#{MapBean.findAllAction}" id="submitCat" type="submit" value="Map Category"/>
                        </td>
                    </tr>

                </table>
                <h:messages/>
            </h:form>
        </f:view>
        &nbsp;&nbsp;&nbsp;        
    </body>
</html>
