<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="java.util.*, com.sun.javaee.blueprints.petstore.search.SearchIndex, com.sun.javaee.blueprints.petstore.search.IndexDocument"%>

<%--
The taglib directive below imports the JSTL library. If you uncomment it,
you must also add the JSTL library to the project. The Add Library... action
on Libraries node in Projects view can be used to add the JSTL 1.1 library.
--%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%> 

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
  
<%
    try {
        String searchString=request.getParameter("searchString");
        String indexDirectory=request.getParameter("indexDirectory");
        if(searchString == null) searchString="cat";
        String submit=request.getParameter("submit");
        
        if(submit != null && searchString != null) {
            // string to search
            SearchIndex si=new SearchIndex();
            si.query(indexDirectory, searchString);
            request.setAttribute("hitsx", si.getHits());
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
        <table>
            <tr>
                <th align="left">Index File Location:</th>
                <td align="left"><input type="text" size="50" name="indexDirectory" value="<%=System.getProperty("com.sun.aas.installRoot")%>/lib/petstore/searchindex"/></td>
            </tr>
            <tr>
                <th>Search String</th>
                <td><input type="text" size="30" name="searchString" value="<%= searchString %>"/></td>
            </tr>
            <tr>
                <td align="center" colspan="2">
                    <input type="submit" name="submit" value="Submit"/>
                </td>
            </tr>
        </table>
    </form>
    
    here1<br>
    <c:if test="${!empty requestScope.hitsx}">
        here2<br>
        <table>
            <c:forEach items="${requestScope.hitsx}" var="docxx">
                <tr>
                    <td>
                        <a href="${docxx.pageURL}">${docxx.title}</a><br>
                        ${docxx.summary}<br>
                        ${docxx.image}<br>
                        ${docxx.price}<br>
                        ${docxx.UID}<br><br>
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