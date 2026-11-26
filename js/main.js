function nextStudyHint(now) {
    var next = getNextStudyDay(now);
    if (!next) {
        return 'В ближайшие две недели пар нет';
    }

    var tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    var dayWord = tomorrow.toDateString() === next.date.toDateString()
        ? 'завтра'
        : formatDateRu(next.date).toLowerCase();

    return 'Ближайшие пары: ' + dayWord + ', с ' + next.info.bells[0].start;
}

function drawTodayBells(bells, nowSec, curIdx, nextIdx, onBreak) {
    var listEl = document.getElementById('todayList');
    var html = '';

    for (var i = 0; i < bells.length; i++) {
        var pair = bells[i];
        var endSec = timeToMinutes(pair.end) * 60;
        var cls = 'pair-item';
        var st = '';

        if (i === curIdx) {
            cls += ' current';
            st = 'идет';
        } else if (nowSec >= endSec) {
            cls += ' past';
        } else if (i === nextIdx) {
            cls += ' next';
            st = 'следующая';
        }

        html += '<li class="' + cls + '">'
            + '<span class="pair-num">' + pair.num + ' пара</span>'
            + '<span class="pair-time">' + pair.start + ' - ' + pair.end + '</span>'
            + '<span class="pair-status">' + st + '</span>'
            + '</li>';

        if (i + 1 < bells.length) {
            var breakMin = timeToMinutes(bells[i + 1].start) - timeToMinutes(pair.end);
            var breakCls = (onBreak && nextIdx === i + 1) ? 'break-item current' : 'break-item';
            var breakTitle = breakMin >= 20 ? 'большая перемена' : 'перемена';
            html += '<li class="' + breakCls + '">' + breakTitle + ' - ' + breakMin + ' мин</li>';
        }
    }

    listEl.innerHTML = html;
}

function updateTimer() {
    var now = new Date();
    var day = getDayData(now);
    var bells = day.bells;
    var nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    var card = document.getElementById('timerCard');
    var badge = document.getElementById('dayBadge');
    var statusText = document.getElementById('statusText');
    var subText = document.getElementById('subText');
    var timerBox = document.getElementById('timerBox');
    var timerVal = document.getElementById('timerValue');
    var timerLabel = document.getElementById('timerLabel');
    var progressBar = document.getElementById('progressBar');
    var progressFill = document.getElementById('progressFill');
    var todayList = document.getElementById('todayList');

    document.getElementById('todayDate').textContent = formatDateRu(now);
    document.getElementById('clockNow').textContent = formatClock(now);
    badge.textContent = day.badge;

    badge.className = 'badge';
    if (day.mode === 'short') {
        badge.classList.add('short');
    }
    if (day.mode === 'holiday' || day.mode === 'sunday') {
        badge.classList.add('off');
    }

    if (bells.length === 0) {
        card.classList.remove('is-break');
        statusText.textContent = day.mode === 'holiday' ? 'Праздничный день' : 'Сегодня выходной';
        var pref = day.mode === 'holiday' ? day.title + '. ' : '';
        subText.textContent = pref + nextStudyHint(now);
        timerBox.style.display = 'none';
        progressBar.style.display = 'none';
        todayList.innerHTML = '<li class="empty-day">Сегодня пар нет</li>';
    } else {
        var firstStart = timeToMinutes(bells[0].start) * 60;
        var lastEnd = timeToMinutes(bells[bells.length - 1].end) * 60;

        if (nowSec < firstStart) {
            card.classList.remove('is-break');
            statusText.textContent = 'Пары еще не начались';
            subText.textContent = '1 пара начнется в ' + bells[0].start;
            timerLabel.textContent = 'до начала 1 пары';
            timerVal.textContent = formatLeft(firstStart - nowSec);
            timerBox.style.display = '';
            progressBar.style.display = 'none';
            drawTodayBells(bells, nowSec, -1, 0, false);
        } else if (nowSec >= lastEnd) {
            card.classList.remove('is-break');
            statusText.textContent = 'Пары закончились';
            subText.textContent = nextStudyHint(now);
            timerBox.style.display = 'none';
            progressBar.style.display = 'none';
            drawTodayBells(bells, nowSec, -1, -1, false);
        } else {
            for (var i = 0; i < bells.length; i++) {
                var startSec = timeToMinutes(bells[i].start) * 60;
                var endSec = timeToMinutes(bells[i].end) * 60;

                if (nowSec >= startSec && nowSec < endSec) {
                    var pct = ((nowSec - startSec) / (endSec - startSec)) * 100;
                    card.classList.remove('is-break');
                    statusText.textContent = 'Идет ' + bells[i].num + ' пара';
                    subText.textContent = 'Звонок с пары в ' + bells[i].end;
                    timerLabel.textContent = 'до конца пары';
                    timerVal.textContent = formatLeft(endSec - nowSec);
                    progressFill.style.width = pct.toFixed(1) + '%';
                    timerBox.style.display = '';
                    progressBar.style.display = '';
                    drawTodayBells(bells, nowSec, i, -1, false);
                    break;
                }

                if (i + 1 < bells.length) {
                    var nextStart = timeToMinutes(bells[i + 1].start) * 60;
                    if (nowSec >= endSec && nowSec < nextStart) {
                        var breakLen = (nextStart - endSec) / 60;
                        var brkPct = ((nowSec - endSec) / (nextStart - endSec)) * 100;
                        card.classList.add('is-break');
                        statusText.textContent = breakLen >= 20 ? 'Большая перемена' : 'Перемена';
                        subText.textContent = bells[i + 1].num + ' пара начнется в ' + bells[i + 1].start;
                        timerLabel.textContent = 'до начала пары';
                        timerVal.textContent = formatLeft(nextStart - nowSec);
                        progressFill.style.width = brkPct.toFixed(1) + '%';
                        timerBox.style.display = '';
                        progressBar.style.display = '';
                        drawTodayBells(bells, nowSec, -1, i + 1, true);
                        break;
                    }
                }
            }
        }
    }
}

function initSchedulePage() {
    var now = new Date();
    var day = getDayData(now);
    var note = document.getElementById('schedNote');
    var todayStr = formatDateRu(now);

    if (day.mode === 'normal') {
        document.getElementById('schedNormal').classList.add('today');
        document.getElementById('tagNormal').style.display = '';
        note.textContent = todayStr + ' - сегодня действует обычное расписание.';
    } else if (day.mode === 'short') {
        document.getElementById('schedShort').classList.add('today');
        document.getElementById('tagShort').style.display = '';
        note.textContent = todayStr + ' - сегодня сокращенное расписание (' + day.title + ').';
    } else {
        var reason = day.mode === 'holiday' ? ' (' + day.title + ')' : '';
        note.textContent = todayStr + ' - сегодня пар нет' + reason + '. ' + nextStudyHint(now) + '.';
    }
}

if (document.getElementById('timerCard')) {
    updateTimer();
    setInterval(updateTimer, 1000);
}

if (document.getElementById('schedNormal')) {
    initSchedulePage();
}

if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js');
}

var deferredPrompt = null;
var installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.style.display = '';
    }
});

if (installBtn) {
    installBtn.onclick = function() {
        if (!deferredPrompt) {
            return;
        }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(choice) {
            if (choice.outcome == 'accepted') {
                installBtn.style.display = 'none';
            }
            deferredPrompt = null;
        });
    };
}
