const monthNames = require('../js/calendarConst').monthNames;
const weekDates = require('../js/calendarConst').weekDates;
const viewConst = require('../js/viewConst');
const calendarConst = require('../js/calendarConst');

const openModalAddEvents = require('../js/addEvent').openModalAddEvents;
const openEventsAddEventListener = require('../js/addEvent').openEventsAddEventListener;

const ipc = require('electron').ipcRenderer;

let events = [];
var getEvents = () => {
	events = ipc.sendSync('get-events');
};

/* Display navigation arrows accords to month calendar */
var showArrows = (document) => {
	document.getElementById(viewConst.nextMonthID).style.display = 'block';
	document.getElementById(viewConst.prevMonthID).style.display = 'block';
	document.getElementById(viewConst.nextWeekID).style.display = 'none';
	document.getElementById(viewConst.prevWeekID).style.display = 'none';
};

/* Global variables */
let calendarMonth = 0;
let calendarYear = 0;
let containerID = '';
let monthTitleID = '';

var getEventCard = (event, index) => {
	let card = `<span id='event' invited=${event.isInvited} index="${index}" class="${event.badgeClass}">${event.title}</span>`;
	return card;
};

var searchEventsInDate = (day, month, year) => {
	let boxEvents = [];
	let formatedStrBoxDate = `${parseInt(day)}-${month}-${year}`;
	events.map((event) => {
		if (event.date == formatedStrBoxDate) {
			boxEvents.push(event);
		}
	});
	return boxEvents;
};

/* Return an array with all days for a month in a defined year */
var getDaysInMonth = (month, year) => {
	var date = new Date(year, month, 1);
	var days = [];
	while (date.getMonth() === month) {
		days.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return days;
};

var getMonthCard = (dayName, dayNumber, cardEventsHtml, backgroundColorClass, headerColorClass, cardDate) => {
	let card = `<div  class="${viewConst.dayBoxClass} card border-secondary mb-3 ${backgroundColorClass}"  style="width: 14.25%">
	        <div date=${cardDate} class="card-header ${headerColorClass} text-white">${dayName} ${dayNumber}</div>
	        <div date=${cardDate} class="card-body text-secondary">
	            ${cardEventsHtml}
	        </div>
		</div>`;
	return card;
};

/* Add to calendar container, days card view */

var renderMonthCalendarCard = (document, dayName, dayNumber, month, year, dayDate) => {
	/* Define day card view */
	/* Change styling depending of day week */
	let backgroundColorClass = viewConst.backgroundWhiteClass;
	let headerColorClass = viewConst.monthBoxHeaderClass;
	/* If is a endweek day */
	if (dayName === calendarConst.satDayName || dayName === calendarConst.sunDayName) {
		headerColorClass = viewConst.monthBoxEndWeekDayHeaderClass;
	} else if ((dayName === calendarConst.emptyDayName) & (dayNumber === 5)) {
		/* If is a day out of this month but is end of weekday */
		headerColorClass = viewConst.monthBoxEndWeekDayHeaderClass;
		backgroundColorClass = viewConst.dayNotInMonthClass;
		dayNumber = '';
	} else if (dayName === calendarConst.emptyDayName) {
		/* If is a day out of this month */
		backgroundColorClass = viewConst.dayNotInMonthClass;
		dayNumber = '';
	}
	let cardEvents = searchEventsInDate(dayNumber, month, year);
	let cardEventsHtml = '';
	cardEvents.map((event, index) => {
		cardEventsHtml += getEventCard(event, index);
	});
	let formatedDate = `${dayDate}-${month}-${year}`;
	let card = getMonthCard(dayName, dayNumber, cardEventsHtml, backgroundColorClass, headerColorClass, formatedDate);
	/* Add to calendar container day card */
	document.getElementById(viewConst.containerID).innerHTML += card;
};

/* Generate the correct logic for a calendar month */
var generateMonthCalendar = (month, year, document) => {
	/* Get all dates in the speficic month */
	let dates = getDaysInMonth(month, year);
	/* Get the start month day number week off set */
	let offSetDay = weekDates[dates[0].toString().split(' ')[0]];
	/* Clean previus month calendar */
	document.getElementById(viewConst.containerID).innerHTML = '';
	/* Render off set days */
	for (var i = 0; i < offSetDay; i++) {
		renderMonthCalendarCard(document, calendarConst.emptyDayValue, i);
	}
	/* Render validated month days */
	dates.map((date) => {
		var dayName = date.toString().split(' ')[0];
		var dayNumber = date.toString().split(' ')[2];
		var dayDate = date.getDate();
		renderMonthCalendarCard(document, dayName, dayNumber, month, year, dayDate);
	});
	openModalAddEvents(document);
	openEventsAddEventListener(document, events);
};

/* Set calendar title name */
var setMonthTitle = (title, document) => {
	document.getElementById(viewConst.monthTitleID).innerHTML = title;
};

/* Next month button pressed trigger function */
var changeToNextMonth = (document) => {
	/* If actual month is the last month of actual year */
	if (calendarMonth === 11) {
		/* Next month is the first of the next year */
		calendarMonth = 0;
		/* Next year */
		calendarYear++;
	} else {
		calendarMonth++;
	}
	/* Change calendar title */
	setMonthTitle(monthNames[calendarMonth] + ' ' + calendarYear, document);
	/* Refresh calendar */
	generateMonthCalendar(calendarMonth, calendarYear, document);
};
/* Preview month button pressed trigger function */
var changeToPrevMonth = (document, innerID, monthTitleID) => {
	/* If actual month is the first of actual year */
	if (calendarMonth === 0) {
		/* Next month is lastest of preview year */
		calendarMonth = 11;
		calendarYear--;
	} else {
		calendarMonth--;
	}
	/* Change calendar title */
	setMonthTitle(monthNames[calendarMonth] + ' ' + calendarYear, document, monthTitleID);
	/* Refresh calendar */

	generateMonthCalendar(calendarMonth, calendarYear, document);
};

/* Generate calendar logic */

var startMonthCalendar = async (document) => {
	await getEvents();
	showArrows(document);
	document.getElementById(viewConst.weekHoursContainer).innerHTML = '';
	/* Get actual date */
	let today = new Date();
	calendarMonth = today.getMonth();
	/* Define clendarYear to actual year */
	calendarYear = today.getFullYear();
	document.getElementById(viewConst.containerID).innerHTML = '';
	setMonthTitle(monthNames[today.getMonth()] + ' ' + calendarYear, document);
	/* Generate calendar */
	generateMonthCalendar(calendarMonth, calendarYear, document, containerID);
};

module.exports = {
	startMonthCalendar: startMonthCalendar,
	changeToPrevMonth: changeToPrevMonth,
	changeToNextMonth: changeToNextMonth
};
