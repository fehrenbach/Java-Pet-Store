/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: AutocompleteBean.java,v 1.1 2006-04-19 04:55:06 yutayoshida Exp $ */

package com.sun.javaee.blueprints.petstore.controller;

import java.util.*;

import javax.faces.application.Application;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import com.sun.javaee.blueprints.petstore.model.*;

import com.sun.j2ee.blueprints.ui.autocomplete.AutoCompleteUtilities;
import com.sun.j2ee.blueprints.ui.autocomplete.CompletionResult;

public class AutocompleteBean {
    
    static final boolean bDebug=false;
    private String[] cities = null;
    private String[] zips = null;
    private String[] states = null;
    
    /** Creates a new instance of AutocompleteBean */
    public AutocompleteBean() {
        initCities();
    }
    
    private void initCities() {
        // fetch records
        FacesContext context=FacesContext.getCurrentInstance();
        Map<String, Object> contextMap = context.getExternalContext().getApplicationMap();
        CatalogFacade catalogFacade = (CatalogFacade)contextMap.get("CatalogFacade");
        List<ZipLocation> zipLocations = catalogFacade.getZipCodeLocations();
        
        if (zipLocations == null) {
            cities =new String[]{"Init Failed"};
            zips =new String[]{"Init Failed"};
            states =new String[]{"Init Failed"};
            return;
        }
        
        int size = zipLocations.size();
        if (bDebug) System.out.println("zip Locations size : "+ size);
        cities = new String[size];
        zips = new String[size];
        states = new String[size];
        int i=0;
        for (ZipLocation zl : zipLocations) {
            cities[i] = zl.getCity()+", "+zl.getState()+" "+Integer.toString(zl.getZipCode());
            zips[i] = Integer.toString(zl.getZipCode());
            states[i] = zl.getState();
            i++;
        }
    }
    
    public String[] getCities() {
        return cities;
    }
    
    public String[] getZips() {
        return zips;
    }
    
    public String[] getStates() {
        return states;
    }
    
    public void completeCity(FacesContext context, String prefix, CompletionResult result) {
        if (bDebug) { System.out.println("Completing City - " + prefix);
                      System.out.println("first city : " + cities[0]); }
        AutoCompleteUtilities.addMatchingItems(cities, prefix, result);
    }
    
    public void completeState(FacesContext context, String prefix, CompletionResult result) {
        if (bDebug) System.out.println("Completing State - " + prefix);
        AutoCompleteUtilities.addMatchingItems(states, prefix, result);
    }
}
