/* Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: RequestHandler.java,v 1.1 2006-09-20 21:50:52 inder Exp $ */

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
            
            String targetAction = request.getParameter("action");
            
            if (targetAction.equals("getcategories")) {
                ret = bd.getCategories();
            }
            if (targetAction.equals("getproducts")) {
                String catID = request.getParameter("cat_id");
                ret = bd.getProducts(catID);
            }
            if (targetAction.equals("getitems")) {
                String prodID = request.getParameter("prod_id");
                ret = bd.getItems(prodID);
            }
            
            request.setAttribute("result", ret);
        } catch(java.lang.Exception exe){
            exe.printStackTrace(System.err);
            throw new RequestHandlerException("Request Handler Exception: "+ exe.getMessage());
        }
    }
}