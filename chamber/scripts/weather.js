// === Display Current Year ===
const currentYear = document.querySelector("#currentyear");
currentYear.textContent = new Date().getFullYear();

// === Display Last Modified Date ===
const lastModified = document.querySelector("#lastModified");
lastModified.textContent = document.lastModified;


const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#nav-menu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});




// scripts/weather.js
// Replace YOUR_API_KEY with your valid OpenWeather key if you want to change it.
// Current coordinates match your original code.
const API_KEY = "ffd205a7c65491d70b06e933b02f1bac";
const LAT = 6.6137;
const LON = 3.3792057;

const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;

async function apiFetch() {
    try {
        console.log("Fetching current weather...");
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Weather fetch failed: ${response.status} ${response.statusText} — ${text}`);
        }
        const data = await response.json();
        displayResults(data);
    } catch (err) {
        console.error("Error fetching current weather:", err);
        showFetchError("#currentTemp", "—");
    }

    try {
        console.log("Fetching forecast...");
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            const text = await forecastResponse.text();
            throw new Error(`Forecast fetch failed: ${forecastResponse.status} ${forecastResponse.statusText} — ${text}`);
        }
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (err) {
        console.error("Error fetching forecast:", err);
        showFetchError("#todayForecast", "—");
        showFetchError("#tomorrowForecast", "—");
        showFetchError("#dayAfterForecast", "—");
    }
}

// Safe helper: write fallback value to a selector if element exists
function showFetchError(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
}

function convertUnixTime(timestamp) {
    if (!timestamp) return "—";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function displayResults(data) {
    if (!data) return;
    const currentTemp = document.querySelector("#currentTemp");
    const weatherDescription = document.querySelector("#weatherDescription");
    const weatherIcon = document.querySelector("#weather-icon");
    const captionDesc = document.querySelector("#captionDesc");
    const high = document.querySelector("#high");
    const low = document.querySelector("#low");
    const humidity = document.querySelector("#humidity");
    const sunrise = document.querySelector("#sunrise");
    const sunset = document.querySelector("#sunset");

    // Defensive checks
    if (!currentTemp) { console.warn("#currentTemp element not found"); return; }

    const iconCode = data.weather && data.weather[0] && data.weather[0].icon ? data.weather[0].icon : null;
    const desc = data.weather && data.weather[0] && data.weather[0].description ? data.weather[0].description : "—";

    const iconsrc = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : "";

    currentTemp.textContent = (data.main && data.main.temp != null) ? Math.round(data.main.temp) : "—";
    if (weatherDescription) weatherDescription.textContent = desc;
    if (weatherIcon) {
        if (iconsrc) {
            weatherIcon.src = iconsrc;
            weatherIcon.alt = desc;
        } else {
            weatherIcon.removeAttribute("src");
            weatherIcon.alt = "";
        }
    }
    if (captionDesc) captionDesc.textContent = desc;
    if (high) high.textContent = (data.main && data.main.temp_max != null) ? Math.round(data.main.temp_max) : "—";
    if (low) low.textContent = (data.main && data.main.temp_min != null) ? Math.round(data.main.temp_min) : "—";
    if (humidity) humidity.textContent = (data.main && data.main.humidity != null) ? data.main.humidity : "—";
    if (sunrise) sunrise.textContent = data.sys && data.sys.sunrise ? convertUnixTime(data.sys.sunrise) : "—";
    if (sunset) sunset.textContent = data.sys && data.sys.sunset ? convertUnixTime(data.sys.sunset) : "—";
}

function displayForecast(forecastData) {
    if (!forecastData || !forecastData.list) return;

    const todayForecast = document.querySelector("#todayForecast");
    const tomorrowForecast = document.querySelector("#tomorrowForecast");
    const dayAfterForecast = document.querySelector("#dayAfterForecast");
    const day1Label = document.querySelector("#day1");
    const day2Label = document.querySelector("#day2");
    const day3Label = document.querySelector("#day3");

    // Build three target dates (YYYY-MM-DD)
    const now = new Date();
    const targetDates = [];
    for (let i = 0; i < 3; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        targetDates.push(`${yyyy}-${mm}-${dd}`);
    }

    // Set labels (friendly)
    if (day1Label) day1Label.textContent = "Today";
    if (day2Label) day2Label.textContent = new Date(targetDates[1]).toLocaleDateString("en-US", { weekday: "long" });
    if (day3Label) day3Label.textContent = new Date(targetDates[2]).toLocaleDateString("en-US", { weekday: "long" });

    // Aggregate temps by date string (YYYY-MM-DD)
    const tempsByDate = {};
    forecastData.list.forEach(item => {
        const dt = new Date(item.dt * 1000);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        const key = `${yyyy}-${mm}-${dd}`;
        if (!tempsByDate[key]) tempsByDate[key] = [];
        if (item.main && item.main.temp != null) tempsByDate[key].push(item.main.temp);
    });

    // Compute averages for the three target days
    const averages = targetDates.map(key => {
        const list = tempsByDate[key] || [];
        if (list.length === 0) return "—";
        const sum = list.reduce((s, v) => s + v, 0);
        return Math.round(sum / list.length);
    });

    if (todayForecast) todayForecast.textContent = averages[0];
    if (tomorrowForecast) tomorrowForecast.textContent = averages[1];
    if (dayAfterForecast) dayAfterForecast.textContent = averages[2];
}

// Run after DOM loaded for safety (works even if you keep `defer`)
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apiFetch);
} else {
    apiFetch();
}
