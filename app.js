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
        var oneCallURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly&appid=" + APIkey;
        fetch(oneCallURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayWeather(data);
            saveSearchHistory(city);
        })
    })
    
}
function displayWeather(data) {
    var city = data.city.name;
    var temp = data.list[0].main.temp;
    var humidity = data.list[0].main.humidity;
    var windSpeed = data.list[0].wind.speed;
    var icon = data.list[0].weather[0].icon;
    currentCity.textContent = city;
    currentTemp.textContent = "Temperature: " + temp + "°F";
    currentHumidity.textContent = "Humidity: " + humidity + "%";
    currentWindSpeed.textContent = "Wind Speed: " + windSpeed + " MPH";
    var currentIcon = document.createElement("img");
    currentCity.appendChild(currentIcon);
    currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + icon + ".png");
    currentIcon.setAttribute("alt", data.list[0].weather[0].description);

    displayForecast(data);
}
function displayForecast(data) {
    forecastEl.innerHTML = "";
    for (var i = 1; i < 6; i++) {
        var forecastCard = document.createElement("div");
        forecastCard.classList.add("card", "bg-primary", "text-light", "m-2", "p-2");
        var forecastDate = document.createElement("h5");
        // forecastDate.textContent = moment().add(i, "days").format("L");
        var forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png");
        forecastIcon.setAttribute("alt", data.list[i].weather[0].description);
        var forecastTemp = document.createElement("p");
        forecastTemp.textContent = "Temp: " + data.list[i].main.temp + "°F";
        var forecastHumidity = document.createElement("p");
        forecastHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";
        forecastCard.appendChild(forecastDate);
        forecastCard.appendChild(forecastIcon);
        forecastCard.appendChild(forecastTemp);
        forecastCard.appendChild(forecastHumidity);
        forecastEl.appendChild(forecastCard);
    }
}
// function to save search history
function saveSearchHistory(city) {
    if(!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    renderSearchHistory();
}
// function to render search history
function renderSearchHistory() {
    searchHistoryEl.innerHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        let historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function() {
            getWeather(historyItem.value);
        })
        searchHistoryEl.appendChild(historyItem);
    }
}
// function to load search history
function loadSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    renderSearchHistory();
}
loadSearchHistory();


