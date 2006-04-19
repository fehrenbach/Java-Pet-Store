/*
 * MapBean.java
 *
 * Created on February 23, 2006, 6:42 PM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

/**
 *
 * @author basler
 */
package com.sun.javaee.blueprints.petstore.mapviewer;

import java.util.ArrayList;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.util.List;
import java.util.Map;
import java.util.Collection;

import javax.faces.component.UICommand;
import javax.faces.component.UIInput;
import javax.faces.component.UIForm;
import javax.servlet.ServletContext;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;

import com.sun.j2ee.blueprints.ui.geocoder.GeoCoder;
import com.sun.j2ee.blueprints.ui.geocoder.GeoPoint;
import com.sun.j2ee.blueprints.ui.mapviewer.MapMarker;
import com.sun.j2ee.blueprints.ui.mapviewer.MapPoint;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.Category;

/**
 *
 * @author basler
 */
public class MapBean {
    
    private ArrayList<MapMarker> alMapMarkers=new ArrayList<MapMarker>();
    private MapMarker mapMarker=new MapMarker();
    private MapPoint mapPoint=new MapPoint();
    private int zoomLevel=5, radius=30;
    private Logger _logger=null;
    private String category=null, centerAddress=null;
    private String[] items=new String[0];
    
    /** Creates a new instance of MapBean */
    public MapBean() {
        init();
    }

    public void init() {
        alMapMarkers.clear();
    }
    
    // search.jsp
    public void setItems(String[] items) {
        this.items=items;
    }
    
    public String[] getItems() {
        return items;
    }
    
    
    // mapAll.jsp
    public List<SelectItem> getCategories() {
        // return categories for a JSF radio button
        ArrayList<SelectItem> arCats=new ArrayList<SelectItem>();
        
        // get the CatalogFacade for the app
        FacesContext context=FacesContext.getCurrentInstance();
        Map<String,Object> contextMap=context.getExternalContext().getApplicationMap();        
        CatalogFacade cf=(CatalogFacade)contextMap.get("CatalogFacade");
        
        // get the categories from the database
        List<Category> catsx=cf.getCategories();
        for(Category catx : catsx) {
            // add categories to be displayed in a radio button
            arCats.add(new SelectItem(catx.getCategoryID(), catx.getName()));
        }
        return arCats;
    }

    public void setCategory(String category) {
        this.category=category;
    }
    public String getCategory() {
        return category;
    }
    
    public void setCenterAddress(String centerAddress) {
        this.centerAddress=centerAddress;
    }
    public String getCenterAddress() {
        return centerAddress;
    }
    
    

    // map.jsp fields
    public void setMapMarker(MapMarker mapMarker) {
        this.mapMarker=mapMarker;
    }
    public MapMarker getMapMarker() {
        return this.mapMarker;
    }
    
    public void setMapPoint(MapPoint mapPoint) {
        this.mapPoint=mapPoint;
    }
    public MapPoint getMapPoint() {
        return this.mapPoint;
    }
    
    public MapMarker[] getLocations() {
        MapMarker[] mm=new MapMarker[alMapMarkers.size()];
        mm=(MapMarker[])alMapMarkers.toArray(mm);
        return mm;
    }
    
    public void addMapMarker(MapMarker mm) {
        alMapMarkers.add(mm);
    }
    
    public void setZoomLevel(int zoom) {
        this.zoomLevel=zoom;
    }
    public int getZoomLevel() {
        return this.zoomLevel;
    }

