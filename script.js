
$(document).ready(function (){

    //Gloabalvar decorations

var cityArray = [];

var cityname;

//local storage function

lsCityList();
lsWeather();

//Dispays the city entered by user into DOM

function renderCities(){
    $("#cityList").empty();
    $("#cityInput").val('');

    for (i=0; i < cityArray; i++){
        var a = $('<a>');
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityArray[i]);
        a.text(cityArray[i]);
        $("#cityList").prepend(a);
    }
}

//Pulls city list array from ls

function lsCityList() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));
$("#cityInput").text(savedCities);
console.log(savedCities)
    if (savedCities !== null){

        cityArray= savedCities;
    }
    renderCities();
}

//pull city to display weather forecast

function lsWeather(){

    var savedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (savedWeather !== null){
        cityname = savedWeather;
        displayWeather();
        display5DayForecast();
    }
}

//saves city array to ls

function storeArray() {
    localStorage.setItem("cities", JSON.stringify(cityArray));

}

//saves current display to ls

function storeCurrent() {
    localStorage.setItem("currentCity", JSON.stringify(cityname));

}

//event handler for search button

$("#citySearch").on("click", function(event){
    event.preventDefault();


    cityname = $("#cityInput").val().trim();
    if(cityname === ""){
        alert("Please enter a city to look up.")
    }else if (cityArray.length >= 5){
        cityArray.shift();
        cityArray.push(cityname)
    }else{
        cityArray.push(cityname);
    }
    storeCurrent();
    storeArray();
    renderCities();
    displayWeather();
   display5DayForecast();

});

//event handler if user hits enter after entering city search

$("#cityInput").keypress(function (e){

    if(e.which == 13){
        $("#citySearch").click();
    }
})

//function runs the open weather API AJAX call

async function displayWeather(){

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=03a3736e09588483eda83a7891f2b76e";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      });
        console.log(response);

        var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
        var getCurrentCity = response.name;
        var date = new Date();
        var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();

        var getCurrentWeatherIcon = response.weather[0].icon;
        var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");
        
        var currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity+" ("+val+")");
        currentCityEl.append(displayCurrentWeatherIcon);
        currentWeatherDiv.append(currentCityEl);
        
        var getTemp = response.main.temp.toFixed(1);
        var tempEl = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
        currentWeatherDiv.append(tempEl);
        
        var getHumidity = response.main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        currentWeatherDiv.append(humidityEl);
        
        var getWindSpeed = response.wind.speed.toFixed(1);
        var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        currentWeatherDiv.append(windSpeedEl);
       
        var getLong = response.coord.lon;
        var getLat = response.coord.lat;


        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+getLat+"&lon="+getLong+"&appid=03a3736e09588483eda83a7891f2b76e";
        var uvResponse = await $.ajax   ({
        url: uvURL,
            method: "GET"
        });

        // getting UV Index info and setting color class according to value
        var getUVIndex = uvResponse.value;
        var uvNumber = $("<span>");
        if (getUVIndex > 0 && getUVIndex <= 2.99){
            uvNumber.addClass("low");
        }else if(getUVIndex >= 3 && getUVIndex <= 5.99){
            uvNumber.addClass("moderate");
        }else if(getUVIndex >= 6 && getUVIndex <= 7.99){
            uvNumber.addClass("high");
        }else if(getUVIndex >= 8 && getUVIndex <= 10.99){
            uvNumber.addClass("vhigh");
        }else{
            uvNumber.addClass("extreme");
        } 
        uvNumber.text(getUVIndex);
        var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
        uvNumber.appendTo(uvIndexEl);
        currentWeatherDiv.append(uvIndexEl);
        $("#weatherContainer").html(currentWeatherDiv);
    }

// This function runs the AJAX call for the 5 day forecast and displays them to the DOM
async function display5DayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      });
      var forecastDiv = $("<div  id='fiveDayForecast'>");
      var forecastHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
      forecastDiv.append(forecastHeader);
      var cardDeck = $("<div  class='card-deck'>");
      forecastDiv.append(cardDeck);
      
      console.log(response);
      for (i=0; i<5;i++){
          var forecastCard = $("<div class='card mb-3 mt-3'>");
          var cardBody = $("<div class='card-body'>");
          var date = new Date();
          var val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
          var forecastDate = $("<h5 class='card-title'>").text(val);
          
        cardBody.append(forecastDate);
        var getCurrentWeatherIcon = response.list[i].weather[0].icon;
        console.log(getCurrentWeatherIcon);
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);
        var getTemp = response.list[i].main.temp;
        var tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
        cardBody.append(tempEl);
        var getHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        cardBody.append(humidityEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
      }
      $("#forecastContainer").html(forecastDiv);
    

// This function is used to pass the city in the history list to the displayWeather function
function historyDisplayWeather(){
    cityname = $(this).attr("data-name");
    displayWeather();
    display5DayForecast();
    console.log(cityname);
    
}

$(document).on("click", ".city", historyDisplayWeather);
}

})