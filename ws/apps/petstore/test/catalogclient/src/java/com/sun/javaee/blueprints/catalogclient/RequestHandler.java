/* Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: RequestHandler.java,v 1.1 2005-11-23 21:09:23 smitha Exp $ */

package com.sun.javaee.blueprints.catalogclient;

import java.util.*;
import java.text.*;

import javax.servlet.http.*;


/**
 * Handles responsibilities related to getting HTTP request
 * info
 */
public class RequestHandler {
    private CatalogBD bd;
    
    public RequestHandler(){
        bd = new CatalogBD();
    }
    
    /**
     * Handles the http request, calls the Business Delegate,
     * and provides an appropriate response.
     * Sets the response message by setting a request attribute for use
     * in the client JSP pages.
     * @throws RequestHandlerException
     */
    public void handle(HttpServletRequest request,
            HttpServletResponse response) throws RequestHandlerException{
        try {
            Collection ret = null;
            //extract request parameters
            String catID = request.getParameter("cat_id");
            String targetAction = request.getParameter("action");
        
            //if((catID == null) || (catID.equals(""))|| (desc.equals(""))|| (image.equals("")))
            //   throw new RequestHandlerException("Request Handler Exception: Please enter a valid Cat ID.");
            if (targetAction.equals("getcategories")) {
                
                ret = bd.getCategories();
            }
            if (targetAction.equals("getproducts")) {
                System.out.println("find called");
                
                ret = bd.getProducts(catID);
            }
            //if (targetAction.equals("getitems")) {
            //    System.out.println("find called");
                
            //    ret = bd.getItems(prodID);
            //}
            
            request.setAttribute("result", ret);
        } catch(java.lang.Exception exe){
            exe.printStackTrace(System.err);
            throw new RequestHandlerException("Request Handler Exception: "+ exe.getMessage());
        }
    }
}