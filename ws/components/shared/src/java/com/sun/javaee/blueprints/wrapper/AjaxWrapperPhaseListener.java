/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
 */
 
/*
 * AjaxWrapperPhaseListener.java
 *
 * Created on May 11, 2005, 11:04 AM
 */

package com.sun.javaee.blueprints.wrapper;

import java.io.*;
import java.net.*;
import java.util.*;
import javax.faces.event.*;
import javax.faces.el.*;
import javax.faces.component.*;
import javax.servlet.http.*;
import javax.servlet.*;
import javax.faces.context.FacesContext;
import javax.faces.webapp.UIComponentTag;
import com.sun.faces.util.Util;

/**
 * Phase listener which responds to requests for the script tag
 * @author Greg Murray
 */
public class AjaxWrapperPhaseListener implements PhaseListener {
    
    private static String CACHE = "ikandi_cache";
    private static String CACHE_TIMES = "ikandi_cache_times";
        

    public AjaxWrapperPhaseListener() {}
        
    public void afterPhase(PhaseEvent event) {
        String rootId = event.getFacesContext().getViewRoot().getViewId();
        if (rootId.endsWith(".js") ||
            rootId.endsWith(".htm") ||
            rootId.endsWith(".html") ||
            rootId.endsWith(".css")) {
            getResource(event, rootId, true, true, null);
        } else if (rootId.endsWith(".gif")) {
              getBinaryResource(event, rootId, true, "image/GIF");     
        } else if (rootId.endsWith(".jpg")) {
              getBinaryResource(event, rootId, true, "image/JPEG");
        } else if (rootId.endsWith(".png")) {
              getBinaryResource(event, rootId, true, "image/png");     
        } else if (rootId.endsWith(".ajax")){
            handleAjaxRequest(rootId, event);
        } else {
           System.out.println("AjaxWrapperPhaseListener: could not handle : " + rootId);
        }
    }
              
    private boolean updateValueBoundObject(FacesContext context, String valueBinding, String value) {
            ValueBinding vb = context.getApplication().createValueBinding(valueBinding);
            vb.setValue(context, value);
            return true;
    }

    public void beforePhase(PhaseEvent event) {
    }

    public PhaseId getPhaseId() {
        return PhaseId.RESTORE_VIEW;
    }
    
    private void handleAjaxRequest(String rootId, PhaseEvent event) {
        System.out.println("AjaxWrapperPhaseListener: we have an ajax event " + rootId);
        FacesContext context = event.getFacesContext();
        HttpServletResponse response =
            (HttpServletResponse)context.getExternalContext().getResponse();

        Object object = context.getExternalContext().getRequest();

        if (!(object instanceof HttpServletRequest)) {
            // PortletRequest? Handle that here?
            return;
        }

        HttpServletRequest request = (HttpServletRequest)object;
        // split up the comma separated args
        String argString = request.getParameter("args");
        String[] args = null;
        if (argString != null) {
            args = argString.split(",");
            System.out.println("AjaxWrapperPhaseListener args are: " + args);
        }
        // need to check these properly
        String[] bindingArgs = rootId.split("-");
        String bindingExpression = "#{" + bindingArgs[0].substring(1,bindingArgs[0].length()) +
                                   "." + bindingArgs[1].substring(0,(bindingArgs[1].length() - ".ajax".length()))  + "}";
        System.out.println("AjaxWrapperPhaseListener: Binding Expression = " + bindingExpression);

        try {
            AjaxResult result = invokeBinding(context, bindingExpression, args);
            if (result.getResponseType() == AjaxResult.XML) {
                    response.setContentType("text/xml");
            }
            response.setHeader("Cache-Control", "no-cache");
            response.getWriter().write(result.toString());
            event.getFacesContext().responseComplete();

            return;
        } catch (EvaluationException ee) {
            // log(ee.toString());
            ee.printStackTrace();
        } catch (IOException ioe) {
            // log(ioe.toString());
            ioe.printStackTrace();
        }
    }

   private AjaxResult invokeBinding(FacesContext context, String methodBinding, String[] params) {
        if (UIComponentTag.isValueReference(methodBinding)) {
            Class[] argTypes = { FacesContext.class, String[].class, AjaxResult.class };
            MethodBinding vb = context.getApplication().createMethodBinding(methodBinding, argTypes);
            AjaxResult result = new AjaxResult();
            Object[] args = { context, params, result };
            vb.invoke(context, args);
            return result;
        } else {
            System.err.println("AjaxWrapperPhaseListener Error: Bad method binding: " + methodBinding);
        }
        return null;
    }
    
