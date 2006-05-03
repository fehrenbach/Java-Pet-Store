/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: AutocompleteServlet.java,v 1.8 2006-05-03 21:43:09 inder Exp $ */
package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import java.text.*;

import com.sun.javaee.blueprints.petstore.model.*;
import javax.annotation.Resource;
import javax.persistence.*;

import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.search.SearchIndex;
import com.sun.javaee.blueprints.petstore.search.IndexDocument;

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
                        
            // create Lucene Search class
            SearchIndex si=new SearchIndex();
            // get default place indexes should exist
            String indexDirectory=PetstoreConstants.PETSTORE_INDEX_DIRECTORY;
            
            // make sure not exact search
            if(targetId.indexOf("\"") < 0) {
                // add wildcard
                targetId += "*";
            }
            si.query(indexDirectory, targetId);
            Vector vtHits=si.getHits();
                        
            // loop through hits and create dom return
            if(vtHits.size() > 0) {
                // add xml docroot only if items to return
                sb.append("<items>\n");
                
                NumberFormat formatter = new DecimalFormat("00.00");
                Iterator it = vtHits.iterator();
                while (it.hasNext()) {
                    IndexDocument indexDoc = (IndexDocument)it.next();
                    sb.append("<item>\n");
                    sb.append(" <id>" + indexDoc.getUID() + "</id>\n");
                    sb.append(" <cat-id>" + indexDoc.getProduct() + "</cat-id>\n");
                    sb.append(" <name>" + indexDoc.getTitle() + "</name>\n");
                    sb.append(" <description>" + indexDoc.getSummary()  + "</description>\n");
                    sb.append(" <image-url>" + indexDoc.getImage() + "</image-url>\n");
                    sb.append(" <price>" + formatter.format(Float.parseFloat(indexDoc.getPrice()))  + "</price>\n");
                    sb.append("</item>\n");
                }
                // close xml docroot element
                sb.append("</items>\n");
                response.getWriter().write(sb.toString());
                out.close();
                        

            /* EJB search code
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
                */
                
            } else {
                //nothing to show
                System.out.println("Returning noting.");
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }
        }
        
    }
}


