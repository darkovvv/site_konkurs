// регистрация service worker (PWA). При открытии файла напрямую (file://)
// service worker не работает, поэтому в этом случае регистрацию пропускаем
if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function (err) {
            console.log("Service worker не зарегистрирован:", err);
        });
    });
}

var days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

var bells = [
    ["8:00", "9:20"],
    ["9:30", "10:50"],
    ["11:10", "12:30"],
    ["12:40", "14:00"],
    ["14:10", "15:30"],
    ["15:40", "17:00"],
    ["17:10", "18:10"]
];

var bellsShort = [
    ["8:00", "9:00"],
    ["9:10", "10:10"],
    ["10:20", "11:20"],
    ["11:30", "12:30"],
    ["12:40", "13:40"],
    ["13:50", "14:50"],
    ["15:00", "16:00"]
];

// списки дней - в js/calendar.js

function updateTimer() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var nowMin = h * 60 + m;

    var holiday = isHoliday(d);

    var list = bells;
    if (holiday || d.getDay() == 0) {
        list = [];
    } else if (isShort(d)) {
        list = bellsShort;
    }

    var minStr = m < 10 ? "0" + m : m;
    var todayLine = "Сегодня " + days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + ", " + h + ":" + minStr;
    if (shortDays.includes(d.getDate() + "." + (d.getMonth() + 1))) {
        todayLine = todayLine + " (сокращённый день)";
    }
    document.getElementById("today").innerHTML = todayLine;

    var statusEl = document.getElementById("status");
    var timerEl = document.getElementById("timer");
    var nextEl = document.getElementById("next");
    var block = document.getElementById("now");

    block.classList.remove("break");

    let leftSec = 0;
    let found = false;

    for (let i = 0; i < list.length; i++) {
        let p1 = list[i][0].split(":");
        let p2 = list[i][1].split(":");
        let start = Number(p1[0]) * 60 + Number(p1[1]);
        let end = Number(p2[0]) * 60 + Number(p2[1]);

        if (nowMin >= start && nowMin < end) {
            statusEl.innerHTML = "Идёт " + (i + 1) + " пара";
            leftSec = (end - nowMin) * 60 - s;
            nextEl.innerHTML = "Звонок в " + list[i][1];
            found = true;
            break;
        }
        if (nowMin < start) {
            block.classList.add("break");
            if (i == 0) {
                statusEl.innerHTML = "Пары ещё не начались";
            } else {
                statusEl.innerHTML = "Перемена";
            }
            leftSec = (start - nowMin) * 60 - s;
            nextEl.innerHTML = "Следующая " + (i + 1) + " пара в " + list[i][0];
            found = true;
            break;
        }
    }

    if (!found) {
        if (holiday) {
            statusEl.innerHTML = "Праздник, пар нет";
        } else if (list.length == 0) {
            statusEl.innerHTML = "Сегодня выходной";
        } else {
            statusEl.innerHTML = "Пары закончились";
        }
        timerEl.innerHTML = "--:--";
        nextEl.innerHTML = "";
    } else {
        // если до звонка больше часа (например, утром до начала пар) - формат ЧЧ:ММ:СС
        let lh = Math.floor(leftSec / 3600);
        let lm = Math.floor((leftSec % 3600) / 60);
        let ls = leftSec % 60;
        if (lm < 10) lm = "0" + lm;
        if (ls < 10) ls = "0" + ls;
        if (lh > 0) {
            if (lh < 10) lh = "0" + lh;
            timerEl.innerHTML = lh + ":" + lm + ":" + ls;
        } else {
            timerEl.innerHTML = lm + ":" + ls;
        }
    }

    // таблица звонков на сегодня
    var tbl = "";
    if (list.length == 0) {
        tbl = "<tr><td>" + (holiday ? "Сегодня праздничный день" : "Сегодня выходной") + "</td></tr>";
    } else {
        for (let i = 0; i < list.length; i++) {
            let a = list[i][0].split(":");
            let b = list[i][1].split(":");
            let st = Number(a[0]) * 60 + Number(a[1]);
            let en = Number(b[0]) * 60 + Number(b[1]);
            let cls = "";
            if (nowMin >= en) cls = "done";
            else if (nowMin >= st) cls = "current";
            tbl += '<tr class="' + cls + '"><td>' + (i + 1) + ' пара</td><td>' + list[i][0] + ' - ' + list[i][1] + '</td></tr>';
        }
    }
    document.getElementById("todayTable").innerHTML = tbl;
}

updateTimer();
setInterval(updateTimer, 1000);