package com.sun.javaee.blueprints.petstore.model;

import java.util.*;

import javax.servlet.*;
import javax.ejb.*;
import javax.persistence.*;

@NamedQuery(
  name="getItemsPerProductCategory",
  query="SELECT i FROM Item i WHERE i.productID.categoryID LIKE :cID "
) 
public class CatalogFacade implements ServletContextListener {

   @PersistenceContext(name="bppu")
   private EntityManager em;

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

    /**
     * Value List Handler for items. Uses the Java Persistence query language.
     * @param catID is the category id that the item belongs to
     * @param start position of the first result, numbered from 0
     * @param chunkSize the maximum number of results to retrieve
     * @returns a List of Item objects
     */
    public List<Item> getItemsVLH(String catID, int start, int chunkSize){     
       //make Java Persistence query
       //Query query = em.createQuery("SELECT  i FROM Item i, Product p WHERE i.productID = p.productID AND p.categoryID LIKE :cID")
       //List<Item>  items = query.setParameter("cID",catID).setFirstResult(start).setMaxResults(chunkSize).getResultList();
       Query query = em.createNamedQuery("getItemsPerProductCategory");
       query.setParameter("cID",catID);
       query.setFirstResult(start).setMaxResults(chunkSize);
       List<Item> items = query.getResultList(); 
       return items;
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
