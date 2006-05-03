<%@page contentType="text/xml"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="com.sun.javaee.blueprints.petstore.model.CatalogFacade, com.sun.javaee.blueprints.petstore.model.Item"%>

<%
    String itemId=request.getParameter("itemId");
    String popupView=request.getParameter("popupView");

    try {
        ServletContext context=config.getServletContext();
        CatalogFacade cf=(CatalogFacade)context.getAttribute("CatalogFacade");
        Item item=cf.getItem(itemId);

        if(itemId != null) {
            out.println("<response>");
            out.println("<name>" + item.getName() + "</name>");
            String tmp=null;
            if(popupView != null && popupView.equals("2")) {
                tmp=item.getAddress().addressToString();
            } else {
                tmp=item.getDescription();
            }
            out.println("<description>" + tmp + "</description>");
            out.println("<price>" + java.text.NumberFormat.getCurrencyInstance().format(item.getPrice()) + "</price>");
            out.println("<image>" + request.getContextPath() + "/ImageServlet/" + item.getImageThumbURL() + "</image>");
            out.println("</response>");
            out.flush();
        }
    } catch(Exception ee) {
        ee.printStackTrace();
    }

%>