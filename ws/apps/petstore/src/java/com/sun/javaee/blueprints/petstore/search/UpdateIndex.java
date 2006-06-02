/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: UpdateIndex.java,v 1.4 2006-06-02 16:42:54 basler Exp $ */

package com.sun.javaee.blueprints.petstore.search;

import java.util.logging.Logger;
import java.util.Vector;
import java.io.IOException;

import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.Term;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.search.Hits;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;

/**
 *
 * @author basler
 */
public class UpdateIndex {
    
    private static final boolean bDebug=false;
    private Logger _logger;
    
    /** Creates a new instance of UpdateIndex */
    public UpdateIndex() {
    }
    
    
    public void updateDocTag(String indexFile, String sxTagField, String tagString, String sxDocId) throws IOException {
        if(bDebug) System.out.println("Tagging document:" + sxDocId + " with \"" + sxTagField + " - " + tagString + "\"");
        
        // get document to update, so data can be added
        SearchIndex si=new SearchIndex();
        Vector vtHits=si.query(indexFile, sxDocId, "uid");
        
        Hits hits=si.getHitsNative();
        // should only have one return
        if(hits.length() > 1) {
            // exception, should only be one
            new IllegalStateException("Should only have one document in index with uid=" + sxDocId);
        }
        
        Document doc=(Document)hits.doc(0);
        if(bDebug) System.out.println("HAVE DOC " + doc);
        
        // Read index and delete targeted doc through a term
        IndexReader reader=IndexReader.open(indexFile);
        // delete document by term
        int del=reader.deleteDocuments(new Term("uid", sxDocId));
        if(bDebug) {
            System.out.println("return Number of items deleted:"  + del);
            int deleted=0;
            for(int ii=0; ii < reader.numDocs(); ii++) {
                if(reader.isDeleted(ii)) {
                    deleted++;
                }
            }
            System.out.println("Number of deleted items in the whole index:" + deleted);
        }
        reader.close();
        
        // update document with tag information or add to tag that exists
        // NOTE: The tag information should be persisted in another place, 
        // incase indexes need to be rebuilt
        Field field=doc.getField(sxTagField);
        if(field == null) {
            // create new tag field
            field=new Field(sxTagField, tagString, Field.Store.YES, Field.Index.TOKENIZED);        

        } else {
            // get existing field and append new tag
            tagString=field.stringValue() + " " + tagString;
            doc.removeField(sxTagField);
            field=new Field(sxTagField, tagString, Field.Store.YES, Field.Index.TOKENIZED);        
        }

        
        doc.add(field);
        if(bDebug) System.out.println("Added field \n" + field + " doc to index = \n" + doc);
        // open writer to re-add document (no update in Lucene)
        Analyzer analyzer=new StandardAnalyzer();
        IndexWriter writer=new IndexWriter(indexFile, analyzer, false);
        if(bDebug) System.out.println("Before optimize = " + writer.docCount());
        writer.optimize();
        if(bDebug) System.out.println("Before add = " + writer.docCount());
        writer.addDocument(doc);
        if(bDebug) System.out.println("after add = " + writer.docCount());
        writer.close();
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
        UpdateIndex uix=new UpdateIndex();
        // use dummy default index file for unit tests
        try {
            uix.updateDocTag("/tmp/tmp/index", "tag_uses",  "Not a good Cat for killing mice", "pet-001");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
