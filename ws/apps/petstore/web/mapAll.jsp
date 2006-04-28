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
        <center>
        <f:view>

            <h:form id="form1">
                <table border="1" cellpadding="5" cellspacing="5" style="border-style:double; width:600px; border-color:darkgreen; padding:5px">
                    <tr>
                        <th align="right">Select Category to Map:</th>
                        <td align="center" colspan=2>
                            <h:selectOneRadio value="#{MapBean.category}" required="true">
                                <f:selectItems value="#{MapBean.categories}"/>
                            </h:selectOneRadio>
                        </td>
                    </tr>
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
                        <td  colspan="2" align="center">
                            <h:commandButton action="#{MapBean.findAllByCategory}" id="submitCat" type="submit" value="Map Category"/>
                        </td>
                    </tr>

                </table>
                <h:messages/>
            </h:form>
        </f:view>
        &nbsp;&nbsp;&nbsp;  
        </center>
    </body>
</html>
