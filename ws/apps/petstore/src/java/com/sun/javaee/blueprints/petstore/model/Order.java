
package com.sun.javaee.blueprints.petstore.model;

import java.util.*;
import javax.persistence.*;

@Entity
public class Order {

    @Id private String id;
    @OneToMany private ArrayList lineItems = null;
    @ManyToOne private Customer customer = null;

    public Order(String id,
                Customer customer,
                ArrayList lineItems) {

        this.id = id;
        this.customer = customer;
        this.lineItems = lineItems;
    }

    public String getId() {
        return this.id;
    }
    
    public ArrayList lineItems() {
        return lineItems;
    }

    public Customer getCustomers() {
        return customer;
    }
}



