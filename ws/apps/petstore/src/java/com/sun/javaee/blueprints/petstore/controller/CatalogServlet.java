
package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import java.util.*;
import java.text.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.annotation.*;
import javax.persistence.*;

import com.sun.javaee.blueprints.petstore.model.*;


/**
 * This is a simple example of an HTTP Servlet.  It responds to the GET
 * method of the HTTP protocol.
 */
public class CatalogServlet extends HttpServlet { 

   private CatalogFacade cf;
   private ServletContext context;
   private Collection categories;

   public void init(ServletConfig config) throws ServletException {
       context = config.getServletContext();
       cf = (CatalogFacade)context.getAttribute("CatalogFacade");
   }

   public void destroy() {
   	  cf = null;
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
                sb.append("<category>\n");
                sb.append("<cat-id>" + catid + "</cat-id>\n");
                sb.append("<cat-name>" + cf.getCategory(catid).getName()  + "</cat-name>\n");
                sb.append("<items>\n");
                Collection items = cf.getAllItemsFromCategory(catid);
                Iterator it = items.iterator();
                NumberFormat formatter = new DecimalFormat("000.00");
                while (it.hasNext()) {
                    PItem i = (PItem)it.next();
                    sb.append("<item>\n");
                    sb.append(" <id>" + i.getItemID() + "</id>\n");
                    sb.append(" <prod-id>" + i.getProductID() + "</prod-id>\n");
                    sb.append(" <cat-id>" + catid + "</cat-id>\n");
                    sb.append(" <name>" + i.getName() + "</name>\n");
                    sb.append(" <price>" + formatter.format(i.getUnitCost()) + "</price>\n");
                    sb.append(" <description>" + i.getDescription() + "</description>\n");
                    sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
                    sb.append("</item>\n");
                }
                sb.append("</items>");
                sb.append("</category>\n");
                out.println(sb.toString());
                System.out.println("Returning:\n" + sb.toString());
                out.close();
            } else if ("products".equals(command)) {
                String catid = request.getParameter("catid");
                System.out.println("Request for category with id: " + catid);
                // set content-type header before accessing the Writer
                response.setContentType("text/xml;charset=UTF-8");
                PrintWriter out = response.getWriter();
                StringBuffer sb = new StringBuffer();
                // then write the data of the response
                sb.append("<products>\n");
                Collection items = cf.getProducts(catid);
                Iterator it = items.iterator();
                NumberFormat formatter = new DecimalFormat("000.00");
                while (it.hasNext()) {
                    Product p = (Product)it.next();
                    sb.append("<product>\n");
                    sb.append(" <id>" + p.getProductID() + "</id>\n");
                    sb.append(" <cat-id>" + p.getCategoryID() + "</cat-id>\n");
                    sb.append(" <name>" + p.getName() + "</name>\n");
                    sb.append(" <description>" + p.getDescription() + "</description>\n");
                    sb.append(" <image-url>" + p.getImageURL() + "</image-url>\n");
                    sb.append("</product>\n");
                }
                sb.append("</products>");
                out.println(sb.toString());
                System.out.println("Returning:\n" + sb.toString());
                out.close();
         } else if ("categories".equals(command)) {
                System.out.println("Request for categories.");
                StringBuffer sb = new StringBuffer();
                sb.append("<categories>\n");
                Collection items = cf.getCategories();
                Iterator it = items.iterator();
                
                while (it.hasNext()) {
                    PCategory c = (PCategory)it.next();
                    sb.append("<category>\n");
                    sb.append(" <id>" + c.getCategoryID() + "</id>\n");
                    sb.append(" <cat-id>" + c.getCategoryID() + "</cat-id>\n");
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
             NumberFormat formatter = new DecimalFormat("000.00");
             System.out.println("CatalogServlet: Request for item with id: " + targetId);
             PItem i = cf.getItem(targetId);
             StringBuffer sb = new StringBuffer();
             sb.append("<item>\n");
             sb.append(" <id>" + i.getItemID() + "</id>\n");
             sb.append(" <cat-id>" + i.getProductID() + "</cat-id>\n");
             sb.append(" <name>" + i.getName() + "</name>\n");
             sb.append(" <description>" + i.getDescription() + "</description>\n");
             sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
             sb.append(" <price>" + formatter.format(i.getListPrice())  + "</price>\n");
             sb.append("</item>\n");
             response.setContentType("text/xml;charset=UTF-8");
             PrintWriter out = response.getWriter();
             out.println(sb.toString());
             System.out.println("Returning:" + sb.toString());
             out.close();  
         }
     }
}
