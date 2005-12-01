package com.sun.javaee.blueprints.petstore.model;

import javax.persistence.*;

@Entity
@Table(name="ITEM") 

public class Item {

    private String itemID;
    private String productID;
    private String name;
    private String description;
    private String imageURL;
    private float listPrice;
    private float unitCost;

    public Item(String itemID,
                String productID,
                String name,
                String description,
                String imageURL,
                float listPrice,
                float unitCost) {

        this.itemID = itemID;
        this.productID = productID;
        this.name = name;
        this.description =  description;
        this.imageURL = imageURL;
        this.listPrice = listPrice;
        this.unitCost = unitCost;
    }
    
    public Item() { }
    
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

}



