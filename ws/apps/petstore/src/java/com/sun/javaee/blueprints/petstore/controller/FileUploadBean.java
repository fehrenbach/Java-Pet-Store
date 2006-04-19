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
import java.util.Map;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.util.Date;

import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import javax.faces.context.ResponseWriter;
import org.apache.shale.remoting.faces.ResponseFactory;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.Address;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.SellerContactInfo;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadStatus;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadUtil;
import com.sun.javaee.blueprints.petstore.search.IndexDocument;
import com.sun.javaee.blueprints.petstore.search.Indexer;

import com.sun.j2ee.blueprints.ui.geocoder.GeoCoder;
import com.sun.j2ee.blueprints.ui.geocoder.GeoPoint;

/**
 *
 * @author basler
 */
public class FileUploadBean {
    private boolean bDebug=false;
    private Logger _logger=null;
    private static final String comma=", ";
    
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
            HttpServletResponse response=(HttpServletResponse)context.getExternalContext().getResponse();
            
            //get the catalog facade
            Map contextMap = context.getExternalContext().getApplicationMap();
            CatalogFacade cf = (CatalogFacade)contextMap.get("CatalogFacade");
            
            // get proxy host and port from servlet context
            String proxyHost=context.getExternalContext().getInitParameter("proxyHost");
            String proxyPort=context.getExternalContext().getInitParameter("proxyPort");
            
            // Acquire a response containing these results
            ResponseWriter writer = factory.getResponseWriter(context, "text/xml");
            
            // persist the data
            try{
                String fileNameKey = null;
                Set keySet = hmUpload.keySet();
                Iterator iter = keySet.iterator();
                while(iter.hasNext()){
                    String key = iter.next().toString();
                    if(key.startsWith("fileLocation_")) {
                        fileNameKey = key;
                        break;
                    }
                }
                String absoluteFileName=getStringValue(hmUpload, fileNameKey);
                System.out.println("Abs name: "+ absoluteFileName);
                String fileName = null;
                if(absoluteFileName != null) {
                    int lastSeparator = absoluteFileName.lastIndexOf("/") + 1;
                    if (lastSeparator != -1) {
                        // set to proper location so image can be read
                        fileName = "images/" + absoluteFileName.substring(lastSeparator, absoluteFileName.length());
                    }
                }
                
                String compName=getStringValue(hmUpload, FileUploadUtil.COMPONENT_NAME);
                
                System.out.println("file name: "+ fileName);
                Item item = new Item();
                String prodId=getStringValue(hmUpload, compName+":product");
                String name=getStringValue(hmUpload, compName+":name");
                String desc=getStringValue(hmUpload, compName+":description");
                String price=getStringValue(hmUpload, compName+":price");
                if(price.length() == 0) price="0";
                Address addr = new Address();
                
                // Add address fields to the file upload page and extract data
                StringBuffer addressx=new StringBuffer();
                String tmpx=getStringValue(hmUpload, compName+":street1");
                addr.setStreet1(tmpx);
                if(tmpx.length() > 0) {
                    addressx.append(tmpx);
                }
                tmpx=getStringValue(hmUpload, compName+":street2");
                addr.setStreet2(tmpx);
                if(tmpx.length() > 0) {
                    addressx.append(tmpx);
                }
                
                tmpx=getStringValue(hmUpload, compName+":cityField");
                addr.setCity(tmpx);
                if(tmpx.length() > 0) {
                    addressx.append(comma);
                    addressx.append(tmpx);
                }
                
                tmpx=getStringValue(hmUpload, compName+":stateField");
                addr.setState(tmpx);
                if(tmpx.length() > 0) {
                    addressx.append(comma);
                    addressx.append(tmpx);
                }
                
                tmpx=getStringValue(hmUpload, compName+":zipField");
                addr.setZip(tmpx);
                if(tmpx.length() > 0) {
                    addressx.append(comma);
                    addressx.append(tmpx);
                }
                
                // get latitude & longitude
                GeoCoder geoCoder=new GeoCoder();
                if(proxyHost != null && proxyPort != null) {
                    // set proxy host and port if it exists
                    // NOTE: This may require write permissions for java.util.PropertyPermission to be granted
                    getLogger().log(Level.INFO, "Setting proxy to " + proxyHost + ":" + proxyPort + ".  Make sure server.policy is updated to allow setting System Properties");
                    geoCoder.setProxyHost(proxyHost);
                    try {
                        geoCoder.setProxyPort(Integer.parseInt(proxyPort));
                    } catch (Exception ee) {
                        ee.printStackTrace();
                    }
                } else {
                    getLogger().log(Level.INFO, "A \"proxyHost\" and \"proxyPort\" isn't set as a web.xml context-param. A proxy server may be necessary to reach the open internet.");
                }
                
                // use component to get points based on location (this uses Yahoo's map service
                String totAddr=addressx.toString();
                if(totAddr.length() > 0) {
                    try {
                        GeoPoint points[]=geoCoder.geoCode(totAddr);
                        if ((points == null) || (points.length < 1)) {
                            getLogger().log(Level.INFO, "No addresses for location - " + totAddr);
                        } else if(points.length > 1) {
                            getLogger().log(Level.INFO, "Matched " + points.length + " locations, taking the first one");
                        }
                        
                        if(points.length > 0) {
                            // set values to used for map location
                            addr.setLatitude(points[0].getLatitude());
                            addr.setLongitude(points[0].getLongitude());
                        }
                    } catch (Exception ee) {
                        getLogger().log(Level.WARNING, "geocoder.lookup.exception", ee);
                    }
                }
                
                SellerContactInfo contactInfo = new SellerContactInfo();
                //TO-DO: Add SellerContactInfo fields to the file upload page and extract data
                contactInfo.setFirstName("duke");
                contactInfo.setLastName("duke");
                contactInfo.setEmail("abc@abc.xyz");
                item.setProductID(prodId);
                item.setDescription(desc);
                item.setName(name);
                Float priceF;
                try {
                    priceF=new Float(price);
                } catch (NumberFormatException nf) {
                    priceF=new Float(0);
                    getLogger().log(Level.INFO, "Price isn't in a proper number - " + price);
                }
                item.setPrice(priceF);
                item.setImageURL(fileName);
                item.setAddress(addr);
                item.setContactInfo(contactInfo);
                String itemID = cf.addItem(item);
                getLogger().log(Level.FINE, "Item " + name + " has been persisted");
                
                // index new item
                String itemId = item.getItemID();
                IndexDocument indexDoc=new IndexDocument();
                indexDoc.setUID(itemId);
                indexDoc.setPageURL(itemId);
                indexDoc.setImage(fileName);
                indexDoc.setPrice(price);
                indexDoc.setProduct(prodId);
                indexDoc.setModifiedDate(new Date().toString());
                indexDoc.setContents(name + " " + desc);
                indexDoc.setTitle(name);
                indexDoc.setSummary(desc);
                indexItem(indexDoc);
                
            } catch (Exception ex) {
                getLogger().log(Level.SEVERE, "fileupload.persist.exception", ex);
            }
            StringBuffer sb=new StringBuffer();
            response.setContentType("text/xml;charset=UTF-8");
            response.setHeader("Pragma", "No-Cache");
            response.setHeader("Cache-Control", "no-cache,no-store,max-age=0");
            response.setDateHeader("Expires", 1);
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
    
    
    private void indexItem(IndexDocument indexDoc) {
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
    
    
    private String getStringValue(HashMap hmUpload, String key)  {
        String sxTemp=(String)hmUpload.get(key);
        if(sxTemp == null) {
            sxTemp="";
        }
        return sxTemp;
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
