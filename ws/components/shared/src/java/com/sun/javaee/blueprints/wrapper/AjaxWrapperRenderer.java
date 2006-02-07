/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
 */

/*
 * AjaxWrapperRenderer.java
 *
 * Created on April 29, 2005, 12:30 PM
 *
 * To change this template, choose Tools | Options and locate the template under
 * the Source Creation and Management node. Right-click the template and choose
 * Open. You can then make changes to the template in the Source Editor.
 */
package com.sun.javaee.blueprints.wrapper;

import java.io.*;
import java.util.*;
import java.net.*;
import javax.faces.component.*;
import javax.faces.el.*;
import javax.faces.context.*;

import javax.servlet.http.*;
import javax.servlet.*;
import javax.servlet.jsp.PageContext;

import javax.faces.render.Renderer;
import javax.faces.webapp.UIComponentTag;
import com.sun.faces.util.Util;


/**
 * This renderer generates HTML (including JavaScript) for AjaxDynamicTextFields,
 * emitting the necessary markup to provide auto completion for the textfield.
 *
 * This component relies on a cooperating servlet that responds to asynchronous
 * requests.
 *
 * @author Greg Murray
 */
public class AjaxWrapperRenderer extends Renderer {

    
    private ServletContext ctx;
    
    private static String COUNTER = "ikandi_counter";
    private static String CACHE = "ikandi_cache";
    private static String CACHE_TIMES = "ikandi_cache_times";
    private static String WROTE_SCRIPT = "ikandi_wrote_script";
    private static String WROTE_STYLE = "ikandi_wrote_style";
    private static String WROTE_DOJO = "ikandi_wrote_dojo";
	private static String DOJO_INCLUDES = "ikandi_dojo_includes";
    
    private static int nextId = 0;
    
    private static final String RENDERED_SCRIPT_KEY = "bpcatalog-ajax-script-wrapper";

    /** Creates a new instance of AjaxDynamicLabelRenderer */
    public AjaxWrapperRenderer() {
    }

    public void encodeBegin(FacesContext context, UIComponent component)
        throws IOException {
    }

    public void encodeChildren(FacesContext context, UIComponent component) {
    }
    
    public void encodeRecursive(FacesContext context, UIComponent component)
        throws IOException {
        encodeBegin(context, component);
        if (component.getRendersChildren()) {
            component.encodeChildren(context);
        } else {
            Iterator kids = component.getChildren().iterator();
            while (kids.hasNext()) {
                UIComponent kid = (UIComponent) kids.next();
                encodeRecursive(context, kid);
            }
        }
        encodeEnd(context,component);

    }

    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        
        AjaxWrapper wrapper = (AjaxWrapper)component;
        
        ctx =  (ServletContext)context.getExternalContext().getContext();
        Object object = context.getExternalContext().getRequest();
        HttpServletRequest request = (HttpServletRequest)object;
 
        ResponseWriter writer = context.getResponseWriter();

