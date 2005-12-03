/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.FloatingPane");
dojo.provide("dojo.widget.HtmlFloatingPane");

//
// this widget provides a window-like floating pane
//
// TODO: instead of custom drag code, use HtmlDragMove.js in
// conjuction with DragHandle).  The only tricky part is the constraint 
// stuff (to keep the box within the container's boundaries)
//

dojo.require("dojo.widget.*");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.widget.HtmlLayoutPane");
dojo.require("dojo.widget.html.TaskBar");
dojo.require("dojo.widget.HtmlResizeHandle");

dojo.widget.HtmlFloatingPane = function(){
	dojo.widget.HtmlLayoutPane.call(this);
}

dojo.inherits(dojo.widget.HtmlFloatingPane, dojo.widget.HtmlLayoutPane);

dojo.lang.extend(dojo.widget.HtmlFloatingPane, {
	widgetType: "FloatingPane",

	// Constructor arguments
	hasShadow: false,
	title: 'Untitled',
	iconSrc: '',
	constrainToContainer: false,
	resizable: false,
	taskBarId: "taskbar",

	// If this pane's content is external then set the url here	
	url: "inline",
	extractContent: true,
	parseContent: true,
	
	isContainer: true,
	containerNode: null,
	domNode: null,
	clientPane: null,
	dragBar: null,
	dragOrigin: null,
	posOrigin: null,
	maxPosition: null,

	templatePath: dojo.uri.dojoUri("src/widget/templates/HtmlFloatingPane.html"),
	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlFloatingPane.css"),
	isDragging: false,

	fillInTemplate: function(args, frag){
		// add a drop shadow
		if ( this.hasShadow ) {
			this.shadow = document.createElement('div');
			dojo.html.addClass(this.shadow, "dojoDropShadow");
			dojo.style.setOpacity(this.shadow, 0.5);
			this.domNode.appendChild(this.shadow);
			dojo.html.disableSelection(this.shadow);
		}

		// this is our chrome
		this.dragBar.appendChild(document.createTextNode(this.title));
		dojo.html.disableSelection(this.dragBar);

		// copy style info from source node to generated node
		var sourceNodeRef = this.getFragNodeRef(frag);
		var targetNodeRef = this.domNode;
		dojo.lang.forEach(
			["top", "left", "bottom", "right", "width", "height", "display"],
			function(x) { targetNodeRef.style[x] = sourceNodeRef.style[x]; } );
		this.containerNode.style["overflow"] = sourceNodeRef.style["overflow"];
	},

	postCreate: function(args, fragment, parentComp){

		if ( this.resizable ) {
			// add the resize handle
			var rh = dojo.widget.fromScript("ResizeHandle", {targetElmId: this.widgetId});
			this.addChild(rh);
			
			// put resize handle is on outer div, not content div.  otherwise it appears
			// to the left of the scrollbar
			this.domNode.appendChild(rh.domNode);
		}

		// add myself to the taskbar after the taskbar has been initialized
		dojo.addOnLoad(this, "taskBarSetup");

		this.resizeSoon();
	},

	taskBarSetup: function() {
		var taskbar = dojo.widget.getWidgetById(this.taskBarId);
		if ( taskbar ) {
			this.toggle="explode";
			var tbi = dojo.widget.fromScript("TaskBarItem",
				{caption: this.title, iconSrc: this.iconSrc, task: this} );
			taskbar.addChild(tbi);
		}
	},

	onResized: function(){
		if ( !this.isVisible() ) { return; }

		var newHeight = dojo.style.getOuterHeight(this.domNode);
		var newWidth = dojo.style.getOuterWidth(this.domNode);
		
		if ( newWidth != this.outerWidth || newHeight != this.outerHeight ) {
			this.outerWidth = newWidth;
			this.outerHeight = newHeight;
	
			// split the available height between the dragBar and the content
			dojo.style.setOuterHeight(this.containerNode,
				dojo.style.getContentHeight(this.domNode) - dojo.style.getOuterHeight(this.dragBar));
			var contentWidth = dojo.style.getContentWidth(this.domNode);
			dojo.style.setOuterWidth(this.dragBar, contentWidth);
			dojo.style.setOuterWidth(this.containerNode, contentWidth);
		
			if ( this.shadow ) {
				dojo.style.setOuterWidth(this.shadow, newWidth);
				dojo.style.setOuterHeight(this.shadow, newHeight);
			}
		}

		dojo.widget.HtmlFloatingPane.superclass.onResized.call(this);
	},

	onMouseDown: function(e){
		if (this.isDragging){ return; }

		this.dragOrigin = {'x': e.clientX, 'y': e.clientY};
		
		// this doesn't work if (as in the test file) the user hasn't set top
		// 	this.posOrigin = {'x': dojo.style.getNumericStyle(this.domNode, 'left'), 'y': dojo.style.getNumericStyle(this.domNode, 'top')};
		this.posOrigin = {'x': this.domNode.offsetLeft, 'y': this.domNode.offsetTop};

		if (this.constrainToContainer){
			// TODO: this doesn't work with scrolled pages

			// get parent client size...

			if (this.domNode.parentNode.nodeName.toLowerCase() == 'body'){
				var parentClient = {
					'w': dojo.html.getViewportWidth(),
					'h': dojo.html.getViewportHeight()
				};
			}else{
				var parentClient = {
					'w': dojo.style.getInnerWidth(this.domNode.parentNode),
					'h': dojo.style.getInnerHeight(this.domNode.parentNode)
				};
			}

			this.maxPosition = {
				'x': parentClient.w - dojo.style.getOuterWidth(this.domNode),
				'y': parentClient.h - dojo.style.getOuterHeight(this.domNode)
			};
		}

		dojo.event.connect(document, 'onmousemove', this, 'onMyDragMove');
		dojo.event.connect(document, 'onmouseup', this, 'onMyDragEnd');

		this.isDragging = true;
	},

	onMyDragMove: function(e){
		var x = this.posOrigin.x + (e.clientX - this.dragOrigin.x);
		var y = this.posOrigin.y + (e.clientY - this.dragOrigin.y);

		if (this.constrainToContainer){
			if (x < 0){ x = 0; }
			if (y < 0){ y = 0; }
			if (x > this.maxPosition.x){ x = this.maxPosition.x; }
			if (y > this.maxPosition.y){ y = this.maxPosition.y; }
		}

		this.domNode.style.left = x + 'px';
		this.domNode.style.top  = y + 'px';
	},

	onMyDragEnd: function(e){
		dojo.event.disconnect(document, 'onmousemove', this, 'onMyDragMove');
		dojo.event.disconnect(document, 'onmouseup', this, 'onMyDragEnd');

		this.isDragging = false;
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:FloatingPane");
