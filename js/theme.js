var themeBtn = document.getElementById('themeBtn');

function updateThemeBtn() {
    var isDark = document.documentElement.classList.contains('dark');
    if (themeBtn) {
        themeBtn.textContent = isDark ? 'Светлая тема' : 'Темная тема';
    }
}

if (!localStorage.getItem('theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
updateThemeBtn();

if (themeBtn) {
    themeBtn.onclick = function() {
        var isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeBtn();
    };
}
