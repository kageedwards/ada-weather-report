'use strict';

const skies = [
    // Skies will go here
];

const landscapes = [
    // Landscape options will go here
];

const appState = {
    cityName: '',
    temperature: 0,
    sky: 0,
    landscape: 0,
    background: 0
};

const initialize = () => {

};

const syncDOM = () => {

};


// Starting temperature
let temperature = 62;

// Select HTML elements
const tempDisplay = document.querySelector("#temperature");
const increaseButton = document.querySelector("#increase-temperature");
const decreaseButton = document.querySelector("#decrease-temperature");

// Increase temperature
function increaseTemperature() {
    temperature++;
    tempDisplay.textContent = `${temperature}°F`;
}

// Decrease temperature
function decreaseTemperature() {
    temperature--;
    tempDisplay.textContent = `${temperature}°F`;
}

// Event listeners
increaseButton.addEventListener("click", increaseTemperature);
decreaseButton.addEventListener("click", decreaseTemperature);


// Select city HTML elements
const cityInput = document.querySelector("#city-input");
const selectButton = document.querySelector("#select-button");
const cityName = document.querySelector("#city-name");
const errorMessage = document.querySelector("#error-message");

// Function to select a city
function selectCity() {

    // Get the city entered by the user
    const newCity = cityInput.value.trim();

    // Check if input is empty
    if (newCity === "") {
        errorMessage.textContent = "Please enter a city name!";
        return;
    }

    // Update city name
    cityName.textContent = newCity;

    // Clear error message
    errorMessage.textContent = "";

    // Clear input field
    cityInput.value = "";
}

// Listen for button click
selectButton.addEventListener("click", selectCity);


//reset city
const resetButton = document.querySelector("#reset-city-button");
const defaultCity = "Seattle";

function resetCity() {
    cityName.textContent = defaultCity;
    cityInput.value = "";
    errorMessage.textContent = "";
}
resetButton.addEventListener("click", resetCity);

const queryWeatherData = (cityName) => {

};



// END
