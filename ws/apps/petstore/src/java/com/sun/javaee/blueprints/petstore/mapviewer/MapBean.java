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

import com.sun.j2ee.blueprints.ui.geocoder.GeoCoder;
import com.sun.j2ee.blueprints.ui.geocoder.GeoPoint; 
import com.sun.j2ee.blueprints.ui.mapviewer.MapMarker;
import com.sun.j2ee.blueprints.ui.mapviewer.MapPoint;
import javax.faces.component.UICommand;
import javax.faces.component.UIInput;
import javax.faces.component.UIForm;

/**
 *
 * @author basler
 */
public class MapBean {

    private MapMarker mapMarker=new MapMarker();
    private MapPoint mapPoint=new MapPoint();
    private String location="4150 Network Circle, Santa Clara, CA 95054", foundLocation="", info="Sun's Santa Clara Campus";
    private String mapReady="true", proxyHost="";
    private double foundLatitude=0.0d, foundLongitude=0.0d;
    private int proxyPort=0;

    /** Creates a new instance of MapBean */
    public MapBean() {
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
        return new MapMarker[]{this.mapMarker};
    }

    
    
    public String findAction() {
        System.out.println("in findAction - " + getLocation());
        // Process the button click action. Return value is a navigation
        // case name where null will return to the same page.
        GeoCoder geoCoder=new GeoCoder();
        if(!getProxyHost().equals("")) {
            // set proxy host and port if it exists
            // NOTE: This requires write permissions for java.util.PropertyPermission to be granted
            System.out.println("Setting proxy to " + getProxyHost() + ":" + getProxyPort() + ".  Make sure server.policy is updated to allow setting System Properties");
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
           System.out.println("Matched " + points.length + " locations, taking the first one");
        }
        
        // set values to be shown on main lookup page
        setFoundLocation(points[0].toString());
        setFoundLatitude(points[0].getLatitude());
        setFoundLongitude(points[0].getLongitude());
        
        // Set up markers for the center and information window
        mapMarker.setLatitude(points[0].getLatitude());
        mapMarker.setLongitude(points[0].getLongitude());
        mapMarker.setMarkup(points[0].toString() + "<br>" + getInfo());

        // set center point for map
        mapPoint.setLatitude(points[0].getLatitude());
        mapPoint.setLongitude(points[0].getLongitude());
        
        // enable the "Map It" button so user can go to map page
        mapReady="false";
        
        // return null so navigation will stay on main lookup page
        return null;
    }
    

    public String mapAction() {
        // return map so navigation will go to map page
        return "map";    
    }
    
}