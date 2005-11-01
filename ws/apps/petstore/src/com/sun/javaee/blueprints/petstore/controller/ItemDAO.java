
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
          //Context initCtx = new InitialContext();
          //Context envCtx = (Context) initCtx.lookup("java:comp/env");
          //DataSource ds = (DataSource) envCtx.lookup("jdbc/PetstoreDB");
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



  public ArrayList getItems(String categoryId) {
    ArrayList items = new ArrayList();
    try {

      String selectStatement = "select productid, name, description, imageurl, price " + "from products where categoryid = ?";
      getConnection();
      PreparedStatement prepStmt = con.prepareStatement(selectStatement);
      prepStmt.setString(1, categoryId);
      System.out.println("*** Statement==" + prepStmt);
      ResultSet rs = prepStmt.executeQuery();
      while (rs.next()) {
        Item item = new Item(rs.getString(1), categoryId, rs.getString(2), rs.getString(3), rs.getString(4), rs.getFloat(5));
        items.add(item);
      }
      prepStmt.close();
    } catch (SQLException ex) {
      System.out.println("ItemDAO caught: " + ex);
    }
	releaseConnection();
    return items;

  }
  
  public ArrayList getCategories() {
    ArrayList categories = new ArrayList();
    try {

      String selectStatement = "select categoryid, name, description, imageurl from category";
      getConnection();
      PreparedStatement prepStmt = con.prepareStatement(selectStatement);
      ResultSet rs = prepStmt.executeQuery();
      while (rs.next()) {
        Category cat = new Category(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4));
        categories.add(cat);
      }
      prepStmt.close();
    } catch (SQLException ex) {
      System.out.println("ItemDAO caught: " + ex);
    }
	releaseConnection();
    return categories;

  }

  public Item getItem(String itemId) {
    try {
      String selectStatement = "select productid, categoryid, name, description, imageurl, price " + "from products where id = ? ";
      getConnection();
      PreparedStatement prepStmt = con.prepareStatement(selectStatement);
      prepStmt.setString(1, itemId);
      ResultSet rs = prepStmt.executeQuery();
      if (rs.next()) {
        Item item = new Item(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4),   rs.getString(5), rs.getFloat(6));
        prepStmt.close();
        releaseConnection();                
        return item;
      } else {          
        prepStmt.close();
        releaseConnection();
      }
    } catch (SQLException ex) {
      releaseConnection();
    }
    return null;
  }

}

