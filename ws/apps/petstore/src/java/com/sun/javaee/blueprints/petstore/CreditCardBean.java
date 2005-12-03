/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
 */
package com.sun.javaee.blueprints.petstore;


/**
 * This bean carries session state, such as the address entered by the user
 *
 * @author Greg Murray
 */
public class CreditCardBean {

    private String type;
    private String expiryYear;
    private String expirtyMonth;
    private String number;
    private String name;
    private String street;
    private String city;
    private String state;
    private String zip;

    public CreditCardBean() {
    }
    
    public void setNumber(String number) {
        this.number = number;
    }
    
    public String getNumber() {
        return number;
    }
    
    public void setType(String type) {
       this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getStreet() {
        return street;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCity() {
        return city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getZip() {
        return zip;
    }
}
