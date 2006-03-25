
package com.sun.javaee.blueprints.petstore.model;

import java.util.*;
import javax.persistence.*;

@Entity
public class Customer implements java.io.Serializable {

    @Id private String id;
    private String firstName = null;
    private String lastName = null;
    private String street1 = null;
    private String street2 = null;
    private String city = null;
    private String zip = null;

    public Customer(String id) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.street1 = street1;
        this.street2 = street2;
        this.city = city;
        this.zip = zip;
    }

    public String getId() {
        return this.id;
    }
    
    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
    
    public String getStreet1() {
        return street1;
    }
    
    public String getStreet2() {
        return street2;
    }
    
    public String getCity() {
        return city;
    }
    
    public String getZip() {
        return zip;
    }
}



