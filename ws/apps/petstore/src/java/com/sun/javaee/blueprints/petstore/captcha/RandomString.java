/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: RandomString.java,v 1.4 2006-05-03 21:48:57 inder Exp $ */

package com.sun.javaee.blueprints.petstore.captcha;

import java.util.Random;

public class RandomString {
    
    private static Random rd = null;
    
    /** Creates a new instance of RandomString */
    public RandomString() {
        rd = new Random();
    }
    
    public String getString(int count) {
        return getString(count, null);
    }
    
    public String getString(int count, String exclude) {
        if (exclude == null) {
            exclude = "";
        }
        if (count <= 0) {
            throw new IllegalArgumentException("Character length must be > 0");
        }
        int start = ' ';
        int end = 'z'+1;
        int num = end-start;
        StringBuffer buf = new StringBuffer();
        char c;
        while (count-- != 0) {
            c = (char)rd.nextInt(num);
            if (Character.isLetterOrDigit(c) && exclude.indexOf((int)c)<0) {
                buf.append(c);
            } else {
                count++;
            }
        }
        return buf.toString();
    }
    public String getStringfromLong() {
        
        String token = Long.toString(Math.abs(rd.nextLong()), 36);
        return token;
    }
    
}
