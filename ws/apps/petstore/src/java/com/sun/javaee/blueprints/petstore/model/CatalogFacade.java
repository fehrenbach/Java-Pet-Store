package com.sun.javaee.blueprints.petstore.model;

import java.util.*;

import javax.servlet.*;
import javax.ejb.*;
import javax.persistence.*;

public class CatalogFacade implements ServletContextListener {

   @PersistenceContext(name="bppu")
   private static EntityManager em;

    public CatalogFacade(){
        System.out.println("Created Catalog Facade...Entity manager=" + em);
    }
    
    public void contextDestroyed(ServletContextEvent sce) {}
    
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext context = sce.getServletContext();
        context.setAttribute("CatalogFacade", this);
    }

    public Collection getCategories(){
        return em.createQuery("SELECT OBJECT(c) FROM PCategory c").getResultList();
    }
    
    public Collection getAllItemsFromCategory(String catID){
        return em.createQuery("SELECT  OBJECT(i) FROM PItem i, Product p WHERE i.productID = p.productID AND p.categoryID LIKE :categoryID")
        .setParameter("categoryID", catID).getResultList();
    }

    public Collection getProducts(String catID){
        return em.createQuery("SELECT p FROM Product p WHERE p.categoryID LIKE :categoryID")
        .setParameter("categoryID", catID).getResultList();
    }


    public Collection getItems(String productID){
        return em.createQuery("SELECT OBJECT(i) FROM PItem i WHERE i.productID LIKE :productID")
                .setParameter("productID", productID).getResultList();
    }

    public PItem getItem(String itemID){
        return em.find(PItem.class,itemID);
    }

    public Collection doSearch(String querryString){
        return em.createQuery("SELECT i FROM Item i WHERE i.productName LIKE :  querryString")
                .setParameter("querryString", querryString).getResultList();
    }

}
