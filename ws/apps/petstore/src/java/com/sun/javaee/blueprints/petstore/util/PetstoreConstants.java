package com.sun.javaee.blueprints.petstore.util;
/*
 * PetstoreContants.java
 *
 * Created on January 2, 2006, 11:25 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

/**
 *
 * @author basler
 */
public class PetstoreConstants {
    
    public static final String PETSTORE_INDEX_DIRECTORY=System.getProperty("com.sun.aas.instanceRoot") + 
                                                            "/lib/petstore/searchindex";
    public static final String PETSTORE_BASE_LOGGER="com.sun.javaee.blueprints.petstore";
    public static final String PETSTORE_BASE_LOG_STRINGS="com.sun.javaee.blueprints.petstore.util.LogStrings";
    
    /** private constructor to enforce only constants class */
    private PetstoreConstants() {}
    
}