    public void setRadius(int radius) {
        this.radius=radius;
    }
    public int getRadius() {
        return this.radius;
    }
    
    
    public String findAllByCategory() {
        
        System.out.println("*** In findAllAction - ");
        
        // get items from catalog
        FacesContext context=FacesContext.getCurrentInstance();
        Map<String,Object> contextMap=context.getExternalContext().getApplicationMap();        
        CatalogFacade cf=(CatalogFacade)contextMap.get("CatalogFacade");
        // should always have a value
        if(category == null) category="CATS";
        List<Item> items=cf.getItemsByCategory(category, 0, 25);
        System.out.println("Have items - " + items.size());
        
        return mapItems(context, items);
    }
    
    
    public String findAllByIDs() {
        
        System.out.println("*** In findAllAction - ");
        
        // get items from catalog
        FacesContext context=FacesContext.getCurrentInstance();
        Map<String,Object> contextMap=context.getExternalContext().getApplicationMap();        
        CatalogFacade cf=(CatalogFacade)contextMap.get("CatalogFacade");
        // should always have a value
        if(category == null) category="CATS";
        List<Item> items=cf.getItemsByCategory(category, 0, 25);
        System.out.println("Have items - " + items.size());
        
        return mapItems(context, items);
    }
    
    
    public String mapItems(FacesContext context, List<Item> items) {
        
        if(items.size() > 0) {

            // Set up markers for the center and information window
            double dLatitude=0;
            double dLongitude=0;
            String infoBalloon="";

            // clear old locations
            alMapMarkers.clear();

            String centerx=getCenterAddress();
            if(centerx == null || centerx.length() < 1) {
                // need center so set first point as center
                Item centerItem=items.get(0);
                dLatitude=centerItem.getAddress().getLatitude();
                dLongitude=centerItem.getAddress().getLongitude();
                infoBalloon=centerItem.getName() + "<br>" + centerItem.getAddress().getAddressAsString();

            } else {
                // look up lat and long of center point
                // get proxy host and port from servlet context
                String proxyHost=context.getExternalContext().getInitParameter("proxyHost");
                String proxyPort=context.getExternalContext().getInitParameter("proxyPort");
                
                // get latitude & longitude
                GeoCoder geoCoder=new GeoCoder();
                if(proxyHost != null && proxyPort != null) {
                    // set proxy host and port if it exists
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
                try {
                    GeoPoint points[]=geoCoder.geoCode(centerx);
                    if ((points == null) || (points.length < 1)) {
                        getLogger().log(Level.INFO, "No addresses for location - " + centerx);
                    } else if(points.length > 1) {
                        getLogger().log(Level.INFO, "Matched " + points.length + " locations, taking the first one");
                    }

                    if(points.length > 0) {
                        // set values to used for map location
                        dLatitude=points[0].getLatitude();
                        dLongitude=points[0].getLongitude();
                        infoBalloon="Center Point<br>" + centerx;
                    }
                } catch (Exception ee) {
                    getLogger().log(Level.WARNING, "geocoder.lookup.exception", ee);
                }
            }
            
            // lat and long of the center point
            mapPoint.setLatitude(dLatitude);
            mapPoint.setLongitude(dLongitude);
            
            // add center point in the marker points so it will show
            mapMarker.setLatitude(dLatitude);
            mapMarker.setLongitude(dLongitude);
            mapMarker.setMarkup(changeSpaces(infoBalloon));
            addMapMarker(mapMarker) ;

            // check radius to zoom level
            if(radius < 5) {
                zoomLevel=4;
            } else if(radius < 21) {
                zoomLevel=7;
            } else if(radius < 41) {
                zoomLevel=8;
            } else if(radius < 61) {
                zoomLevel=9;
            } else if(radius < 81) {
                zoomLevel=10;
            } else if(radius < 101) {
                zoomLevel=11;
            } else {
                zoomLevel=12;
            }

            // add other locations
            String outputx="";
            MapMarker mm=null;
            Item loc=null;
            double dLat=calculateLatitudeRadius(radius);
            double dLong=calculateLongitudeRadius(radius);
            getLogger().log(Level.FINE, "ZOOM - Lat and long  - " + zoomLevel + " - " + dLat + " - " + dLong);
            for(int ii=1; ii < items.size(); ii++) {
                loc=items.get(ii);
                if(loc.getAddress() != null && !loc.getAddress().equals("")) {
                    mm=new MapMarker();
                    /*
                    if ((points != null) && (points.length > 0)) {
                        // check to see if in radius
                        if(points[0].getLatitude() >= (dLatitude - dLat) && 
                           points[0].getLatitude() <= (dLatitude + dLat) &&
                           points[0].getLongitude() >= (dLongitude - dLong) &&
                           points[0].getLongitude() <= (dLongitude + dLong)) {

                            mm.setLatitude(points[0].getLatitude());
                            mm.setLongitude(points[0].getLongitude());
                            mm.setMarkup(changeSpaces(loc.getInfo()) + "<br>" + changeSpaces(loc.getAddress()));
                            addMapMarker(mm) ;
                            outputx +="\n" + points[0].getLatitude() + " - " + points[0].getLongitude();
                        }
                    }
                    */
                    mm.setLatitude(loc.getAddress().getLatitude());
                    mm.setLongitude(loc.getAddress().getLongitude());
                    mm.setMarkup(changeSpaces(loc.getName()) + "<br>" + 
                        changeSpaces(loc.getAddress().getAddressAsString()));

                    addMapMarker(mm) ;
                }
            }
        }
        //System.out.println("Lat - Long " + outputx);
        // return null so navigation will stay on main lookup page
        return "map";
    }
    
        
    public double calculateLatitudeRadius(int radius) {
        // 1 latitude degree = 68.70795454545454 miles
        // 1 latitude mile = 0.014554355556290625173426834100111 degrees
        return (0.014554d * radius);
    }
    
    public double calculateLongitudeRadius(int radius) {
        // 1 logitude degree = 69.16022727272727 miles
        // 1 logitude mile = 0.014459177469972560994758974186 degrees
        return (0.014459d * radius);
    }
    
    public String changeSpaces(String text) {
        return text.replaceAll(" ", "&nbsp;");
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
