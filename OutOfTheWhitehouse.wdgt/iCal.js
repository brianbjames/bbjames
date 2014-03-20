/* iCalendar */

function ICalendar (icsBlock)
{
	this.ics = icsBlock;
	this.timeZones = this.loadComponentObjects("vtimezone", "tzid", ICalTimeZone);

	this.events = new Array();
	var vevents = this.ics["vevent"];
	if (vevents != null) {
		for (var i = 0; i < vevents.length; i++) {
			var event = new ICalEvent(vevents[i]);

			// Only care if the event has a start time
			if (event.ics.dtstart != null) {
				var dtstart = event.ics.dtstart[0];

				// Find time zone if necessary
				var tzid = dtstart.params["tzid"];
				var tz = null;
				if (tzid != null) {
					tz = this.timeZones[tzid];
					if (tz == null) {
						throw new Error("No timezone data for " + tzid);
					}
				}

				event.start = new ICalDateTime(dtstart.value, tz);
				this.events.push(event);
			}
		}
	}
}

ICalendar.prototype.loadComponentObjects = function (componentName, key, constructor)
{
	var components = new Object();

	var blocks = this.ics[componentName];
	if (blocks != null) {
		for (var i = 0; i < blocks.length; i++) {
			var component = new constructor(blocks[i]);
			components[component[key]] = component;
		}
	}
	
	return components;
}

ICalendar.prototype.nextEvent = function ()
{
	// Generatet the next occurrence of each event
	var event_list = new Array();
	
	for (var i = 0; i < this.events.length; i++) {
		var next_ts = this.events[i].updateNextOccurrence();
		if (next_ts != null) {
			event_list.push({ ts: next_ts, event: this.events[i] });
		}
	}
	
	event_list.sort(function (a, b) { return a.ts.getTime() - b.ts.getTime(); });

	if (event_list.length > 0) {
		return event_list[0].event;
	}
	else {
		return null;
	}
}

/* ICalDateBase */

function ICalDateBase ()
{

}

ICalDateBase.prototype.parseDTValue = function (date_time)
{
	delete this.jsDate;

	var match;
	if ((match = date_time.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z?))?$/i)) == null) {
		throw new Error("Invalid date-time: " + date_time);
	}

	this.year = parseInt(match[1], 10);
	this.month = parseInt(match[2], 10);
	this.mday = parseInt(match[3], 10);

	if (match.length > 4 && match[4] != null) {
		this.hour = parseInt(match[4], 10);
		this.min = parseInt(match[5], 10);
		this.sec = parseInt(match[6], 10);
		this.utcFlag = (match[7] == "Z" || match[7] == "z");
	}
	else {
		// If only the date is specified, it's assumed to be midnight local time.
		this.hour = 0;
		this.min = 0;
		this.sec = 0;
	}
}

ICalDateBase.prototype.isUTC = function ()
{
	return (this.utcFlag == true);
}

ICalDateBase.prototype.getTime = function ()
{
	return this.getJSDate().getTime();
}

ICalDateBase.prototype.computeOffset = function (utc_offset)
{
	var match;
	if ((match = utc_offset.match(/^([\+-])(\d{2})(\d{2})(\d{2})?$/)) == null) {
		throw new Error("Invalid utc-offset: " + utc_offset);
	}

	var offsetSec = parseInt(match[2], 10) * 3600 + parseInt(match[3], 10) * 60;
	if (match.length > 4 && match[4] != null) {
		offsetSec += parseInt(match[4], 10);
	}

	if (match[1] == "-") {
		offsetSec = -offsetSec;
	}
	
	return offsetSec * 1000;
}

ICalDateBase.prototype.getFullYear = function ()
{
	return this.year;
}

ICalDateBase.prototype.getMonth = function ()
{
	return this.month;
}

ICalDateBase.prototype.getDate = function ()
{
	return this.mday;
}

ICalDateBase.prototype.getDay = function ()
{
	var y = parseInt(this.getFullYear(), 10);
	var m = parseInt(this.getMonth(), 10);
	var d = parseInt(this.getDate(), 10);

	// Sakamoto method
	var t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
	y -= m < 3;
	return (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + t[m - 1] + d) % 7;
}

