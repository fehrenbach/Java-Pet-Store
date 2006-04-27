
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
            System.out.println("CatalogServlet: command=" + command);
            if ("category".equals(command)) {
                String catid = request.getParameter("catid");
                System.out.println("Request for category with id: " + catid);
                // set content-type header before accessing the Writer
                response.setContentType("text/xml;charset=UTF-8");
                PrintWriter out = response.getWriter();             
                String str = handleCategory(catid);                
                out.println(str);
                out.close();
            } else if ("items".equals(command)) {
                String pid = request.getParameter("pid");
                String startString = request.getParameter("start");
                int start = 0;
                if (startString != null) {
                    try {
                        start = Integer.parseInt(startString);
                    } catch (NumberFormatException nfe) {
                        // defaults start to 0
                    }
                }
                String lengthString = request.getParameter("length");
                int length = 10;
                if (lengthString != null) {
                    try {
                        length = Integer.parseInt(lengthString);
                    } catch (NumberFormatException nfe) {
                        // defaults length to 10
                    }
                }
                System.err.println("**** Request for items with product id: " + pid + " start=" + start + " length=" + length);
                // set content-type header before accessing the Writer
                response.setContentType("text/xml;charset=UTF-8");
                // leave these headers here for development - remove for deploy
                response.setHeader("Cache-Control", "no-cache");
                response.setHeader("Pragma", "no-cache");
                PrintWriter out = response.getWriter();            
                //get response data
                String str = handleItems(pid, start, length);               
                out.println(str);
                out.close();
         } else if ("categories".equals(command)) {
                System.out.println("Request for categories.");
                String format = request.getParameter("format");
                
                //get response data in proper format
                String str = handleCategories(format);
                
                if ((format != null) && format.toLowerCase().equals("json")) {
                    response.setContentType("text/javascript;charset=UTF-8");
                } else {
                    response.setContentType("text/xml;charset=UTF-8");
                }               
                PrintWriter out = response.getWriter();             
                out.println(str);
                out.close();         
         } else if ("item".equals(command)) {
             String targetId = request.getParameter("id");          
             System.out.println("CatalogServlet: Request for item with id: " + targetId);
             String str = handleItem(targetId);
             response.setContentType("text/xml;charset=UTF-8");
             PrintWriter out = response.getWriter();
             out.println(str);
             out.close();  
         }
     }
   
   private String handleItems(String pid, int start, int length) {
       StringBuffer sb = new StringBuffer();
       // then write the data of the response
       sb.append("<items>\n");
       List items = cf.getItemsVLH(pid, start, length);
       System.out.println("**** Items length=" + items.size());
       Iterator<Item> it = items.iterator();
       NumberFormat formatter = new DecimalFormat("00.00");
       while (it.hasNext()) {
                    Item i = it.next();
                    sb.append("<item>\n");
                    sb.append(" <id>" + i.getItemID() + "</id>\n");
                    sb.append(" <product-id>" + i.getProductID() + "</product-id>\n");
                    sb.append(" <rating>" + i.checkAverageRating() + "</rating>\n");
                    sb.append(" <name>" + i.getName() + "</name>\n");
                    sb.append(" <description>" + i.getDescription() + "</description>\n");
                    sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
                    sb.append(" <image-tb-url>" + i.getImageThumbURL() + "</image-tb-url>\n");
                    sb.append("</item>\n");
       }
       sb.append("</items>");
       return sb.toString();      
   }
   
   private String handleCategory(String categoryId) {
        StringBuffer sb = new StringBuffer();
        // then write the data of the response
        sb.append("<category>\n");
        sb.append("<cat-id>" + categoryId + "</cat-id>\n");
        sb.append("<cat-name>" + cf.getCategory(categoryId).getName()  + "</cat-name>\n");
        sb.append("<items>\n");
        List items = cf.getAllItemsFromCategory(categoryId);
        Iterator<Item> it = items.iterator();
        NumberFormat formatter = new DecimalFormat("00.00");
        while (it.hasNext()) {
                    Item i = it.next();
                    sb.append("<item>\n");
                    sb.append(" <id>" + i.getItemID() + "</id>\n");
                    sb.append(" <prod-id>" + i.getProductID() + "</prod-id>\n");
                    sb.append(" <cat-id>" + categoryId + "</cat-id>\n");
                    sb.append(" <name>" + i.getName() + "</name>\n");
                    sb.append(" <price>" + formatter.format(i.getPrice()) + "</price>\n");
                    sb.append(" <description>" + i.getDescription() + "</description>\n");
                    sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
                    sb.append("</item>\n");
        }
        sb.append("</items>");
        sb.append("</category>\n");
        return sb.toString();
   }
   
   private String handleItem(String targetId){
             NumberFormat formatter = new DecimalFormat("00.00");
             Item i = cf.getItem(targetId);
             StringBuffer sb = new StringBuffer();
             sb.append("<item>\n");
             sb.append(" <id>" + i.getItemID() + "</id>\n");
             sb.append(" <cat-id>" + i.getProductID() + "</cat-id>\n");
             sb.append(" <name>" + i.getName() + "</name>\n");
             sb.append(" <description>" + i.getDescription() + "</description>\n");
             sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
             sb.append(" <price>" + formatter.format(i.getPrice())  + "</price>\n");
             sb.append("</item>\n");
             return sb.toString();
   }
   
   private String handleCategories(String format){
       StringBuffer sb = new StringBuffer();
       if ((format != null) && format.toLowerCase().equals("json")) {
           sb.append("[\n");
           List categories = cf.getCategories();
           Iterator<Category> it = categories.iterator();
           while (it.hasNext()) {
                        Category c = it.next();
                        String catid = c.getCategoryID() + "";
                        sb.append("{");
                        sb.append("\"id\":\"" + c.getCategoryID() + "\",");
                        sb.append("\"catid\":\"" + catid + "\",");
                        sb.append("\"name\":\"" + c.getName() + "\",");
                        sb.append("\"description\":\"" + c.getDescription() + "\",");
                        sb.append("\"imageURL\":\"" + c.getImageURL() + "\",");
                        sb.append("\"products\": [");
                        // get the products in that category
                        List products = cf.getProducts(catid);
                        Iterator<Product> pit = products.iterator();
                        while (pit.hasNext()) {
                            Product p = pit.next();
                            sb.append("{");
                            sb.append("\"id\":\"" + p.getProductID() + "\",");
                            sb.append("\"catid\":\"" + catid + "\",");
                            sb.append("\"name\":\"" + p.getName()+ "\",");
                            sb.append("\"description\":\"" + p.getDescription() + "\",");
                            sb.append("\"imageURL\":\"" + p.getImageURL() + "\"");
                            sb.append("}");
                            if (pit.hasNext()) {
                                sb.append(",");
                            }
                        }
                        sb.append("]");
                        sb.append("}");
                        if (it.hasNext()) {
                            sb.append(",\n");
                        }
           }//end while loop
           sb.append("\n]");
       } else {
           sb.append("<categories>\n");
           List categories = cf.getCategories();
           Iterator<Category> it = categories.iterator();
           while (it.hasNext()) {
                        Category c = it.next();
                        sb.append("<category>\n");
                        sb.append(" <id>" + c.getCategoryID() + "</id>\n");
                        sb.append(" <cat-id>" + c.getCategoryID()+ "</cat-id>\n");
                        sb.append(" <name>" + c.getName() + "</name>\n");
                        sb.append(" <description>" +c.getDescription() + "</description>\n");
                        sb.append(" <image-url>" + c.getImageURL() + "</image-url>\n");
                        sb.append("</category>\n");
            }
            sb.append("</categories>\n");         
       }
       return sb.toString();
   }
}
