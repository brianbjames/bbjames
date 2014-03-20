/*	
.      .


  .      .
DashboardCollider Version 1.1
      .     .                                          .     .
http://www.bbjames.com
        .    .                                       .    .     
admin@bbjames.com, bjames@mills.com, brian.james@apple.com      
            .   .                                  .   .    
Copyright(C)2007 Brian B. James 
                .  .                            .  .
Some code (C)2005 Apple Computer, Inc.       . .
                         ..               ..
This widget is freeware            .
*/

function load()
{
}

function openSC() {
	if (window.widget) {
		var out = widget.system("/usr/bin/osascript openApp.scpt", postResults);
	}
}

function openSCHelp() {
	if (window.widget) {
		var out = widget.system("/usr/bin/osascript help.scpt", postResults);
	}
}

function term() {
	if (window.widget) {
		var out = widget.system("/usr/bin/osascript killallYES.scpt", postResults);
	}
}

function postResults()
{
}

function connect()
{
     widget.openURL("http://www.bbjames.com");
}

function connectDownloads()
{
     widget.openURL("http://www.bbjames.com/downloads.html");
}

function connectAS()
{
     widget.openURL("http://www.audiosynth.com/");
}

function connectSwiki()
{
     widget.openURL("http://swiki.hfbk-hamburg.de:8888/MusicTechnology/6");
}

function connectUA()
{
     widget.openURL("http://www.create.ucsb.edu/pipermail/sc-users/");
}

function connectSF()
{
     widget.openURL("http://supercollider.sourceforge.net/");
}

function connectRM()
{
     widget.openURL("http://sced.berlios.de/reference/html/index.xml");
}

function connectF()
{
     widget.openURL("http://www.newscores.com/scforum/");
}

function connectUML()
{
     widget.openURL("http://www.create.ucsb.edu/mailman/listinfo/sc-users");
}
////////////////////////
// possibly add:
// javascript:void(str=prompt(%22Search sc-users for:%22,%22%22));if(str){location.href=%22http://www.google.com/search?hl=en&lr=&safe=off&btnG=Search&hq=site%3Ahttp%3A%2F%2Fwww.create.ucsb.edu/pipermail/sc-users&q=%22+escape (str).split(%22%20%22).join(%22+%22);}

function remove()
{
	// your widget has just been removed from the layer
	// remove any preferences as needed
	// widget.setPreferenceForKey(null, "your-key");
}

function hide()
{
	// your widget has just been hidden stop any timers to
	// prevent cpu usage
}

function show()
{
	// your widget has just been shown.  restart any timers
	// and adjust your interface as needed
}

function showBack(event)
{
	// your widget needs to show the back

	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
		widget.prepareForTransition("ToBack");

	front.style.display="none";
	back.style.display="block";
	
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

function showFront(event)
{
	// your widget needs to show the front

	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
		widget.prepareForTransition("ToFront");

	front.style.display="block";
	back.style.display="none";
	
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

if (window.widget)
{
	widget.onremove = remove;
	widget.onhide = hide;
	widget.onshow = show;
}
function buttonmousedown()
{                            
	var button = document.getElementById("button40");                            
	document.addEventListener("mouseup", buttonmouseup, true);                            
	button.parentNode.addEventListener("mouseover", buttonmouseover, true);                            
	button.parentNode.addEventListener("mouseout", buttonmouseout, true);                            
	document.mousedownonbutton = true;                            
	button.src="Images/buttonpressed.png";                            
	event.stopPropagation();                            
	event.preventDefault();                            
}
function buttonmouseup() 
{                            
	var button = document.getElementById("button40");                            
	document.removeEventListener("mouseup", buttonmouseup, true);                            
	button.parentNode.removeEventListener("mouseover", buttonmouseover, true);                            
	button.parentNode.removeEventListener("mouseout", buttonmouseout, true);                            
	document.mousedownonbutton = false;                            
	button.src="Images/button.png";                            
	event.stopPropagation();                            
	event.preventDefault();                            
}
function buttonmouseover() 
{                            
	var button = document.getElementById("button40");                            
	document.mousedownonbutton = true;                            
	button.src="Images/buttonpressed.png";                            
	event.stopPropagation();                            
	event.preventDefault();                            
}
function buttonmouseout() 
{                            
	var button = document.getElementById("button40");                            
	document.mousedownonbutton = true;                            
	button.src="Images/button.png";                            
	event.stopPropagation();                            
	event.preventDefault();                            
}