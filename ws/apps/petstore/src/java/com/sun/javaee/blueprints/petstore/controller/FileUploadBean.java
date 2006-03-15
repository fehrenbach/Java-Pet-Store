/*
 * FileUploadBean.java
 *
 * Created on February 8, 2006, 9:07 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.sun.javaee.blueprints.petstore.controller;

import java.util.HashMap;
import java.util.Collection;
import java.util.Iterator;
import java.util.Set;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.util.Date;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.UserTransaction;

import javax.faces.context.FacesContext;
//import javax.faces.event.PhaseEvent;
//import javax.servlet.http.HttpServletResponse;
import javax.faces.context.ResponseWriter;
import org.apache.shale.remoting.faces.ResponseFactory;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.Address;
import com.sun.javaee.blueprints.petstore.model.SellerContactInfo;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadStatus;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadUtil;
import com.sun.javaee.blueprints.petstore.search.IndexDocument;
import com.sun.javaee.blueprints.petstore.search.Indexer;

/**
 *
 * @author basler
 */
public class FileUploadBean {
    @PersistenceContext(name="bppu")
    private EntityManager em;
    @Resource UserTransaction utx;
    private boolean bDebug=false;
    private Logger _logger=null;

    /**
     * <p>Factory for response writers that we can use to construct the
     * outgoing response.</p>
     */
    private static ResponseFactory factory = new ResponseFactory();
    
    /** Creates a new instance of FileUploadBean */
    public FileUploadBean() {
    }
    
    public void postProcessingMethod(FacesContext context, HashMap hmUpload, FileUploadStatus status) {
        if(bDebug) System.out.println("IN Custom Post Processing method");
        try {
            // set custom return enabled so Phaselistener knows not to send default response
            status.enableCustomReturn();
            //FacesContext context=event.getFacesContext();
            //HttpServletResponse response=(HttpServletResponse)context.getExternalContext().getResponse();

            // Acquire a response containing these results
            ResponseWriter writer = factory.getResponseWriter(context, "text/xml");
            
            // persist the data
            try{
                String fileNameKey = null;
                Set keySet = hmUpload.keySet();
                Iterator iter = keySet.iterator();
                while(iter.hasNext()){
                    String key = iter.next().toString();
                    if(key.startsWith("fileLocation"))
                        fileNameKey = key;
                }
                String absoluteFileName = hmUpload.get(fileNameKey).toString();
                System.out.println("Abs name: "+ absoluteFileName);
                String fileName = null;
                int lastSeparator = absoluteFileName.lastIndexOf("/") + 1;
                if (lastSeparator != -1) {
                    fileName = absoluteFileName.substring(lastSeparator, absoluteFileName.length());
                }
                
                String compName = (String)hmUpload.get(FileUploadUtil.COMPONENT_NAME);
                System.out.println("file name: "+ fileName);
                Item item = new Item();
                String prodId = hmUpload.get(compName+":product").toString();
                String name = hmUpload.get(compName+":name").toString();
                String desc = hmUpload.get(compName+":description").toString();
                String unitCost = hmUpload.get(compName+":unitCost").toString();
                String listPrice = hmUpload.get(compName+":listPrice").toString();
                Address addr = new Address();
                //TO-DO: Add address fields to the file upload page and extract data
                addr.setStreet1("street1");
                addr.setStreet2("street2");
                addr.setCity("city");
                addr.setState("state");
                addr.setZip("9999");
                addr.setLatitude(-8.343545645);
                addr.setLongitude(-9.76878787);
                
                SellerContactInfo contactInfo = new SellerContactInfo();
                //TO-DO: Add SellerContactInfo fields to the file upload page and extract data
                contactInfo.setFirstName("duke");
                contactInfo.setLastName("duke");
                contactInfo.setEmail("abc@abc.xyz");
                item.setProductID(prodId);
                item.setDescription(desc);
                item.setName(name);
                item.setUnitCost(new Float(unitCost));
                item.setListPrice(new Float(listPrice));
                item.setImageURL(fileName);
                item.setAddress(addr);
                item.setContactInfo(contactInfo);
                utx.begin();
                em.persist(item);
                utx.commit();
                getLogger().log(Level.FINE, "Item " + name + " has been persisted");

                // index new item
                String itemId = item.getItemID();
                IndexDocument indexDoc=new IndexDocument();
                indexDoc.setUID(itemId);
                indexDoc.setPageURL(itemId);
                indexDoc.setImage(fileName);
                indexDoc.setPrice(listPrice);
                indexDoc.setProduct(prodId);
                indexDoc.setModifiedDate(new Date().toString());
                indexDoc.setContents(name + " " + desc);
                indexDoc.setTitle(name);
                indexDoc.setSummary(desc);
                indexItem(indexDoc);
                
            } catch (Exception ex) {
                getLogger().log(Level.SEVERE, "fileupload.persist.exception", ex);
                try {
                    utx.rollback();
                } catch (Exception exe) {
                    getLogger().log(Level.SEVERE, "fileupload.rollback.exception", exe);
                }
            }
            StringBuffer sb=new StringBuffer();
            //response.setContentType("text/xml;charset=UTF-8");
            //response.setHeader("Cache-Control", "no-cache");
            sb.append("<response>");
            sb.append("<message>***CUSTOM SERVER-SIDE RETURN *** MESSAGE->");
            sb.append(status.getMessage());
            sb.append("</message>");
            sb.append("<status>");
            sb.append(status.getStatus());
            sb.append("</status>");
            sb.append("<duration>");
            sb.append(status.getUploadTime());
            sb.append("</duration>");
            sb.append("<duration_string>");
            sb.append(status.getUploadTimeString());
            sb.append("</duration_string>");
            sb.append("<start_date>");
            sb.append(status.getStartUploadDate());
            sb.append("</start_date>");
            sb.append("<end_date>");
            sb.append(status.getEndUploadDate());
            sb.append("</end_date>");
            sb.append("<upload_size>");
            sb.append(status.getTotalUploadSize());
            sb.append("</upload_size>");
            sb.append("</response>");
            if(bDebug) System.out.println("Response:\n" + sb);
            //response.getWriter().write(sb.toString());
            writer.write(sb.toString());
            writer.flush();
            
        } catch (IOException iox) {
            System.out.println("FileUploadPhaseListener error writting AJAX response : " + iox);
        }
    }
    
    
    public void indexItem(IndexDocument indexDoc) {
        // Add document to index
        Indexer indexer=null;
        try {
            indexer=new Indexer(PetstoreConstants.PETSTORE_INDEX_DIRECTORY, false);    
            getLogger().log(Level.FINE, "Adding document to index: " + indexDoc.toString());
            indexer.addDocument(indexDoc);
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "index.exception", e);
            e.printStackTrace();
        } finally {
            try {
                // must close file or will not be able to reindex
                indexer.close();
            } catch (Exception ee) {
                ee.printStackTrace();
            }
        }
    }
    
    /**
    * Method getLogger
    *
    * @return Logger - logger for the NodeAgent
    */
    public Logger getLogger() {
        if (_logger == null) {
            _logger=PetstoreUtil.getBaseLogger();
        }
        return _logger;
    }    
    
}
