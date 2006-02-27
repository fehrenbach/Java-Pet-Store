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
    </head>        
    <body>
        <f:view>
            <h1>Map Viewer Page</h1>
            <h:form id="form1">
                <table>
                    <tr>
                        <td colspan="2">
                            Proxy Host:
                            <h:inputText size="30" id="proxyHost" value="#{MapBean.proxyHost}"/>&nbsp;&nbsp;
                            Proxy Port:
                            <h:inputText size="5" id="proxyPort" value="#{MapBean.proxyPort}"/><br>
                            (if proxy necessary, the server.policy also has to be updated. Not necessary after build 38 of Glassfish)<br><br><br>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Addresses (1st entry is the main/center point)
                        </th>
                        <th>
                            Popup Balloon Information
                        </th>
                    </tr>
                    
                    <tr>
                        <td>
                            <h:inputText size="75" id="location0" value="#{MapBean.location}"/>
                        </td>
                        <td>
                            <h:inputText size="30" id="info0" value="#{MapBean.info}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h:inputText size="75" id="location1" value="#{MapBean.location1}"/>
                        </td>
                        <td>
                            <h:inputText size="30" id="info1" value="#{MapBean.info1}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h:inputText size="75" id="location2" value="#{MapBean.location2}"/>
                        </td>
                        <td>
                            <h:inputText size="30" id="info2" value="#{MapBean.info2}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h:inputText size="75" id="location3" value="#{MapBean.location3}"/>
                        </td>
                        <td>
                            <h:inputText size="30" id="info3" value="#{MapBean.info3}"/>
                        </td>
                    </tr>
                    
                    
                    
                    <tr>
                        <td align="center" colspan=2>
                            <br>
                            <h:commandButton action="#{MapBean.findAllAction}" id="find" type="submit" value="Find It"/>
                            <br><br>
                        </td>
                    </tr>

                </table>
            </h:form>
        </f:view>
    </body>
</html>
