/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: BlueFilter.java,v 1.1 2006-02-23 20:25:37 yutayoshida Exp $ */

package com.sun.javaee.blueprints.petstore.captcha;

import java.awt.image.*;

/**
 *
 * @author yuta
 */
public class BlueFilter extends RGBImageFilter {
    
    /** Creates a new instance of BlueFilter */
    public BlueFilter() {
        canFilterIndexColorModel = true;
    }
    public int filterRGB(int x, int y, int rgb) {
        return (rgb | 0x000000FF);
    }
}