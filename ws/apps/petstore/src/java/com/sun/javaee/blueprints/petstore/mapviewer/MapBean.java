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

import com.sun.j2ee.blueprints.ui.geocoder.GeoCoder;
import com.sun.j2ee.blueprints.ui.geocoder.GeoPoint;
import com.sun.j2ee.blueprints.ui.mapviewer.MapMarker;
import com.sun.j2ee.blueprints.ui.mapviewer.MapPoint;
import javax.faces.component.UICommand;
import javax.faces.component.UIInput;
import javax.faces.component.UIForm;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;

/**
 *
 * @author basler
 */
public class MapBean {
    
    private ArrayList<Location> alLocations=new ArrayList();
    private ArrayList<MapMarker> alMapMarkers=new ArrayList();
    private MapMarker mapMarker=new MapMarker();
    private MapPoint mapPoint=new MapPoint();
    private String location="", foundLocation="", info="";
    private String mapReady="true", proxyHost="webcache.sfbay.sun.com";
    private double foundLatitude=0.0d, foundLongitude=0.0d;
    private int proxyPort=8080, zoomLevel=5, radius=20;
    private Logger _logger=null;
    
    
    /** Creates a new instance of MapBean */
    public MapBean() {
        init();
    }

    public void init() {
        alLocations.clear();
        alMapMarkers.clear();
        proxyHost="webcache.sfbay.sun.com";
        proxyPort=8080;
        location="4150 Network Circle, Santa Clara, CA 95054";
        info="Sun's Santa Clara Campus";
        alLocations.add(new Location("1205 Laurelwood Road, Santa Clara, CA", "Je Neill Kennels"));
        alLocations.add(new Location("1780 Old Bayshore Hwy, San Jose, CA", "San Jose Spay Neuter Clinic"));
        alLocations.add(new Location("375 Saratoga Ave Ste D, San Jose, CA", "Sara Creek Veterinary Clinic"));
        alLocations.add(new Location("1657 S Bascom Avenue, Campbell, CA", "Emergency Animal Clinic"));
        alLocations.add(new Location("396 First St., Los Altos, CA", "Adobe Animal Hospital"));
        alLocations.add(new Location("4486 Pearl Ave, San Jose, CA", "Acacia Pet Clinic"));
        alLocations.add(new Location("55 Mowry Ave, Fremont, CA", "Mission Valley Veterinary Clinic"));
        alLocations.add(new Location("33663 Mission Blvd, Union City, CA", "Veterinary Medical Center"));
        alLocations.add(new Location("7570 Tierra Sombra Ct, San Jose, CA", "Calero Pet Retreat"));
        alLocations.add(new Location("1275 Calhoun, Hayward, CA", "Hayward Hills Equestrian Center"));
        alLocations.add(new Location("14790 Washington Av, San Leandro, CA", "Bay Area Veterinary Specialists"));
        alLocations.add(new Location("1980 41st Ave, Capitola, CA", "Pacific Veterinary Emergency Services"));
        alLocations.add(new Location("1333 9th Ave, San Francisco, CA", "All Animals Emergency"));
        alLocations.add(new Location("4901 Bethel Island Rd, Bethel Island, CA ", "Tail Wag Inn Veterinary Hospital"));
    }
    
    // index.jsp fields
    public void setProxyHost(String proxyHost) {
        this.proxyHost=proxyHost;
    }
    public String getProxyHost() {
        return this.proxyHost;
    }
    
    public void setProxyPort(int proxyPort) {
        this.proxyPort=proxyPort;
    }
    public int getProxyPort() {
        return this.proxyPort;
    }
    
    public void setMapReady(String mapReady) {
        this.mapReady=mapReady;
    }
    public String getMapReady() {
        return this.mapReady;
    }
    
    public void setInfo(String info) {
        this.info=info;
    }
    public String getInfo() {
        return this.info;
    }
    
    public void setLocation(String location) {
        this.location=location;
    }
    public String getLocation() {
        return this.location;
    }
    
    public void setFoundLocation(String foundLocation) {
        this.foundLocation=foundLocation;
    }
    public String getFoundLocation() {
        return this.foundLocation;
    }
    
    public void setFoundLatitude(double foundLatitude) {
        this.foundLatitude=foundLatitude;
    }
    public double getFoundLatitude() {
        return this.foundLatitude;
    }
    
