
package com.sun.javaee.blueprints.petstore.model;



public class Category {

    private String categoryId = null;
    private String categoryName = null;
    private String description = null;
    private String imageURL = null;


    private float price = 0.0F;
    private boolean onSale = false;  

    public Category(String categoryId,
                String categoryName,
                String description,
                String imageURL) {

        this.categoryId = categoryId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description =  description;
        this.imageURL = imageURL;
    }

    public String getId() {
        return this.categoryId;
    }
    

    public String getName() {
        return this.categoryName;
    }    

    public String getDescription() {
        return this.description;
    }

    public String getImageURL() {
        return imageURL;
    }

}



