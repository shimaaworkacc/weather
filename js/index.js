// Base URL: http://api.weatherapi.com/v1
// Api key: 86a4d093b7a04d52b2b211716252506
// Search for cities starting with Lond: JSON: http://api.weatherapi.com/v1/search.json?key=<YOUR_API_KEY>&q=lond
// So to get current weather for London: JSON: http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London
// To get 7 day weather for US Zipcode 07112: JSON: http://api.weatherapi.com/v1/forecast.json?key=<YOUR_API_KEY>&q=07112&days=7


var API_KEY = "86a4d093b7a04d52b2b211716252506";
var BASE_URL = "http://api.weatherapi.com/v1";

var searchInput = document.getElementById("searchInput");//done
var findBtn = document.getElementById("findBtn");
var today = document.getElementById("today");//done
var todayDate = document.getElementById("todayDate");
var city = document.getElementById("city");//done
var temp = document.getElementById("temp");//done
var icon1 = document.getElementById("icon1");
var icon2 = document.getElementById("icon2");
var icon3 = document.getElementById("icon3");
var status1 = document.getElementById("status1");//done
var status2 = document.getElementById("status2");//done
var status3 = document.getElementById("status3");//done
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var direction = document.getElementById("direction");
var temp2high = document.getElementById("temp2high");
var temp2small = document.getElementById("temp2small");
var temp3high = document.getElementById("temp3high");
var temp3small = document.getElementById("temp3small");
var day2 = document.getElementById("tomorrow");//done
var day3 = document.getElementById("day3");//done

var getDateToday;
var getDateTomorrow;
var getDateDay3;

var myHttp = new XMLHttpRequest();
myHttp.open('GET', BASE_URL + '/search.json?key=' + API_KEY + '&q=' + 'cairo' + '&days=3');
myHttp.send();

myHttp.addEventListener('load', function () {
  if (myHttp.status === 200) {
    var data = JSON.parse(myHttp.responseText);
    displayWeather(data[0].name);

  }
  else {
    console.log('loaded but no response: ' + myHttp.status);
  }


})

document.addEventListener("DOMContentLoaded", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function success(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`)
    .then(res => res.json())
    .then(data => {
      getDateToday=data.location.localtime.split(' ')[0];

      var todayDateObj = new Date(getDateToday);
      var tomorrowDateObj = new Date(todayDateObj);
      var day3Obj = new Date(todayDateObj);
      tomorrowDateObj.setDate(todayDateObj.getDate() + 1);    
        day3Obj.setDate(todayDateObj.getDate() + 2);
      getDateTomorrow = tomorrowDateObj.toISOString().split('T')[0];
      getDateDay3 = day3Obj.toISOString().split('T')[0];

      today.innerHTML = new Date(getDateToday).toLocaleDateString('en-US', { weekday: 'long' });
      todayDate.innerHTML = ` ${getDateToday}`;
      day2.innerHTML = new Date(getDateTomorrow).toLocaleDateString('en-US', { weekday: 'long' });
      day3.innerHTML = new Date(getDateDay3).toLocaleDateString('en-US', { weekday: 'long' });
    })
}
function error() {
  alert("Sorry, no can't veiw your data without location access.");
}


searchInput.addEventListener('input', function () {
  searchCities(searchInput.value).then(cities => {
    if (cities.length > 0) {
      displayWeather(cities[0].name);
    } else {
      console.log("No cities found.");
    }
  }).catch(console.error);
});


async function searchCities(query) {
  var url = `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
  var response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch cities");
  return await response.json();
}

async function displayWeather(city) {
  var url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3`;
  var response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch weather");
  var data = await response.json();

  document.getElementById("city").innerHTML = data.location.name;
  document.getElementById("temp").innerHTML = data.current.temp_c+' <span class="degree fs-1">o</span> C';
  document.getElementById("status1").innerHTML = data.current.condition.text;
  document.getElementById("humidity").innerHTML = data.current.humidity;
  document.getElementById("wind").innerHTML = data.current.wind_kph;
  document.getElementById("direction").innerHTML = data.current.wind_dir;
  document.getElementById("temp2high").innerHTML = data.forecast.forecastday[1].day.maxtemp_c+'<span class="degree2 fs-3">o</span> C';
  document.getElementById("temp2small").innerHTML = data.forecast.forecastday[1].day.mintemp_c+'<span class="degree2 fs-3">o</span> C';
  document.getElementById("status2").innerHTML = data.forecast.forecastday[1].day.condition.text;
  document.getElementById("temp3high").innerHTML = data.forecast.forecastday[2].day.maxtemp_c+'<span class="degree2 fs-3">o</span> C';
  document.getElementById("temp3small").innerHTML = data.forecast.forecastday[2].day.mintemp_c+'<span class="degree2 fs-3">o</span> C';
  document.getElementById("status3").innerHTML = data.forecast.forecastday[2].day.condition.text;
  icon1.src = "https:" + data.current.condition.icon;

};
