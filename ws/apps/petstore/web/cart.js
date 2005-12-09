function Cart() {

    this.index = 0;
    var itemCount = 0;
    
    items = new Array();

    function Item(id,image,name,description,price){
      this.id = id;
      this.image = image;
      this.name = name;
      this.description = description;
      this.price = price;
    };

    this.getTotal = function(){
       var total = 0;
       for (i=0; i < itemCount; i++) {
         total += Number(items[i].price);
      }
      return total;
    }
    
    this.empty = function(){
        items = new Array();
        itemCount = 0;
        this.showItems(0,0);
    }
    
    function getItem(index){
        return items[index];
    }
    
    function removeItem (key) {
        for (i=0; i < itemCount; i++) {
            if (items[i].id == key) {
               if (itemCount == 1) items = new Array();
               else items.splice(i,1);
               itemCount = items.length;
            }
        }
    }

this.init = function () {
    items = new Array();
    var cartPop = $("cart-popup");
    var dragme = new Dragable(cartPop, $("cartDragTarget"));
    var sW = 430;
    if (!isIE)  cartPop.style.left = (document.body.clientWidth - 228) + "px";
    else cartPop.style.left = (document.body.offsetWidth - 228) + "px";
    cartPop.style.top= "140px";

}

this.show = function() {
    var cartPop = $("cart-popup");
    if (cartPop.style.visibility !='visible') {
	    cartPop.style.visibility ='visible';
	}
    dojo.graphics.htmlEffects.fadeShow(cartPop, 1000);
}


this.hide = function() {
	var cartPop = $("cart-popup");
 		dojo.graphics.htmlEffects.fadeHide(cartPop, 1000);
}

this.removeItem = function(id) {
	var cartPop = $("cart-popup");
	if (cartPop.style.visibility !='visible') {
	    this.show();
    }
    removeItem(id);
    this.showItems(0,chunkSize);
    if (itemCount == 0) checkingOut = false;
}

 function addItem(id,image,name,description,price) {
    items[itemCount++] = new Item(id,image,name,description,price);
 }
 
 function displayItem(id,image,name,description,price) {
    checkingOut = true;
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
        plink.setAttribute("onClick", "cart.removeItem('" + id + "')");
        cell3.appendChild(plink);
        row.appendChild(cell3);
        bodyTable.appendChild(row);
    }
}

this.purchaseItem = function(catid,id) {
    var tcat = gcats.get(catid);
    var i = tcat.getItemById(id);
    addItem(i.id, i.image,i.name,i.description, i.price);
    this.showLastItems();
   	var cartPop = $("cart-popup");
   	if (cartPop.style.visibility =='hidden') {
	    this.show();
    }
}

this.showLastItems = function() {
    var startIndex = 0;
    if (itemCount >= chunkSize) startIndex = (itemCount- chunkSize);
    this.showItems(startIndex, chunkSize);
}

this.showItems = function(ci, count) {
    var bodyTable = $("cartBody");
    if (itemCount == 0) {
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
           var i = getItem(l);
           if (i) displayItem(i.id,i.image,i.name,i.description,i.price);
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
            link.setAttribute("onclick", "cart.showItems('" + prevIndex + "','" + chunkSize + "')");
            cell.appendChild(link);
            row.appendChild(cell);
        }
   }
        if (Number(itemCount) > (Number(ci) + Number(count)) ) {
            cell = document.createElement("td");
            cell.setAttribute("bgcolor", "white");
            cell.setAttribute("nowrap", "true");
            cell.setAttribute("valign", "top");
            cell.setAttribute("align", "right");
            var link = document.createElement("a");
            link.appendChild(document.createTextNode("Next"));
            link.className = "cartValueListNavigate";
            var nextCount = itemCount;
            if ((Number(ci) + Number(count) + Number(chunkSize)) > Number(itemCount)) {
                nextCount = Number(itemCount) - (Number(ci) + Number(count));
            }
            link.setAttribute("onclick", "cart.showItems('"  + (Number(ci) + chunkSize) + "','" + nextCount + "')");
            cell.appendChild(link);
            row.appendChild(cell);
        }
        
        bodyTable.appendChild(row);
        var cartTotal = $("cartTotal");
        cartTotal.innerHTML =  "$" + this.getTotal() + ".00";
        if (itemCount == 0) $("coItem").style.visibility='hidden';
        else $("coItem").style.visibility='visible';
	}
}
