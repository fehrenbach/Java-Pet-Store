/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: FileUploadBean.java,v 1.45 2006-12-01 03:30:29 sean_brydon Exp $ */

package com.sun.javaee.blueprints.petstore.controller;


import java.io.File;
import java.io.IOException;
import java.util.logging.Level;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.faces.context.ResponseWriter;
import javax.faces.model.SelectItem;
import org.apache.shale.remoting.faces.ResponseFactory;
import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.util.ImageScaler;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadStatus;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadUtil;
//import com.sun.javaee.blueprints.components.ui.geocoder.GeoCoder;
//import com.sun.javaee.blueprints.components.ui.geocoder.GeoPoint;
import com.sun.javaee.blueprints.petstore.proxy.GeoCoder;
import com.sun.javaee.blueprints.petstore.proxy.GeoPoint;

import com.sun.javaee.blueprints.petstore.model.Address;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Category;
import com.sun.javaee.blueprints.petstore.model.Product;
import com.sun.javaee.blueprints.petstore.model.FileUploadResponse;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.Tag;
import com.sun.javaee.blueprints.petstore.model.SellerContactInfo;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

public class FileUploadBean {
    private boolean bDebug=false;
    private static final String comma=", ";
    private List<SelectItem> categories = null;
    private List<SelectItem> products = null;
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
    
    private static final String PERSIST_FAILRE = "persist_failure";
    
    /** Creates a new instance of FileUploadBean */
    public FileUploadBean() {
    }
    
