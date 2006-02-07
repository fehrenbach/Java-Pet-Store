/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
 */

/**
 * Completion-capable JSF AJAX Wrapper.
 */
package com.sun.javaee.blueprints.wrapper;

import java.io.IOException;
import java.util.*;

import javax.faces.context.FacesContext;
import javax.faces.el.*;
import javax.faces.component.*;

/**
 *
 *
 * @author Greg Murray
*/
public class AjaxWrapper extends UIComponentBase {


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
    
    public void setName(String name) {this.name=name;}
    public String getName(){return name;};
    public void setBinding(String binding) {this.binding=binding;}
    public String getBinding() {return binding;}
    public void setService(String service) {this.service=service;}
    public String getService() {return service;}
    public void setStyle(String style) {this.style=style;}
    public String getStyle() {return style;}
    public void setDiv(String div) {this.div=div;}
    public String getDiv() {return div;}
    public void setScript(String script) {this.script=script;}
    public String getScript(){return script;};
    public void setEvent(String event) {this.event=event;}
    public String getEvent(){return event;};
    public void setEventHandler(String eventHandler) {this.eventHandler=eventHandler;}
    public String getEventHandler(){return eventHandler;};
    public void setTemplate(String template) {this.template=template;}
    public String getTemplate(){return template;};
    public void setEmbedded(boolean embedded) {this.embedded=embedded;}
    public boolean getEmbedded(){return embedded;};
    public void setCaches(boolean caches) {this.caches=caches;}
    public boolean getCaches(){return caches;};
    public void setType(String type) {this.type=type;}
    public String getType(){return type;};
    public boolean getFromWebRoot(){return fromWeb;};
    public void setFromWebRoot(boolean fromWeb){this.fromWeb = fromWeb;};

    public AjaxWrapper() {
        super();
        setRendererType("AjaxWrapper");
    }
    
    public String getFamily() {
        return ("AjaxWrapper");
    }
    
    public boolean getRendersChildren() {
        return (true);
    }
    
    public void processDecodes(FacesContext context) {
        // Process all facets and children of this component
        Iterator kids = getFacetsAndChildren();
        while (kids.hasNext()) {
            UIComponent kid = (UIComponent) kids.next();
            kid.processDecodes(context);
        }

        // Process this component itself
        try {
            decode(context);
        } catch (RuntimeException e) {
            context.renderResponse();
            throw e;
        }
    }

}
