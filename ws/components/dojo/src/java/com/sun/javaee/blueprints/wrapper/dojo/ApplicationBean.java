/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
 */

/*
 * ApplicationBean.java
 *
 * Created on June 16, 2005, 4:13 PM
 *
 */
package com.sun.javaee.blueprints.wrapper.dojo;

import javax.faces.context.FacesContext;
import com.sun.javaee.blueprints.wrapper.*;

public class ApplicationBean {

    public ApplicationBean() {}
    
    private String[] countries =
        new String[] {
            "Canada", "France", "Uganda", "Ukraine", "United States of America", "United Kingdom", "Japan", "Korea", "Jamacia", "Thailand"
        };
        private String[] countryCodes =
        new String[] {
            "CA", "FR", "UG", "UR", "USA", "UK", "JP", "KR", "JA", "TH"
        };


     public void completeCountry(FacesContext context, String[] args, AjaxResult result) {
        result.setResponseType(AjaxResult.JSON);
        result.append("[");
        for (int loop=0; loop < countries.length; loop++){
             result.append("[\"" + countries[loop] + "\",\"" + countryCodes[loop] + "\" ]");
             if (loop < countries.length -1) result.append(",");
        }
        result.append("];");   
    }
 
 }
