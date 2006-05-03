/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: SQLParser.java,v 1.4 2006-05-03 21:49:00 inder Exp $ */

package com.sun.javaee.blueprints.petstore.search;

import java.io.File;
import javax.naming.InitialContext;
import javax.rmi.PortableRemoteObject;
import javax.sql.DataSource;
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.Properties;
import java.util.logging.Logger;
import java.util.logging.Level;

import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;

/**
 *
 * @author basler
 */
public class SQLParser {

    private boolean bDebug=false;
    private Logger _logger=null;

    /** Creates a new instance of SQLParser */
    public SQLParser() {
    }
    
    
    public void runSQL(String sxIndexFile, Connection conn, String sql) {
        getLogger().log(Level.INFO, "index.sql.statement", sql);
        
        Indexer indexer=null;
        IndexDocument indexDoc=null;
        try {
            // make sure files exist
            File indexFile=new File(sxIndexFile);
            indexFile.mkdirs();
            
            // get indexer
            indexer=new Indexer(sxIndexFile);    

            // create and execute query on provide connection
            Statement statement=conn.createStatement();
            ResultSet result=statement.executeQuery(sql);
            boolean hasNext=result.next();
            String title=null, summary=null;
            while(hasNext) {
                // extract information from row
                title=result.getString("title");
                summary=result.getString("summary");
                indexDoc=new IndexDocument();
                indexDoc.setUID(result.getString("id"));
                indexDoc.setPageURL(result.getString("id"));
                indexDoc.setImage(result.getString("image"));
                indexDoc.setPrice(result.getString("price"));
                indexDoc.setProduct(result.getString("product"));
                indexDoc.setModifiedDate(result.getString("modifiedDate"));
                indexDoc.setContents(title + " " + summary);
                indexDoc.setTitle(title);
                indexDoc.setSummary(summary);
                getLogger().log(Level.INFO, "Adding document to index: " + indexDoc.toString());

                // add doc to index
                indexer.addDocument(indexDoc);
                hasNext=result.next();
            }

        } catch (Exception e) {
            getLogger().log(Level.WARNING, "index.exception", e);
            e.printStackTrace();
        } finally {
            try {
                // must close file or will not be able to reindex
                indexer.close();
            } catch (Exception ee) {
                ee.printStackTrace();
            }
        }
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
        SQLParser sp=new SQLParser();
        
        // get connection
        Properties props=new Properties();
        props.put("user", "APP" );
        props.put("password", "APP");    
        // pointbase info
        //Class.forName("com.pointbase.jdbc.jdbcDataSource");
        //Class.forName("com.pointbase.jdbc.jdbcUniversalDriver");
        String driver="org.apache.derby.jdbc.ClientDriver";
        try {
            Class.forName(driver);
            String sxJdbcURL="jdbc:derby://localhost:1527/petstore";
            Connection conn=DriverManager.getConnection(sxJdbcURL, props);        

            sp.runSQL("/tmp/tmp/index", conn, "select itemid \"id\", name \"title\", description \"summary\", imageurl \"image\", listprice \"price\", productid \"product\", '' \"modifiedDate\" from \"APP\".\"ITEM\"");
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
    
    
}
