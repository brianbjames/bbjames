var DEBUG_LEVEL = 10;

var initKeyPrefix       = "apple-init-";
var countdownTargetKey  = "countdownTarget";
var showLeadingZerosKey = "showLeadingZeros";
var blinkColonsKey      = "blinkSeparators";
var reachedActionIndexKey       = "reachedActionIndex";
var doActionKey         = "doAction";
var zeroActionKey		= "zeroAction";
var iCalURLKey          = "ical-url";

// Constants (we hope)
var msPerSecond = 1000;
var sPerMinute  = 60;
var sPerHour    = 60 * sPerMinute;
var sPerDay     = 24 * sPerHour;

// Properties set by attributes panel
var countdownTarget;
var wantLeadingZeros;
var wantBlinkingColons;
var wantStopAtZero;
var doAction;
var zeroAction;
var iCalURL;

// JavaScript interval timer
var updateTimerDisplayInterval;

// Clock registers
var currentTime;
var remainingSeconds;
var remainingTime = new Array(4);
var iCalendar;

// Flag for whether we've reached/passed the target time
var isTargetReached = false;

function dprint(level, str) {
    if (level <= DEBUG_LEVEL) {
        alert(str);
    }
}

function load()
{
	// Localize text
	var localizedElements = { "label-days":    "DAYS",
							  "label-hours":   "HOURS",
							  "label-minutes": "MIN",
							  "label-seconds": "SEC" };
	for (var anElement in localizedElements) {
		setElementText(anElement, getLocalizedString(localizedElements[anElement]));
	}

	// Get the properties
	wantLeadingZeros   = getPropertyFromHTML(showLeadingZerosKey) == 1;
	wantBlinkingColons = getPropertyFromHTML(blinkColonsKey) == 1;
	wantStopAtZero     = getPropertyFromHTML(reachedActionIndexKey) == 0;
	doAction           = getPropertyFromHTML(doActionKey) == 1;
	zeroAction		   = getPropertyFromHTML(zeroActionKey);
	iCalURL			   = getPropertyFromHTML(iCalURLKey);
	setCountdownTarget({ eventTime: new Date(getPropertyFromHTML(countdownTargetKey)),
						 eventLabel: null });

	// Make sure the alarm will run if necessary
	isTargetReached = false;
	
	// If we're using remote events, load them and use the callback to start the timer
	if (iCalURL != null && iCalURL.length > 0) {
		loadRemoteiCalEvents(startDisplayUpdateTimer);
	}
	else {
		// Otherwise, just start the timer now
		startDisplayUpdateTimer();
	}
}

function loadRemoteiCalEvents(callback)
{
	var xml_request = new XMLHttpRequest();
	xml_request.open("GET", iCalURL, true);
	
	xml_request.onreadystatechange = function () {
		if (xml_request.readyState == 4) {
			iCalendar = (new ICSParser()).parse(xml_request.responseText);
			setNextCountdownTarget();
			// Fire the callback event, if necessary
			if (callback != null) {
				callback();
			}
		}
	};
	
	xml_request.send(null);
}

// Set the timer
function setCountdownTarget(countdownEvent)
{
	countdownTarget = countdownEvent;
	if (countdownEvent.eventLabel != null) {
		setEventLabel(countdownEvent.eventLabel);
	}
}

// Find the next event in the event list and set the timer
function setNextCountdownTarget()
{
	updateCurrentTime();

	var nextEvent;
    if (iCalendar != null) {
        nextEvent = iCalendar[0].nextEvent();
    }
	
	if (nextEvent != null) {
		setCountdownTarget({ eventTime: nextEvent.nextOccurrence, eventLabel: nextEvent.summary });
		isTargetReached = false;
	}
}

function setEventLabel(label) {
	var formatString = getLocalizedString("Countdown to");
	var labelString = formatString.replace("%s", label);
	document.getElementById("event-label").innerHTML = labelString;
}

// Install the interval timer
function startDisplayUpdateTimer()
{
	updateTimerDisplay();

	if (!updateTimerDisplayInterval)
		updateTimerDisplayInterval = setInterval(updateTimerDisplay, 1000);
}

// Remove the interval timer
function stopDisplayUpdateTimer()
{
	if (updateTimerDisplayInterval) {
		clearInterval(updateTimerDisplayInterval);
		updateTimerDisplayInterval = null;
	}
}

