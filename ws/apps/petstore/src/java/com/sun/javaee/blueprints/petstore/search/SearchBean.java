/*
 * SearchBean.java
 *
 * Created on April 18, 2006, 8:37 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.sun.javaee.blueprints.petstore.search;

import java.util.Vector;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import javax.faces.component.html.HtmlDataTable;

import javax.faces.model.SelectItem;
import java.util.Iterator;
import javax.faces.context.FacesContext;
import javax.el.ValueExpression;

/**
 *
 * @author basler
 */
public class SearchBean {
    
    private String searchString="dog";
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
