/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: Location.java,v 1.2 2006-05-03 21:48:58 inder Exp $ */

package com.sun.javaee.blueprints.petstore.mapviewer;

/**
 *
 * @author basler
 */
public class Location {
    
    private String address="", info="";
    
    /** Creates a new instance of Location */
    public Location() {}    
    
    public Location(String address, String info) {
        this.address=address;
        this.info=info;
    }
    
    public void setAddress(String address) {
        this.address=address;
    }
    public String getAddress() {
        return address;
    }
    
    public void setInfo(String info) {
        this.info=info;
    }
    public String getInfo() {
        return info;
    }
    
}
