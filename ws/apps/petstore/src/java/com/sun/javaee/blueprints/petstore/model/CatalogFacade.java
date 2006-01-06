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
        return em.createNativeQuery("SELECT * FROM Category").getResultList();
    }
    
    public Collection getAllItemsFromCategory(String catID){
        return em.createNativeQuery("SELECT  * FROM Item, Product WHERE Item.productID = Product.productID AND Product.categoryID LIKE ?")
        .setParameter(1, "%"+catID+"%").getResultList();
    }

    public Collection getProducts(String catID){
        return em.createNativeQuery("SELECT * FROM Product WHERE categoryID LIKE ?")
        .setParameter(1, "%"+catID+"%").getResultList();
    }


    public Collection getItems(String productID){
        return em.createNativeQuery("SELECT * FROM Item WHERE productid LIKE ?")
                .setParameter(1, "%"+productID+"%").getResultList();
    }

    public Category getCategory(String categoryID){
        return em.find(Category.class,categoryID);
    }

    public Item getItem(String itemID){
        return em.find(Item.class,itemID);
    }

    public Collection doSearch(String querryString){
        Query searchQuery = em.createNativeQuery("SELECT * FROM Item WHERE (name LIKE ? OR description LIKE ?) " );
        searchQuery.setParameter(1, "%"+querryString+"%");
        searchQuery.setParameter(2,"%"+querryString+"%");
        return searchQuery.getResultList();
    }

}
