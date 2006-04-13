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

import javax.faces.component.UICommand;
import javax.faces.component.UIInput;
import javax.faces.component.UIForm;
import javax.servlet.ServletContext;
import javax.faces.context.FacesContext;

import com.sun.j2ee.blueprints.ui.geocoder.GeoCoder;
import com.sun.j2ee.blueprints.ui.geocoder.GeoPoint;
import com.sun.j2ee.blueprints.ui.mapviewer.MapMarker;
import com.sun.j2ee.blueprints.ui.mapviewer.MapPoint;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Item;

/**
 *
 * @author basler
 */
public class MapBean {
    
    private ArrayList<MapMarker> alMapMarkers=new ArrayList();
    private MapMarker mapMarker=new MapMarker();
    private MapPoint mapPoint=new MapPoint();
    private int zoomLevel=5, radius=30;
    private Logger _logger=null;
    private String category=null;
    
    /** Creates a new instance of MapBean */
    public MapBean() {
        init();
    }

    public void init() {
        alMapMarkers.clear();
    }
    
    // search.jsp
    public void setCategory(String category) {
        this.category=category;
    }
    public String getCategory() {
        return category;
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
    
    
    public String findAllAction() {
        
        // get items from catalog
        FacesContext context=FacesContext.getCurrentInstance();
        
        CatalogFacade cf=(CatalogFacade)((ServletContext)context.getExternalContext().getContext()).getAttribute("CatalogFacade");
        if(category == null) category="CATS";
        List<Item> items=cf.getItemsByRadius(category, 0, 25, -200d, -200d, 200d, 200d);
        System.out.println("Have items - " + items.size());
        if(items.size() > 0) {
            Item centerItem=items.get(0);

            // getLogger().log(Level.FINE, "in findAction - " + getLocation());
            // Set up markers for the center and information window
            double dLatitude=centerItem.getAddress().getLatitude();
            double dLongitude=centerItem.getAddress().getLongitude();
            mapMarker.setLatitude(dLatitude);
            mapMarker.setLongitude(dLongitude);
            mapMarker.setMarkup(changeSpaces(centerItem.getName()) + "<br>" + changeSpaces(centerItem.getAddress().getAddressAsString()) );

            // clear old locations
            alMapMarkers.clear();
            addMapMarker(mapMarker) ;

            // set center point for map
            mapPoint.setLatitude(centerItem.getAddress().getLatitude());
            mapPoint.setLongitude(centerItem.getAddress().getLongitude());

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
