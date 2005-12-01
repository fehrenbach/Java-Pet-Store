package com.sun.javaee.blueprints.catalogclient.ejb;

import java.util.*;

import javax.ejb.*;
import javax.annotation.*;
import javax.persistence.*;

import com.sun.javaee.blueprints.petstore.model.*;

@Stateless
public class CatalogFacadeBean implements CatalogFacade{

@PersistenceContext(name="bppu")
private static EntityManager em;

public Collection getCategories(){
return em.createQuery("SELECT OBJECT(c) FROM Category_1 c").getResultList();
}

public Collection getProducts(String catID){
return em.createQuery(
"SELECT p FROM Product p WHERE p.categoryID LIKE :categoryID")
.setParameter("categoryID", catID).getResultList();
}


public Collection getItems(String prodID){
return em.createQuery(
"SELECT i FROM Item i WHERE i.productID LIKE :productID")
.setParameter("productID", prodID).getResultList();
}

}
