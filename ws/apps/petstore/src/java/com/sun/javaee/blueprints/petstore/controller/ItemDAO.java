
package com.sun.javaee.blueprints.petstore.controller;

import com.sun.javaee.blueprints.petstore.model.*;

import java.sql.*;
import javax.sql.*;
import javax.naming.*;
import java.util.*;

public class ItemDAO {

  Connection con;

  private boolean conFree = true;



  public ItemDAO (DataSource ds) {
      try  {               
          con =  ds.getConnection();     
      } catch (Exception ex) {
          throw new RuntimeException("Couldn't open connection to database: " + ex.getMessage());
      }
  }
  
  public void destroy () {
      try {
          con.close();
      } catch (SQLException ex) {
          System.out.println(ex.getMessage());
      }
  }
  
  protected synchronized Connection getConnection() {
      while (conFree == false) {
          try {
              wait();
          } catch (InterruptedException e) {
          }
      }
      conFree = false;
      notify();
      return con;
  }
  
    protected synchronized void releaseConnection() {
        while (conFree == true) {
            try {
               wait();
            } catch (InterruptedException e) {
            }
         }
         conFree = true;
         notify();
   }


  public ArrayList doSearch(String searchString) {
    ArrayList items = new ArrayList();
    PreparedStatement prepStmt = null;
    try {

      String selectStatement = "select productid, products.categoryid, name, description, imageurl, price " + "from products where (name like ? or description like ?)";
      getConnection();
      prepStmt = con.prepareStatement(selectStatement);
      prepStmt.setString(1, "%" + searchString + "%");
      prepStmt.setString(2, "%" + searchString + "%");
      ResultSet rs = prepStmt.executeQuery();
      while (rs.next()) {
        Item item = new Item(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4), rs.getString(5), rs.getFloat(6));
        items.add(item);
      }
    } catch (SQLException ex) {
      System.out.println("ItemDAO caught: " + ex);
    } finally {
        try {
            prepStmt.close();
        } catch (java.sql.SQLException sqx) {}
        releaseConnection();
    }
    return items;
  }

  public ArrayList getItems(String categoryId) {
    ArrayList items = new ArrayList();
    PreparedStatement prepStmt = null;
    try {

      String selectStatement = "select productid, name, description, imageurl, price " + "from products where categoryid = ?";
      getConnection();
      prepStmt = con.prepareStatement(selectStatement);
      prepStmt.setString(1, categoryId);
      ResultSet rs = prepStmt.executeQuery();
      while (rs.next()) {
        Item item = new Item(rs.getString(1), categoryId, rs.getString(2), rs.getString(3), rs.getString(4), rs.getFloat(5));
        items.add(item);
      }
    } catch (SQLException ex) {
      System.out.println("ItemDAO caught: " + ex);
    } finally { 
        try {
            prepStmt.close();
        } catch (java.sql.SQLException sqx) {}
        releaseConnection();
    }
    return items;

  }
  
  public ArrayList getCategories() {
    ArrayList categories = new ArrayList();
    PreparedStatement prepStmt = null;
    try {

      String selectStatement = "select categoryid, name, description, imageurl from category";
      getConnection();
      prepStmt = con.prepareStatement(selectStatement);
      ResultSet rs = prepStmt.executeQuery();
      while (rs.next()) {
        Category cat = new Category(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4));
        categories.add(cat);
      }
    } catch (SQLException ex) {
      System.out.println("ItemDAO caught: " + ex);
    } finally {
        try {
            prepStmt.close();
        } catch (java.sql.SQLException sqx) {}
        releaseConnection();
    }
    return categories;

  }

  public Item getItem(String itemId) {
    PreparedStatement prepStmt = null;
    try {
      String selectStatement = "select productid, categoryid, name, description, imageurl, price " + "from products where productid = ? ";
      getConnection();
      prepStmt = con.prepareStatement(selectStatement);
      prepStmt.setString(1, itemId);
      ResultSet rs = prepStmt.executeQuery();
      if (rs.next()) {
        Item item = new Item(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4),   rs.getString(5), rs.getFloat(6));
        return item;
      }
    } catch (SQLException ex) {
       System.out.println(ex);
       ex.printStackTrace();
    } finally {
        try {
            prepStmt.close();
        } catch (java.sql.SQLException sqx) {}
        releaseConnection();
    }
    return null;
  }

}

