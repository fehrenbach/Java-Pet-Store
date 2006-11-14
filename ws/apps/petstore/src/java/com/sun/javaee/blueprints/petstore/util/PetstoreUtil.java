/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: PetstoreUtil.java,v 1.4 2006-11-14 18:30:25 basler Exp $ */

package com.sun.javaee.blueprints.petstore.util;

import java.util.logging.Logger;

/**
 *
 * @author basler
 */

public class PetstoreUtil {
    
    private static final Logger _logger=getBaseLogger();

    /** Creates a new instance of PetstoreUtil */
    public PetstoreUtil() {
    }
    
    
    public static Logger getLogger() {
        return _logger;
    }
    
    /**
    * Method getBaseLogger
    *
    * @return Default Logger for petstore application
    */
    private static Logger getBaseLogger() {
       return Logger.getLogger(PetstoreConstants.PETSTORE_BASE_LOGGER, PetstoreConstants.PETSTORE_BASE_LOG_STRINGS);
    }
    
    
}
