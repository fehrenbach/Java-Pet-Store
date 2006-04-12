<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="java.util.*, com.sun.javaee.blueprints.petstore.search.SearchIndex, com.sun.javaee.blueprints.petstore.search.IndexDocument, com.sun.javaee.blueprints.petstore.search.UpdateIndex, com.sun.javaee.blueprints.petstore.util.PetstoreConstants"%>

<%--
The taglib directive below imports the JSTL library. If you uncomment it,
you must also add the JSTL library to the project. The Add Library... action
on Libraries node in Projects view can be used to add the JSTL 1.1 library.
--%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%> 

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
 <jsp:include page="banner.jsp" />
  
<%
    try {
        String searchString=request.getParameter("searchString");
        if(searchString == null) searchString="cat";
        String submit=request.getParameter("submitx");
        String submitTag=request.getParameter("submitTag");
        String searchTags=request.getParameter("searchTags");
        String tagKeywords=request.getParameter("tagKeywords");

        // perform search
        if(submit != null && searchString != null) {
            // string to search
            SearchIndex si=new SearchIndex();
            // alter search string if tagged
            String searchxx=searchString;
            if(searchTags != null && searchTags.equals("true") && searchString.indexOf(":") < 0) {
                searchxx="contents:" + searchString + " OR tag:" + searchString;
            }
            Vector vtHits=si.query(PetstoreConstants.PETSTORE_INDEX_DIRECTORY, searchxx);
            request.setAttribute("searchStringx", searchxx);
            request.setAttribute("numberOfHits", vtHits.size());
            request.setAttribute("hitsx", vtHits);
        }

        // perform tagging
        if(submitTag != null && tagKeywords != null) {
            String docId=request.getParameter("docId");
            UpdateIndex update=new UpdateIndex();
            update.updateDocTag(PetstoreConstants.PETSTORE_INDEX_DIRECTORY, "tag" , tagKeywords, docId);
        }

%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Search Page</title>
    </head>
    <body>

        <h1>Search Page</h1>
    
    
        <form action="./search.jsp" method="post">
            <table border="1" style="border-style:double; border-color:darkgreen">
                <tr>
                    <th>Search String</th>
                    <td>
                        <input type="text" size="50" name="searchString" value="<%= searchString %>"/> 
                        Also Search Tags:<input type="checkbox" name="searchTags" value="true" CHECKED/>
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="2">
                        <input type="submit" name="submitx" value="Submit"/>
                        <input type="reset" name="resetx" value="Reset"/>
                    </td>
                </tr>
            </table>
        </form>
        <br/><br/><br/>
    
        <c:if test="${!empty requestScope.hitsx}">
            <b>${numberOfHits} hits returned for search string:</b> "${searchStringx}"<br>
            <table border="1" cellpadding="5" cellspacing="5" style="border-style:double; border-color:darkgreen">
                <tr>
                    <th>Map</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Current Tag(s)</th>
                    <th>Add Tag Keyword(s)</th>
                </tr>
                <c:forEach items="${requestScope.hitsx}" var="docxx">
                    <tr>
                        <td>
                            <input name="map:${docxx.UID}" type="checkbox"/>
                        </td>
                        <td>${docxx.title}</td>
                        <td>${docxx.summary}</td>
                        <td>${docxx.price}</td>
                        <td>${docxx.tag}</td>
                        <td>
                            <form action="./search.jsp" method="post">
                                <input name="tagKeywords" type="text" size="30"/>
                                <input type="hidden" name="docId" value="${docxx.UID}"/>
                                <input type="submit" name="submitTag" value="Submit"/>
                            </form>
                        </td>
                    </tr>
                </c:forEach>
            </table>
        </c:if>
    </body>
</html>
<%
        } catch(Exception e) {
            e.printStackTrace();
        }
%>