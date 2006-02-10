/*
 * Indexer.java
 *
 * Created on December 13, 2005, 3:46 PM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.sun.javaee.blueprints.petstore.search;

import java.io.IOException;
import java.io.StringReader;

import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.DateField;

/**
 * This class is used to encapsulate the Lucene functionality
 * for the Petstore application.  It is strictly used to loosely couple
 * the search with the Lucene engine for indexing
 *
 * @author basler
 */
public class Indexer {
    
    private IndexWriter writer=null; 
    
    /** Creates a new instance of Indexer */
    public Indexer(String file) throws IOException {
        writer=new IndexWriter(file, new StandardAnalyzer(), true);
        writer.maxFieldLength = 1000000;
    }
    
    public void addDocument(IndexDocument indexDoc) throws IOException {
        // create an index document for the page
        Document doc=new Document();
        doc.add(Field.UnIndexed("url", indexDoc.getPageURL()));
        doc.add(Field.UnIndexed("image", indexDoc.getImage()));
        doc.add(Field.UnIndexed("price", indexDoc.getPrice()));
        doc.add(Field.UnIndexed("product", indexDoc.getProduct()));
        doc.add(new Field("uid", indexDoc.getUID(), true, true, false));

        // Add the last modified date of the file a field named "modified".  Use a
        // Keyword field, so that it's searchable, but so that no attempt is made
        // to tokenize the field into words.
        doc.add(Field.Keyword("modified", indexDoc.getModifiedDate()));

        // use string return instead of reader, because info isn't retrievable which is 
        // needed for delete/add of document to index when tagging occurs
        //doc.add(Field.Text("contents", new StringReader(indexDoc.getContents())));
        doc.add(Field.Text("contents", indexDoc.getContents()));
        doc.add(Field.Text("title", indexDoc.getTitle()));
        doc.add(Field.UnIndexed("summary", indexDoc.getSummary()));
        writer.addDocument(doc);
    }
    
    
    public IndexWriter getWriter() {
        return writer;
    }
    
    public void close() throws IOException {
        writer.optimize();
        writer.close();
    }
    
}