    public void setProducts(List<SelectItem> products) {
        this.products = products;
    }
    public List<SelectItem> getProducts() {
        if (catalogFacade == null) {
            FacesContext context=FacesContext.getCurrentInstance();
            Map<String,Object> contextMap = context.getExternalContext().getApplicationMap();
            this.catalogFacade = (CatalogFacade)contextMap.get("CatalogFacade");
        }
            //get the catalog facade
        if (products == null) {
            products = new ArrayList<SelectItem>();
        
            List<Product> tmpPd = catalogFacade.getProducts();
            String name = null;
            String productId = null;
            for (Product pd : tmpPd) {
                name = pd.getName();
                productId = pd.getProductID();
                SelectItem si = new SelectItem(productId, name);
                products.add(si);
            }
        }
        return this.products;
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
    
    public void postProcessingMethod(FacesContext context, Hashtable htUpload, FileUploadStatus status) {
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
            HttpSession session = (HttpSession)context.getExternalContext().getSession(true);
            try{
                String fileNameKey = null;
                for (Object key1 : htUpload.keySet()) {
                    String key = key1.toString();
                    if(key.startsWith("fileLocation_")) {
                        fileNameKey = key;
                        break;
                    }
                }
                String absoluteFileName=getStringValue(htUpload, fileNameKey);
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
                
                String compName=getStringValue(htUpload, FileUploadUtil.COMPONENT_NAME);                               
                prodId=getStringValue(htUpload, compName+":product");
                name=getStringValue(htUpload, compName+":name");
                String desc=getStringValue(htUpload, compName+":description");
                String price=getStringValue(htUpload, compName+":price");
                if(name.length() == 0) name="Default Monster";
                if(desc.length() == 0) desc="No description available";
                if(price.length() == 0) price="0";
                String tags=getStringValue(htUpload, compName+":tags");
                if(tags == null) tags="";
                
                //Address
                StringBuffer addressx=new StringBuffer();
                String street1=getStringValue(htUpload, compName+":street1");
                String city=getStringValue(htUpload, compName+":cityField");
                String state=getStringValue(htUpload, compName+":stateField");
                String zip=getStringValue(htUpload, compName+":zipField");
                if (street1.length() == 0) street1 = "11 Main Steet";
                if (city.length() == 0) city = "Milpitas";
                if (state.length() == 0) state = "California";
                if (zip.length() == 0) zip = "95035";
                
                // Contact info
                firstName = getStringValue(htUpload, compName+":firstName");
                String lastName = getStringValue(htUpload, compName+":lastName");
                String email = getStringValue(htUpload, compName+":email");
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
                    PetstoreUtil.getLogger().log(Level.INFO, "Setting proxy to " + proxyHost + ":" + proxyPort + ".  Make sure server.policy is updated to allow setting System Properties");
                    geoCoder.setProxyHost(proxyHost);
                    try {
                        geoCoder.setProxyPort(Integer.parseInt(proxyPort));
                    } catch (Exception ee) {
                        ee.printStackTrace();
                    }
                } else {
                    PetstoreUtil.getLogger().log(Level.INFO, "A \"proxyHost\" and \"proxyPort\" isn't set as a web.xml context-param. A proxy server may be necessary to reach the open internet.");
                }
                
                // use component to get points based on location (this uses Yahoo's map service
                String totAddr=addressx.toString();
                double latitude=0;
                double longitude=0;
                if(totAddr.length() > 0) {
                    try {
                        GeoPoint points[]=geoCoder.geoCode(totAddr);
                        if ((points == null) || (points.length < 1)) {
                            PetstoreUtil.getLogger().log(Level.INFO, "No addresses for location - " + totAddr);
                        } else if(points.length > 1) {
                            PetstoreUtil.getLogger().log(Level.INFO, "Matched " + points.length + " locations, taking the first one");
                        }
                        
                        if(points.length > 0) {
                            // set values to used for map location
                            latitude = points[0].getLatitude();
                            longitude = points[0].getLongitude();
                        }
                    } catch (Exception ee) {
                        PetstoreUtil.getLogger().log(Level.WARNING, "geocoder.lookup.exception", ee);
                    }
                }
                Float priceF;
                try {
                    priceF=new Float(price);
                } catch (NumberFormatException nf) {
                    priceF=new Float(0);
                    PetstoreUtil.getLogger().log(Level.INFO, "Price isn't in a proper number - " + price);
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
                
                // now parse tags for item
                StringTokenizer stTags=new StringTokenizer(tags, " ");
                String tagx=null;
                while(stTags.hasMoreTokens()) {
                    tagx=stTags.nextToken().toLowerCase();
                    Tag tag=null;
                    if(bDebug) System.out.println("Adding TAG = " + tagx);
                    // see if tag is already in item
                    if(!item.containsTag(tagx)) {
                        // add correct tag reference to item
                        item.getTags().add(catalogFacade.addTag(tagx));
                    }
                }
                
                itemId=catalogFacade.addItem(item);
                PetstoreUtil.getLogger().log(Level.FINE, "Item " + name + " has been persisted");
                
            } catch (RuntimeException re) {
                PetstoreUtil.getLogger().log(Level.SEVERE, "persist failed in addItem()", re);
                // store the info for later use
                session.setAttribute(PERSIST_FAILRE, Boolean.valueOf(true));
            } catch (Exception ex) {
                PetstoreUtil.getLogger().log(Level.SEVERE, "fileupload.persist.exception", ex);
            }
            if (session.getAttribute(PERSIST_FAILRE)!=null) {
                session.removeAttribute(PERSIST_FAILRE);
            }
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
            sb.append("<itemId>");
            sb.append(itemId);
            sb.append("</itemId>");
            sb.append("<productId>");
            sb.append(prodId);
            sb.append("</productId>");
            sb.append("</response>");
            if(bDebug) System.out.println("Response:\n" + sb);
            //response.getWriter().write(sb.toString());
            writer.write(sb.toString());
            writer.flush();
            
        } catch (IOException iox) {
            PetstoreUtil.getLogger().log(Level.SEVERE, "FileUploadPhaseListener error writting AJAX response", iox);
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
            PetstoreUtil.getLogger().log(Level.SEVERE, "ERROR in generating thumbnail", e);
        }
        return thumbPath;
    }
    
    private String getStringValue(Hashtable htUpload, String key)  {
        String sxTemp=(String)htUpload.get(key);
        if(sxTemp == null) {
            sxTemp="";
        }
        return sxTemp;
    }
    
    public String getUploadImageDirectory() {
        return PetstoreConstants.PETSTORE_IMAGE_DIRECTORY + "/images";
    }
    
    
}
