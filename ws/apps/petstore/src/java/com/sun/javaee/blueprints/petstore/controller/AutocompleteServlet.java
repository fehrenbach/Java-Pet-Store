/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: AutocompleteServlet.java,v 1.6 2005-12-09 01:56:57 gmurray71 Exp $ */
package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import java.text.*;

import com.sun.javaee.blueprints.petstore.model.*;
import javax.annotation.Resource;
import javax.persistence.*;

public class AutocompleteServlet extends HttpServlet {
    
    private CatalogFacade cf;
    private ServletContext context;
    
    public void init(ServletConfig config) throws ServletException {
        context = config.getServletContext();
        cf = (CatalogFacade)context.getAttribute("CatalogFacade");
    }
    
    public  void doGet(HttpServletRequest request, HttpServletResponse  response)
    throws IOException, ServletException {
        request.setCharacterEncoding("UTF-8");
        String action = request.getParameter("action");
        String targetId = request.getParameter("id");
        StringBuffer sb = new StringBuffer();
        if (targetId != null) targetId = targetId.trim();
        if ("complete".equals(action)) {
            System.out.println("AutoComplete: key=" + targetId);
            response.setContentType("text/xml;charset=UTF-8");
            response.setHeader("Cache-Control", "no-cache");
            PrintWriter out = response.getWriter();
            
            // then write the data of the response
            sb.append("<items>\n");
            Collection items = cf.doSearch(targetId);
            if (items.size() > 0) {
                NumberFormat formatter = new DecimalFormat("00.00");
                Iterator it = items.iterator();
                while (it.hasNext()) {
                    Vector i = (Vector)it.next();
                    sb.append("<item>\n");
                    sb.append(" <id>" + i.get(0) + "</id>\n");
                    sb.append(" <cat-id>" + i.get(1)  + "</cat-id>\n");
                    sb.append(" <name>" + i.get(2)  + "</name>\n");
                    sb.append(" <description>" + i.get(3)  + "</description>\n");
                    sb.append(" <image-url>" + i.get(4) + "</image-url>\n");
                    sb.append(" <price>" + formatter.format(i.get(5))  + "</price>\n");
                    sb.append("</item>\n");
                }
                sb.append("</items>\n");
                response.getWriter().write(sb.toString());
                out.close();
            } else {
                //nothing to show
                System.out.println("Returning noting.");
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }
        }
        
    }
}


