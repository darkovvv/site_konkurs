var btn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") == "dark") {
    document.body.classList.add("dark");
    btn.innerHTML = "Светлая";
}

btn.onclick = function() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        btn.innerHTML = "Светлая";
    } else {
        localStorage.setItem("theme", "light");
        btn.innerHTML = "Тёмная";
    }
}
