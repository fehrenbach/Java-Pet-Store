package com.sun.javaee.blueprints.petstore.model;

import java.util.*;

import javax.servlet.*;
import javax.ejb.*;

import javax.persistence.*;
import javax.transaction.*;
import javax.annotation.*;

public class CatalogFacade implements ServletContextListener {

   @PersistenceContext(name="bppu")
   private EntityManager em;
   
   @Resource UserTransaction utx;

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
     * @param pID is the product id that the item belongs to
     * @param start position of the first result, numbered from 0
     * @param chunkSize the maximum number of results to retrieve
     * @returns a List of Item objects
     */
    public List<Item> getItemsVLH(String pID, int start, int chunkSize){     
       //make Java Persistence query
       System.out.println("CatalogFacade: productId=" + pID + " start=" + start + " chunkSize=" + chunkSize);
       
       //Query query = em.createNamedQuery("Item.getItemsPerProductCategory");
       Query query = em.createQuery("SELECT i FROM Item i WHERE i.productID = :pID");
       List<Item>  items = query.setParameter("pID",pID).setFirstResult(start).setMaxResults(chunkSize).getResultList();      
       
       Iterator<Item> it = items.iterator();            
          while (it.hasNext()) {
               Item i = it.next();
              System.out.println("*****CatalogFacade:**" +i.getItemID() + "\n");
          }
       return items;
    }
    
    /**
     * Gets a list of all the zipcode/city/state for autocomplete on user forms
     * Need to enhance so that returned list is cached for reuse at application scope 
     * and held as member field of facade.
     * @returns a List of ZipLocation objects
     */
    public List<ZipLocation> getZipCodeLocations(){     
       //Query query = em.createQuery("SELECT  z FROM ZipLocation z");
       Query query = em.createNamedQuery("getAllZipCityState");
       List<ZipLocation>  zipCodeLocations = query.getResultList();    
       return zipCodeLocations;
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
    
    public void addItem(Item item){
        try{
            utx.begin();
            em.persist(item);
            utx.commit();
        } catch(Exception exe){
            System.out.println("Error persisting item: "+exe);
            try {
                utx.rollback();
            } catch (Exception e) {}
        } 
    }

    public Collection doSearch(String querryString){
        Query searchQuery = em.createNativeQuery("SELECT * FROM Item WHERE (name LIKE ? OR description LIKE ?) " );
        searchQuery.setParameter(1, "%"+querryString+"%");
        searchQuery.setParameter(2,"%"+querryString+"%");
        return searchQuery.getResultList();
    }
}

