/* Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:  http://developer.sun.com/berkeley_license.html $Id: FrontController.java,v 1.1 2006-09-20 21:50:52 inder Exp $ */
package com.sun.javaee.blueprints.catalogclient;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

/**
 * Centralized controller for all the * incoming requests
 */
public class FrontController  extends HttpServlet {
    private Map nameSpace;
    private RequestHandler handler;
    public void init() {
        initPathMapping();
        handler = new RequestHandler();    }
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws
            IOException, ServletException {
        doGet(req, resp);
    }
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws
            IOException, ServletException{
        process(req, resp);
    }
    protected void process(HttpServletRequest req, HttpServletResponse resp) throws
            IOException, ServletException {
        
        resp.setContentType("text/html");
        String responseURL = null;
        String fullURL = req.getRequestURI();
        // get the screen name
        String selectedURL = null;
        int lastPathSeparator = fullURL.lastIndexOf("/") + 1;
        if (lastPathSeparator != -1) {
            selectedURL = fullURL.substring(lastPathSeparator, fullURL.length());
        }
        responseURL = getResponseURL(selectedURL);
        if ((selectedURL.equals("getcategories.do")) ||(selectedURL.equals("getproducts.do")) ||(selectedURL.equals("getitems.do"))) {
            try {
                handler.handle(req,resp);
            } catch (RequestHandlerException re) {
                req.setAttribute("error_message", re.getMessage());
                responseURL = getResponseURL("error.do");
            }
        }
        getServletConfig().getServletContext().getRequestDispatcher(responseURL).forward(req, resp);    }
    
    protected String getResponseURL(String url) {
        return (String) nameSpace.get(url);    }
    
    protected void initPathMapping() {
        nameSpace = new HashMap();
        nameSpace.put("getcategories.do", "/category.jsp");
        nameSpace.put("getproducts.do", "/product.jsp");
        nameSpace.put("getitems.do", "/item.jsp");
        nameSpace.put("index.do", "/index.jsp");
        nameSpace.put("error.do", "/error.jsp");    }
}