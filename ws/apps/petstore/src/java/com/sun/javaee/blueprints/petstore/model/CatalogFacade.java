package com.sun.javaee.blueprints.petstore.model;

import java.util.*;

import javax.servlet.*;
import javax.ejb.*;

import javax.persistence.*;
import javax.transaction.*;
import javax.annotation.*;

public class CatalogFacade implements ServletContextListener {

   //@PersistenceContext(name="bppu")
   //private EntityManager em;
    @PersistenceUnit(unitName="bppu") private EntityManagerFactory emf;
    @Resource UserTransaction utx;

    public CatalogFacade(){
        System.out.println("Created Catalog Facade...Entity manager factory =" + emf);
    }

    public void contextDestroyed(ServletContextEvent sce) {
       //close the factory and all entity managers associtaed with it
       emf.close();
    }
    
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext context = sce.getServletContext();
        context.setAttribute("CatalogFacade", this);
    }

    public Collection getCategories(){
        EntityManager em = emf.createEntityManager();
        Collection results = em.createNativeQuery("SELECT * FROM Category").getResultList();
        em.close();
        return results;
    }
    
    public Collection getAllItemsFromCategory(String catID){
        EntityManager em = emf.createEntityManager();
        Collection results = em.createNativeQuery("SELECT  * FROM Item, Product WHERE Item.productID = Product.productID AND Product.categoryID LIKE ?")
        .setParameter(1, "%"+catID+"%").getResultList();
        em.close();
        return results;
    }

    /**
     * Value List Handler for items. Uses the Java Persistence query language.
     * @param pID is the product id that the item belongs to
     * @param start position of the first result, numbered from 0
     * @param chunkSize the maximum number of results to retrieve
     * @returns a List of Item objects
     */
    public List<Item> getItemsVLH(String pID, int start, int chunkSize){    
       EntityManager em = emf.createEntityManager();

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
       em.close();
       return items;
    }
    
    /**
     * Gets a list of all the zipcode/city/state for autocomplete on user forms
     * Need to enhance so that returned list is cached for reuse at application scope 
     * and held as member field of facade.
     * @returns a List of ZipLocation objects
     */
    public List<ZipLocation> getZipCodeLocations(){  
       EntityManager em = emf.createEntityManager();
       //Query query = em.createQuery("SELECT  z FROM ZipLocation z");
       Query query = em.createNamedQuery("getAllZipCityState");
       List<ZipLocation>  zipCodeLocations = query.getResultList();    
       em.close();
       return zipCodeLocations;
    }

    public Collection getProducts(String catID){
        EntityManager em = emf.createEntityManager();
        Collection results = em.createNativeQuery("SELECT * FROM Product WHERE categoryID LIKE ?")
        .setParameter(1, "%"+catID+"%").getResultList();
        em.close();
        return results;
    }

    public Collection getItems(String productID){
        EntityManager em = emf.createEntityManager();
        Collection results = em.createNativeQuery("SELECT * FROM Item WHERE productid LIKE ?")
                .setParameter(1, "%"+productID+"%").getResultList();
        em.close();
        return results;
    }

    public Category getCategory(String categoryID){
        EntityManager em = emf.createEntityManager();
        Category result = em.find(Category.class,categoryID);
        em.close();
        return result;
    }

    public Item getItem(String itemID){
        EntityManager em = emf.createEntityManager();
        Item result = em.find(Item.class,itemID);
        em.close();
        return result;
    }
    
    public void addItem(Item item){
        EntityManager em = emf.createEntityManager();
        try{
            utx.begin();
            em.joinTransaction();
            em.persist(item);
            utx.commit();
        } catch(Exception exe){
            System.out.println("Error persisting item: "+exe);
            try {
                utx.rollback();
            } catch (Exception e) {}
        } finally {
            em.close();
        }
    }

    public Collection doSearch(String querryString){
        EntityManager em = emf.createEntityManager();
        Query searchQuery = em.createNativeQuery("SELECT * FROM Item WHERE (name LIKE ? OR description LIKE ?) " );
        searchQuery.setParameter(1, "%"+querryString+"%");
        searchQuery.setParameter(2,"%"+querryString+"%");
        
        Collection results = searchQuery.getResultList();
        em.close();
        return results;
    }
}

