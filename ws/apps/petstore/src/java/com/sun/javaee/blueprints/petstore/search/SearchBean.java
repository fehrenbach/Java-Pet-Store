/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: SearchBean.java,v 1.4 2006-05-05 20:15:25 inder Exp $ */

package com.sun.javaee.blueprints.petstore.search;

import java.util.Vector;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;

/**
 *
 * @author basler
 */
public class SearchBean {
    
    private String searchString="cat";
    private boolean searchTags=true, showResults=false;
    private Vector<IndexDocument> vtHits=null;
    
    /** Creates a new instance of SearchBean */
    public SearchBean() {
    }
    
    
    public void setSearchString(String searchString) {
        this.searchString=searchString;
    }
    public String getSearchString() {
        return searchString;
    }
    
    public void setSearchTags(boolean searchTags) {
        this.searchTags=searchTags;
    }
    public boolean getSearchTags() {
        return searchTags;
    }

    public void setShowResults(boolean showResults) {
        this.showResults=showResults;
    }
    public boolean getShowResults() {
        return showResults;
    }
    
    public Vector<IndexDocument> getHits() {
        return vtHits;
    }
    
    
    public String searchAction() {
        // perform search
        try {
            
            // string to search
            SearchIndex si=new SearchIndex();
            // alter search string if tagged
            String searchxx=searchString;
            if(searchTags && searchString.indexOf(":") < 0) {
                searchxx="contents:" + searchString + " OR tag:" + searchString;
            }
            vtHits=si.query(PetstoreConstants.PETSTORE_INDEX_DIRECTORY, searchxx);
            setShowResults(true);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "displayResults";
    }
 
}
