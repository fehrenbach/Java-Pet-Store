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

function initCart() {
 var cartPop = $("cart-popup");
 if (!cart) {
    cart = new Cart();
    var dragme = new Dragable(cartPop);
    cartPop.style.top="140px";
    cartPop.style.left="500px";
 }
}

function hideCart() {
 var cartPop = $("cart-popup");
 cartPop.style.visibility='hidden';
}

function removeCartItem(id) {
    showCart();
    cart.removeItem(id);
    showCartItems(0,chunkSize);
}

function addCartItem(id,image,name,description,price) {
    var cell0;
    var cell1;
    var cell2;
    var cell3;
    
    var bodyTable = $("cartBody");
    var row;
    if (isIE) {
    } else {
        row = document.createElement("tr");
        row.setAttribute("bgcolor", "white");
        row.setAttribute("valign", "top");
        cell0 = document.createElement("td");
        var img = document.createElement("img");
        img.setAttribute("width", "25");
        img.setAttribute("height", "25");
        img.src = ("images\\" + image);
        cell0.appendChild(img);
        row.appendChild(cell0);
        cell1 = document.createElement("td");
        var dDiv = document.createTextNode(name);
        dDiv.className = "cartItemName";
        cell1.appendChild(dDiv);
        row.appendChild(cell1);
        cell2 = document.createElement("td");
        var dDiv2 = document.createTextNode( " $" + price + " ");
        cell2.appendChild(dDiv2);
        row.appendChild(cell2);
        cell3 = document.createElement("td");
        var plink = document.createElement("a");
        plink.appendChild(document.createTextNode("Remove"));
        plink.className = "removeItem";
        plink.setAttribute("onClick", "removeCartItem('" + id + "')");
        cell3.appendChild(plink);
        row.appendChild(cell3);
        bodyTable.appendChild(row);
    }
}


function purchaseItem(catid,id) {
    showCart();
    var tcat = gcats.get(catid);
    var i = tcat.getItemById(id);
    cart.addItem(i.id, i.image,i.name,i.description, i.price);
    showLastItems();
}

function showLastItems() {
    var startIndex = 0;
    if (cart.length >= chunkSize) startIndex = (cart.length- chunkSize);
    showCartItems(startIndex, chunkSize);
}

function showCartItems(ci, count) {
    var bodyTable = $("cartBody");

    if (cart.length == 0) {
        clearNodes("cartBody");

        if (isIE) {
          bodyTable.innerHTML = "<tr><td>No items</td></tr>";
        } else {
            var cell;
            var row;
            clearNodes("cartBody");
            row = document.createElement("tr");
            row.setAttribute("bgcolor", "white");
            cell = document.createElement("td");
            cell.setAttribute("bgcolor", "white");
            cell.setAttribute("nowrap", "true");
            cell.setAttribute("align", "center");
            var empty = document.createTextNode( "Empty.");
            empty.className = "cartItem";
            cell.appendChild(empty);
            row.appendChild(cell);
            bodyTable.appendChild(row);
        }
    } else {
        clearNodes("cartBody");
        var  loopLength = Number(ci) + Number(count);
        for (l = ci; l  < loopLength; l++) {
           var i = cart.getItem(l);
           if (i) addCartItem(i.id,i.image,i.name,i.description,i.price);
        }
        var cell;
        var row;
        // put the next and previous links
        row = document.createElement("tr");
        row.setAttribute("bgcolor", "white");

        if (ci > 0) {
            cell = document.createElement("td");
            cell.setAttribute("bgcolor", "white");
            cell.setAttribute("nowrap", "true");
            cell.setAttribute("valign", "top");
            cell.setAttribute("align", "left");
            var link = document.createElement("a");
            link.appendChild(document.createTextNode("Previous"));
            link.className = "cartValueListNavigate";
            var prevIndex =  (Number(ci) - chunkSize);
            if ((Number(ci)  - Number(chunkSize)) < 0) {
               prevIndex = 0;
            }
            link.setAttribute("onclick", "showCartItems('" + prevIndex + "','" + chunkSize + "')");
            cell.appendChild(link);
            row.appendChild(cell);
        }

        }
        if (Number(cart.length) > (Number(ci) + Number(count)) ) {
            cell = document.createElement("td");
            cell.setAttribute("bgcolor", "white");
            cell.setAttribute("nowrap", "true");
            cell.setAttribute("valign", "top");
            cell.setAttribute("align", "right");
            var link = document.createElement("a");
            link.appendChild(document.createTextNode("Next"));
            link.className = "cartValueListNavigate";
            var nextCount = count;
            if ((Number(ci) + Number(count) + Number(chunkSize)) > Number(cart.length)) {
                nextCount = Number(cart.length) - (Number(ci) + Number(count));
            }
            
            link.setAttribute("onclick", "showCartItems('"  + (Number(ci) + chunkSize) + "','" + nextCount + "')");
            cell.appendChild(link);
            row.appendChild(cell);
        }
        
        bodyTable.appendChild(row);
        var cartTotal = $("cartTotal");
        cartTotal.innerHTML =  "$" + cart.getTotal();
        if (cart.length == 0) $("coItem").style.visibility='hidden';
        else $("coItem").style.visibility='visible';
}
