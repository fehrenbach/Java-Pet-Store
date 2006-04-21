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
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;

import com.sun.j2ee.blueprints.ui.geocoder.GeoCoder;
import com.sun.j2ee.blueprints.ui.geocoder.GeoPoint;
import com.sun.j2ee.blueprints.ui.mapviewer.MapMarker;
import com.sun.j2ee.blueprints.ui.mapviewer.MapPoint;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.Category;
import javax.el.ValueExpression;

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
    private String category="CATS", centerAddress=null;
    private String[] itemIds=new String[0];
    
    /** Creates a new instance of MapBean */
    public MapBean() {
        init();
    }

    public void init() {
        alMapMarkers.clear();
    }
    
    // search.jsp
    public void setItemIds(String[] items) {
        this.itemIds=items;
    }
    
    public String[] getItemIds() {
        return itemIds;
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
    
    public int getLocationCount() {
        return alMapMarkers.size();
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
        
        System.out.println("*** In findAllByCategory - ");
        
        // get items from catalog
        FacesContext context=FacesContext.getCurrentInstance();
        Map<String,Object> contextMap=context.getExternalContext().getApplicationMap();        
        CatalogFacade cf=(CatalogFacade)contextMap.get("CatalogFacade");
        // should always have a value
        if(category == null) category="CATS";

        // check to see if radius set with centerpoint
        String centerx=getCenterAddress();
        List<Item> items=null;
        GeoPoint[] geoCenterPoint=null;
        if(centerx != null && centerx.length() > 0) {
            // set center so use to/from lat & long to retrieve data
            geoCenterPoint=lookUpAddress(context);
            if(geoCenterPoint != null) {
                // have center point
                double dLatRadius=calculateLatitudeRadius(radius);
                double dLatitude=geoCenterPoint[0].getLatitude();
                double dLongRadius=calculateLongitudeRadius(radius);
                double dLongitude=geoCenterPoint[0].getLongitude();
                System.out.println("\n *** cat radius" + dLatitude + " - " + dLongitude);
                items=cf.getItemsByCategoryByRadiusVLH(category, 0, 25, dLatitude - dLatRadius,  
                    dLatitude + dLatRadius, dLongitude - dLongRadius, dLongitude + dLongRadius);
            }
        }

        if(geoCenterPoint == null) {
            // no center point so look up whole category
            items=cf.getItemsByCategoryVLH(category, 0, 25);
        }
        if(items != null) {
            System.out.println("\nHave Database items - " + items.size());
        } else {
            System.out.println("\nHave NULL items from the database");
        }
    
        return mapItems(context, items, geoCenterPoint, centerx);
    }
    
    
    public String findAllByIDs() {
        System.out.println("*** In findAllByIDs - ");
        // get items from catalog
        FacesContext context=FacesContext.getCurrentInstance();
        Map<String,Object> contextMap=context.getExternalContext().getApplicationMap();        
        CatalogFacade cf=(CatalogFacade)contextMap.get("CatalogFacade");
        // should always have a value
        ValueExpression vex=context.getApplication().getExpressionFactory().createValueExpression(context.getELContext(), "#{paramValues.mapSelectedItems}", String[].class);
        String[] itemx=(String[])vex.getValue(context.getELContext());
        // since looking up values from request, make sure the values exist before replacing old values
        if(itemx != null) {
            itemIds=itemx;
        }
        System.out.println("\n *** GET TYPE - " + vex.getType(context.getELContext()) + " - " + itemIds);
        System.out.println("Have number of selected items - " + itemIds.length);
        
        // check to see if radius set with centerpoint
        String centerx=getCenterAddress();
        List<Item> items=null;
        GeoPoint[] geoCenterPoint=null;
        if(centerx != null && centerx.length() > 0) {
            // set center so use to/from lat & long to retrieve data
            geoCenterPoint=lookUpAddress(context);
            if(geoCenterPoint != null) {
                // have center point
                double dLatRadius=calculateLatitudeRadius(radius);
                double dLatitude=geoCenterPoint[0].getLatitude();
                double dLongRadius=calculateLongitudeRadius(radius);
                double dLongitude=geoCenterPoint[0].getLongitude();
                System.out.println("\n *** id radius" + dLatitude + " - " + dLongitude);
                items=cf.getItemsByItemIDByRadius(itemIds, dLatitude - dLatRadius,  
                    dLatitude + dLatRadius, dLongitude - dLongRadius, dLongitude + dLongRadius);
            }
        }

        if(geoCenterPoint == null) {
            // no center point so look up just ids
            items=cf.getItemsByItemID(itemIds);
        }

        if(items != null) {
            System.out.println("\nHave Database items - " + items.size());
        } else {
            System.out.println("\nHave NULL items from the database");
        }
        return mapItems(context, items, geoCenterPoint, centerx);
    }
    
    
    public String mapItems(FacesContext context, List<Item> items, GeoPoint[] geoCenterPoint, String centerx) {
        if(items != null && items.size() > 0) {
            // Set up markers for the center and information window
            double dLatitude=0;
            double dLongitude=0;
            String infoBalloon="";

            // clear old locations
            alMapMarkers.clear();
            if(geoCenterPoint != null) {
                // set values to used from centerAddress lookup
                dLatitude=geoCenterPoint[0].getLatitude();
                dLongitude=geoCenterPoint[0].getLongitude();
                infoBalloon="<b>Center Point</b><br/>" + centerx;
            } else {
                // use first item that as center point
                Item centerItem=items.get(0);
                dLatitude=centerItem.getAddress().getLatitude();
                dLongitude=centerItem.getAddress().getLongitude();
                infoBalloon="<b>" + centerItem.getName() + "</b><br/>" + centerItem.getAddress().getAddressAsString();
            }

            // lat and long of the center point
            mapPoint.setLatitude(dLatitude);
            mapPoint.setLongitude(dLongitude);
            
            // add center point in the marker points so it will show
            mapMarker.setLatitude(dLatitude);
            mapMarker.setLongitude(dLongitude);
            mapMarker.setMarkup(changeSpaces(infoBalloon));
            addMapMarker(mapMarker) ;

            // check radius and set initial zoom level
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
                    mm.setLatitude(loc.getAddress().getLatitude());
                    mm.setLongitude(loc.getAddress().getLongitude());
                    mm.setMarkup("<b>" + changeSpaces(loc.getName()) + "</b><br/>" + 
                        changeSpaces(loc.getAddress().getAddressAsString()));

                    addMapMarker(mm) ;
                }
            }
        }
        //System.out.println("Lat - Long " + outputx);
        // return null so navigation will stay on main lookup page
        return "map";
    }
    

    public GeoPoint[] lookUpAddress(FacesContext context) {
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
        GeoPoint points[]=null;
        try {
            String centerx=getCenterAddress();
            points=geoCoder.geoCode(centerx);
            if ((points == null) || (points.length < 1)) {
                getLogger().log(Level.INFO, "No addresses for location - " + centerx);
            } else if(points.length > 1) {
                getLogger().log(Level.INFO, "Matched " + points.length + " locations, taking the first one");
            }

        } catch (Exception ee) {
            getLogger().log(Level.WARNING, "geocoder.lookup.exception", ee);
        }
        return points;
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
