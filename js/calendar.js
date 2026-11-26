// расписание звонков моего колледжа и праздники на 2026-2027 уч год. я не особо сверял на 27 год (прост по инфе с инета взял насчет переносов)

// пн-пт
var normalBells = [
    { num: 1, start: '08:00', end: '09:20' },
    { num: 2, start: '09:30', end: '10:50' },
    { num: 3, start: '11:10', end: '12:30' },
    { num: 4, start: '12:40', end: '14:00' },
    { num: 5, start: '14:10', end: '15:30' },
    { num: 6, start: '15:40', end: '17:00' },
    { num: 7, start: '17:10', end: '18:10' }
];

// сб и предпраздничные
var shortBells = [
    { num: 1, start: '08:00', end: '09:00' },
    { num: 2, start: '09:10', end: '10:10' },
    { num: 3, start: '10:20', end: '11:20' },
    { num: 4, start: '11:30', end: '12:30' },
    { num: 5, start: '12:40', end: '13:40' },
    { num: 6, start: '13:50', end: '14:50' },
    { num: 7, start: '15:00', end: '16:00' }
];

var holidays = {
    '01-01': 'Новый год',
    '01-02': 'Новогодние каникулы',
    '01-03': 'Новогодние каникулы',
    '01-04': 'Новогодние каникулы',
    '01-05': 'Новогодние каникулы',
    '01-06': 'Новогодние каникулы',
    '01-07': 'Рождество Христово',
    '01-08': 'Новогодние каникулы',
    '02-23': 'День защитника Отечества',
    '03-08': 'Международный женский день',
    '05-01': 'Праздник Весны и Труда',
    '05-09': 'День Победы',
    '06-12': 'День России',
    '11-04': 'День народного единства'
};

var movedDays = {
    '2026-12-31': 'Выходной день',
    '2027-02-22': 'Выходной (перенос)',
    '2027-05-03': 'Выходной (перенос с 1 мая)',
    '2027-05-10': 'Выходной (перенос с 9 мая)',
    '2027-06-14': 'Выходной (перенос с 12 июня)'
};

var shortDays = {
    '02-20': 'предпраздничный день',
    '02-22': 'предпраздничный день',
    '03-07': 'предпраздничный день',
    '04-30': 'предпраздничный день',
    '05-08': 'предпраздничный день',
    '06-11': 'предпраздничный день',
    '11-03': 'предпраздничный день',
    '12-30': 'предпраздничный день'
};

function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
}

function timeToMinutes(str) {
    var parts = str.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function getDayData(date) {
    var y = date.getFullYear();
    var m = pad2(date.getMonth() + 1);
    var d = pad2(date.getDate());
    var fullDate = y + '-' + m + '-' + d;
    var monthDay = m + '-' + d;
    var weekDay = date.getDay();

    if (movedDays[fullDate]) {
        return { mode: 'holiday', title: movedDays[fullDate], badge: 'Выходной день', bells: [] };
    }
    if (holidays[monthDay]) {
        return { mode: 'holiday', title: holidays[monthDay], badge: 'Праздничный день', bells: [] };
    }
    if (weekDay === 0) {
        return { mode: 'sunday', title: 'Воскресенье', badge: 'Выходной', bells: [] };
    }
    if (shortDays[monthDay]) {
        return { mode: 'short', title: shortDays[monthDay], badge: 'Сокращенное (предпраздничный)', bells: shortBells };
    }
    if (weekDay === 6) {
        return { mode: 'short', title: 'суббота', badge: 'Сокращенное (суббота)', bells: shortBells };
    }

    return { mode: 'normal', title: 'будний день', badge: 'Обычное расписание', bells: normalBells };
}

function formatDateRu(date) {
    var weekNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    var monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return weekNames[date.getDay()] + ', ' + date.getDate() + ' ' + monthNames[date.getMonth()];
}

function formatClock(date) {
    return pad2(date.getHours()) + ':' + pad2(date.getMinutes());
}

function formatLeft(sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;

    if (h > 0) {
        return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
    }
    return pad2(m) + ':' + pad2(s);
}

function getNextStudyDay(fromDate) {
    var check = new Date(fromDate);
    for (var i = 1; i <= 14; i++) {
        check.setDate(check.getDate() + 1);
        var info = getDayData(check);
        if (info.bells.length > 0) {
            return { date: check, info: info };
        }
    }
    return null;
}
