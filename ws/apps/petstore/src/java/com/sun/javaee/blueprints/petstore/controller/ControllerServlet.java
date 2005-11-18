
package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import java.util.*;
import java.net.*;
import javax.servlet.*;
import javax.servlet.http.*;


/**
 * This servlet is responsible for interacting with a client
 * based controller and will fetch resources including content  
 * and relevant script.
 * 
 * This servlet also will process requests for client observers
 */
public class ControllerServlet extends HttpServlet { 

    private ServletContext ctx;
    private static String CACHE = "controller_cache";
    private static String CACHE_TIMES = "controller_cache_times";

   public void init(ServletConfig config) throws ServletException {
       ctx = config.getServletContext();
   }

   public void destroy() {
   }   
   
   public void doGet (HttpServletRequest request,
                      HttpServletResponse response)
       throws ServletException, IOException {
            request.setCharacterEncoding("UTF-8");
            String command = request.getParameter("command");
            System.out.println("ControllerServlet : command=" + command);
           
            if ("content".equals(command)) {
                String target = request.getParameter("target");
                System.out.println("ControllerServlet : target=" + target);
                if (target != null) target = target.trim();
                response.setContentType("text/html;charset=UTF-8");
                PrintWriter out = response.getWriter();
                StringBuffer content = getResource(target, true, true);
                System.out.println("ControllerServlet returning: " + content.toString());
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
                URL url = ctx.getResource(resource);
                con = url.openConnection();
            }
            if (cacheContent) {
                HashMap cache = (HashMap)ctx.getAttribute(CACHE);
                HashMap cacheTimes = (HashMap)ctx.getAttribute(CACHE_TIMES);
                if (cache == null) {
                    cache = new HashMap();
                    cacheTimes = new HashMap();
                    ctx.setAttribute(CACHE, cache);
                    ctx.setAttribute(CACHE_TIMES, cacheTimes);
                }
                long lastModified = con.getLastModified();
                long cacheModified = 0;
                if (cacheTimes.get(resource) != null) {
                    cacheModified = ((Long)cacheTimes.get(resource)).longValue();
                }
                if (cacheModified < lastModified) {
                    StringBuffer buffer = getResource(con.getInputStream());
                    synchronized(cacheTimes) {
                        cacheTimes.put(resource, new Long(lastModified));
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
            System.out.println("ControllerServlet:loadResource error: Could not load " + resource);
            System.out.println("Reason: " + e);
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
        } catch (Exception e) {
            System.out.println("ControllerServlet:loadResource from stream error:"  + e);
        }
        return buffer;
    }


}
