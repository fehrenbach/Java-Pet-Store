/*
 * PayPalBean.java
 *
 * Created on March 14, 2006, 7:50 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.sun.javaee.blueprints.petstore.model;

import java.util.ArrayList;
import java.math.BigDecimal;
import com.sun.j2ee.blueprints.ui.shopping.BuyNowPostData;
/**
 *
 * @author basler
 */
public class PayPalBean {
    
    BuyNowPostData postData=null;
   
    /** Creates a new instance of PayPalBean */
    public PayPalBean() {
        postData=new BuyNowPostData();
        postData.setCurrencyCode("U.S. Dollar");
        postData.setShippingCost(new BigDecimal("25"));
        postData.setTax(new BigDecimal("10"));
        postData.setUndefinedQuantity("1");
        postData.setSubmissionMethod("GET");
    }
    
    public BuyNowPostData getPostData() {
        return postData;
    }
    
    
}
