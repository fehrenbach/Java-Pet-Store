/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: RatingBean.java,v 1.6 2006-05-03 21:48:59 inder Exp $ */

package com.sun.javaee.blueprints.petstore.model;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.faces.context.FacesContext;
import java.util.Map;

/**
 *
 * @author basler
 */
public class RatingBean {
    
    private String itemId=null;
    private int grade=0;
    private CatalogFacade cf;
    
    /** Creates a new instance of RatingBean */
    public RatingBean() {
        FacesContext context=FacesContext.getCurrentInstance();
        Map<String,Object> contextMap=context.getExternalContext().getApplicationMap();        
        cf=(CatalogFacade)contextMap.get("CatalogFacade");
    }
    
    public String[] getRatingText() {
        return new String[]{"Hate It", "Below Average", "Average", "Above Average", "Love It"};
    }

    public void setGrade(int grade) {
        // "itemId" is the primarykey for the product...
        // "grade" is the grade to be store
        String itemId=getItemId();
        System.out.println("\n *** have rating - " + itemId + " - " + grade);
        if(itemId != null) {
            // persistant code goes here !!!!
            Item item = cf.getItem(itemId);
            item.addRating(grade);
            cf.updateRating(item);
        }
    }

    public int getGrade() {
        return grade;
    }  

    public void setItemId(String itemId) {
        this.itemId=itemId;
    }
    
    public String getItemId() {
        return itemId;
    }
}
