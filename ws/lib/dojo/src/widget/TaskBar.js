/* Copyright (c) 2004-2005 The Dojo Foundation, Licensed under the Academic Free License version 2.1 or above */dojo.provide("dojo.widget.TaskBar");
dojo.provide("dojo.widget.TaskBarItem");
dojo.require("dojo.widget.Widget");

dojo.requireIf("html", "dojo.widget.html.TaskBar");


dojo.widget.TaskBar = function(){
	dojo.widget.Widget.call(this);

	this.widgetType = "TaskBar";
	this.isContainer = true;
}
dojo.inherits(dojo.widget.TaskBar, dojo.widget.Widget);
dojo.widget.tags.addParseTreeHandler("dojo:taskbar");

dojo.widget.TaskBarItem = function(){
	dojo.widget.Widget.call(this);

	this.widgetType = "TaskBarItem";
}
dojo.inherits(dojo.widget.TaskBarItem, dojo.widget.Widget);
dojo.widget.tags.addParseTreeHandler("dojo:taskbaritem");

