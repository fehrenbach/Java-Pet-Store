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
     * Value List Handler for items. The Chunk return contains an item with iID or nothing is returned. Uses the Java Persistence query language.
     * @param pID is the product id that the item belongs to
     * @param start position of the first result, numbered from 0
     * @param chunkSize the maximum number of results to retrieve
     * @returns a List of Item objects
     */
    public List<Item> getItemInChunckVLH(String pID, String iID, int chunkSize){
        EntityManager em = emf.createEntityManager();
        //make Java Persistence query
        Query query = em.createQuery("SELECT i FROM Item i WHERE i.productID = :pID");
        List<Item>  items;
        // scroll through these till we find the set with the itemID we are loooking for
        int index = 0;
        while (true) {
            items = query.setParameter("pID",pID).setFirstResult(index++ * chunkSize).setMaxResults(chunkSize).getResultList();
            if ((items == null) || items.size() <= 0) break;
            System.out.println("items.size=" + items.size());
            Iterator<Item> it = items.iterator();
            while ((it != null) && it.hasNext()) {
                Item i = it.next();
                // return this chunck if it contains the id we are looking for
                if (i.getItemID().equals(iID)) {
                    em.close();
                    return items;
                }
            }
        }
        em.close();
        return null;
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
        String idString  = "";
        List<Item>  items = new ArrayList();
        if(itemIDs.length !=0) {
            for(int i=0;i<itemIDs.length;++i){
                if(idString.length()!=0) idString+=",";
                idString=idString+"'"+itemIDs[i]+"'";
            }
            String queryString = "SELECT i FROM Item i WHERE " +
                    "i.itemID IN (" +idString+")";
            Query query = em.createQuery(queryString + " ORDER BY i.name");
            items = query.getResultList();
        }
        em.close();
        return items;
    }
    
    /**
     * Value List Handler for items. Found by item ID and radius
     * @param IDs is an array of item ids for specific items that need to be returned
     * @returns a List of Item objects
     */
    public List<Item> getItemsByItemIDByRadius(String[] itemIDs, double fromLat,
            double toLat, double fromLong, double toLong){
        EntityManager em = emf.createEntityManager();
        List<Item>  items = new ArrayList();
        String idString  = "";
        if(itemIDs.length !=0) {
            for(int i=0;i<itemIDs.length;++i){
                if(idString.length()!=0) idString+=",";
                idString=idString+"'"+itemIDs[i]+"'";
            }
            String queryString = "SELECT i FROM Item i WHERE ((" +
                    "i.itemID IN (" +idString+"))";
            Query query = em.createQuery(queryString + " AND " +
                    " ((i.address.latitude BETWEEN :fromLatitude AND :toLatitude) AND " +
                    "(i.address.longitude BETWEEN :fromLongitude AND :toLongitude )))" +
                    "  ORDER BY i.name");
            query.setParameter("fromLatitude",fromLat);
            query.setParameter("toLatitude",toLat);
            query.setParameter("fromLongitude",fromLong);
            query.setParameter("toLongitude",toLong);
            items = query.getResultList();
        }
        em.close();
        return items;
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
                " ORDER BY i.name");
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
                "AND((i.address.latitude BETWEEN :fromLatitude AND :toLatitude) AND " +
                "(i.address.longitude BETWEEN :fromLongitude AND :toLongitude ))" +
                "  ORDER BY i.name");
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
    public List<ZipLocation> getZipCodeLocations(String city, int start, int chunkSize){
        EntityManager em = emf.createEntityManager();        
        /*StringTokenizer parser = new StringTokenizer(city);
        StringBuffer patternSB =  null;        
        while (parser.hasMoreTokens()) {
            String token = parser.nextToken();
            char firstChar = Character.toUpperCase(token.charAt(0));
            StringBuffer tokenSB = new StringBuffer(token);
            tokenSB.setCharAt(0,firstChar);
            patternSB.append(tokenSB);
            patternSB.append(" ");
        }*/
        char firstChar = Character.toUpperCase(city.charAt(0));
        StringBuffer patternSB = new StringBuffer(city);
        patternSB.setCharAt(0,firstChar);
        String pattern = "'"+patternSB+"%'";
        System.out.println("pattern is" + pattern);
        Query query = em.createQuery("SELECT  z FROM ZipLocation z where z.city LIKE "+pattern);
        //Query query = em.createNamedQuery("Item.getAllZipCityState");
        List<ZipLocation>  zipCodeLocations = query.setFirstResult(start).setMaxResults(chunkSize).getResultList();
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
    
    public void updateRating(Item item){
        EntityManager em = emf.createEntityManager();
        try{
            utx.begin();
            em.merge(item);
            utx.commit();
        } catch(Exception exe){
            System.out.println("Error updating rating: "+exe);
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

