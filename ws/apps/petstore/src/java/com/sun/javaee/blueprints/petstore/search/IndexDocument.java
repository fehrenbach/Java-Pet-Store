/*
 * indexDocuments.java
 *
 * Created on December 5, 2005, 10:06 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.sun.javaee.blueprints.petstore.search;

/**
 * This class is a simple stuctured used to hold petstore indexed info for indexing and search
 * @author basler
 */
public class IndexDocument {
    
    public String uid="", pageURL="", title="", summary="", image="";
    public String modifiedDate="", contents="", price="0", product="", tag="";
    
    /** Creates a new instance of indexDocuments */
    public IndexDocument() {
    }

    public IndexDocument(String pageURL, String title, String summary, String image) {
        this.pageURL=pageURL;
        this.title=title;
        this.summary=summary;
        this.image=image;
    }

    public String getUID() {
        return this.uid;
    }
    public void setUID(String uid) {
        this.uid=uid;
    }
 
    public String getPageURL() {
        return this.pageURL;
    }
    public void setPageURL(String pageURL) {
        this.pageURL=pageURL;
    }

    public String getTitle() {
        return this.title;
    }
    public void setTitle(String title) {
        this.title=title;
    }

    public String getSummary() {
        return this.summary;
    }
    public void setSummary(String summary) {
        this.summary=summary;
    }

    public String getImage() {
        return this.image;
    }
    public void setImage(String image) {
        this.image=image;
    }
    
    public String getModifiedDate() {
        return this.modifiedDate;
    }
    public void setModifiedDate(String modifiedDate) {
        this.modifiedDate=modifiedDate;
    }

    
    public String getContents() {
        return this.contents;
    }
    public void setContents(String contents) {
        this.contents=contents;
    }
    
    public float getPriceValue() {
        float fPrice=0f;
        try {
            fPrice=Float.parseFloat(price);
        } catch (NumberFormatException nfe) {
            System.out.println("Index Price format conversion error = " + nfe);
        }
        return fPrice;
    }

    public String getPrice() {
        return this.price;
    }
    public void setPrice(String price) {
        this.price=price;
    }

    public String getProduct() {
        return this.product;
    }
    public void setProduct(String product) {
        this.product=product;
    }

    public String getTag() {
        return this.tag;
    }
    public void setTag(String tag) {
        this.tag=tag;
    }
    
    
    public String toString() {
        String sxRet=" UID=" + uid + " pageURL=" + pageURL + " title=" + title +
            " summary=" + summary + " image=" + image + 
            " modifiedDate=" + modifiedDate + " contents=" + contents +
            " price=" + price + " product=" + product + " tag=" + tag;
        return sxRet;
                
    }
    
    
}
