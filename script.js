$(document).ready(function (){

//Open array for user input 
var cityList = [];


var cityname;

// functions to display in local storage
lsCityList();
lsWeather();


//What city the user enters will show up in the DOM

function renderCities(){
    $("#cityList").empty();
    $("#cityInput").val("");


    
    for (i=0; i<cityList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#cityList").prepend(a);
    } 
}

// This function pulls the city list array from local storage
function lsCityList() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (savedCities !== null) {
        cityList = savedCities;
    }
    
    renderCities();
    }

// This function pull the current city into local storage to display the current weather forecast on reload
function lsWeather() {
    var savedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (savedWeather !== null) {
        cityname = savedWeather;

        displayWeather();
        displayFiveDayForecast();
    }
}

// This function saves the city array to local storage
function storeArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
    }

// This function saves the currently display city to local storage
function storeCity() {

    localStorage.setItem("currentCity", JSON.stringify(cityname));
}
      

// Click event handler for city search button
$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    cityname = $("#cityInput").val().trim();
    if(cityname === ""){
        alert("Please enter a city to look up")

    }else if (cityList.length >= 5){  
        cityList.shift();
        cityList.push(cityname);

    }else{
    cityList.push(cityname);
    }
    storeCity();
    storeArray();
    renderCities();
    displayWeather();
    displayFiveDayForecast();
});

// Event handler for if the user hits enter after entering the city search term
$("#cityInput").keypress(function(o){
    if(e.which == 13){
        $("#citySearchBtn").click();
    }
})

// This function runs the Open Weather API AJAX call and displays the current city, weather, and 5 day forecast to the DOM
 function displayWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=03a3736e09588483eda83a7891f2b76e";

     $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        console.log(response);
        var WeatherDiv = $("<div class='card-body' id='currentWeather'>");
        var getCity = response.name;
        var date = new Date();
        var calendar=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
        var getWeatherIcon = response.weather[0].icon;
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getWeatherIcon + "@2x.png />");
        var currentCity = $("<h3 class = 'card-body'>").text(getCity+" ("+calendar+")");
        currentCity.append(displayWeatherIcon);
        WeatherDiv.append(currentCity);
        var getTemp = response.main.temp.toFixed(1);
        var temp = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
        WeatherDiv.append(temp);
        var getHumidity = response.main.humidity;
        var humidityp = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        WeatherDiv.append(humidityp);
        var getWindSpeed = response.wind.speed.toFixed(1);
        var windSpeed = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        WeatherDiv.append(windSpeed);
        var getLong = response.coord.lon;
        var getLat = response.coord.lat;



        var locationURL = "https://api.openweathermap.org/data/2.5/uvi?appid=03a3736e09588483eda83a7891f2b76e&lat="+getLat+"&lon="+getLong;
         $.ajax({
            url: locationURL,
            method: "GET"
        }).then(function(uvResponse){
            var getlocIndex = uvResponse.value;
            var locNumber = $("<span>");
            if (getlocIndex > 0 && getlocIndex <= 2.99){
                locNumber.addClass("low");
            }else if(getlocIndex >= 3 && getlocIndex <= 5.99){
                locNumber.addClass("moderate");
            }else if(getlocIndex >= 6 && getlocIndex <= 7.99){
                locNumber.addClass("high");
            }else if(getlocIndex >= 8 && getlocIndex <= 10.99){
                locNumber.addClass("vhigh");
            }else{
                locNumber.addClass("extreme");
            } 
            locNumber.text(getlocIndex);
            var locIndex = $("<p class='card-text'>").text("UV Index: ");
            locNumber.appendTo(locIndex);
            WeatherDiv.append(locIndex);
            $("#weatherContainer").html(WeatherDiv);
        })

      })
        

        
        
        // getting UV Index info and setting color class according to value
        
}

// This function runs the AJAX call for the 5 day forecast and displays them to the DOM
 function displayFiveDayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=03a3736e09588483eda83a7891f2b76e";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        var forecast = $("<div  id='fiveDayForecast'>");
        var fcHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
        forecast.append(fcHeader);
        var fiveDaySection = $("<div  class='card-deck'>");
        forecast.append(fiveDaySection);
        
        console.log(response);
        for (i=0; i<5;i++){
            var forecastSection = $("<div class='card mb-3 mt-3'>");
            var fcBody = $("<div class='card-body'>");
            var date = new Date();
            var calendar=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
            var forecastDate = $("<h5 class='card-title'>").text(calendar);
            
          fcBody.append(forecastDate);
          var getWeatherIcon = response.list[i].weather[0].icon;
          console.log(getWeatherIcon);
          var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getWeatherIcon + ".png />");
          fcBody.append(displayWeatherIcon);
          var getTemp = response.list[i].main.temp;
          var temp = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
          fcBody.append(temp);
          var getHumidity = response.list[i].main.humidity;
          var humidityp = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
          fcBody.append(humidityp);
          forecastSection.append(fcBody);
          fiveDaySection.append(forecastSection);
        }
        $("#forecastContainer").html(forecast);
      })
    }

// This function is used to pass the city in the history list to the displayWeather function
function displayHistoryWeather(){
    cityname = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityname);
    
}

$(document).on("click", ".city", displayHistoryWeather);
})