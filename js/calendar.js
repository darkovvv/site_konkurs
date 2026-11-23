// праздники
var holidays = ["1.1", "2.1", "23.2", "8.3", "1.5", "9.5", "12.6", "4.11"];
// предпраздничные дни
var shortDays = ["22.2", "7.3", "30.4", "8.5", "11.6", "3.11"];

function isHoliday(d) {
    var s = d.getDate() + "." + (d.getMonth() + 1);
    return holidays.includes(s);
}

function isShort(d) {
    var s = d.getDate() + "." + (d.getMonth() + 1);
    return d.getDay() == 6 || shortDays.includes(s);
}