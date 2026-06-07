const apiKey = "3dede429bac6084afbf4da1a82dc0c25";


const backgrounds = {
    // ☀️ КАРТИНКА ДЛЯ ЯСНОЙ ПОГОДЫ
    // ❗ поменяй 'sunny.jpg' на свою картинку (например: sun.png)
    sunny: "url('1.png')",

    // 🌧 КАРТИНКА ДЛЯ ПЛОХОЙ ПОГОДЫ (дождь, облака и т.д.)
    // ❗ поменяй 'bad.jpg' на свою картинку
    bad: "url('3.png')"
};

/* =========================================
   🌤 ТЕКУЩАЯ ПОГОДА
   ========================================= */
async function checkWeather(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.cod != 200) {
        alert("Город не найден");
        return;
    }

    // 📊 вывод данных
    document.getElementById("city").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = Math.round(data.main.temp);
    document.getElementById("feelsLike").textContent = Math.round(data.main.feels_like);
    document.getElementById("wind").textContent = data.wind.speed;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("pressure").textContent = data.main.pressure;
    document.getElementById("description").textContent = data.weather[0].description;

    // 🌦 иконка погоды
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // 🌅 смена фона
    setBackground(data.weather[0].main);
}

/* =========================================
   📅 ПРОГНОЗ
   ========================================= */
async function checkForecast(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`;

    const res = await fetch(url);
    const data = await res.json();

    let daily = {};

    data.list.forEach(item => {
        let date = item.dt_txt.split(" ")[0];
        if (!daily[date]) daily[date] = item;
    });

    let container = document.getElementById("forecast");
    container.innerHTML = "";

    Object.keys(daily).forEach(date => {
        let item = daily[date];

        container.innerHTML += `
            <div class="day">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
                <p>${Math.round(item.main.temp)}°C</p>
            </div>
        `;
    });
}

/* =========================================
   🌦 СМЕНА ФОНА
   ========================================= */
function setBackground(weatherMain) {
    const bg = document.querySelector(".bg");
    if (!bg) return;

    let type;

    // ☀️ только Clear = солнечно
    if (weatherMain === "Clear") {
        type = "sunny";
    } else {
        type = "bad";
    }

    // 🎯 применяем фон
    bg.style.backgroundImage = backgrounds[type];
    bg.style.backgroundSize = "cover";
    bg.style.backgroundPosition = "center";
    bg.style.transition = "0.6s ease";
}

/* =========================================
   🔘 КНОПКА ПОИСКА
   ========================================= */
document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("searchCity").value;

    if (city) {
        checkWeather(city);
        checkForecast(city);
    }
});

/* =========================================
   🚀 СТАРТ САЙТА
   ========================================= */
checkWeather("Kyiv");
checkForecast("Kyiv");