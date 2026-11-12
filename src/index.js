'use strict';

const API_PREFIX = 'https://ada-weather-report-proxy-server.onrender.com';
const API_LOCATION_ENDPOINT = API_PREFIX + '/location';
const API_WEATHER_ENDPOINT = API_PREFIX + '/weather';

// Select HTML elements
const tempDisplay = document.querySelector("#temperature");
const increaseButton = document.querySelector("#increase-temperature");
const decreaseButton = document.querySelector("#decrease-temperature");

// Select city HTML elements
const cityInput = document.querySelector("#city-input");
const selectButton = document.querySelector("#select-button");
const cityName = document.querySelector("#city-name");
const errorMessageBox = document.querySelector("#error-message");
const getWeatherButton = document.querySelector("#get-weather-button");

//reset city
const resetButton = document.querySelector("#reset-city-button");
const defaultCity = 'Seattle';
//const defaultTemperature = 62;

const skies = [
    // Skies will go here
    // 'cloudy': 'cloud clouds',
];

const landscapes = [
    // Landscape options will go here
    // 'autumn': 'leaf leaf leaf',
];

const state = {
    invalidated: true,
    cityName: 'Seattle',
    cityLocation: {
        lat: 47.6088012,
        lng: -122.4221973
    },
    unit: 'F',
    temperature: 62,
    sky: 0,
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
    if (state.invalidated) {
        cityName.className = 'italic'
    } else {
        cityName.className = ''
    }
};

const syncTemp = () => {
    let temp = Math.round(Number.parseFloat(state.temperature));
    tempDisplay.textContent = `${temp}°${state.unit}`;
    if (state.invalidated) {
        tempDisplay.className = 'italic'
    } else {
        tempDisplay.className = ''
    }
};

const syncWeatherButton = () => {
    if (state.invalidated) {
        getWeatherButton.className = '';
    } else {
        getWeatherButton.className = 'hidden';
    }
};

const syncDOM = () => {
    cityInput.value = "";
    syncCityName();
    syncTemp();
    syncWeatherButton();
};

const queryWeatherData = (lat, lng) => {
    let params = {
        lat: state.cityLocation.lat,
        lon: state.cityLocation.lng
    };
    return axios.get(API_WEATHER_ENDPOINT, { params })
        .then((resp) => {
            console.log(resp);
            state.temperature = convertTemperature(resp.data.main.temp, state.unit);
            state.cityName = resp.data.name;
            state.invalidated = false;
            syncDOM();
        });
};

const queryCityData = (cityName) => {
    let params = {
        q: state.cityName
    };
    return axios.get(API_LOCATION_ENDPOINT, { params })
        .then((resp) => {
            console.log(resp);
            state.cityLocation.lat = resp.data[0].lat;
            state.cityLocation.lng = resp.data[0].lon;
            queryWeatherData();
        })
        .catch((err) => {
            console.log(err);
        });
};

const initialize = () => {
    const cityDataSuccess = queryCityData();
};

// Increase temperature
const increaseTemperature = () => {
    state.temperature++;
    state.invalidated = true;
    syncDOM();
};

// Decrease temperature
const decreaseTemperature = () => {
    state.temperature--;
    state.invalidated = true;
    syncDOM();
};

// Function to select a city
function selectCity() {

    // Get the city entered by the user
    const newCity = cityInput.value.trim();

    // Check if input is empty
    if (newCity === "") {
        errorMessageBox.textContent = "Please enter a city name!";
        return;
    }

    // Update city name
    // cityName.textContent = '- loading -';
    // queryCityData();
    state.cityName = newCity;
    state.invalidated = true;
    syncDOM();

    // Clear error message
    errorMessageBox.textContent = "";
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

increaseButton.addEventListener("click", increaseTemperature);
decreaseButton.addEventListener("click", decreaseTemperature);
selectButton.addEventListener("click", selectCity);
getWeatherButton.addEventListener("click", queryCityData);
resetButton.addEventListener("click", resetCity);

initialize();