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

public Collection getProducts(String catID){
return em.createQuery(
"SELECT p FROM Product_1 p WHERE p.categoryID LIKE :categoryID")
.setParameter("categoryID", catID).getResultList();
}


public Collection getItems(String prodID){
return em.createQuery(
"SELECT i FROM Item_1 i WHERE i.productID LIKE :productID")
.setParameter("productID", prodID).getResultList();
}

public Item_1 getItem(String itemID){
return em.find(Item_1.class,itemID);
}

}
