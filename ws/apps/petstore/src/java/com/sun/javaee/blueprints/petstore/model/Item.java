package com.sun.javaee.blueprints.petstore.model;

import javax.persistence.*;

@Entity

public class Item implements java.io.Serializable {

    private String itemID;
    private String productID;
    private String name;
    private String description;
    private String imageURL;
    private float listPrice;
    private float unitCost;
    private Address address;
    private SellerContactInfo contactInfo;
      
    public Item() { }
    
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

    public float getListPrice() {
       return listPrice;
    }
    
    public float getUnitCost() {
       return unitCost;
    }
    
    public String getImageURL() {
        return imageURL;
    }
    
    @ManyToOne(cascade={CascadeType.PERSIST})
    public Address getAddress() {
        return address;
    }
    
    @ManyToOne(cascade={CascadeType.PERSIST})    
    public SellerContactInfo getContactInfo() {
        return contactInfo;
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
    public void setListPrice(float listPrice) {
        this.listPrice = listPrice;
    }
    public void setUnitCost(float unitCost) {
        this.unitCost = unitCost;
    }
    public void setAddress(Address address) {
        this.address = address;
    }
    public void setContactInfo(SellerContactInfo contactInfo) {
        this.contactInfo = contactInfo;
    }    
}