        int counter = 0;
        Integer counterI = (Integer)request.getAttribute(COUNTER);
        if (counterI != null) {
         counter = counterI.intValue();
        }
        // Default Ids that are incremented
        String uuid =  "" +  counter++;
        request.setAttribute(COUNTER, new Integer(counter));
        boolean isDojo = ((wrapper.getType() != null)  && (wrapper.getType().toLowerCase().equals("dojo")));
        // check for the widget type
        try {
        if (isDojo) {
	        boolean wroteDojo =  (request.getAttribute(WROTE_DOJO) != null);
	        if (!wroteDojo) {
	      	 	writer.write("<script type=\"text/javascript\" src=\"dojo.js\"></script>\n");
	      	 	// set that dojo has been written in the page scope.
	      	 	// ### May want to consider using the Request scope here
	      	 	// ### sine JSP pages can be included inline.
	        	request.setAttribute(WROTE_DOJO, new Boolean(true));
			}        
	    }

        // Check and see if the style for this component has been written
        boolean wroteStyle =  (request.getAttribute(WROTE_STYLE) != null);
        if (!wroteStyle && wrapper.getEmbedded()) {
            StringBuffer sbuff = getResource("/" + wrapper.getName() + ".css", wrapper.getFromWebRoot(), wrapper.getCaches());
            if (sbuff != null) {
                writer.write("<style type=\"text/css\">\n");
                writer.write(sbuff.toString());
                writer.write("</style>\n");
                request.setAttribute(WROTE_STYLE, new Boolean(true));
            }
            // ## doublecheck this logic - dojo manages it's own styles
            // ## but it would be good to allow additional styles
        } else if (!wroteStyle &&  !wrapper.getEmbedded()) {
            String styleName = wrapper.getStyle();
            if (styleName == null) styleName = wrapper.getName() + ".css";
            writer.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + styleName + "\"></link>\n");
            request.setAttribute(WROTE_STYLE, new Boolean(true));
        }
        boolean wroteScript =  (request.getAttribute(WROTE_SCRIPT) != null);
        if (!wroteScript && wrapper.getEmbedded() &&  wrapper.getScript() != null && isDojo) {
            StringBuffer jsbuff = getResource("/" +  wrapper.getName() + ".js", wrapper.getFromWebRoot(), wrapper.getCaches());
            if (jsbuff != null) {
                writer.write("<script type=\"text/javascript\">\n");
                writer.write(jsbuff.toString());
                writer.write("</script>\n");
                request.setAttribute(WROTE_SCRIPT, new Boolean(true));
            }
        } else if (!wroteScript && !wrapper.getEmbedded()) {
            String scriptName = wrapper.getScript();
            if (scriptName == null) scriptName =  wrapper.getName() + ".js";
            writer.write("<script type=\"text/javascript\" src=\"" + scriptName + "\"></script>\n");
            request.setAttribute(WROTE_SCRIPT, new Boolean(true));  
        }
        // write the dojo widget initialization script
        if (isDojo) {
	        HashMap dojoIncludes = (HashMap)request.getAttribute(DOJO_INCLUDES);
	        if (dojoIncludes == null) dojoIncludes = new HashMap();
	        if (dojoIncludes.get(wrapper.getName()) == null) {
		    	writer.write("<script type=\"text/javascript\">\n");
    	        writer.write(" dojo.require(\"dojo.widget." + wrapper.getName() + "\");" );
    	        // this might not work right with multiple tags in the page.
        	    writer.write(" dojo.hostenv.writeIncludes();" );
            	writer.write("</script>\n");
			}
            dojoIncludes.put(wrapper.getName(), new Boolean("true"));
	    }
        // get the component fragment
        String templateName = "";
        if (wrapper.getTemplate() != null) {
            templateName = wrapper.getTemplate();
            // resources need to be preceeded by / 
            // add if not present
            if (!templateName.startsWith("/")) {
                wrapper.setTemplate("/" + templateName);
            }
        } else {
            templateName = "/" + wrapper.getName() + ".htmf";
        }
        StringBuffer buff = null;
        buff = getResource(templateName, wrapper.getFromWebRoot(), wrapper.getCaches());
 
        // if there are no children for the template in the body show error.
        // 
        // It might be better to get the content here and apply the replacements
        List children = component.getChildren();
        Iterator kids = children.iterator();
        System.out.println("Rendering Children ");
        component.encodeChildren(context);
        while ((kids != null) && kids.hasNext()) {
                UIComponent kid = (UIComponent) kids.next();
                kid.encodeEnd(context);
        }
        System.out.println("Rendered Children");
        if (buff == null && (children == null)) {
            writer.write("<h2>Error</h2> <p>Unable to locate the template file " + templateName  + " and there is template as the body.</p>");
        } else if (buff !=null) {
            // now substitue the template parameters
            // ### May want to consider autogenerating.
            StringBuffer outBuffer = new StringBuffer(buff.toString());
            replace(outBuffer, "@{uuid}", uuid);
            replace(outBuffer, "@{event}", wrapper.getEvent());
            // default service URL to the name
            if (wrapper.getService() != null) replace(outBuffer, "@{service}", wrapper.getService());
            else replace(outBuffer, "@{service}",  wrapper.getName());
            replace(outBuffer, "@{event_handler}",  wrapper.getEventHandler());
            replace(outBuffer, "@{src_id}", wrapper.getName() + "_" + uuid );
            replace(outBuffer, "@{target_div}", wrapper.getName() + "_" + uuid +"_div");
            replace(outBuffer, "@{binding}",  wrapper.getBinding());
            writer.write(outBuffer.toString());
        }

        } catch (java.io.IOException iox) {
            System.err.println("AjaxWrapperRenderer IO Error: " + iox); 
        }
	}
       
    public void replace(StringBuffer buff, String target, String replacement) {
        if (buff == null || target == null || replacement == null) {
          return;
        }
        int index = 0;
        while (index < buff.length()) {
            index = buff.indexOf(target);
            if (index == -1) {
                break;
            }
            buff.replace(index, index +  target.length(), replacement);
            index += replacement.length() + 1;
        }
    }
    
    public StringBuffer getResource(String resource, boolean fromWeb, boolean cacheContent) {
        InputStream stream = null;
        URLConnection con;
        try {
            if (!fromWeb) {
                URL url = AjaxWrapperRenderer.class.getResource(resource);
                if (url == null) return null;
                con = url.openConnection();
            } else {
                // check the time stamp on the resource
                URL url = ctx.getResource(resource);
                if (url == null) return null;
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
            System.out.println("AjaxWrapperRenderer Error: Could not load " + resource);
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
            System.out.println("AJAXTag:loadResource from stream error:"  + e);
        }
        return buffer;
    }
}
