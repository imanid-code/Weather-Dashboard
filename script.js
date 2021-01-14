$(document).ready(function (){

//Open array for user input 
var cityList = [];

//just stores into memory , gives us the freedom to change value throughout the document - global scope is before the object , available everywhere - global is declared before function 
//local scope is only available inside function 
var cityname;

// functions to display in local storage
lsCityList();
lsWeather();


//What city the user enters will show up in the DOM
//this function empties the list of cities already enter and puts the value of the next cityInput into a string
function renderCities(){
    //if you don't empty , causes duplicates in cities 
    $("#cityList").empty();
    $("#cityInput").val("");


    
    for (i=0; i<cityList.length; i++){
        // acnchor element , creates link to click on already viewed cities 
        var a = $("<a>");
        //bootstrap
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        //adds the attribute of the data name and add's it to the cityList array, the city name is being attached to data-name
        a.attr("data-name", cityList[i]);
       //takes the text from the array and returns it,
        a.text(cityList[i]);
        //puts the cityList before a-anchor element 
        $("#cityList").prepend(a);
    } 
}

//Takes the city array from ls
function lsCityList() {
    //json.parse = strings to objects in ls - the key you need to access data in ls , giving a name for you data in ls 
    var savedCities = JSON.parse(localStorage.getItem("cities"));
    //if savedCities are not equal value or type then the cityList array equals the city they saved 
    if (savedCities !== null) {
        cityList = savedCities;
    }
    //display the city
    renderCities();
    }


//Takes the current city and put it in ls to display the current weather when page refreshes
function lsWeather() {
    var savedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (savedWeather !== null) {
        cityname = savedWeather;

        displayWeather();
        displayFiveDayForecast();
    }
}

// This function saves the city array to local storage
//setItem sets the data and the keyword ("cities") is what getItem uses , setItem is setting citylistarray
function storeArray() {
    //json.stringify sets object to string 
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
        //>= greater than or equal to
    }else if (cityList.length >= 5){  
        //.shift removes the first item of an array, changes legnth and returns removed item
        cityList.shift();
        //.push adds a new element to an array
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

//Allows enter to sumbit the request 
$("#cityInput").keypress(function(event){
    
    //event object  , .which is saying which key is pressed , 13 = enter key 
    if(event.which == 13){
        $("#citySearchBtn").click(); //does this click refer back to the previous button function? 
    }
})


//Runs the weather API by the ajax call and displays city, weather and 5 day fc 
function displayWeather() {
//var queryURL holds the site and api keys for info to be pulled from , city name is what we are pulling 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=03a3736e09588483eda83a7891f2b76e";
    //.ajax calls on the website using get method, getting what we are calling , . then says after you call on site then do this function(response)
     
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){


          //console.log(response) put the response from api in the console.log
          
          
        console.log(response);

        //adds a div to html with the following 
        var WeatherDiv = $("<div class='card-body' id='currentWeather'>");

        //the response from the api will send back the name
        var getCity = response.name;

        //?
        var date = new Date();

        //??using previous var 
        var calendar=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
        
        //shows weather icon
        var getWeatherIcon = response.weather[0].icon;

        //adds a image and the weather icon (previous)
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getWeatherIcon + "@2x.png />");
       
       //add h3 heading + text of the response to get city + the calendar from var calendar
        var currentCity = $("<h3 class = 'card-body'>").text(getCity+" ("+calendar+")");
        
        //currenty puts displayweathericon after it 
        currentCity.append(displayWeatherIcon);

        //weatherdiv puts current city after it 
        WeatherDiv.append(currentCity);

        //get the main temp and only allows 1 decimal after it
        var getTemp = response.main.temp.toFixed(1);

        // adds paragraph + the text from the Temperature: returned value from getTemp + F
        var temp = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
       
       //WeatherDiv put temp after 
        WeatherDiv.append(temp);
        
        //get the main humidity from api
        var getHumidity = response.main.humidity;

        //add paragraph + text reading "Humidity: getHumidity(variable) + %"
        var humidityp = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        
        //put humidity after weather div
        WeatherDiv.append(humidityp);

        //get wind speed and allow one decimal after 
        var getWindSpeed = response.wind.speed.toFixed(1);

        //add paragraph then text 
        var windSpeed = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        
        //add windspeed after weatherdiv
        WeatherDiv.append(windSpeed);

        //grabbing coordinates from api
        var getLong = response.coord.lon;
        var getLat = response.coord.lat;



        var locationURL = "https://api.openweathermap.org/data/2.5/uvi?appid=03a3736e09588483eda83a7891f2b76e&lat="+getLat+"&lon="+getLong;
         $.ajax({
            url: locationURL,
            method: "GET"
        }).then(function(locResponse){

            //value of response
            var getlocIndex = locResponse.value;

            // getting UV Index info and setting color class according to value in css 
            //creates span - same as div but inline vs block
            var locNumber = $("<span>");
            // if greater than 0 and less than or equal to 2.99 add class low
            if (getlocIndex > 0 && getlocIndex <= 2.99){
                locNumber.addClass("low");

              //if greater than or = to 3 and less than or = to 5.99 add class moderate  
            }else if(getlocIndex >= 3 && getlocIndex <= 5.99){
                locNumber.addClass("moderate");

                //if greater than or = to 6 and less than or = to 7.99 add class high
            }else if(getlocIndex >= 6 && getlocIndex <= 7.99){
                locNumber.addClass("high");

                //if greater than or = to 8 and less than or = to 10.99 add class vhigh
            }else if(getlocIndex >= 8 && getlocIndex <= 10.99){
                locNumber.addClass("vhigh");
            }else{
                //if none of those add class extreme
                locNumber.addClass("extreme");
            } 

            //in this span locNumber add the text from getlocIndex value 
            locNumber.text(getlocIndex);
            // add paragraph and the text UV INDEX: then add value from getLocIndex
            var locIndex = $("<p class='card-text'>").text("UV Index: ");
            //locNumber goes after locIndex
            locNumber.appendTo(locIndex);
            WeatherDiv.append(locIndex);
            $("#weatherContainer").html(WeatherDiv);
        })

      })
        

        
        
        
        
}