ICalDateBase.prototype.isLeapYear = function ()
{
	var y = this.getFullYear();
	return y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
}

ICalDateBase.prototype.dateExists = function (mday)
{
	var mdays = this.getMonthDays();

	if (mday == null) {
		mday = this.getDate();
	}

	return mday > 0 && mday <= mdays[this.getMonth() - 1];
}

ICalDateBase.prototype.getMonthDays = function ()
{
	var mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	if (this.isLeapYear()) {
		mdays[1] = 29;
	}
	
	return mdays;
}

ICalDateBase.prototype.getDaysInYear = function ()
{
	return this.isLeapYear() ? 366 : 365;
}

ICalDateBase.prototype.getDayOfYear = function ()
{
	var mdays = this.getMonthDays();
	var month = this.getMonth();
	var day = this.getDate() - 1;

	// Add each month that's passed
	for (var i = 1; i < month; i++) {
		day += mdays[i - 1];
	}

	return day;
}

ICalDateBase.prototype.getFirstDayOfYear = function ()
{
	var y = this.getFullYear() - 1;

	return (y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + 1) % 7;
}

ICalDateBase.prototype.getWeek = function ()
{
	return Math.floor((this.getFirstDayOfYear() + this.getDayOfYear()) / 7);
}

ICalDateBase.prototype.getHours = function ()
{
	return this.hour;
}

ICalDateBase.prototype.getMinutes = function ()
{
	return this.min;
}

ICalDateBase.prototype.getSeconds = function ()
{
	return this.sec;
}

ICalDateBase.prototype.pad02 = function (value)
{
	var str = new String(value);
	
	return str.length == 1 ? "0" + str : str;
}

ICalDateBase.prototype.pad04 = function (value)
{
	var str = new String(value);
	
	return str.length == 1 ? "000" + str :
		   str.length == 2 ? "00" + str :
		   str.length == 3 ? "0" + str :
		   str;
}

ICalDateBase.prototype.getICSDateTime = function ()
{
	return this.pad04(this.getFullYear()) +
			this.pad02(this.getMonth()) +
			this.pad02(this.getDate()) +
			"T" +
			this.pad02(this.getHours()) +
			this.pad02(this.getMinutes()) +
			this.pad02(this.getSeconds()) +
			(this.isUTC() ? "Z" : "");
}

/* ICalDateTime */

ICalDateTime.prototype = new ICalDateBase();

function ICalDateTime (date_time, tz) {
	this.tz = tz;

	if (date_time != null)
		this.parseDTValue(date_time);
}

ICalDateTime.prototype.copy = function ()
{
	return new ICalDateTime(this.getICSDateTime(), this.tz);
}

ICalDateTime.prototype.getJSDate = function ()
{
	if (this.jsDate == null) {
		if (this.isUTC()) {
			// UTC
			this.jsDate = new Date(Date.UTC(this.year, this.month - 1, this.mday, this.hour, this.min, this.sec));
		}
		else if (this.tz != null) {
			// Date-time with time zone
			var offset = this.computeOffset(this.tz.findRuleForLocalTime(this.getICSDateTime()).offset);
			this.jsDate = new Date(Date.UTC(this.year, this.month - 1, this.mday, this.hour, this.min, this.sec) - offset);	
		}
		else {
			// Floating
			this.jsDate = new Date(this.year, this.month - 1, this.mday, this.hour, this.min, this.sec);
		}
	}
	
	return this.jsDate;
}

ICalDateTime.prototype.setFullYear = function (year)
{
	delete this.jsDate;

	this.year = year;
}

ICalDateTime.prototype.setMonth = function (month)
{
	delete this.jsDate;

	this.month = month;
}

ICalDateTime.prototype.setDate = function (mday)
{
	delete this.jsDate;
	
	this.mday = mday;
}

ICalDateTime.prototype.setWeekAndDay = function (week, day)
{
	delete this.jsDate;

	this.setDayOfYear(week * 7 + day - this.getFirstDayOfYear());
}

ICalDateTime.prototype.setDay = function (day)
{
	delete this.jsDate;

	this.setWeekAndDay(this.getWeek(), day);
}

