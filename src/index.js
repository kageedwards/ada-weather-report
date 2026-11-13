'use strict';

const API_PREFIX = 'https://ada-weather-report-proxy-server.onrender.com';
const API_LOCATION_ENDPOINT = API_PREFIX + '/location';
const API_WEATHER_ENDPOINT = API_PREFIX + '/weather';
const WEATHER_ICON_URL = 'https://openweathermap.org/payload/api/media/file/{code}.png';
const defaultCity = 'Seattle';
//const defaultTemperature = 62;

//landscaping
const landscapeDisplay = document.querySelector("#landscape");

//sky
const skyDisplay = document.querySelector('#sky');
const skySelect = document.querySelector('#sky-select');

const skyEmojis = [
    "☁️ ☁️ ☁️ ☀️ ☁️ ☁️☁️ ☁️ ☁️ ",
    "☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️",
    "🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧",
    "🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨"
];
// Select HTML elements
const mainContainer = document.querySelector("main");
const cityName = document.querySelector("#city-name");
const weatherConditionText = document.querySelector("#weather-condition");
const tempContainer = document.querySelector("#temperature-container");
const tempDisplay = document.querySelector("#temperature");
const tempValueDisplay = document.querySelector("#temperature span");
const unitDisplay = document.querySelector("#temperature small");
const increaseButton = document.querySelector("#increase-temperature");
const decreaseButton = document.querySelector("#decrease-temperature");
const skyView = document.querySelector("#sky");
const weatherIcon = document.querySelector("#weather-icon");
const cityInput = document.querySelector("#city-input");
const selectButton = document.querySelector("#select-button");
const errorMessageBox = document.querySelector("#error-message");
const getWeatherButton = document.querySelector("#get-weather-button");
const skySelectBox = document.querySelector("#sky-select");

//reset city
const resetButton = document.querySelector("#reset-city-button");

//weather-message
const weatherMessage = document.querySelector("#weather-message");

const skies = {
    'clear': '01d',
    'clouds': '03d',
    'rainy': '10d',
    'snowy': '13d'
};

const landscapes = [
    "🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂",
    "🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷",
    "🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃",
    "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲"
];

const state = {
    invalidated: true,
    cityName: 'Seattle',
    cityLocation: {
        lat: 47.6088012,
        lng: -122.4221973
    },
    unit: 'F',
    temperature: '- ',
    weatherCondition: '',
    sky: '01d',
    skyCategory: 'clear',
    landscape: 0,
    background: 0
};

const convertTemperature = (value, unit) => {
    let result = value - 273.15;

    if (unit === 'F') {
        result = result * 1.8 + 32;
    }

    return result;
};

const syncCityName = () => {
    cityName.textContent = state.cityName;
    weatherConditionText.textContent = state.weatherCondition;
    if (state.invalidated) {
        cityName.className = 'invalidated'
    } else {
        cityName.className = ''
    }
};

const syncTemp = () => {
    let temp = Number.parseFloat(state.temperature);
    temp = Math.round(convertTemperature(temp, state.unit));
    tempValueDisplay.textContent = temp;
    unitDisplay.textContent = state.unit;

    tempContainer.animate([
        {opacity: 0,},
        {opacity: 1,}
    ], 500);
    if (state.invalidated) {
        tempContainer.className = 'invalidated'
    } else {
        tempContainer.className = ''
    }
    // Always use Fahrenheit for choosing the message
    const tempF = Math.round(
        convertTemperature(Number.parseFloat(state.temperature), 'F')
    );
    syncWeatherMessage(tempF);
};

const syncWeatherButton = () => {
    if (state.invalidated) {
        getWeatherButton.className = '';
    } else {
        getWeatherButton.className = 'hidden';
    }
};

const syncLandscape = () => {
    const temp = convertTemperature(state.temperature, 'F');
    if (temp >= 80){
        state.landscape = 0;
    } else if (temp >= 70){
        state.landscape = 1;
    } else if (temp >= 60){
        state.landscape = 2;
    } else {
        state.landscape = 3;
    }
    landscapeDisplay.textContent = landscapes[state.landscape];   
};

const syncTempColour = () => {
    const temp = convertTemperature(state.temperature, 'F');
    
    if (temp >= 80) {
        tempValueDisplay.className = "hot";
    } else if (temp >= 70) {
        tempValueDisplay.className = "warm";
    } else if (temp >= 60) {
        tempValueDisplay.className = "mild";
    } else if (temp >= 50) {
        tempValueDisplay.className = "cool";
    } else {
        tempValueDisplay.className = "cold";
    } 
};

