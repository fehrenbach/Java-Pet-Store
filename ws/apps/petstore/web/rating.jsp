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