ICalDateTime.prototype.setDayOfYear = function (days)
{
	delete this.jsDate;

	while (days >= this.getDaysInYear()) {
		days -= this.getDaysInYear();
		this.setFullYear(this.getFullYear() + 1);
	}

	var mdays = this.getMonthDays();

	var month = 0;
	while (days >= mdays[month]) {
		if (month >= mdays.length - 1)
			throw new Error("Attempt to set day beyond end of year");
		days -= mdays[month++];
	}
	
	this.setDate(days + 1);
	this.setMonth(month + 1);
}

ICalDateTime.prototype.setOrdinalWeekDay = function (num, day)
{
	delete this.jsDate;

	if (num > 0) {
		// Find out which day the month starts on
		this.setDate(1);
		if (day < this.getDay()) {
			// Starts after they day we want; add an extra week
			num++;
		}
		this.setDate((num - 1) * 7 + 1 + day - this.getDay());
	}
	else {
		var last_mday = (this.getMonthDays())[this.getMonth() - 1];
		// Find out what day the month ends on
		this.setDate(last_mday);
		if (day > this.getDay()) {
			// Ends before the day they want; subtract an extra week
			num--;
		}
		this.setDate(last_mday + (num + 1) * 7 + day - this.getDay());
	}
}

ICalDateTime.prototype.addDays = function (days)
{
	this.setDayOfYear(this.getDayOfYear() + parseInt(days, 10));
}

ICalDateTime.prototype.addWeeks = function (weeks)
{
	this.addDays(weeks * 7);
}

ICalDateTime.prototype.addMonths = function (months)
{
	var month = this.getMonth() - 1 + months;

	this.setFullYear(this.getFullYear() + Math.floor(month / 12));
	this.setMonth((month % 12) + 1);	
}

ICalDateTime.prototype.addYears = function (years)
{
	this.setFullYear(this.getFullYear() + years);
}

ICalDateTime.prototype.setHours = function (hours)
{
	delete this.jsDate;

	this.hour = hours;
}

ICalDateTime.prototype.setMinutes = function (minutes)
{
	delete this.jsDate;

	this.min = minutes;
}

ICalDateTime.prototype.setSeconds = function (seconds)
{
	delete this.jsDate;

	this.sec = seconds;
}

/* ICalFixedDate */

ICalFixedDateTime.prototype = new ICalDateBase();

function ICalFixedDateTime (date_time, offset)
{
	this.icsDateTime = date_time;
	this.offset = offset;

	if (date_time != null)
		this.parseDTValue(date_time);
}

ICalFixedDateTime.prototype.getJSDate = function ()
{
	if (this.jsDate == null) {
		this.jsDate = new Date(Date.UTC(this.year, this.month - 1, this.mday, this.hour, this.min, this.sec) - this.computeOffset(this.offset));
	}
	
	return this.jsDate;
}

/* ICalTimeZone */

function ICalTimeZone (icsBlock)
{
	this.ics = icsBlock;
	this.tzid = this.ics.tzid[0].value;
	this.rules = this.buildRuleList();
}

ICalTimeZone.prototype.buildRuleList = function ()
{
	// Go through the daylight and standard observances, convert them to
	// UTC, and drop them into an list ordered by start time
	var rules = new Array();

	var observances;
	if (this.ics.standard != null) {
		observances = this.ics.standard;
	}
	else {
		observances = new Array();
	}
	if (this.ics.daylight != null) {
		observances = observances.concat(this.ics.daylight);
	}

	for (var i = 0; i < observances.length; i++) {
		var obs = observances[i];

		var rule = new Object;

		var dtstart = new ICalFixedDateTime(obs.dtstart[0].value, obs.tzoffsetfrom[0].value);
		rule.start = dtstart;
		rule.offset = obs.tzoffsetto[0].value;
		if (obs.tzname != null) {
			rule.tzname = obs.tzname[0].value;
		}

		rules.push(rule);
	}

	rules.sort(function (a, b) { return a.start.getTime() - b.start.getTime(); });

	return rules;
}

