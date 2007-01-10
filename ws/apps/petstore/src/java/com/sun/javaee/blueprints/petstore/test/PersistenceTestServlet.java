/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: PersistenceTestServlet.java,v 1.3 2007-01-10 21:21:12 inder Exp $ */

package com.sun.javaee.blueprints.petstore.test;

import com.sun.javaee.blueprints.petstore.model.Address;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.SellerContactInfo;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This is a simple example of an HTTP Servlet.  It responds to the GET
 * method of the HTTP protocol.
 */
public class PersistenceTestServlet extends HttpServlet {
    private CatalogFacade cf;
    private ServletContext context;

    @Override public void init(ServletConfig config) throws ServletException {
        
        context = config.getServletContext();
        cf = (CatalogFacade)context.getAttribute("CatalogFacade");
    }
    
    @Override public void destroy() {
        cf = null;
    }   
    
    @Override public void doGet(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        String action = request.getParameter("action");
        System.out.println("action="+action);
        try{
            if (action.equals("add")) {
                String desc = request.getParameter("item_desc");
                String name = request.getParameter("item_name");
                String listPrice = request.getParameter("item_price");

                PrintWriter out = response.getWriter();
                Item item = new Item();
                item.setName(name);
                item.setDescription(desc);
                item.setPrice(new Float(listPrice));
                item.setImageURL("test.gif");
        item.setProductID("canine01");

                Address addr = new Address();
                //TO-DO: Add address fields and extract data
                addr.setStreet1("street1");
                addr.setStreet2("street2");
                addr.setCity("city");
                addr.setState("state");
                addr.setZip("9999");
                addr.setLatitude(-8.343545645);
                addr.setLongitude(-9.76878787);
                
                SellerContactInfo contactInfo = new SellerContactInfo();
                //TO-DO: Add SellerContactInfo fields and extract data
                contactInfo.setFirstName("duke");
                contactInfo.setLastName("duke");
                contactInfo.setEmail("abc@abc.xyz");

        item.setAddress(addr);
                item.setContactInfo(contactInfo);
                cf.addItem(item);
                out.println("The item has been added. Here is the Item id: "+item.getItemID());
                out.close();
            }
            if (action.equals("search")) {
                String id = request.getParameter("item_id");
                PrintWriter out = response.getWriter();
                Item item = cf.getItem(id);
                out.println("Here are the Item details: ");
                out.println("<br>"+ "Name: " +item.getName());
                out.println("<br>"+ "Description: " +item.getDescription());
                out.println("<br>"+ "Price: " +item.getPrice());
                out.println("<br>"+ "Image URL: " +item.getImageURL());
                out.close();
            }
/*            if (action.equals("findallitems")) {
                PrintWriter out = response.getWriter();
                Collection items = cf.getItems();
                out.println("Here are the Items: ");
                Iterator it = items.iterator();
                while (it.hasNext()) {
                    Item item = (Item)it.next();
                    out.println("<br> <br>"+ "ID: " +item.getItemID());
                    out.println("<br>"+ "Name: " +item.getName());
                    out.println("<br>"+ "Description: " +item.getDescription());
                    out.println("<br>"+ ""Price: " +item.getPrice());
                    out.println("<br>"+ "Image URL: " +item.getImageURL());
                }
                out.close(); 
            } */
        } catch (Exception exe) {
            System.out.println("PersistenceTestServlet error: "+exe);
            request.setAttribute("error_message", exe);            
        }
    }
}
