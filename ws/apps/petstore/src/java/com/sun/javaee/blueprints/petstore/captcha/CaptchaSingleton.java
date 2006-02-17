/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: CaptchaSingleton.java,v 1.1 2006-02-17 03:04:23 yutayoshida Exp $ */

package com.sun.javaee.blueprints.petstore.captcha;

import com.octo.captcha.service.image.DefaultManageableImageCaptchaService;
import com.octo.captcha.service.image.ImageCaptchaService;

/*
 * Singleton facility to create the captcha image
 */
public class CaptchaSingleton {
    
    private static ImageCaptchaService instance = new DefaultManageableImageCaptchaService();
    
    public static ImageCaptchaService getInstance() {
        return instance;
    }
    
}

