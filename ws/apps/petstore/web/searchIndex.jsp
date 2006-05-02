<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="com.sun.javaee.blueprints.petstore.search.HTMLParser, com.sun.javaee.blueprints.petstore.search.SQLParser, javax.sql.*, java.sql.*, javax.rmi.*, javax.naming.*"%>

<%--
The taglib directive below imports the JSTL library. If you uncomment it,
you must also add the JSTL library to the project. The Add Library... action
on Libraries node in Projects view can be used to add the JSTL 1.1 library.
--%>
<%--
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%> 
--%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
  
<%
    String indexType=request.getParameter("indexType");
    String submit=request.getParameter("submit");
    if(submit != null) {
        if(indexType != null && indexType.equals("database")) {
            String sqlStatement=request.getParameter("sqlStatement");
            String dataSource=request.getParameter("dataSource");
            String indexDirectory=request.getParameter("indexDirectory");
            SQLParser sp=new SQLParser();
            InitialContext ic=new InitialContext();
            DataSource ds=(DataSource)PortableRemoteObject.narrow(ic.lookup(dataSource), DataSource.class);
            Connection conn=ds.getConnection();
            sp.runSQL(indexDirectory, conn, sqlStatement);

        } else {
            String beginURL=request.getParameter("beginURL");
            String contextRoot=request.getParameter("contextRoot");
            String pageURI=request.getParameter("pageURI");

            if(beginURL != null && contextRoot != null && pageURI != null) {
                // have URL to index
                HTMLParser hp=new HTMLParser();
                hp.runWeb(beginURL, contextRoot, pageURI);
            }
        }
    }

%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Index Page</title>
    </head>
    <body>

        <h1>Index Page</h1>
    
        <%--
        This example uses JSTL, uncomment the taglib directive above.
        To test, display the page like this: index.jsp?sayHello=true&name=Murphy
        --%>
        <%--
        <c:if test="${param.sayHello}">
        <!-- Let's welcome the user ${param.name} -->
        Hello ${param.name}!
        </c:if>
        --%>
    
        <form action="./searchIndex.jsp" method="post">
            <table border="1">
                <tr>
                    <td>
                        <table>
                            <tr>
                                <th align="left" colspan="2">
                                    <input type="radio" name="indexType" value="web"/>
                                    Web Crawl Starting at this location:
                                </th>
                            </tr>
                            <tr>
                                <th align="left">URL:</th>
                                <td align="left"><input type="text" size="50" name="beginURL" value="http://localhost:8080"/></td>
                            </tr>
                            <tr>
                                <th align="left">Context Root:</th>
                                <td align="left"><input type="text" size="50" name="contextRoot" value="petstore"/></td>
                            </tr>
                            <tr>
                                <th align="left" >URI:</th>
                                <td align="left"><input type="text" size="50" name="pageURI" value="main.screen"/></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table>
                            <tr>
                                <th align="left" colspan="2">
                                    <input type="radio" name="indexType" value="database" CHECKED/>
                                    Use datasource with sql statement:
                                </th>
                            </tr>
                            <tr>
                                <th align="left">Index File Location:</th>
                                <td align="left"><input type="text" size="50" name="indexDirectory" value="<%=System.getProperty("com.sun.aas.instanceRoot")%>/lib/petstore/searchindex"/></td>
                            </tr>
                            <tr>
                                <th align="left">Data Source:</th>
                                <td align="left"><input type="text" size="50" name="dataSource" value="java:comp/env/jdbc/PetstoreDB"/></td>
                            </tr>
                            <tr>
                                <th align="left" colspan="2">SQL:</th>
                            </tr>
                            <tr>
                                <td align="left" colspan="2">
                                    <textarea rows="10" cols="70" wrap="soft" 
                                    name="sqlStatement">select itemid "id", name "title", description "summary", imageurl "image", price "price", productid "product", '' tag,  CURRENT_TIMESTAMP "modifiedDate" from "APP"."ITEM"</textarea>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <input type="submit" name="submit" valu="Submit"/>
                    </td>
                </tr>
            </table>
        </form>
  
    
    </body>
</html>
