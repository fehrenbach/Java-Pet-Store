/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: CatalogFacade.java,v 1.46 2006-09-18 16:16:11 basler Exp $ */

package com.sun.javaee.blueprints.petstore.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;
import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.persistence.Query;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.transaction.UserTransaction;


public class CatalogFacade implements ServletContextListener {
    
    @PersistenceUnit(unitName="PetstorePu") private EntityManagerFactory emf;
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
    
    public List<Product> getProducts(){
        EntityManager em = emf.createEntityManager();
        List<Product> products = em.createQuery("SELECT p FROM Product p").getResultList();
        em.close();
        return products;
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
        //Query query = em.createNamedQuery("Item.getItemsPerProductCategory");
        Query query = em.createQuery("SELECT i FROM Item i WHERE i.productID = :pID");
        List<Item>  items = query.setParameter("pID",pID).setFirstResult(start).setMaxResults(chunkSize).getResultList();
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
        String pattern = "'"+city.toUpperCase()+"%'";
        Query query = em.createQuery("SELECT  z FROM ZipLocation z where UPPER(z.city) LIKE "+pattern);
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
            try {
                utx.rollback();
            } catch (Exception e) {}
            throw new RuntimeException("Error persisting item", exe);
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
            try {
                utx.rollback();
            } catch (Exception e) {}
            throw new RuntimeException("Error updating rating", exe);
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
    
    public int addTagToItem(String sxTag, Item item){
        EntityManager em = emf.createEntityManager();
        Tag tag=null;
        try {
            List<Tag> tags=em.createQuery("SELECT t FROM Tag t WHERE t.tag = :tag").setParameter("tag", sxTag).getResultList();
            
            
            if(tags != null && !tags.isEmpty()) {
                tag=tags.get(0);
                // found tag so add in reference item
                if(!tag.itemExists(item)) {
                    // add item to tag
                    tag.getItems().add(item);
                    tag.incrementRefCount();
                }
            } else {
                // need add tag and reference item
                tag=new Tag(sxTag);
                // add item to tag
                tag.getItems().add(item);
                tag.incrementRefCount();
            }
            // add tag to items ???
            item.getTags().add(tag);
            
            utx.begin();
            em.joinTransaction();
            em.merge(item);
            em.persist(tag);
            utx.commit();
        } catch(Exception exe){
            try {
                utx.rollback();
            } catch (Exception e) {}
            throw new RuntimeException("Error persisting tag", exe);
        } finally {
            em.close();
        }
        return tag.getTagID();
    }
    
    
    public List<Tag> getTagsInChunk(int start, int chunkSize) {
        EntityManager em = emf.createEntityManager();
        Query query = em.createQuery("SELECT t FROM Tag t ORDER BY t.tag");
        List<Tag> tags = query.setFirstResult(start).setMaxResults(chunkSize).getResultList();
        em.close();
        return tags;
    }

    public Tag getTag(String sxTag) {
        Tag tag=null;
        EntityManager em = emf.createEntityManager();
        List<Tag> tags=em.createQuery("SELECT t FROM Tag t WHERE t.tag = :tag").setParameter("tag", sxTag).getResultList();
        em.close();
        if(tags != null && !tags.isEmpty()) {
            tag=tags.get(0);
        }
        return tag;
    }
    
}

