/* Copyright 2005 Sun Microsystems, Inc. All rights reserved.
   You may not modify, use, reproduce, or distribute this software except in
   compliance with the terms of the License at:
   http://developer.sun.com/berkeley_license.html
$Id: slider.js,v 1.4 2005-12-06 17:53:09 gmurray71 Exp $
*/

var layerLeft=100;
var layerTop=10;
var layerWidth=130;
var layerHeight=90;
var pause=3000;
var speed= 65;
var paused = false;
var sliderOffset = 5;

var sliderItems = new Array();

function initItems() {
    sliderItems[0]= new SliderItem('pet-001', 'A Cat 1', 'Cat ', 'cat1.gif', "showSearchItem");
    sliderItems[1]= new SliderItem('pet-012', 'A Cat 2', 'Dog', 'dog1.gif', "showSearchItem");
    sliderItems[2]= new SliderItem('pet-013', 'A Cat 2', 'Dog', 'dog2.gif', "showSearchItem");
}

function SliderItem(id, name, description, image, handler){
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.handler = handler;
}

var scrollerbgcolor='#efefef';

// Right now, the array must have more than two images.
var nextImg = 2;
// Layer moving rate
var layerMoveRate = 6;

function setSliderItems(items){
    if (items) {
        for (loop=2;loop < items.length;loop++) {
          items[loop].handler = "showSearchItem";
          sliderItems[loop] = items[loop];
        }
    }
}

function stopSlider() {
    $("slider-popup").style.visibility = "hidden";
    paused = true;
    sliderStarted = false;
}


function slide(layerlocation){

  layerObj=eval(layerlocation)
  currentXpos = parseInt(layerObj.style.left);

  if ((currentXpos > 0) && (currentXpos <= layerMoveRate)) {
    // if the layer is close to the left, force it to the left and
    // start process 1) continue to go to the left, 2) start the next layer.
    // Note that the layer is moving per layerMoveRate.
    layerObj.style.left = 0;
    if (!paused)setTimeout("slide(layerObj)", pause);
    if (!paused)setTimeout("slideOther(l2)", pause);
    return;
  }
  if (currentXpos >= layerObj.offsetWidth*-1){
    // Move the layer per layerMoveRate from right to left.
    // untill the right side of the image is move beyond the layer offset.
    layerObj.style.left = parseInt(layerObj.style.left)-layerMoveRate;
    if (!paused) setTimeout("slide(layerObj)", speed);

  } else{
    // Set this layer's x position to the right side and fetch the next image.
    layerObj.style.left=layerWidth + sliderOffset;
    layerObj.innerHTML= getImage(sliderItems[nextImg]);
    if (nextImg==sliderItems.length-1)
      nextImg=0;
    else
      nextImg++;
  }
}

// This function is exactly the same as slide(), except the
// calling sequence of the slide*() functions recursively.
// Need to call these two functions in a toggle way.
function slideOther(layerLocation){
  otherLayer = eval(layerLocation);
  xpos2 = parseInt(otherLayer.style.left+ sliderOffset);

  if ((xpos2 > 0) && (xpos2 <= layerMoveRate)){
    otherLayer.style.left = 0;
    if (!paused)setTimeout("slideOther(otherLayer)",pause);
    if (!paused)setTimeout("slide(l1)",pause);
    return;
  }
  if (xpos2 >= layerObj.offsetWidth*-1){
    otherLayer.style.left = (parseInt(otherLayer.style.left)-layerMoveRate);
    if (!paused) setTimeout("slideOther(l2)", speed);

  } else{
    otherLayer.style.left=layerWidth + sliderOffset;
    otherLayer.innerHTML = getImage(sliderItems[nextImg]);
    if (nextImg==sliderItems.length-1)
      nextImg=0;
    else
      nextImg++;
  }
}

function startSlider(){
  paused = false;
  initItems();
  if (document.all) {
    l1 = layerOne;
    l2 = layerTwo;
  } else if (document.getElementById) {
    l1 = document.getElementById("layerOne");
    l2 = document.getElementById("layerTwo");
  }                                                                                      
  l1.innerHTML= getImage(sliderItems[0]);
  l2.innerHTML= getImage(sliderItems[1]);
  slide(l1, 0);
  // set next layer's x position to the "ready" position.
  l2.style.left = layerWidth + sliderOffset;
  sliderStarted = true;
}

function viewLarge(filepath) {
  var viewObj = document.getElementById("limg");
  viewObj.src = filepath;
}

function getImage(item) {
    if (item) return "<img onmouseover=\"javascript:this.style.cursor='pointer';\" src='images\\" + item.image + "' border='0' onClick=\"" + item.handler + "('" + item.id + "')\">";
    else return "";
}

function popupImage(path){
  var pObj = new Image();
  pObj.src = path;
  window.open(path,"pw","menubar=no,scrollbars=no,resizable=yes,width="+(pObj.width+20)+",height="+(pObj.height+30));
}