//runs ajax for 5 day forecast puts in DOM  - card class=BOOTSTRAP
function displayFiveDayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=03a3736e09588483eda83a7891f2b76e";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
          //add Div w. id 
        var forecast = $("<div  id='fiveDayForecast'>");

        //header and text 
        var fcHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
        
        //put the forcast div after the header 
        forecast.append(fcHeader);

        //add div and class 
        var fiveDaySection = $("<div  class='card-deck'>");
        //put forecast div afterthe 5day section
        forecast.append(fiveDaySection);
        
        console.log(response);
        for (i=0; i<5;i++){
//card class = BOOTSTRAP

            //add div with card class BOOTSTRAP 
            var forecastSection = $("<div class='card mb-3 mt-3'>");

            //creating div for card body
            var fcBody = $("<div class='card-body'>");

            // new Date is built in method , get is getting it from Date()
            var date = new Date();
            var calendar=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
            var forecastDate = $("<h5 class='card-title'>").text(calendar);
            
          fcBody.append(forecastDate);
          var getWeatherIcon = response.list[i].weather[0].icon;
          console.log(getWeatherIcon);
          var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getWeatherIcon + ".png />");
          fcBody.append(displayWeatherIcon);

          //list i 
          var getTemp = response.list[i].main.temp;
          var temp = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
          fcBody.append(temp);
          var getHumidity = response.list[i].main.humidity;
          var humidityp = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
          fcBody.append(humidityp);
          forecastSection.append(fcBody);
          fiveDaySection.append(forecastSection);
        }
        // .html - setting/adding each element inside forecast container , creating a div inside forecast container
        $("#forecastContainer").html(forecast);
      })
    }


// pass city in history list to displayWeather function 

function displayHistory(){
    cityname = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityname);
    
}

$(document).on("click", ".city", displayHistory);
})