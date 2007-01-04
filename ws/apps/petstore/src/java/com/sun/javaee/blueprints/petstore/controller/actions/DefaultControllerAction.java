/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: DefaultControllerAction.java,v 1.1 2007-01-04 03:22:06 inder Exp $ */

package com.sun.javaee.blueprints.petstore.controller.actions;

import com.sun.javaee.blueprints.petstore.controller.ControllerAction;
import com.sun.javaee.blueprints.petstore.controller.ControllerServlet;
import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.logging.Level;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This action class provides the default handling of the controller
 * @author Inderjeet Singh
 */
public class DefaultControllerAction implements ControllerAction {
    
    private static String CACHE = "controller_cache";
    private static String CACHE_TIMES = "controller_cache_times";
    private final ServletContext context;
    public DefaultControllerAction(ServletContext context) {
        this.context = context;
    }
    public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException  {
        request.setCharacterEncoding("UTF-8");
        String command = request.getParameter("command");
        //if(bDebug) System.out.println("ControllerServlet : command=" + command);
        
        if ("content".equals(command)) {
            String target = request.getParameter("target");
            //if(bDebug) System.out.println("ControllerServlet : target=" + target);
            if (target != null) target = target.trim();
            response.setContentType("text/html;charset=UTF-8");
            PrintWriter out = response.getWriter();
            StringBuffer content = getResource(target, true, true);
            out.write(content.toString());
            out.close();
        }    
    }
        public StringBuffer getResource(String resource, boolean fromWeb, boolean cacheContent) {
        InputStream stream = null;
        URLConnection con;
        try {
            if (!fromWeb) {
                URL url = ControllerServlet.class.getResource(resource);
                con = url.openConnection();
            } else {
                // check the time stamp on the resource
                URL url = context.getResource(resource);
                con = url.openConnection();
            }
            if (cacheContent) {
                HashMap<String, StringBuffer> cache = (HashMap<String, StringBuffer>) context.getAttribute(CACHE);
                HashMap<String, Long> cacheTimes = (HashMap<String, Long>)context.getAttribute(CACHE_TIMES);
                if (cache == null) {
                    cache = new HashMap<String, StringBuffer>();
                    cacheTimes = new HashMap<String, Long>();
                    context.setAttribute(CACHE, cache);
                    context.setAttribute(CACHE_TIMES, cacheTimes);
                }
                long lastModified = con.getLastModified();
                long cacheModified = 0;
                if (cacheTimes.get(resource) != null) {
                    cacheModified = ((Long)cacheTimes.get(resource)).longValue();
                }
                if (cacheModified < lastModified) {
                    StringBuffer buffer = getResource(con.getInputStream());
                    synchronized(cacheTimes) {
                        cacheTimes.put(resource, Long.valueOf(lastModified));
                    }
                    synchronized(cache) {
                        cache.put(resource, buffer);
                    }
                    return buffer;
                } else {
                    return (StringBuffer)cache.get(resource);
                }
            } else {
                return getResource(con.getInputStream());
            }
        } catch (Exception e) {
            PetstoreUtil.getLogger().log(Level.SEVERE, "ControllerServlet:loadResource error: Could not load", resource + " - " + e.toString());
        }
        return null;
    }
    
    private StringBuffer getResource(InputStream stream) {
        StringBuffer buffer = new StringBuffer();
        BufferedReader bufReader = null;
        String curLine = null;
        try {
            bufReader = new BufferedReader(new InputStreamReader(stream));
            while (null != (curLine = bufReader.readLine())) {
                buffer.append(curLine + "\n");
            }
        } catch (IOException e) {
            PetstoreUtil.getLogger().log(Level.SEVERE, "ControllerServlet:loadResource from stream error", e);
        }
        return buffer;
    }        
}