// Calculate and display the time
function updateTimerDisplay()
{
	calculateRemainingTime();
	
	setElementText("remaining-days",    remainingTime[0]);
	setElementText("remaining-hours",   formatTwoDigits(remainingTime[1]));
	setElementText("remaining-minutes", formatTwoDigits(remainingTime[2]));
	setElementText("remaining-seconds", formatTwoDigits(remainingTime[3]));

	var isVisible = true;
	if (wantBlinkingColons) {
		var isVisible = Math.floor(currentTime / 1000) % 2 ? "hidden" : "visible";
	}
	var colonDiv = document.getElementById("timer-colons");
	if (colonDiv)
		colonDiv.style.visibility = isVisible;

	// Check for alarm
	if (remainingSeconds <= 0) {
		// We're there
		if (isTargetReached == false) {
			// Just once
			isTargetReached = true;
			// Call the alarm hook
			if (doAction && zeroAction != null) {
				try {
					eval(zeroAction);
				}
				catch (exception) {
					alert(exception);
				}
			}
			// Start countdown to the next event
			setNextCountdownTarget();
		}
	}
}

// Set the contents of an HTML div
function setElementText(elementName, elementValue)
{
	var element = document.getElementById(elementName);
	if (element) {
		element.innerText = elementValue;
	}
}

// Format a number as one or two digits
function formatTwoDigits(aNumber)
{
	var digits = aNumber.toString(10);

	// Add a leading zero if it's only one digit long
	if (wantLeadingZeros && digits.length == 1) {
		digits = "0" + digits;
	}
	
	return digits;
}

// Retrieve the contents of an HTML div
function getPropertyFromHTML(propertyKey)
{
	var element = document.getElementById(initKeyPrefix + propertyKey);
	if (element) {
		return trim(element.innerHTML);
	}
	else {
		// XXX maybe an exception; is nonexistence an error?
		return null;
	}
}

// Store the current time in the clock's internal state
function updateCurrentTime()
{
	currentTime = new Date();
}

// Returns [days, hours, minutes, seconds]
function calculateRemainingTime()
{
	// Start by getting the current date
	updateCurrentTime();
	// Clear excessive precision
	currentTime.setMilliseconds(0);

	// Number of seconds between now and target
	remainingSeconds = Math.floor((countdownTarget.eventTime.getTime() - currentTime.getTime()) / msPerSecond);
	if (remainingSeconds <= 0) {
		if (wantStopAtZero) {
			remainingSeconds = 0;
		}
		else {
			remainingSeconds = Math.abs(remainingSeconds);
		}
	}
	
	// Calculate days
	var remainingDays = Math.floor(remainingSeconds / sPerDay);
	// And take remainder
    var leftoverSeconds = remainingSeconds - remainingDays * sPerDay;
    // Same for hours, minutes, and seconds
	var remainingHours = Math.floor(leftoverSeconds / sPerHour);
    leftoverSeconds -= remainingHours * sPerHour;
	var remainingMinutes = Math.floor(leftoverSeconds / sPerMinute);
    leftoverSeconds -= remainingMinutes * sPerMinute;

	remainingTime[0] = remainingDays;
	remainingTime[1] = remainingHours;
	remainingTime[2] = remainingMinutes;
	remainingTime[3] = leftoverSeconds;
}

function remove()
{
	// your widget has just been removed from the layer
	// remove any preferences as needed
	// widget.setPreferenceForKey(null, "your-key");
	// stopDisplayUpdateTimer();
}

function hide()
{
	// your widget has just been hidden stop any timers to
	// prevent cpu usage
	// stopDisplayUpdateTimer();
}

function show()
{
	// your widget has just been shown.  restart any timers
	// and adjust your interface as needed
	//startDisplayUpdateTimer();
}

function showBack(event)
{
	// your widget needs to show the back

	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
		widget.prepareForTransition("ToBack");

	// stopDisplayUpdateTimer();

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

	//startDisplayUpdateTimer();
	
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

if (window.widget)
{
	widget.onremove = remove;
	widget.onhide = hide;
	widget.onshow = show;
}

function doubleClickTimer(event) 
{
	if (event.altKey) {
		// loadDemoEventList();
	}
}
