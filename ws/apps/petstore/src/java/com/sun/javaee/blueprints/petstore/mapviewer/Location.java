/*
 * Location.java
 *
 * Created on March 2, 2006, 9:55 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

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
