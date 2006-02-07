/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
 */

/**
 * Completion-capable JSF AJAX Wrapper.
 */
package com.sun.javaee.blueprints.wrapper;

import java.util.*;


/**
 *
 *
 * @author Greg Murray
*/
public class AjaxResult {

    public static int JSON = 1;
    public static int JAVASCRIPT=2;
    public static int XML = 3;
    public static int HTML = 4;
    public static int TEXT = 5;
    
    private ArrayList items;
    private StringBuffer buffer;
    
    // default to XML
    private int type = 3;

    public AjaxResult() {
        buffer = new StringBuffer();
    }
    
    public int getResponseType() {
        return type;
    }
    
    public void setResponseType(int type) {
        this.type = type;
    }
    
    public void addItem(String item) {
        if (items == null) items = new ArrayList();
        items.add(item);
    }
    
    public ArrayList getItems() {
        return items;
    }
    
    public StringBuffer getBuffer() {
        return buffer;
    }
    
    public void append(String content) {
        buffer.append(content);
    }
    
    public String toString() {
        return buffer.toString();
    }

}