    public void setFoundLongitude(double foundLongitude) {
        this.foundLongitude=foundLongitude;
    }
    public double getFoundLongitude() {
        return this.foundLongitude;
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
    
    public void setRadius(int radius) {
        this.radius=radius;
    }
    public int getRadius() {
        return this.radius;
    }
    
    
    // mapAll.jsp
    public ArrayList getMapLocations() {
        return alLocations;
    }
    
    public void addMapLocation() {
        alLocations.add(new Location());
    }
    public void initPage() {
        init();
    }
    public void setZoomLevel(int zoom) {
        this.zoomLevel=zoom;
    }
    public int getZoomLevel() {
        return this.zoomLevel;
    }
    
    
    
    
    
    public String findItAction() {
        getLogger().log(Level.FINE, "in findAction - " + getLocation());
        // Process the button click action. Return value is a navigation
        // case name where null will return to the same page.
        GeoCoder geoCoder=new GeoCoder();
        if(!getProxyHost().equals("")) {
            // set proxy host and port if it exists
            // NOTE: This requires write permissions for java.util.PropertyPermission to be granted
            getLogger().log(Level.FINE, "Setting proxy to " + getProxyHost() + ":" + getProxyPort() + ".  Make sure server.policy is updated to allow setting System Properties");
            geoCoder.setProxyHost(getProxyHost());
            geoCoder.setProxyPort(getProxyPort());
        }
        
        // use component to get points based on location (this uses Yahoo's map service
        GeoPoint points[]=geoCoder.geoCode(location);
        if ((points == null) || (points.length < 1)) {
            setFoundLocation("No geographic points matched this location OR the Yahoo server can't be reached, please try again");
            return null;
        }
        
        // more that one point return, just tell user in log
        if (points.length > 1) {
            getLogger().log(Level.INFO, "Matched " + points.length + " locations, taking the first one");
        }
        
        // set values to be shown on main lookup page
        setFoundLocation(points[0].toString());
        setFoundLatitude(points[0].getLatitude());
        setFoundLongitude(points[0].getLongitude());
        
        // Set up markers for the center and information window
        mapMarker.setLatitude(points[0].getLatitude());
        mapMarker.setLongitude(points[0].getLongitude());
        mapMarker.setMarkup(changeSpaces(getLocation()) + "<br>" + changeSpaces(getInfo()));
        
        // clear old locations
        alMapMarkers.clear();
        addMapMarker(mapMarker) ;

        // set center point for map
        mapPoint.setLatitude(points[0].getLatitude());
        mapPoint.setLongitude(points[0].getLongitude());
        
        // enable the "Map It" button so user can go to map page
        mapReady="false";
        
        // return null so navigation will stay on main lookup page
        return null;
    }
    
    
    
    public String findAllAction() {
        getLogger().log(Level.FINE, "in findAction - " + getLocation());
        // Process the button click action. Return value is a navigation
        // case name where null will return to the same page.
        GeoCoder geoCoder=new GeoCoder();
        if(!getProxyHost().equals("")) {
            // set proxy host and port if it exists
            // NOTE: This requires write permissions for java.util.PropertyPermission to be granted
            getLogger().log(Level.FINE, "Setting proxy to " + getProxyHost() + ":" + getProxyPort() + ".  Make sure server.policy is updated to allow setting System Properties");
            geoCoder.setProxyHost(getProxyHost());
            geoCoder.setProxyPort(getProxyPort());
        }
        
        // use component to get points based on location (this uses Yahoo's map service
        GeoPoint points[]=geoCoder.geoCode(location);
        if ((points == null) || (points.length < 1)) {
            setFoundLocation("No geographic points matched this location OR the Yahoo server can't be reached, please try again");
            return null;
        }
        // more that one point return, just tell user in log
        if (points.length > 1) {
            getLogger().log(Level.INFO, "Matched " + points.length + " locations, taking the first one");
        }
        
        // Set up markers for the center and information window
        double dLatitude=points[0].getLatitude();
        double dLongitude=points[0].getLongitude();
        mapMarker.setLatitude(dLatitude);
        mapMarker.setLongitude(dLongitude);
        mapMarker.setMarkup(changeSpaces(getInfo()) + "<br>" + changeSpaces(getLocation()) );
        
        // clear old locations
        alMapMarkers.clear();
        addMapMarker(mapMarker) ;
        
        // set center point for map
        mapPoint.setLatitude(points[0].getLatitude());
        mapPoint.setLongitude(points[0].getLongitude());
        
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
        Location loc=null;
        double dLat=calculateLatitudeRadius(radius);
        double dLong=calculateLongitudeRadius(radius);
        getLogger().log(Level.FINE, "ZOOM - Lat and long  - " + zoomLevel + " - " + dLat + " - " + dLong);
        for(int ii=0; ii < alLocations.size(); ii++) {
            loc=alLocations.get(ii);
            if(loc.getAddress() != null && !loc.getAddress().equals("")) {
                mm=new MapMarker();
                points=geoCoder.geoCode(loc.getAddress());
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
            }
        }
        //System.out.println("Lat - Long " + outputx);
        // return null so navigation will stay on main lookup page
        return "map";
    }
    
    
    public String mapAction() {
        // return map so navigation will go to map page
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
