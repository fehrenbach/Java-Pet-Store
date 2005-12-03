/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.html");
dojo.require("dojo.string");

dojo.widget.HtmlWidget = function(args){
	// mixin inheritance
	dojo.widget.DomWidget.call(this);
}

dojo.inherits(dojo.widget.HtmlWidget, dojo.widget.DomWidget);

dojo.lang.extend(dojo.widget.HtmlWidget, {
	templateCssPath: null,
	templatePath: null,
	allowResizeX: true,
	allowResizeY: true,

	resizeGhost: null,
	initialResizeCoords: null,
	// this.templateString = null;

	// for displaying/hiding widget
	toggle: "plain",
	toggleDuration: 150,

	initialize: function(args, frag){
	},

	postMixInProperties: function(args, frag){
		// now that we know the setting for toggle, define show()&hide()
		dojo.lang.mixin(this,
			dojo.widget.HtmlWidget.Toggle[dojo.string.capitalize(this.toggle)] ||
			dojo.widget.HtmlWidget.Toggle.Plain);
	},

	getContainerHeight: function(){
		// NOTE: container height must be returned as the INNER height
		dj_unimplemented("dojo.widget.HtmlWidget.getContainerHeight");
	},

	getContainerWidth: function(){
		return this.parent.domNode.offsetWidth;
	},

	setNativeHeight: function(height){
		var ch = this.getContainerHeight();
	},

	startResize: function(coords){
		// get the left and top offset of our dom node
		coords.offsetLeft = dojo.html.totalOffsetLeft(this.domNode);
		coords.offsetTop = dojo.html.totalOffsetTop(this.domNode);
		coords.innerWidth = dojo.html.getInnerWidth(this.domNode);
		coords.innerHeight = dojo.html.getInnerHeight(this.domNode);
		if(!this.resizeGhost){
			this.resizeGhost = document.createElement("div");
			var rg = this.resizeGhost;
			rg.style.position = "absolute";
			rg.style.backgroundColor = "white";
			rg.style.border = "1px solid black";
			dojo.html.setOpacity(rg, 0.3);
			dojo.html.body().appendChild(rg);
		}
		with(this.resizeGhost.style){
			left = coords.offsetLeft + "px";
			top = coords.offsetTop + "px";
		}
		this.initialResizeCoords = coords;
		this.resizeGhost.style.display = "";
		this.updateResize(coords, true);
	},

	updateResize: function(coords, override){
		var dx = coords.x-this.initialResizeCoords.x;
		var dy = coords.y-this.initialResizeCoords.y;
		with(this.resizeGhost.style){
			if((this.allowResizeX)||(override)){
				width = this.initialResizeCoords.innerWidth + dx + "px";
			}
			if((this.allowResizeY)||(override)){
				height = this.initialResizeCoords.innerHeight + dy + "px";
			}
		}
	},

	endResize: function(coords){
		// FIXME: need to actually change the size of the widget!
		var dx = coords.x-this.initialResizeCoords.x;
		var dy = coords.y-this.initialResizeCoords.y;
		with(this.domNode.style){
			if(this.allowResizeX){
				width = this.initialResizeCoords.innerWidth + dx + "px";
			}
			if(this.allowResizeY){
				height = this.initialResizeCoords.innerHeight + dy + "px";
			}
		}
		this.resizeGhost.style.display = "none";
	},


	createNodesFromText: function(txt, wrap){
		return dojo.html.createNodesFromText(txt, wrap);
	},

	_old_buildFromTemplate: dojo.widget.DomWidget.prototype.buildFromTemplate,

	buildFromTemplate: function(args, frag){
		dojo.widget.buildFromTemplate(this);
		this._old_buildFromTemplate(args, frag);
	},

	destroyRendering: function(finalize){
		try{
			var tempNode = this.domNode.parentNode.removeChild(this.domNode);
			if(!finalize){
				dojo.event.browser.clean(tempNode);
			}
			delete tempNode;
		}catch(e){ /* squelch! */ }
	},

	// Displaying/hiding the widget

	isVisible: function(){
		return dojo.html.isVisible(this.domNode);
	},
	doToggle: function(){
		this.isVisible() ? this.hide() : this.show();
	},
	show: function(){
		this.showMe();
	},
	hide: function(){
		this.hideMe();
	}		
});


/**** 
	Strategies for displaying/hiding widget
*****/

dojo.widget.HtmlWidget.Toggle={}

dojo.widget.HtmlWidget.Toggle.Plain = {
	showMe: function(){
		dojo.html.show(this.domNode);
	},

	hideMe: function(){
		dojo.html.hide(this.domNode);
	}
}

dojo.widget.HtmlWidget.Toggle.Fade = {
	showMe: function(){
		dojo.fx.html.fadeShow(this.domNode, this.toggleDuration);
	},

	hideMe: function(){
		dojo.fx.html.fadeHide(this.domNode, this.toggleDuration);
	}
}

dojo.widget.HtmlWidget.Toggle.Wipe = {
	showMe: function(){
		dojo.fx.html.wipeIn(this.domNode, this.toggleDuration);
	},

	hideMe: function(){
		dojo.fx.html.wipeOut(this.domNode, this.toggleDuration);
	}
}

dojo.widget.HtmlWidget.Toggle.Explode = {
	showMe: function(){
		dojo.fx.html.explode(this.explodeSrc, this.domNode, this.toggleDuration);
	},

	hideMe: function(){
		dojo.fx.html.implode(this.domNode, this.explodeSrc, this.toggleDuration);
	}
}
