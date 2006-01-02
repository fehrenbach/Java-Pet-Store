package com.sun.javaee.blueprints.petstore.util;
/*
 * PetstoreUtil.java
 *
 * Created on January 2, 2006, 1:40 PM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

import java.util.logging.Logger;
import java.util.logging.Level;

/**
 *
 * @author basler
 */

public class PetstoreUtil {
    
    /** Creates a new instance of PetstoreUtil */
    public PetstoreUtil() {
    }
    
    /**
    * Method getBaseLogger
    *
    * @return Default Logger for petstore application
    */
    public static Logger getBaseLogger() {
       return Logger.getLogger(PetstoreConstants.PETSTORE_BASE_LOGGER, PetstoreConstants.PETSTORE_BASE_LOG_STRINGS);
    }
    
    
}
