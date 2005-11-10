/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: model.js,v 1.1 2005-11-10 12:06:36 gmurray71 Exp $
*/
function Category(id) {

    this.index = 0;
    
    this.length = 0;
    
    this.id = id;
    this.items = new Array();

    function Item(id,image,name,description,price){
      this.id = id;
      this.image = image;
      this.name = name;
      this.description = description;
      this.price = price;
    };

    
    this.addItem = function(id,image,name,description,price) {
        this.items[this.length++] = new Item(id,image,name,description,price);
    }
    
    this.getItem = function(index){
        return this.items[index];
    }
    
    this.getItemById = function(key){
        
        for (i=0; i < this.length; i++) {
            if (this.items[i].id == key) {
               return this.items[i];
            }
        }
        return null;
    }
}

function Cart() {

    this.index = 0;
    this.length = 0;
    
    this.items = new Array();

    function Item(id,image,name,description,price){
      this.id = id;
      this.image = image;
      this.name = name;
      this.description = description;
      this.price = price;
    };

    
    this.addItem = function(id,image,name,description,price) {
        this.items[this.length++] = new Item(id,image,name,description,price);
    }
    
    this.getTotal = function(index){
       var total = 0;
       for (i=0; i < this.length; i++) {
         total += Number(this.items[i].price);
      }
      return total;
    }
    
    this.empty = function(){
        this.items = new Array();
        this.length = 0;
    }
    
    this.getItem = function(index){
        return this.items[index];
    }
    
    this.removeItem = function(key) {
        for (i=0; i < this.length; i++) {
            if (this.items[i].id == key) {
               if (this.length == 1) this.items = new Array();
               else this.items.splice(i,1);
               this.length = this.items.length;
            }
        }
    }
}