ICalTimeZone.prototype.findRuleForLocalTime = function (date_time)
{
	var found_rule;

	var i = this.rules.length - 1;
	while (found_rule == null && i >= 0) {
		var test_rule = this.rules[i];

		var test_date = new ICalFixedDateTime(date_time, test_rule.offset);
		
		// alert(test_date.getTime() + " >=? " + test_rule.start.getTime());
		if (test_date.getTime() >= test_rule.start.getTime()) {
			found_rule = test_rule;
		}

		i--;
	}

	if (found_rule == null)
		throw new Error("No timezone rule for " + date_time + " in " + this.tzid);

	return found_rule;
}

/* ICalEvent */

function ICalEvent (icsBlock)
{
	this.ics = icsBlock;

	this.initBasicFields();
}

ICalEvent.prototype.initBasicFields = function ()
{
	if (this.ics.description != null)
		this.description = this.ics.description[0].value;
	if (this.ics.summary != null)
		this.summary = this.ics.summary[0].value;
}

ICalEvent.prototype.updateNextOccurrence = function ()
{
	var day_numbers = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };

	var now = new Date();

	//alert("updating for " + this.summary);

	this.nextOccurrence = null;

	if (this.start.getJSDate() >= now) {
		this.nextOccurrence = this.start.getJSDate();
	}
	else if (this.ics.rrule != null) {
		var occurrences = new Array();
		for (var r = 0; r < this.ics.rrule.length; r++) {
			var rrule = new RRule(this.ics.rrule[r].value);
			//alert("rule: " + rrule.definition);

			var occur = this.start.copy();
			var interval = rrule.interval == null ? 1 : parseInt(rrule.interval[0], 10);
			var count = rrule.count == null ? null : parseInt(rrule.count[0], 10);
			var stop_date = rrule.until == null ? null : (new ICalDateTime(rrule.until[0])).getJSDate();
			switch (rrule.freq[0]) {
				case "daily":
					//alert("daily rule for " + this.summary + ": " + rrule.definition);
					//alert("stop at " + stop_date);
					var num = 1;
					while (true) {
						occur.addDays(interval);
						if (stop_date != null && occur.getJSDate() > stop_date)
							break;
						if (count != null && ++num > count)
							break;
						
						//alert("considering " + occur.getJSDate());
						
						if (occur.getJSDate() >= now) {
							//alert("chose " + occur.getJSDate());
							occurrences.push(occur);
							break;
						}
					}
										
					break;
				case "weekly":
					//alert("weekly rule for " + this.summary + ": " + rrule.definition);
					var by_days = new Array();
					if (rrule.byday != null) {
						for (var d = 0; d < rrule.byday.length; d++) {
							by_days.push(day_numbers[rrule.byday[d]]);
						}
						by_days.sort(function (a, b) { return a - b; });
					}
					else {
						by_days.push(this.start.getDay());
					}

					var num = 1;
weekloop:			while (true) {
						for (var d = 0; d < by_days.length; d++) {
							occur.setDay(by_days[d]);
							if (stop_date != null && occur.getJSDate() > stop_date)
								break weekloop;
							if (occur.getJSDate() > this.start.getJSDate()) {
								if (count != null && ++num > count)
									break weekloop;
						
								//alert("considering " + occur.getJSDate());
						
								if (occur.getJSDate() >= now) {
									//alert("chose " + occur.getJSDate());
									occurrences.push(occur);
									break weekloop;
								}
							}
						}
						occur.addWeeks(interval);
					}
					break;
				case "monthly":
					//alert("monthly rule for " + this.summary + ": " + rrule.definition);
					var by_month_days = rrule.bymonthday != null ? rrule.bymonthday : [this.start.getDate()];
					by_month_days.sort(function (a, b) { return a - b; });
					var by_days = rrule.byday;

					var num = 1;
monthloop:			while (true) {
						if (by_days != null) {
							for (var d = 0; d < by_days.length; d++) {
								var match = by_days[d].match(/^([-+]?\d*)(..)$/);
								if (match == null)
									throw new Error("Invalid BYDAY specification: " + by_days[d]);
								
								var weekdaynum = match[1];
								var weekday = day_numbers[match[2]];
								if (weekdaynum.length == 0)
									throw new Error("Unhandled BYDAY specification: " + by_days[d]);
								// XXX hint - [0, 1, 2, 3, 4]
								
								occur.setOrdinalWeekDay(parseInt(weekdaynum, 10), weekday);
								if (occur.dateExists()) {
									if (stop_date != null && occur.getJSDate() > stop_date)
										break monthloop;
									if (occur.getJSDate() > this.start.getJSDate()) {
										if (count != null && ++num > count)
											break monthloop;
						
										//alert("considering " + occur.getJSDate());
						
										if (occur.getJSDate() >= now) {
											//alert("chose " + occur.getJSDate());
											occurrences.push(occur);
											break monthloop;
										}
									}
								}
							}
						}
						else {
							for (var d = 0; d < by_month_days.length; d++) {
								if (occur.dateExists(by_month_days[d])) {
									occur.setDate(by_month_days[d]);
									if (stop_date != null && occur.getJSDate() > stop_date)
										break monthloop;
									if (occur.getJSDate() > this.start.getJSDate()) {
										if (count != null && ++num > count)
											break monthloop;
						
										//alert("considering " + occur.getJSDate());
						
										if (occur.getJSDate() >= now) {
											//alert("chose " + occur.getJSDate());
											occurrences.push(occur);
											break monthloop;
										}
									}
								}
							}
						}
						occur.setDate(1);
						occur.addMonths(interval);
					}
					break;
				case "yearly":
					// alert("yearly rule for " + this.summary + ": " + rrule.definition);
					var by_months = rrule.bymonth != null ? rrule.bymonth : [this.start.getMonth()];
					by_months.sort(function (a, b) { return a - b; });
					var by_days = rrule.byday;

					var num = 1;
yearloop:			while (true) {
						for (var m = 0; m < by_months.length; m++) {
							occur.setMonth(by_months[m]);
							if (by_days != null) {
								for (var d = 0; d < by_days.length; d++) {
									var match = by_days[d].match(/^([-+]?\d*)(..)$/);
									if (match == null)
										throw new Error("Invalid BYDAY specification: " + by_days[d]);
								
									var weekdaynum = match[1];
									var weekday = day_numbers[match[2]];
									if (weekdaynum.length == 0)
										throw new Error("Unhandled BYDAY specification: " + by_days[d]);
									// XXX hint - [0, 1, 2, 3, 4]
								
									occur.setOrdinalWeekDay(parseInt(weekdaynum, 10), weekday);
									if (occur.dateExists()) {
										if (stop_date != null && occur.getJSDate() > stop_date)
											break yearloop;
										if (occur.getJSDate() > this.start.getJSDate()) {
											if (count != null && ++num > count)
												break yearloop;
						
											// alert("considering " + occur.getJSDate());
						
											if (occur.getJSDate() >= now) {
												//alert("chose " + occur.getJSDate());
												occurrences.push(occur);
												break yearloop;
											}
										}
									}
								}
							}
							else {
								if (stop_date != null && occur.getJSDate() > stop_date)
									break yearloop;
								if (occur.getJSDate() > this.start.getJSDate()) {
									if (count != null && ++num > count)
										break yearloop;

									// alert("considering " + occur.getJSDate());

									if (occur.getJSDate() >= now) {
										// alert("chose " + occur.getJSDate());
										occurrences.push(occur);
										break yearloop;
									}
								}
							}
						}
						occur.addYears(interval);
					}
					break;
				default:
					throw new Error("Unexpected FREQ " + rrule.freq[0]);
			}

		}
		
		occurrences.sort(function (a, b) { return a.getTime() - b.getTime(); });
		if (occurrences.length > 0) {
			this.nextOccurrence = occurrences[0].getJSDate();
		}
	}

	return this.nextOccurrence;
}

