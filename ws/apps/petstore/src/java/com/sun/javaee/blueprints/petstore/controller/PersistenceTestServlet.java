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
public class PersistenceTestServlet extends HttpServlet {
    private CatalogFacade cf;
    private ServletContext context;

    public void init(ServletConfig config) throws ServletException {
        
        context = config.getServletContext();
        cf = (CatalogFacade)context.getAttribute("CatalogFacade");
    }
    
    public void destroy() {
        cf = null;
    }   
    
    public void doGet(HttpServletRequest request,
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
            if (action.equals("findallitems")) {
               /* PrintWriter out = response.getWriter();
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
                out.close(); */
            }
        } catch (Exception exe) {
            System.out.println("PersistenceTestServlet error: "+exe);
            request.setAttribute("error_message", exe);            
        }
    }
}