const syncSky = () => {
    let weatherIconURL = WEATHER_ICON_URL.replace('{code}', encodeURIComponent(state.sky));
    weatherIcon.setAttribute('src', weatherIconURL);

    if (['clouds', 'rainy'].indexOf(state.skyCategory) >= 0) {
        mainContainer.className = 'cloudy';
    } else {
        mainContainer.className = '';
    }

    if (state.invalidated) {
        skyView.className = 'invalidated';
        // weatherIcon.className = 'hidden';
    } else {
        skyView.className = '';
    }
};

const syncDOM = () => {
    cityInput.value = "";
    syncCityName();
    syncTemp();
    syncWeatherButton();
    syncLandscape();
    syncTempColour();
    syncSky();
    syncWeatherMessage();
};



const queryWeatherData = (lat, lng) => {
    let params = {
        lat: state.cityLocation.lat,
        lon: state.cityLocation.lng
    };
    return axios.get(API_WEATHER_ENDPOINT, { params })
        .then((resp) => {
            console.log(resp);
            state.temperature = resp.data.main.temp;
            state.cityName = resp.data.name;
            state.weatherCondition = resp.data.weather[0].description;
            state.sky = resp.data.weather[0].icon;
            state.skyCategory = resp.data.weather[0].main.toLowerCase();
            state.invalidated = false;
            syncDOM();
        });
};

const queryCityData = (cityName) => {
    let params = {
        q: cityName
    };

    return axios.get(API_LOCATION_ENDPOINT, { params })
        .then((resp) => {
            console.log(resp);

            if (!resp.data || resp.data.length === 0) {
                errorMessageBox.textContent = "City not found! Please try again.";
                return;
            }

            state.cityLocation.lat = resp.data[0].lat;
            state.cityLocation.lng = resp.data[0].lon;
            state.cityName = resp.data[0].name;

            errorMessageBox.textContent = "";

            return queryWeatherData();
        })
        .catch((err) => {
            console.log(err);
            errorMessageBox.textContent = "Unable to find this city. Please try again.";
        });
};

const initialize = () => {
    queryCityData(defaultCity);
};

const increaseTemperature = () => {
    state.temperature += (state.unit === 'F') ? 1 / 1.8 : 1;
    state.invalidated = true;
    syncDOM();
};

const decreaseTemperature = () => {
    state.temperature -= (state.unit === 'F') ? 1 / 1.8 : 1;
    state.invalidated = true;
    syncDOM();
};

const swapTemperatureUnit = (event) => {
    event.preventDefault();
    state.unit = (state.unit === 'F') ? 'C' : 'F';
    syncDOM();
}
function selectCity() {
    const newCity = cityInput.value.trim();

    if (newCity === "") {
        errorMessageBox.textContent = "Please enter a city name!";
        return;
    }

    queryCityData(newCity);
}

function resetCity() {
    state.cityName= defaultCity;
    //state.temperature = defaultTemperature;
    state.cityLocation = {
        lat: 47.6088012,
        lng: -122.4221973
    };
    state.invalidated = true;
    //cityName.textContent = defaultCity;
    errorMessageBox.textContent = "";
    syncDOM();
    queryWeatherData();
}

const selectSky = () => {
    let inputSky = skySelectBox.value;
    state.skyCategory = inputSky;
    state.sky = skies[inputSky];
    state.invalidated = true;
    syncDOM();
}


const syncWeatherMessage = () => {
    const temp = Math.round(convertTemperature(Number(state.temperature), 'F'));

    if (temp >= 80) {
        weatherMessage.textContent = "Don't forget your sunscreen! ☀️";
    } else if (temp >= 70) {
        weatherMessage.textContent = "Keep your sunny G's out! 😎";
    } else if (temp >= 60) {
        weatherMessage.textContent = "Perfect weather for a little adventure! 🌼";
    } else if (temp >= 50) {
        weatherMessage.textContent = "A little breeze never hurt anyone! 🍃";
    } else if (temp >= 40) {
        weatherMessage.textContent = "Time to grab your favorite hoodie! 🧥";
    } else {
        weatherMessage.textContent = "It's officially hot cocoa weather! ☕";
    }
};

increaseButton.addEventListener("mousedown", increaseTemperature);
decreaseButton.addEventListener("mousedown", decreaseTemperature);
selectButton.addEventListener("click", selectCity);
cityInput.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        selectCity();
    }
});
getWeatherButton.addEventListener("click", () => {
    queryCityData(state.cityName);
});
resetButton.addEventListener("click", resetCity);
skySelectBox.addEventListener("change", selectSky);
tempDisplay.addEventListener("mousedown", swapTemperatureUnit);

initialize();