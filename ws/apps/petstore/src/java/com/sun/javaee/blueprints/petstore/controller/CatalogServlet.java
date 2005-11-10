
package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import java.util.*;
import java.text.*;
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
             dao = new ItemDAO(PetstoreDB);
             context.setAttribute("itemDAO", dao);
   }

   public void destroy() {
   	  dao = null;
   }   
   
   public void doGet (HttpServletRequest request,
                      HttpServletResponse response)
       throws ServletException, IOException {
            request.setCharacterEncoding("UTF-8");
            String command = request.getParameter("command");
           
            if ("category".equals(command)) {
                String catid = request.getParameter("catid");
                System.out.println("Request for category with id: " + catid);
                // set content-type header before accessing the Writer
                response.setContentType("text/xml;charset=UTF-8");
                PrintWriter out = response.getWriter();
                StringBuffer sb = new StringBuffer();
                // then write the data of the response
                sb.append("<items>\n");
                ArrayList items = dao.getItems(catid);
                Iterator it = items.iterator();
                NumberFormat formatter = new DecimalFormat("0000");
                while (it.hasNext()) {
                    Item i = (Item)it.next();
                    sb.append("<item>\n");
                    sb.append(" <id>" + i.getId() + "</id>\n");
                    sb.append(" <cat-id>" + i.getCategoryId() + "</cat-id>\n");
                    sb.append(" <name>" + i.getName() + "</name>\n");
                    sb.append(" <description>" + i.getDescription() + "</description>\n");
                    sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
                    sb.append(" <price>" + formatter.format(i.getPrice())  + "</price>\n");
                    sb.append("</item>\n");
                }
                sb.append("</items>");
                out.println(sb.toString());
                System.out.println("Returning:\n" + sb.toString());
                out.close();
         } else if ("categories".equals(command)) {
                System.out.println("Request for categories.");
                StringBuffer sb = new StringBuffer();
                sb.append("<categories>\n");
                ArrayList items = dao.getCategories();
                Iterator it = items.iterator();
                
                while (it.hasNext()) {
                    Category c = (Category)it.next();
                    sb.append("<category>\n");
                    sb.append(" <id>" + c.getId() + "</id>\n");
                    sb.append(" <cat-id>" + c.getId() + "</cat-id>\n");
                    sb.append(" <name>" + c.getName() + "</name>\n");
                    sb.append(" <description>" + c.getDescription() + "</description>\n");
                    sb.append(" <image-url>" + c.getImageURL() + "</image-url>\n");
                    sb.append("</category>\n");
                }
                sb.append("</categories>\n");
                response.setContentType("text/xml;charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.println(sb.toString());
                System.out.println("Returning:\n" + sb.toString());
                out.close();         
         } else if ("item".equals(command)) {
             String targetId = request.getParameter("id");
             NumberFormat formatter = new DecimalFormat("0000");
             System.out.println("Request for item with id: " + targetId);
             Item i = dao.getItem(targetId);
             StringBuffer sb = new StringBuffer();
             sb.append("<item>\n");
             sb.append(" <id>" + i.getId() + "</id>\n");
             sb.append(" <cat-id>" + i.getCategoryId() + "</cat-id>\n");
             sb.append(" <name>" + i.getName() + "</name>\n");
             sb.append(" <description>" + i.getDescription() + "</description>\n");
             sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
             sb.append(" <price>" + formatter.format(i.getPrice())  + "</price>\n");
             sb.append("</item>\n");
             response.setContentType("text/xml;charset=UTF-8");
             PrintWriter out = response.getWriter();
             out.println(sb.toString());
             System.out.println("Returning:" + sb.toString());
             out.close();  
         }
     }

}
