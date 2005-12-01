package com.sun.javaee.blueprints.petstore.model;

import javax.persistence.*;

@Entity
@Table(name="CATEGORY") 

public class PCategory implements java.io.Serializable {
    
    private String categoryID;
    private String name;
    private String description;
    private String imageURL;
    
    public PCategory() { }
    
    @Id
    public String getCategoryID() {
        return categoryID;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getImageURL() {
        return imageURL;
    }
    
    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }
    public void setCategoryID(String categoryID) {
        this.categoryID = categoryID;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    
}



