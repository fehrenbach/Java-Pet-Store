/* Copyright 2004 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: 
 http://bpcatalog.dev.java.net/LICENSE.txt
 $Id: AjaxWrapperTag.java,v 1.1 2006-02-07 02:34:00 gmurray71 Exp $ */

package com.sun.javaee.blueprints.wrapper;

import javax.servlet.jsp.*;
import javax.servlet.*;
import javax.servlet.jsp.tagext.*;

import java.io.*;
import java.net.*;
import java.util.*;

import javax.faces.component.*;
import javax.faces.context.FacesContext;
import javax.faces.el.*;
import javax.faces.event.ValueChangeEvent;
import javax.faces.webapp.UIComponentTag;

/**
 * Base tag for AJAX Wrappers.
 *
 * @author Greg Murray
 */
public class AjaxWrapperTag extends UIComponentTag {
    
    private static String COUNTER = "ajax_wrapper_counter";
    private static String CACHE = "ajax_wrapper_cache";
    private static String CACHE_TIMES = "ajax_wrapper_cache_times";
    private static String WROTE_SCRIPT = "ajax_wrapper_wrote_script";
    private static String WROTE_STYLE = "ajax_wrapper_wrote_style";
    private static String WROTE_DOJO = "ajax_wrapper_wrote_dojo";
	private static String DOJO_INCLUDES = "ajax_wrapper_dojo_includes";
    
    private boolean fromWeb = true;
    private boolean embedded = false;
    private boolean caches = true;
    
    private String binding = null;
    private String name = null;
    private String div = null;
    private String style = null;
    private String script = null;
    private String template = null;
    private String service = null;
    private String event = null;
    private String eventHandler = null;
    private String type = null;
    private ServletContext ctx = null;
    
    public void setName(String name) {this.name=name;}
    public void setBinding(String binding) {this.binding=binding;}
    public void setService(String service) {this.service=service;}
    public void setStyle(String style) {this.style=style;}
    public void setDiv(String div) {this.div=div;} 
    public void setScript(String script) {this.script=script;}
    public void setEvent(String event) {this.event=event;}
    public void setEventHandler(String eventHandler) {this.eventHandler=eventHandler;}
    public void setTemplate(String template) {this.template=template;}
    public void setEmbedded(boolean embedded) {this.embedded=embedded;}
    public void setCaches(boolean caches) {this.caches=caches;}
    public void setType(String type) {this.type=type;}
    
    /**
        * Gets the type of the component associated wit hthe tag.
     * @return the name of the component type
     */
    public String getComponentType() {
        return "AjaxWrapper";
    }
    
    /**
        * Gets the type of the renderer that will render this tag.
     * @return the type of the renderer that renders this tag
     */
    public String getRendererType() {
        return "AjaxWrapperType";
    }
    
    /**
        * Releases resources allocated during the execution of this tag handler.
     */
    public void release() {
        super.release();
    }
    
    
    /**
        * Sets the properties of the specified component.
     * @param component the component associated with this tag
     */
    protected void setProperties(UIComponent component) {
        AjaxWrapper wrapper = null;
        
        try {
            wrapper = (AjaxWrapper)component;
        } catch (ClassCastException cce) {
            throw new IllegalStateException("Component " + component.toString() +
                                            " not expected type.  Expected: AjaxWrapper.");
        }
        
        wrapper.setBinding(binding);
        wrapper.setName(name);
        wrapper.setService(service);
        wrapper.setStyle(style);
        wrapper.setDiv(div);
        wrapper.setScript(script);
        wrapper.setEvent(event);
        wrapper.setEventHandler(eventHandler);
        wrapper.setTemplate(template);
        wrapper.setEmbedded(embedded);
        wrapper.setCaches(caches);
        wrapper.setType(type);
    }
    
    
}

