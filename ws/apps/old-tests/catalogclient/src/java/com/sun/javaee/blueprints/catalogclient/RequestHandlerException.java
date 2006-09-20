/* Copyright 2005 Sun Microsystems, Inc.  All rights reserved.
 You may not modify, use, reproduce, or distribute this software
 except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: RequestHandlerException.java,v 1.1 2006-09-20 21:33:20 inder Exp $
 */
package com.sun.javaee.blueprints.catalogclient;

/** An application exception indicating something has gone wrong
 * These are errors which the application could potentially
 * take some corrective action 
 */

public class RequestHandlerException extends Exception {
    public RequestHandlerException() {}
    public RequestHandlerException(String msg) { super(msg); }
    public RequestHandlerException(String msg, Throwable cause) { super(msg, cause); }
    public RequestHandlerException(Throwable cause) { super(cause); }
    
}