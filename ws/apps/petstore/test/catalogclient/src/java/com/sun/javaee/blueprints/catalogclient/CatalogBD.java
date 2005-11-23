/* Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: CatalogBD.java,v 1.1 2005-11-23 21:09:22 smitha Exp $ */

package com.sun.javaee.blueprints.catalogclient;

import java.rmi.*;
import java.io.*;
import java.util.*;
import javax.ejb.EJB;
import javax.ejb.*;
import javax.naming.*;

import com.sun.javaee.blueprints.catalogclient.ejb.*;


public class CatalogBD {
    
    //private static @EJB CategoryFacade cf;
    //private static CategoryFacade cf;
    public CatalogBD(){
    }
    
    public Collection getCategories() throws RequestHandlerException {
        
        try {
            InitialContext ic = new InitialContext();
            System.out.println("here 1");
            CatalogFacade cf = (CatalogFacade)ic.lookup("java:comp/env/ejb/CatalogFacade");
            //CategoryFacade cf = cfh.create();
            System.out.println("here 2");
            return cf.getCategories();
            
        }  catch(Exception re){
            re.printStackTrace(System.err);
            throw new RequestHandlerException(re.getMessage());
        }
    }
    
    public Collection getProducts(String catID) throws RequestHandlerException {
        
        try {
            InitialContext ic = new InitialContext();
            System.out.println("here 1");
            CatalogFacade cf = (CatalogFacade)ic.lookup("java:comp/env/ejb/CatalogFacade");
            //CategoryFacade cf = cfh.create();
            System.out.println("here 2");
            
            return cf.getProducts(catID);
            
        }  catch(Exception re){
            re.printStackTrace(System.err);
            throw new RequestHandlerException(re.getMessage());
        }
    }
}