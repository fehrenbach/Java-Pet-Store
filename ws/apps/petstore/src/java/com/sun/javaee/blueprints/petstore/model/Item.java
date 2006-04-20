package com.sun.javaee.blueprints.petstore.model;

import javax.persistence.*;

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
    
    @ManyToOne(cascade={CascadeType.PERSIST})
    public Address getAddress() {
        return address;
    }
    
    @ManyToOne(cascade={CascadeType.PERSIST})    
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
    
    /*Business Methods
     **/
    public void addRating(int score){
        setTotalScore(getTotalScore() + score);
        setNumberOfVotes(getNumberOfVotes()+ 1);
    }
}



