var APIkey = "33a109799f5934b9fa42dd4f7a56545b";
var city = "Philadelphia";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
var searchHistory = [];
var searchForm = document.querySelector("#search-form");
var searchHistoryEl = document.querySelector("#search-history");
var searchBtn = document.querySelector("#search-btn");
var searchInput = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");
var currentCity = document.querySelector("#city-name");
var currentTemp = document.querySelector("#current-temp");
var currentHumidity = document.querySelector("#current-humidity");
var currentWindSpeed = document.querySelector("#current-wind");
var currentUVIndex = document.querySelector("#current-uv");
var currentIcon = document.querySelector("#current-icon");

// code to read input from user
searchForm.addEventListener("submit", handleUserSearch);

// function to handle user search
function handleUserSearch(event) {
    event.preventDefault();
    var city = searchInput.value.trim();
    if (city) {
        console.log(city);
        getWeather(city);
        searchInput.value = "";
    } else {
        alert("Please enter a city");
    }
    }
function getWeather (city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    fetch(queryURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly&appid=" + APIkey;
        fetch(oneCallURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayWeather(data);
        })
    })
}