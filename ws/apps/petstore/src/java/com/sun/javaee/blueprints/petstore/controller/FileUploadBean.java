/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: FileUploadBean.java,v 1.32 2006-05-05 05:44:57 yutayoshida Exp $ */

package com.sun.javaee.blueprints.petstore.controller;

import java.util.*;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.logging.Logger;
import java.util.logging.Level;

import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletContext;
import javax.faces.context.ResponseWriter;
import javax.faces.model.SelectItem;

import org.apache.shale.remoting.faces.ResponseFactory;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.util.ImageScaler;
import com.sun.javaee.blueprints.petstore.model.*;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadStatus;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadUtil;
import com.sun.javaee.blueprints.petstore.search.IndexDocument;
import com.sun.javaee.blueprints.petstore.search.Indexer;
import com.sun.j2ee.blueprints.ui.geocoder.GeoCoder;
import com.sun.j2ee.blueprints.ui.geocoder.GeoPoint;

public class FileUploadBean {
    private boolean bDebug=false;
    private Logger _logger=null;
    private static final String comma=", ";
    private List<SelectItem> categories = null;
    private CatalogFacade catalogFacade = null;
    
    /**
     * <p>Factory for response writers that we can use to construct the
     * outgoing response.</p>
     */
    private static ResponseFactory factory = new ResponseFactory();
    
    /**
     * session attribute to contain the fileupload status
     */
    private static final String FILE_UL_RESPONSE = "fileuploadResponse";
    
    /** Creates a new instance of FileUploadBean */
    public FileUploadBean() {
    }
    
    public void setCategories(List<SelectItem> categories) {
        this.categories = categories;
    }
    public List<SelectItem> getCategories() {
        if (catalogFacade == null) {
            FacesContext context=FacesContext.getCurrentInstance();
            Map<String,Object> contextMap = context.getExternalContext().getApplicationMap();
            this.catalogFacade = (CatalogFacade)contextMap.get("CatalogFacade");
        }
            //get the catalog facade
        if (categories == null) {
            categories = new ArrayList<SelectItem>();
        
            List<Category> tmpCat = catalogFacade.getCategories();
            String name = null;
            String categoryId = null;
            for (Category cat : tmpCat) {
                name = cat.getName();
                categoryId = cat.getCategoryID();
                SelectItem si = new SelectItem(categoryId, name);
                categories.add(si);
            }
        }
        return this.categories;
    }
    
    public void postProcessingMethod(FacesContext context, HashMap hmUpload, FileUploadStatus status) {
        if(bDebug) System.out.println("IN Custom Post Processing method");
        try {
            // set custom return enabled so Phaselistener knows not to send default response
            status.enableCustomReturn();
            HttpServletResponse response=(HttpServletResponse)context.getExternalContext().getResponse();
            
            // get proxy host and port from servlet context
            String proxyHost=context.getExternalContext().getInitParameter("proxyHost");
            String proxyPort=context.getExternalContext().getInitParameter("proxyPort");
            
            // Acquire a response containing these results
            ResponseWriter writer = factory.getResponseWriter(context, "text/xml");
            
            String itemId = null;
            String name = null;
            String thumbPath = null;
            String firstName = null;
            String prodId = null;
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
                if(bDebug) System.out.println("Abs name: "+ absoluteFileName);
                String fileName = null;
                if(absoluteFileName.length() > 0) {
                    int lastSeparator = absoluteFileName.lastIndexOf("/") + 1;
                    if (lastSeparator != -1) {
                        // set to proper location so image can be read
                        fileName = "images/" + absoluteFileName.substring(lastSeparator, absoluteFileName.length());
                    }
                    String spath = constructThumbnail(absoluteFileName);
                    thumbPath = null;
                    if (spath != null) {
                        // recreate "images/FILENAME"
                        int idx = spath.lastIndexOf(System.getProperty("file.separator"));
                        thumbPath = "images/"+spath.substring(idx+1, spath.length());
                    }
                } else{
                    fileName = "images/dragon-iron-med.jpg";
                    thumbPath = "images/dragon-iron-thumb.jpg ";
                }
                
                String compName=getStringValue(hmUpload, FileUploadUtil.COMPONENT_NAME);                               
                prodId=getStringValue(hmUpload, compName+":product");
                name=getStringValue(hmUpload, compName+":name");
                String desc=getStringValue(hmUpload, compName+":description");
                String price=getStringValue(hmUpload, compName+":price");
                if(name.length() == 0) name="Default Monster";
                if(desc.length() == 0) desc="No description available";
                if(price.length() == 0) price="0";
                
                //Address
                StringBuffer addressx=new StringBuffer();
                String street1=getStringValue(hmUpload, compName+":street1");
                String city=getStringValue(hmUpload, compName+":cityField");
                String state=getStringValue(hmUpload, compName+":stateField");
                String zip=getStringValue(hmUpload, compName+":zipField");
                if (street1.length() == 0) street1 = "11 Main Steet";
                if (city.length() == 0) city = "Milpitas";
                if (state.length() == 0) state = "California";
                if (zip.length() == 0) zip = "95035";
                
                // Contact info
                firstName = getStringValue(hmUpload, compName+":firstName");
                String lastName = getStringValue(hmUpload, compName+":lastName");
                String email = getStringValue(hmUpload, compName+":email");
                if (firstName.length() == 0) firstName = "Duke";
                if (lastName.length() == 0) lastName = "Duke";
                if (email.length() == 0) email = "aaa@bbb.ccc";
                
                if(street1.length() > 0) {
                    addressx.append(street1);
                }
                
                if(city.length() > 0) {
                    addressx.append(comma);
                    addressx.append(city);
                }
                
                if(state.length() > 0) {
                    addressx.append(comma);
                    addressx.append(state);
                }
                
                if(zip.length() > 0) {
                    addressx.append(comma);
                    addressx.append(zip);
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
                double latitude=0;
                double longitude=0;
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
                            latitude = points[0].getLatitude();
                            longitude = points[0].getLongitude();
                        }
                    } catch (Exception ee) {
                        getLogger().log(Level.WARNING, "geocoder.lookup.exception", ee);
                    }
                }
                Float priceF;
                try {
                    priceF=new Float(price);
                } catch (NumberFormatException nf) {
                    priceF=new Float(0);
                    getLogger().log(Level.INFO, "Price isn't in a proper number - " + price);
                }
                Address addr = new Address(street1,"",city,state,zip,
                        latitude,longitude);
                SellerContactInfo contactInfo = new SellerContactInfo(firstName, lastName, email);
                Item item = new Item(prodId,name,desc,fileName, thumbPath, priceF,
                        addr,contactInfo,0,0);
                if (catalogFacade == null) {
                    Map<String,Object> contextMap = context.getExternalContext().getApplicationMap();
                    this.catalogFacade = (CatalogFacade)contextMap.get("CatalogFacade");
                }
                String itemID = catalogFacade.addItem(item);
                getLogger().log(Level.FINE, "Item " + name + " has been persisted");
                
