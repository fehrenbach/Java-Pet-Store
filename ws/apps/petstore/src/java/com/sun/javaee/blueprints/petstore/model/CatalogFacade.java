package com.sun.javaee.blueprints.petstore.model;

import java.util.*;

import javax.servlet.*;
import javax.ejb.*;

import javax.persistence.*;
import javax.transaction.*;
import javax.annotation.*;

public class CatalogFacade implements ServletContextListener {
    
    @PersistenceUnit(unitName="bppu") private EntityManagerFactory emf;
    @Resource UserTransaction utx;
    
    public CatalogFacade(){ }
    
    public void contextDestroyed(ServletContextEvent sce) {
        //close the factory and all entity managers associated with it
        if (emf.isOpen()) emf.close();
    }
    
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext context = sce.getServletContext();
        context.setAttribute("CatalogFacade", this);
    }
    
    public List<Category> getCategories(){
        EntityManager em = emf.createEntityManager();
        List<Category> categories = em.createQuery("SELECT c FROM Category c").getResultList();
        em.close();
        return categories;
    }
    
    public List<Item> getAllItemsFromCategory(String catID){
        EntityManager em = emf.createEntityManager();
        List<Item> items = em.createQuery("SELECT i FROM Item i, Product p WHERE i.productID = p.productID AND p.categoryID LIKE :categoryID")
        .setParameter("categoryID", catID).getResultList();
        em.close();
        return items;
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
       /*
       Iterator<Item> it = items.iterator();
          while (it.hasNext()) {
               Item i = it.next();
              System.out.println("*****CatalogFacade:**" +i.getItemID() + "\n");
          }
        **/
        em.close();
        return items;
    }
    
    /**
     * Value List Handler for items. Found by item ID
     * @param IDs is an array of item ids for specific items that need to be returned
     * @returns a List of Item objects
     */
    public List<Item> getItemsByItemID(String[] itemIDs){
        EntityManager em = emf.createEntityManager();
        List<Item> items = new ArrayList<Item>();
        for(int i=0;i<itemIDs.length;++i){
            Item item = em.find(Item.class,itemIDs[i]); 
            items.add(item);
        }
        em.close();
        return items;
    }
    
    /**
     * Value List Handler for items. Found by item ID and radius
     * @param IDs is an array of item ids for specific items that need to be returned
     * @returns a List of Item objects
     */
    public List<Item> getItemsByItemIDByRadius(String[] IDs, double fromLatitude,
            double toLatitude, double fromLongitude, double toLongitude){
            EntityManager em = emf.createEntityManager();
       /* List<Item> items = new List<Item>();
        em.close();
        return items;*/
    }
    
    /**
     * Value List Handler for items. Found by category
     * @param categoryID is the category id that the item belongs to
     * @param start position of the first result, numbered from 0
     * @param chunkSize the maximum number of results to retrieve
     * @returns a List of Item objects
     */
    public List<Item> getItemsByCategoryVLH(String catID, int start,
            int chunkSize){
        EntityManager em = emf.createEntityManager();
        Query query = em.createQuery("SELECT i FROM Item i, Product p WHERE " +
                "i.productID=p.productID AND p.categoryID = :categoryID" +
                " GROUP BY i.name");
        List<Item>  items = query.setParameter("categoryID",catID).setFirstResult(start).setMaxResults(chunkSize).getResultList();
        em.close();
        return items;
    }
    /**
     * Value List Handler for items. Found by category and location radius
     * @param categoryID is the category id that the item belongs to
     * @param start position of the first result, numbered from 0
     * @param chunkSize the maximum number of results to retrieve
     * @returns a List of Item objects
     */
    public List<Item> getItemsByCategoryByRadiusVLH(String catID, int start,
            int chunkSize,double fromLat,double toLat,double fromLong,
            double toLong){
        EntityManager em = emf.createEntityManager();
        Query query = em.createQuery("SELECT i FROM Item i, Product p WHERE " +
                "i.productID=p.productID AND p.categoryID = :categoryID " +
                "AND i.address IN (SELECT a FROM Address a where (a.latitude BETWEEN" +
                ":fromLatitude AND :toLatitude) AND (a.longitude BETWEEN" +
                ":fromLongitude AND :toLongitude )) GROUP BY i.name");
        query.setParameter("categoryID",catID);
        query.setParameter("fromLatitude",fromLat);
        query.setParameter("toLatitude",toLat);
        query.setParameter("fromLongitude",fromLong);
        query.setParameter("toLongitude",toLong);
        List<Item>  items = query.setFirstResult(start).setMaxResults(chunkSize).getResultList();
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
        Query query = em.createNamedQuery("Item.getAllZipCityState");
        List<ZipLocation>  zipCodeLocations = query.getResultList();
        em.close();
        return zipCodeLocations;
    }
    
    public List<Product> getProducts(String catID){
        EntityManager em = emf.createEntityManager();
        List<Product> products = em.createQuery("SELECT p FROM Product p WHERE p.categoryID LIKE :categoryID")
        .setParameter("categoryID", catID).getResultList();
        em.close();
        return products;
    }
    
    public List<Item> getItems(String prodID){
        EntityManager em = emf.createEntityManager();
        List<Item> items = em.createQuery("SELECT i FROM Item i WHERE i.productID LIKE :productID")
        .setParameter("productID", prodID).getResultList();
        em.close();
        return items;
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
    
    public String addItem(Item item){
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
        return item.getItemID();
    }
    public String addRating(Item item){
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
        return item.getItemID();
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

