/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: PetstoreUtil.java,v 1.3 2006-05-05 20:15:26 inder Exp $ */

package com.sun.javaee.blueprints.petstore.util;

import java.util.logging.Logger;

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
