/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: model.js,v 1.4 2005-11-28 07:33:20 gmurray71 Exp $
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

