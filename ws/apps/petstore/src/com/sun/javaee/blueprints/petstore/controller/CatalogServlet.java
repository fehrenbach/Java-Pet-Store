
package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.sql.DataSource;

import com.sun.javaee.blueprints.petstore.model.*;
import javax.annotation.Resource;

/**
 * This is a simple example of an HTTP Servlet.  It responds to the GET
 * method of the HTTP protocol.
 */
public class CatalogServlet extends HttpServlet { 

   private ItemDAO dao;
   private ServletContext context;
   @Resource private DataSource PetstoreDB;

   public void init(ServletConfig config) throws ServletException {
       context = config.getServletContext();
       dao =
            (ItemDAO)context.getAttribute("itemDAO");
         if (dao == null)
             System.out.println("Creating the DAO with DS=" + PetstoreDB);
             dao = new ItemDAO(PetstoreDB);
             context.setAttribute("itemDAO", dao);
   }

   public void destroy() {
   	  dao = null;
   }   
   
   public void doGet (HttpServletRequest request,
                      HttpServletResponse response)
       throws ServletException, IOException {
           
           
            String command = request.getParameter("command");
           
            if ("category".equals(command)) {
                String catid = request.getParameter("catid");
                // set content-type header before accessing the Writer
                response.setContentType("text/xml");
                PrintWriter out = response.getWriter();
           
                // then write the data of the response
                out.println("<items>");
                ArrayList items = dao.getItems(catid);
                Iterator it = items.iterator();
                while (it.hasNext()) {
                    Item i = (Item)it.next();
                    out.println("<item>");
                    out.println(" <id>" + i.getId() + "</id>");
                    out.println(" <cat-id>" + i.getCategoryId() + "</cat-id>");
                    out.println(" <name>" + i.getName() + "</name>");
                    out.println(" <description>" + i.getDescription() + "</description>");
                    out.println(" <image-url>" + i.getImageURL() + "</image-url>");
                    out.println(" <price>" + i.getPrice() + "</price>");
                    out.println("</item>");
                }
                out.println("</items>");
                out.close();
         } else if ("categories".equals(command)) {
                response.setContentType("text/xml");
                PrintWriter out = response.getWriter();
           
                // then write the data of the response
                out.println("<categories>");
                ArrayList items = dao.getCategories();
                Iterator it = items.iterator();
                while (it.hasNext()) {
                    Category c = (Category)it.next();
                    out.println("<category>");
                    out.println(" <id>" + c.getId() + "</id>");
                    out.println(" <cat-id>" + c.getId() + "</cat-id>");
                    out.println(" <name>" + c.getName() + "</name>");
                    out.println(" <description>" + c.getDescription() + "</description>");
                    out.println(" <image-url>" + c.getImageURL() + "</image-url>");
                    out.println("</category>");
                }
                out.println("</categories>");
                out.close();         
        } else if ("categories".equals(command)) {
                String orderId = "A1234";
                response.setContentType("text/xml");
                PrintWriter out = response.getWriter();
                // then write the data of the response
                out.println("<status>");
                out.println("<message>" + orderId + "<message>");
                out.println("</status>");
                out.close();         
         }
     }

}
