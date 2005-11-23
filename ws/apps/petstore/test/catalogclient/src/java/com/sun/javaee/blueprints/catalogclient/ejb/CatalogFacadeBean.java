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
    System.out.println("em is" + em);
return em.createNativeQuery("SELECT * FROM Category_1").getResultList();
}

public Collection getProducts(String catID){

return em.createQuery(
"SELECT p FROM Product_1 p WHERE p.categoryID LIKE :categoryID")
.setParameter("categoryID", catID)
.setMaxResults(10)
.getResultList();
}


}
