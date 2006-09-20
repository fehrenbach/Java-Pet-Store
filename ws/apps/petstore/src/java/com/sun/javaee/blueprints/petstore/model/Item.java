/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: Item.java,v 1.20 2006-09-20 17:02:18 basler Exp $ */

package com.sun.javaee.blueprints.petstore.model;

import static javax.persistence.CascadeType.ALL;
import java.util.Collection;
import java.util.Vector;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.TableGenerator;

@NamedQueries(
 {  @NamedQuery(
      name="Item.getItemsPerProductCategory",
      query="SELECT i FROM Item i WHERE i.productID = :pID"
    ), 
    @NamedQuery(
      name="Item.getAllZipCityState",
      query="SELECT z FROM ZipLocation z"       
    )
  }
) 
@Entity
public class Item implements java.io.Serializable {

    private String itemID;
    private String productID;
    private String name;
    private String description;
    private String imageURL;
    private String imageThumbURL;
    private float price;
    private Address address;
    private SellerContactInfo contactInfo;
    private int totalScore;
    private int numberOfVotes;
    private Collection<Tag> tags=new Vector();

      
    public Item() { }
    public Item(String productID, String name, String description,
            String imageURL, String imageThumbURL, float price,
            Address address, SellerContactInfo contactInfo,
            int totalScore, int numberOfVotes ) {
        this.productID = productID;
        this.name = name;
        this.description = description;
        this.imageURL = imageURL;
        this.imageThumbURL = imageThumbURL;
        this.price = price;
        this.address = address;
        this.contactInfo = contactInfo;
        this.totalScore = totalScore;
        this.numberOfVotes = numberOfVotes;                    
    }
    
    @TableGenerator(name="ITEM_ID_GEN",
            table="ID_GEN",
            pkColumnName="GEN_KEY",
            valueColumnName="GEN_VALUE",
            pkColumnValue="ITEM_ID",
            allocationSize=1)
    @GeneratedValue(strategy=GenerationType.TABLE,generator="ITEM_ID_GEN")
    @Id
    public String getItemID() {
        return itemID;
    }
    
    public String getProductID() {
        return productID;
    }

    public String getName() {
        return name;
    }    

    public String getDescription() {
        return description;
    }

    public float getPrice() {
       return price;
    }
        
    public String getImageURL() {
        return imageURL;
    }
    
    public String getImageThumbURL() {
        return imageThumbURL;
    }
    
    @OneToOne(cascade={CascadeType.PERSIST})
    public Address getAddress() {
        return address;
    }
    
    @OneToOne(cascade={CascadeType.PERSIST})    
    public SellerContactInfo getContactInfo() {
        return contactInfo;
    }
    
    public int getTotalScore(){
        return totalScore;
    }
    public int getNumberOfVotes() {
        return numberOfVotes;
    } 
    
    public void setItemID(String itemID) {
        this.itemID = itemID;
    }     
    public void setProductID(String productID) {
        this.productID = productID;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }
    public void setImageThumbURL(String imageThumbURL) {
        this.imageThumbURL = imageThumbURL;
    }
    public void setPrice(float price) {
        this.price = price;
    }
    public void setAddress(Address address) {
        this.address = address;
    }
    public void setContactInfo(SellerContactInfo contactInfo) {
        this.contactInfo = contactInfo;
    }    
    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }
    public void setNumberOfVotes(int numberOfVotes) {
        this.numberOfVotes = numberOfVotes;
    }
    
    @ManyToMany(mappedBy = "items")
    public Collection<Tag> getTags() {
        return tags;
    }
    public void setTags(Collection<Tag> tags) {
        this.tags=tags;
    }
    
    
    /*Business Methods
     **/
    public void addRating(int score){
        setTotalScore(getTotalScore() + score);
        setNumberOfVotes(getNumberOfVotes()+ 1);
    }
    public int checkAverageRating(){
        int average;
        if (getTotalScore() > 0) {
          average = getTotalScore()/getNumberOfVotes();
        } else {
          average = 0;
        }    
        return average;
    }
    
    public String tagsAsString() {
        StringBuffer sbTags=new StringBuffer();
        for(Tag tag : this.getTags()) {
            sbTags.append(tag.getTag());
            sbTags.append(" ");
        }
        return sbTags.toString().trim();
    }

    public boolean containsTag(String sxTag) {
        boolean bRet=false;
        for(Tag tag : getTags()) {
            if(tag.getTag().equals(sxTag)) {
                bRet=true;
                break;
            }
        }
        return bRet;
    }
}



