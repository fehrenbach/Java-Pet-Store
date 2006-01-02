/*
 * SearchIndex.java
 *
 * Created on November 17, 2005, 4:50 PM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.sun.javaee.blueprints.petstore.search;

import java.util.*;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.search.Searcher;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.Hits;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.document.Field;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;

/**
 * Base search mechanism for Petstore indexes created from the database data
 * @author basler
 */
public class SearchIndex {
    
    private boolean bDebug=false;
    private Vector vtHits=new Vector();
    private static Logger _logger=null;
    
    
    /** Creates a new instance of SearchIndex */
    public SearchIndex() {
    }
    
    public void query(String indexFile, String searchString) {

        Searcher searcher=null;
        try {
            searcher=new IndexSearcher(indexFile);
            Analyzer analyzer=new StandardAnalyzer();
            // search "contents" attribute where all relavant item words are kept
            Query query=QueryParser.parse(searchString, "contents", analyzer);
            getLogger().log(Level.INFO, "search.string", searchString);

            // execute search
            Hits hits=searcher.search(query);
            getLogger().log(Level.INFO, "search.results", hits.length());
            Document indexDoc;
            Enumeration enumx;
            Field fieldx;
            IndexDocument indexDocument=null;
            for(int ii=0; ii < hits.length(); ii++) {
                indexDoc=hits.doc(ii);
                
                // create new holder for research results
                indexDocument=new IndexDocument();
                
                fieldx=indexDoc.getField("url");
                if(fieldx != null) {
                    indexDocument.setPageURL(fieldx.stringValue());
                }

                fieldx=indexDoc.getField("uid");
                if(fieldx != null) {
                    indexDocument.setUID(fieldx.stringValue());
                }
                
                fieldx=indexDoc.getField("summary");
                if(fieldx != null) {
                    indexDocument.setSummary(fieldx.stringValue());
                }
                
                fieldx=indexDoc.getField("title");
                if(fieldx != null) {
                    indexDocument.setTitle(fieldx.stringValue());
                }
                
                fieldx=indexDoc.getField("image");
                if(fieldx != null) {
                    indexDocument.setImage(fieldx.stringValue());
                }
                
                fieldx=indexDoc.getField("price");
                if(fieldx != null) {
                    indexDocument.setPrice(fieldx.stringValue());
                }

                fieldx=indexDoc.getField("product");
                if(fieldx != null) {
                    indexDocument.setProduct(fieldx.stringValue());
                }
                
                /*
                // list all attributes indexed
                enumx=indexDoc.fields();
                while(enumx.hasMoreElements()) {
                    fieldx=(Field)enumx.nextElement();
                    System.out.println("\nField - " + fieldx);
                    System.out.println(fieldx.name() + " - " +  fieldx.stringValue());
                }
                */
                
                vtHits.add(indexDocument);
                
                
            }
        } catch(Exception e) {
            getLogger().log(Level.WARNING, "search.exception", e);
            e.printStackTrace();
        } finally {
            if(searcher != null) {
                try {
                    // make sure close search or index files get locked
                    searcher.close();
                } catch(IOException ioe) {
                    ioe.printStackTrace();
                }
            }
        }
    }
    
    public Vector getHits() {
            return vtHits;
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
    
    
    public static void main(String[] args) {
        // used for unit tests
        SearchIndex si=new SearchIndex();
        // use dummy default index file for unit tests
        si.query("/tmp/tmp/index", "Puppy");
    }
    
}
