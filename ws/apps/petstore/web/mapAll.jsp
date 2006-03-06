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
                        <td>
                            Map Center Location: 
                        </td>
                        <td colspan=2>
                            <h:inputText size="100" id="locationx" value="#{MapBean.location}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Information Window Contents:  
                        </td>
                        <td colspan=2>
                            <h:inputText size="100" id="info" value="#{MapBean.info}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Mile Radius
                        </td>
                        <td>
                            <h:inputText size="10" id="radius" value="#{MapBean.radius}"/><br/>
                            (default data has from 1-49 mile radius)
                        </td>
                    </tr>
                    <tr>
                        <td colspan=2>
                            <br><br>
                            <h:dataTable id="locations" value="#{MapBean.mapLocations}" var="address">
                                <h:column>
                                    <f:facet name="header">
                                        <h:outputText value="Address Points"/>
                                    </f:facet>
                                    <h:inputText id="address" size="60" value="#{address.address}"/>
                                </h:column>
                                <h:column>
                                    <f:facet name="header">
                                        <h:outputText value="Information about point"/>
                                    </f:facet>
                                    <h:inputText id="city" size="40" value="#{address.info}"/>
                                </h:column>
                            </h:dataTable>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan=2>
                            <br>
                            <h:commandButton action="#{MapBean.findAllAction}" id="find" type="submit" value="Find It"/>&nbsp;&nbsp;&nbsp;
                            <h:commandButton id="addx" action="#{MapBean.addMapLocation}" value="Add Point"/>&nbsp;&nbsp;&nbsp;
                            <h:commandButton action="#{MapBean.initPage}" id="reset" value="Reset"/>
                            <br><br>
                        </td>
                    </tr>

                </table>
                <h:messages/>
            </h:form>
        </f:view>
    </body>
</html>
