/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: CaptchaSingleton.java,v 1.4 2006-05-03 21:48:57 inder Exp $ */

package com.sun.javaee.blueprints.petstore.captcha;

/*
 * Singleton facility to create the captcha image
 */
public class CaptchaSingleton {
    
    private static SimpleCaptcha instance = new SimpleCaptcha();
    
    public static SimpleCaptcha getInstance() {
        return instance;
    }
    
}

