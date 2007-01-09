/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: PetstoreUtil.java,v 1.5 2007-01-09 19:02:11 basler Exp $ */

package com.sun.javaee.blueprints.petstore.util;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.PropertyResourceBundle;
import java.util.logging.Logger;

/**
 *
 * @author basler
 */

public class PetstoreUtil {
    
    private static final Logger _logger=getBaseLogger();
    private static final PropertyResourceBundle _resBundle=null;

    /** Creates a new instance of PetstoreUtil */
    public PetstoreUtil() {
    }
    
    
    public static Logger getLogger() {
        return _logger;
    }
    
    /**
    * This method returns the default logger for the petstore application
    *
    * @return Default Logger for petstore application
    */
    private static Logger getBaseLogger() {
       return Logger.getLogger(PetstoreConstants.PETSTORE_BASE_LOGGER, PetstoreConstants.PETSTORE_BASE_LOG_STRINGS);
    }
    

    public static String getMessage(String key) {
        return getMessage(key, (Object[])null);
    }
    
    
    /**
     * This method uses the default message strings property file to resolve
     * resultant string to show to an end user
     *
     * @return Formated message for external display
     */
    public static String getMessage(String key, Object... arguments) {
        String sxRet=null;
        try {
            // get resource bundle and retrive message
            PropertyResourceBundle res=new PropertyResourceBundle(PetstoreUtil.class.getResourceAsStream("MessageStrings.properties"));
            sxRet=res.getString(key);

            // see if the message needs to be formatted
            if(arguments != null) {
                // format message
                sxRet=MessageFormat.format(sxRet, arguments);
            }
        } catch(IOException io) {
            sxRet="Resource Bundle Error retrieving key " + key;
        }
        return sxRet;
    }
    
    
}