    public void getBinaryResource(PhaseEvent event, String resource, boolean fromWeb, String contentType) {
        System.out.println("AjaxWrapperPhaseListener: loading binary resource: " + resource);
        FacesContext context = event.getFacesContext();
        ServletContext ctx =  (ServletContext)context.getExternalContext().getContext();
        InputStream stream = null;
        URLConnection con;
        ByteArrayOutputStream buffer = null;
        try {
            if (!fromWeb) {
                URL url = AjaxWrapperPhaseListener.class.getResource(resource);
                if (url == null) {
                    event.getFacesContext().responseComplete();
                    return;
                }
                con = url.openConnection();
            } else {
                // check the time stamp on the resource
                URL url = ctx.getResource(resource);
                if (url == null) {
                    event.getFacesContext().responseComplete();
                    return;
                }
                con = url.openConnection();
            }
            buffer = getBinaryResource(con.getInputStream());
            HttpServletResponse response = (HttpServletResponse)context.getExternalContext().getResponse();
            if (contentType != null) {
                response.setContentType(contentType);
            }
            if (buffer != null) {
                response.getOutputStream().write(buffer.toByteArray());
                buffer.close();
            } else {
                System.out.println("AjaxWrapperPhaseListener Error: No Content: Could not load " + resource);
            }
            event.getFacesContext().responseComplete();
            return;
        } catch (Exception e) {
            System.out.println("AjaxWrapperPhaseListener Error: Could not load " + resource);
            System.out.println("Reason: " + e);
        }
        System.out.println("AjaxWrapperPhaseListener Error: Could not load " + resource);
        event.getFacesContext().responseComplete();
        return;
    }
    
    private ByteArrayOutputStream getBinaryResource(InputStream in) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] bytes = new byte[1024];
        try {
          int read = 0;
          while ((read = in.read(bytes)) > 0) {
               out.write(bytes, 0, read);
          }
          in.close();
          out.close();
        } catch (IOException e) {
            System.out.println("AjaxWrapperPhaseListener:loadResource from stream error:"  + e);
        }
        return out;
    }
    
   private void getResource(PhaseEvent event, String resource, boolean fromWeb, boolean cacheContent, String contentType) {
        System.out.println("AjaxWrapperPhaseListener: loading resource: " + resource);
        FacesContext context = event.getFacesContext();
        ServletContext ctx =  (ServletContext)context.getExternalContext().getContext();
        HttpServletResponse response = (HttpServletResponse)context.getExternalContext().getResponse();
        InputStream stream = null;
        StringBuffer buffer = null;
        URLConnection con;
        try {
            if (!fromWeb) {
                URL url = AjaxWrapperPhaseListener.class.getResource(resource);
                if (url == null) {
                    System.out.println("AjaxWrapperPhaseListener Error: Bad URL: Could not load from classpath: " + resource);
                    event.getFacesContext().responseComplete();
                    return;
                }
                con = url.openConnection();
            } else {
                // check the time stamp on the resource
                URL url = ctx.getResource(resource);
                if (url == null) {
                    System.out.println("AjaxWrapperPhaseListener Error: Bad URL: Could not load from classpath: " + resource);
                    event.getFacesContext().responseComplete();
                    return;
                }
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
                    buffer = getResource(con.getInputStream());
                    synchronized(cacheTimes) {
                        cacheTimes.put(resource, new Long(lastModified));
                    }
                    synchronized(cache) {
                        cache.put(resource, buffer);
                    }
                } else {
                    buffer =(StringBuffer)cache.get(resource);
                }
            } else {
                buffer = getResource(con.getInputStream());
            }
            if (buffer != null) response.getWriter().write(buffer.toString());
        } catch (Exception e) {
            System.out.println("AjaxWrapperRenderer Error: Could not load " + resource);
            System.out.println("Reason: " + e);
        }
        event.getFacesContext().responseComplete();
        return;
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
            System.out.println("AJAXTag:loadResource from stream error:"  + e);
        }
        return buffer;
    }
    
}
