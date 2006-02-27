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
    
    private ArrayList<MapMarker> alMapMarkers=new ArrayList();
    private MapMarker mapMarker=new MapMarker();
    private MapPoint mapPoint=new MapPoint();
    private String location="4150 Network Circle, Santa Clara, CA 95054", foundLocation="", info="Sun's Santa Clara Campus";
    private String location1="100 Main Street, Milpitas, CA 95035";
    private String location2="400 Castro Street, Mountain View, CA";
    private String location3="100 University Ave, Palo Alto, CA";
    private String info1="info1";
    private String info2="info2";
    private String info3="info3";
    
    private String mapReady="true", proxyHost="webcache.sfbay.sun.com";
    private double foundLatitude=0.0d, foundLongitude=0.0d;
    private int proxyPort=8080, zoomLevel=6;
    
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
    
    
    
    public String findItAction() {
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
        GeoPoint points1[]=geoCoder.geoCode(location1);
        GeoPoint points2[]=geoCoder.geoCode(location2);
        GeoPoint points3[]=geoCoder.geoCode(location3);
        if ((points == null) || (points.length < 1)) {
            setFoundLocation("No geographic points matched this location OR the Yahoo server can't be reached, please try again");
            return null;
        }
        // more that one point return, just tell user in log
        if (points.length > 1) {
            System.out.println("Matched " + points.length + " locations, taking the first one");
        }
        
       
        // Set up markers for the center and information window
        mapMarker.setLatitude(points[0].getLatitude());
        mapMarker.setLongitude(points[0].getLongitude());
        mapMarker.setMarkup(points[0].toString() + "<br>" + getInfo());
        addMapMarker(mapMarker) ;
       
        MapMarker mm=new MapMarker();
        mm.setLatitude(points1[0].getLatitude());
        mm.setLongitude(points1[0].getLongitude());
        mm.setMarkup(points1[0].toString() + "<br>" + getInfo1());
        addMapMarker(mm) ;
        
        mm=new MapMarker();
        mm.setLatitude(points2[0].getLatitude());
        mm.setLongitude(points2[0].getLongitude());
        mm.setMarkup(points2[0].toString() + "<br>" + getInfo2());
        addMapMarker(mm) ;
        
        mm=new MapMarker();
        mm.setLatitude(points3[0].getLatitude());
        mm.setLongitude(points3[0].getLongitude());
        mm.setMarkup(points3[0].toString() + "<br>" + getInfo3());
        addMapMarker(mm) ;
        
        // set center point for map
        mapPoint.setLatitude(points[0].getLatitude());
        mapPoint.setLongitude(points[0].getLongitude());
                
        // return null so navigation will stay on main lookup page
        return "map";
    }
    
    
    
    
    
    
    public String mapAction() {
        // return map so navigation will go to map page
        return "map";
    }
    
    
    public void setInfo1(String info) {
        this.info1=info;
    }
    public String getInfo1() {
        return this.info1;
    }
    public void setInfo2(String info) {
        this.info2=info;
    }
    public String getInfo2() {
        return this.info2;
    }
    public void setInfo3(String info) {
        this.info3=info;
    }
    public String getInfo3() {
        return this.info3;
    }
    public void setLocation1(String location) {
        this.location1=location;
    }
    public String getLocation1() {
        return this.location1;
    }
    public void setLocation2(String location) {
        this.location2=location;
    }
    public String getLocation2() {
        return this.location2;
    }
    public void setLocation3(String location) {
        this.location3=location;
    }
    public String getLocation3() {
        return this.location3;
    }
    
    
}
