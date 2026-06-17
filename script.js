/**
 * METEORIX WEATHER DASHBOARD CORE CONTROLLER
 * Architectural Framework: Vanilla Modern JavaScript (ES6+)
 */

// ==========================================
// 1. GLOBAL API CONFIGURATION STRATAGEM
// ==========================================
// REPLACE THIS WITH YOUR OPENWEATHERMAP VALID API KEY
const API_KEY = "d9808b0ba8e9aecb96454c6751ff6423"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// ==========================================
// 2. DOM ELEMENT SELECTOR REGISTRY
// ==========================================
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const recentSearchesContainer = document.getElementById('recentSearchesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const weatherDashboardContent = document.getElementById('weatherDashboardContent');

// Live Metric Components
const currentCityName = document.getElementById('currentCityName');
const currentDateTime = document.getElementById('currentDateTime');
const currentWeatherIcon = document.getElementById('currentWeatherIcon');
const currentCondition = document.getElementById('currentCondition');
const currentTemp = document.getElementById('currentTemp');
const currentHumidity = document.getElementById('currentHumidity');
const currentWindSpeed = document.getElementById('currentWindSpeed');
const forecastContainer = document.getElementById('forecastContainer');

// ==========================================
// 3. APPLICATION INITIALIZATION LAYER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Set up standard workflow events
    searchForm.addEventListener('submit', searchWeather);
    
    // Initialize LocalStorage historical state
    loadRecentSearches();
    
    // Seed system with an initial view using a default global business city
    executeDataPipeline("awka");
});

// ==========================================
// 4. FUNCTIONAL LOGIC WORKFLOW PIECES
// ==========================================

/**
 * Event Interceptor for the UI Form submission.
 * @param {Event} event - The standard form submit event argument.
 */
function searchWeather(event) {
    // Intercept default server form posting cycle
    event.preventDefault();
    
    const cityValue = cityInput.value.trim();
    
    if (cityValue) {
        executeDataPipeline(cityValue);
        cityInput.value = ''; // Clean field for seamless user experience
    }
}

/**
 * Orchestrates Async execution to capture full meteorological profiles.
 * @param {string} cityName - Target geographic query criteria.
 */
async function executeDataPipeline(cityName) {
    showLoading(true);
    hideError();
    
    try {
        // Step A: Fetch real-time metrics
        const currentData = await fetchWeatherData(cityName);
        
        // Step B: Use geographic coordinates from payload A to get correct 5-day forecast
        const forecastData = await fetchForecastData(currentData.coord.lat, currentData.coord.lon);
        
        // Step C: Render views
        displayWeather(currentData);
        displayForecast(forecastData);
        
        // Step D: Write entry to storage history
        saveRecentSearch(currentData.name);
        
        // Reveal full dashboard view
        weatherDashboardContent.classList.remove('hidden');
    } catch (error) {
        console.error("Pipeline breakdown details:", error);
        showError(error.message || "Network exception encountered parsing live stream.");
        weatherDashboardContent.classList.add('hidden');
    } finally {
        showLoading(false);
    }
}

/**
 * Requests Current Core Conditions via standard geographic querying.
 * @param {string} city - The parsed target locale value string.
 * @returns {Promise<Object>} Processed body data JSON payload map.
 */
async function fetchWeatherData(city) {
    // Construct request query map string utilizing metric standard format units
    const url = `${BASE_URL}weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    // Validate networking response payload states manually 
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("The requested city was not found inside the global meteorological indexes.");
        }
        throw new Error("Server communication fault during runtime execution.");
    }
    
    return await response.json();
}

/**
 * Requests 5-Day Forecast parameters using Latitudinal and Longitudinal vectors.
 * @param {number} lat - Latitude vector.
 * @param {number} lon - Longitude vector.
 * @returns {Promise<Object>} Complete programmatic forecast list arrays.
 */
async function fetchForecastData(lat, lon) {
    const url = `${BASE_URL}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error("Unable to synthesize current predictive trends array.");
    }
    
    return await response.json();
}

/**
 * Transports Current Realtime JSON Metrics straight directly to the DOM Nodes.
 * @param {Object} data - Clean JSON source format map from real-time endpoint.
 */