                // index new item
                itemId = item.getItemID();
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
            HttpSession session = (HttpSession)context.getExternalContext().getSession(true);
            String responseMessage = firstName+", Thank you for submitting your pet "+name+" !";
            FileUploadResponse fuResponse = new FileUploadResponse(
                    itemId,
                    prodId,
                    responseMessage,
                    status.getStatus(),
                    Long.toString(status.getUploadTime()),
                    status.getUploadTimeString(),
                    status.getStartUploadDate().toString(),
                    status.getEndUploadDate().toString(),
                    Long.toString(status.getTotalUploadSize()),
                    thumbPath);
            session.removeAttribute(FILE_UL_RESPONSE);
            session.setAttribute(FILE_UL_RESPONSE, fuResponse);
            /** the following writer operation is for the case when iframe
             * bug is fixed. they are not used currently in the client
             */
            StringBuffer sb=new StringBuffer();
            response.setContentType("text/xml;charset=UTF-8");
            response.setHeader("Pragma", "No-Cache");
            response.setHeader("Cache-Control", "no-cache,no-store,max-age=0");
            response.setDateHeader("Expires", 1);
            sb.append("<response>");
            sb.append("<message>");
            sb.append(responseMessage);
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
            sb.append("<thumbnail>");
            sb.append(thumbPath);
            sb.append("</thumbnail>");
            sb.append("</response>");
            if(bDebug) System.out.println("Response:\n" + sb);
            //response.getWriter().write(sb.toString());
            writer.write(sb.toString());
            writer.flush();
            
        } catch (IOException iox) {
            getLogger().log(Level.SEVERE, "FileUploadPhaseListener error writting AJAX response", iox);
        }
    }
    
    private String constructThumbnail(String path) {
        String thumbPath = null;
        File file = new File(path);
        String aPath = file.getAbsolutePath();
        
        // first, construct the file name for thumbnail
        if (file.exists()) {
            int idx = aPath.lastIndexOf(".");
            if (idx > 0) {
                thumbPath = aPath.substring(0, idx)+"_thumb"+aPath.substring(idx, aPath.length());
            }
        }
        try {
            ImageScaler imgScaler = new ImageScaler(aPath);
            imgScaler.keepAspectWithWidth();
            imgScaler.resizeWithGraphics(thumbPath);
        } catch (Exception e) {
            getLogger().log(Level.SEVERE, "ERROR in generating thumbnail", e);
        }
        return thumbPath;
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
    
    public String getUploadImageDirectory() {
        return PetstoreConstants.PETSTORE_IMAGE_DIRECTORY + "/images";
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
