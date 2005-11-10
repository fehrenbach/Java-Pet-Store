
package com.sun.javaee.blueprints.petstore.model;



public class Item {

    private String itemId = null;
    private String categoryId = null;
    private String itemName = null;
    private String description = null;
    private String imageURL = null;


    private float price = 0.0F;
    private boolean onSale = false;  

    public Item(String itemId,
                String categoryId,
                String itemName,
                String description,
                String imageURL,
                float price) {

        this.itemId = itemId;
        this.categoryId = categoryId;
        this.itemName = itemName;
        this.description =  description;
        this.imageURL = imageURL;
        this.price = price;
    }

    public String getId() {
        return this.itemId;
    }
    
    public String getCategoryId() {
        return categoryId;
    }

    public String getName() {
        return this.itemName;
    }    

    public String getDescription() {
        return this.description;
    }

    public float getPrice() {
       return this.price;
    }
    
    public String getImageURL() {
        return imageURL;
    }
    
    public String toString() {
        return "Item [id=" + itemId + ", name=" + itemName + ", description=" + description + "]"; 
    }

}