function displayWeather(data) {
    currentCityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Process machine unix timestamp format dynamically into local presentation layer standard
    const timestamp = data.dt * 1000;
    const dateObject = new Date(timestamp);
    currentDateTime.textContext = dateObject.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    // Fallback assignment to cover variations in strict node engines
    currentDateTime.textContent = dateObject.toDateString() + " | Local Baseline";

    currentCondition.textContent = data.weather[0].description;
    currentTemp.textContent = Math.round(data.temperature ?? data.main.temp);
    currentHumidity.textContent = `${data.main.humidity}%`;
    currentWindSpeed.textContent = `${data.wind.speed} m/s`;
    
    // Link raw weather status icons to secure delivery assets
    const iconCode = data.weather[0].icon;
    currentWeatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Processes complex 40-item forecast segments down to pristine isolated daily arrays.
 * @param {Object} data - Raw 3-Hour forecast interval telemetry structure.
 */
function displayForecast(data) {
    // Flush out historical items
    forecastContainer.innerHTML = '';
    
    // Filter strategy: OpenWeatherMap serves data intervals spanning every 3 hours. 
    // We isolate slices targeting roughly mid-day parameters (12:00:00 timestamps) to represent clean trends.
    const cleanDailySlices = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    
    // Edge-case recovery engine logic wrapper in case API processing schedules warp layout delivery
    const finalRenderArray = cleanDailySlices.length > 0 ? cleanDailySlices.slice(0, 5) : data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

    finalRenderArray.forEach(day => {
        const dateEpoch = new Date(day.dt * 1000);
        const dayOfWeekName = dateEpoch.toLocaleDateString('en-US', { weekday: 'short' });
        const dayCalendarDate = dateEpoch.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const tempValue = Math.round(day.main.temp);
        const iconId = day.weather[0].icon;
        const conditionText = day.weather[0].main;

        // Construct high-fidelity HTML structures on the fly
        const cardElement = document.createElement('div');
        cardElement.className = "bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-center space-y-2 hover:border-blue-500/50 transition-all-300 transform hover:-translate-y-1 shadow-md";
        
        cardElement.innerHTML = `
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">${dayOfWeekName}</p>
            <p class="text-[11px] text-slate-500">${dayCalendarDate}</p>
            <img src="https://openweathermap.org/img/wn/${iconId}.png" alt="Icon" class="w-12 h-12 mx-auto object-contain">
            <p class="text-2xl font-black text-white">${tempValue}°C</p>
            <p class="text-xs text-teal-400 font-medium truncate">${conditionText}</p>
        `;
        
        forecastContainer.appendChild(cardElement);
    });
}

// ==========================================
// 5. LOCALSTORAGE TRACKING ENGINE
// ==========================================

/**
 * Appends fresh search parameters safely onto LocalStorage history structures.
 * @param {string} name - Explicit real geographic naming parameter.
 */
function saveRecentSearch(name) {
    let currentHistory = JSON.parse(localStorage.getItem('meteorix_history')) || [];
    
    // Standard cleaning algorithm: Delete any prior match instances to avoid UI duplicates
    currentHistory = currentHistory.filter(item => item.toLowerCase() !== name.toLowerCase());
    
    // Add current entry to top position
    currentHistory.unshift(name);
    
    // Constrain array scale strict maximum threshold parameter
    if (currentHistory.length > 5) {
        currentHistory.pop();
    }
    
    localStorage.setItem('meteorix_history', JSON.stringify(currentHistory));
    loadRecentSearches();
}

/**
 * Pulls local history array profiles to compile active layout clickable navigation nodes.
 */
function loadRecentSearches() {
    const trackingHistory = JSON.parse(localStorage.getItem('meteorix_history')) || [];
    
    if (trackingHistory.length === 0) {
        recentSearchesContainer.innerHTML = `<p class="text-xs text-slate-500 italic p-1">No recent search records</p>`;
        return;
    }
    
    recentSearchesContainer.innerHTML = '';
    
    trackingHistory.forEach(city => {
        const operationalBtn = document.createElement('button');
        operationalBtn.type = 'button';
        operationalBtn.className = "w-full text-left bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-blue-400 border border-slate-700/60 hover:border-blue-500/30 text-xs py-2 px-3 rounded-lg transition-all-300 flex items-center justify-between group";
        operationalBtn.innerHTML = `
            <span><i class="fa-solid fa-clock-rotate-left mr-2 text-slate-500 group-hover:text-blue-400"></i>${city}</span>
            <i class="fa-solid fa-chevron-right opacity-0 group-hover:opacity-100 text-[10px] transition-all-300"></i>
        `;
        
        // Wire high efficiency click triggers directly onto dynamically generated nodes
        operationalBtn.addEventListener('click', () => {
            executeDataPipeline(city);
        });
        
        recentSearchesContainer.appendChild(operationalBtn);
    });
}

// ==========================================
// 6. UTILITY INTERACTIVE FEEDBACK AUXILIARY LAYER
// ==========================================
function showLoading(isActive) {
    if (isActive) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorAlert.classList.remove('hidden');
}

function hideError() {
    errorAlert.classList.add('hidden');
}