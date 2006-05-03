<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: rating.jsp,v 1.3 2006-05-03 22:00:34 inder Exp $ --%>

<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui/14" %>

<f:view>
    <ui:rating id="rating" maxGrade="5" includeNotInterested="false" includeClear="true" 
    hoverTexts="#{RatingBean.ratingText}" notInterestedHoverText="Not Interested" clearHoverText="Clear Rating"
    grade="#{RatingBean.grade}"/>
</f:view>