/* RRule */
function RRule (rule_definition)
{
	this.definition = rule_definition;
	
	if (this.definition != null) {
		this.parse(rule_definition);
	}
}

RRule.prototype.parse = function (rule_definition)
{
	var parts = rule_definition.split(";");

	for (var i = 0; i < parts.length; i++) {
		var match = parts[i].match(/^([^=]+)=(.*)$/);
		if (match == null)
			throw new Error("Bad RRULE part, expecting KEYWORD=VALUE: " + parts[i]);
		
		var keyword = match[1].toLowerCase();
		var values = match[2].toLowerCase().split(",");
		
		this[keyword] = values;
	}
}

/* icsParser */

function ICSParser ()
{

}


ICSParser.prototype.parse = function (icsData)
{
	// Normalize line endings
	icsData = icsData.replace(/(\x0d\x0a)+/g, "\x0a");

	// Unfold
	icsData = icsData.replace(/\x0a /g, "");

	var blocks = new Array();
	var block = new Object();

	// Process each line
	var match;
    var line_pat = /^.+$/mg;
    while ((match = line_pat.exec(icsData)) != null) {
		var line = match[0];
		
		// Pull off name
		match = line.match("^([^;:\"=]+)(.*)$");
		if (match == null)
			throw new Error("Failed to match name: " + line);
		var name = match[1].toLowerCase();
		var rest = match[2];

		// Parameters
		var params = new Object();
		// First get the param-name
		while ((match = rest.match("^;([^;:\"=]+)=(.+)$")) != null) {
			var param_name = match[1].toLowerCase();
			rest = match[2];

			// Now look for the value
			var param_value;

			// Quoted string?
			if (rest.charAt(0) == '"') {
				match = this.matchEscapedString(rest);
				if (match == null)
					throw new Error("Param-value failed to match quoted string: " + rest);
				param_value = match[0];
				rest = match[1];
			}
			else {
				match = rest.match("^([^;:]+)(.*)$");
				if (match == null)
					throw new Error("Param-value failed to match paramtext: " + rest);
				param_value = match[1];
				rest = match[2];
			}

			params[param_name] = param_value;
		}

		// Now what's left is a colon followed by the value
		if ((match = rest.match("^:(.*)$")) == null)
			throw new Error("Parse error - missing ':': " + line);
		var value = match[1];
		
		// If it was a BEGIN, put the current block on the stack and start a new one
		if (name == "begin") {
			blocks.push({ name: value.toLowerCase(), block: block });
			block = new Object();
		}
		else {
			// When we hit an END, pop the stack and save the block we just finished
			if (name == "end") {
				var prev_block = blocks.pop();

				name = value.toLowerCase();
				if (name != prev_block.name)
					throw new Error("Nesting error - END " + name + ", expecting " + prev_block.name);

				value = block;
				block = prev_block.block;
			}

			// Make sure there's a place to add this block
			if (block[name] == null) {
				block[name] = new Array();
			}

			if (typeof(value) == "object") {
				block[name].push(value);
			}
			else {
				block[name].push({ params: params, value: value });
			}
		}
	}

	// Convert any calendars found into ICalendar objects
	var vcalendars = block.vcalendar;
	if (vcalendars == null) {
		alert("No VCALENDAR blocks found!");
		return;
	}

	var calendars = new Array();
	for (var i = 0; i < vcalendars.length; i++) {
		calendars.push(new ICalendar(vcalendars[i]));
	}
		
	return calendars;
}

// Look for a balanced quoted string and unescape backslash sequences
ICSParser.prototype.matchEscapedString = function (text)
{
	var string = new String();
	var rest = text;
	
	// First, remove the initial quote
	if ((match = rest.match('^"(.*)')) != null) {
		rest = match[1];
	}
	else {
		throw new Error("Quoted string must begin with a quote");
	}


	while (rest.length > 0 && rest.charAt(0) != '"') {
		// Grab any simple text
		var match = rest.match("^([^\\\\\"]*)(.*)$");
		string += match[1];
		rest = match[2];
		
		// Handle escape sequences
		if ((match = rest.match("^\\\\(.?)(.*)$")) != null) {
			if (match[1].length) {
				string += match[1];
			}
			else {
				string += "\\";
			}
			rest = match[2];
		}
	}

	if ((match = rest.match("^\"(.*)$")) == null) {
		throw new Error("Failed to find quote at end of string");
	}
	rest = match[1];
	
	return [string, rest];
}
