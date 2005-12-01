package com.sun.javaee.blueprints.petstore.model;

import java.util.*;

import javax.ejb.*;
import javax.persistence.*;

public class CatalogFacade{

private EntityManager em;

public CatalogFacade(EntityManager em){
    this.em = em;
}

    public Collection getCategories(){
        return em.createQuery("SELECT OBJECT(c) FROM Category_1 c").getResultList();
    }
    
    public Collection getAllItemsFromCategory(String catID){
        return em.createQuery("SELECT  OBJECT(i) FROM Item i, Product p WHERE i.productID = p.productID AND p.categoryID LIKE :categoryID")
        .setParameter("categoryID", catID).getResultList();
    }

    public Collection getProducts(String catID){
        return em.createQuery("SELECT p FROM Product p WHERE p.categoryID LIKE :categoryID")
        .setParameter("categoryID", catID).getResultList();
    }


    public Collection getItems(String itemID){
        return em.createQuery("SELECT i FROM Item i WHERE i.productID LIKE :itemID")
                .setParameter("itemID", itemID).getResultList();
    }

    public Item getItem(String itemID){
        return em.find(Item.class,itemID);
    }

    public Collection doSearch(String querryString){
        return em.createQuery("SELECT i FROM Item i WHERE i.productName LIKE :  querryString")
                .setParameter("querryString", querryString).getResultList();
    }

}
