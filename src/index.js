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


const queryWeatherData = (cityName) => {

};



// END
