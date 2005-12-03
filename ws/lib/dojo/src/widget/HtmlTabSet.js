/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.HtmlTabSet");
dojo.provide("dojo.widget.HtmlTab");

dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlLayoutPane");
dojo.require("dojo.event.*");
dojo.require("dojo.html");
dojo.require("dojo.style");

//////////////////////////////////////////
// TabSet -- a set of Tabs
//////////////////////////////////////////
dojo.widget.HtmlTabSet = function() {
	dojo.widget.HtmlLayoutPane.call(this);
}
dojo.inherits(dojo.widget.HtmlTabSet, dojo.widget.HtmlLayoutPane);

dojo.lang.extend(dojo.widget.HtmlTabSet, {

	widgetType: "TabSet",

	labelPosition: "top",

	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlTabSet.css"),

	selectedTab: "",		// currently selected tab's widgetId, later widget

	fillInTemplate: function(args, frag) {
		dojo.widget.HtmlTabSet.superclass.fillInTemplate.call(this, args, frag);
		
		// TODO: prevent multiple includes of the same CSS file, when there are multiple
		// TabSets on the same screen.
		dojo.style.insertCssFile(this.templateCssPath);

		// Create panel to hold the tab labels (as a <ul> with special formatting)
		// TODO: set "bottom" css tag if label is on bottom
		this.filterAllowed('labelPosition', ['top', 'bottom']);
		this.labelPanel = dojo.widget.fromScript("LayoutPane", {layoutAlign: this.labelPosition});
		this.ul = document.createElement("ul");
		dojo.html.addClass(this.ul, "tabs");
		dojo.html.addClass(this.ul, this.labelPosition);
		this.labelPanel.domNode.appendChild(this.ul);
		this.addPane(this.labelPanel);
	},

	registerChild: function(child, insertionIndex){
		// registerChild will be called for each tab, and also for the
		// top pane (layoutAlign="top") that holds all the tab labels

		dojo.widget.HtmlTabSet.superclass.registerChild.call(this, child, insertionIndex);

		if ( child.widgetType == "Tab" ){
			this.ul.appendChild(child.li);
	
			if (this.selectedTab==child.widgetId ||
					child.selected) {
				this.onSelected(child);
			}
		}
	},

	onSelected: function(tab) {
		// Deselect old tab and select new one
		if (this.selectedTab && this.selectedTab.widgetId) {
			this.selectedTab.hide();
		}
		tab.show();
		this.selectedTab = tab;		// becomes widget rather than string
	},
	
	onResized: function() {
		// If none of the tabs were specified as selected, catch that here
		// and just select the first one
		if ( !this.selectedTab.widgetId ) {
			this.onSelected(this.children[0]);
		}
		dojo.widget.HtmlTabSet.superclass.onResized.call(this);
	}
});
dojo.widget.tags.addParseTreeHandler("dojo:TabSet");

//////////////////////////////////////////////////////
// Tab - a single tab
//////////////////////////////////////////////////////
dojo.widget.HtmlTab = function() {
	dojo.widget.HtmlLayoutPane.call(this);
}
dojo.inherits(dojo.widget.HtmlTab, dojo.widget.HtmlLayoutPane);

dojo.lang.extend(dojo.widget.HtmlTab, {
	widgetType: "Tab",
	
	label: "",
	url: "inline",
	handler: "none",
	selected: false,	// is this tab currently selected?
	
	fillInTemplate: function(args, frag) {
		this.layoutAlign = "client";
		dojo.widget.HtmlTab.superclass.fillInTemplate.call(this, args, frag);
		dojo.html.prependClass(this.domNode, "dojoTabPanel");
		this.domNode.style.display="none";

		// Create label
		this.li = document.createElement("li");
		var span = document.createElement("span");
		span.innerHTML = this.label;
		this.li.appendChild(span);
		dojo.event.connect(this.li, "onclick", this, "onSelected");
	},
	
	onSelected: function() {
		this.parent.onSelected(this);
	},
	
	show: function() {
		dojo.html.addClass(this.li, "current");
		this.selected=true;
		dojo.widget.HtmlTab.superclass.show.call(this);
	},

	hide: function() {
		dojo.html.removeClass(this.li, "current");
		this.selected=false;
		dojo.widget.HtmlTab.superclass.hide.call(this);
	}	
});
dojo.widget.tags.addParseTreeHandler("dojo:Tab");

