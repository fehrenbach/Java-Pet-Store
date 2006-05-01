<%@page contentType="text/xml"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="com.sun.javaee.blueprints.petstore.model.CatalogFacade, com.sun.javaee.blueprints.petstore.model.Item"%>

<%
    String itemId=request.getParameter("itemId");

    try {
       ServletContext context=config.getServletContext();
       CatalogFacade cf=(CatalogFacade)context.getAttribute("CatalogFacade");
       Item item=cf.getItem(itemId);
 
        out.println("<response>");
        out.println("<name>" + item.getName() + "</name>");
        out.println("<description>" + item.getDescription() + "</description>");
        out.println("<price>" + java.text.NumberFormat.getCurrencyInstance().format(item.getPrice()) + "</price>");
        out.println("<image>" + request.getContextPath() + "/" + item.getImageThumbURL() + "</image>");
        out.println("</response>");
        out.flush();
    } catch(Exception ee) {
        ee.printStackTrace();
    }

%>