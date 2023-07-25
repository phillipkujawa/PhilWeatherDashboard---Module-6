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
var errorMessageEl = document.querySelector("#error-message");

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
    function getWeather(city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
        fetch(queryURL)
        .then(function(response) {
            if (!response.ok) { // if status code is not ok, throw an error
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            errorMessageEl.textContent = "";
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var oneCallURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly&appid=" + APIkey + "&units=metric";
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
        .catch(function(error) { // catch any errors and display them to the user
            console.error(error);
            errorMessageEl.textContent = error.message;
        });
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
    // Clear any existing content
    forecastEl.innerHTML = "";

    // Create heading for 5-day forecast
    let forecastHeading = document.createElement("h2");
    forecastHeading.textContent = "5-Day Forecast:";
    forecastHeading.classList.add("mb-3"); // add Bootstrap margin bottom class
    forecastEl.appendChild(forecastHeading);

    // Create container for forecast cards
    let forecastCardsContainer = document.createElement("div");
    forecastCardsContainer.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4", "mt-3");

    for (let i = 1; i < 6; i++) {
        let forecastCard = document.createElement("div");
        forecastCard.classList.add("card", "bg-primary", "text-light", "m-2", "p-2");

        let forecastDate = new Date(data.list[i].dt * 1000);
        let forecastDateEl = document.createElement("h5");
        forecastDateEl.textContent = forecastDate.toDateString();

        let forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png");
        forecastIcon.setAttribute("alt", data.list[i].weather[0].description);

        let forecastTemp = document.createElement("p");
        forecastTemp.textContent = "Temp: " + data.list[i].main.temp + "°F";

        let forecastHumidity = document.createElement("p");
        forecastHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";

        forecastCard.appendChild(forecastDateEl);
        forecastCard.appendChild(forecastIcon);
        forecastCard.appendChild(forecastTemp);
        forecastCard.appendChild(forecastHumidity);

        // Append the card to the container
        forecastCardsContainer.appendChild(forecastCard);
    }

    // Append the container to the forecastEl
    forecastEl.appendChild(forecastCardsContainer);
}
document.getElementById('confirmClear').addEventListener('click', function() {
    localStorage.clear();
    // Refresh the page or update the UI to reflect that the data has been cleared
    location.reload();
});


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


