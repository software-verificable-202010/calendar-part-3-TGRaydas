let calendarType = 0; // 0 = Month calendar, 1 = Week calendar

const viewConst = require('../js/viewConst');
const startWeekCalendar = require('../js/weekCalendar.js').startWeekCalendar;
const startMonthCalendar = require('../js/monthCalendar.js').startMonthCalendar;
const modalButtonsEvents = require('../js/addEvent.js').modalButtonsEvents;
const changeToNextWeek = require('../js/weekCalendar.js').changeToNextWeek;
const changeToPrevWeek = require('../js/weekCalendar.js').changeToPrevWeek;
const changeToPrevMonth = require('../js/monthCalendar.js').changeToPrevMonth;
const changeToNextMonth = require('../js/monthCalendar.js').changeToNextMonth;
let calendarStarted = false;

var generateCalendar = (document) => {
    if(!calendarStarted){
        modalButtonsEvents(document, generateCalendar)
        calendarStarted = !calendarStarted;
    }
    document.getElementById(viewConst.nextWeekID).addEventListener('click', () => changeToNextWeek(document));
    document.getElementById(viewConst.prevWeekID).addEventListener('click', () => changeToPrevWeek(document));

    document.getElementById(viewConst.nextMonthID).addEventListener('click', () => changeToNextMonth(document));
    document.getElementById(viewConst.prevMonthID).addEventListener('click', () => changeToPrevMonth(document));

    document.getElementById(viewConst.monthCalendarButtonID).addEventListener('click', () => {
        startMonthCalendar(document);
    });

    document.getElementById(viewConst.weekCalendarButtonID).addEventListener('click', () => {
        startWeekCalendar(document);
    });

    if (calendarType === 0) {
        startMonthCalendar(document);
    } else {
        startWeekCalendar(document);
    }
}