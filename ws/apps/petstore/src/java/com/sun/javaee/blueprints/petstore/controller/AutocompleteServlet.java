/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html  
$Id: AutocompleteServlet.java,v 1.1 2005-11-10 12:06:32 gmurray71 Exp $ */
package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import java.text.*;

import com.sun.javaee.blueprints.petstore.model.*;

public class AutocompleteServlet extends HttpServlet {
    
    private ServletContext context;
    private ItemDAO dao;

 
    public void init(ServletConfig config) throws ServletException {
        this.context = config.getServletContext();

    }

    public  void doGet(HttpServletRequest request, HttpServletResponse  response)
        throws IOException, ServletException {
        if (dao == null)  dao = (ItemDAO)context.getAttribute("itemDAO");
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
            ArrayList items = dao.doSearch(targetId);
            if (items.size() > 0) {
                NumberFormat formatter = new DecimalFormat("0000");
                Iterator it = items.iterator();
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
                sb.append("</items>\n");
                response.getWriter().write(sb.toString());
                System.out.println("Returning: " + sb.toString());
                out.close();
			} else {
                //nothing to show
                System.out.println("Returning noting.");
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }
	    }
        
    }
}


