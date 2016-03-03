var settings = {
	geoip_api: 'http://freegeoip.net/json/',
	forecast_base_url: 'https://api.forecast.io/forecast/',
	forecast_api_key: ''
}
var city = '';
var country = '';

document.addEventListener('DOMContentLoaded', function() {
	var wwCity = document.getElementById('ww-city');
	wwCity.innerText = 'Currently processing information. Please hold on!';
	// get location
	GET_IP(settings.geoip_api, getForecast);
});

/* this function performs the get IP call
*/
function GET_IP(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.send();
	xhr.onload = function() {
	    var json = xhr.responseText;                         // Response
	    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
	    json = JSON.parse(json);
		callback(json);
	};
}

/* this function performs the get forecast call
*/
function GET_FORECAST(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.send();
	xhr.onload = function() {
	    var json = xhr.responseText;                         // Response
	    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
	    json = JSON.parse(json);
		callback(json);
	};
}

/* get forecast for specific location
*/
function getForecast(data) {
	var time = new Date().getTime();
	time = Math.floor(time / 1000);
	var url = settings.forecast_base_url + settings.forecast_api_key + '/' +
				data.latitude + ',' + data.longitude + ',' + time;
	city = data.city;
	country = data.country_name;
	GET_FORECAST(url, display);
}

/* process and display information on the
 * html page
 */
function display(data) {
	if(!data || !city || !country) {
		var wwCity = document.getElementById('ww-city');
		wwCity.innerText = 'ERROR processing information. Please try again later.';
		return;
	}

	var wwCity = document.getElementById('ww-city');
	wwCity.innerText = 'You are currently in ' + city + ', ' +  country;

	var wwTemp = document.getElementById('ww-temp');
	var curTempCel = convertDegrees(data.currently.temperature);
	var curApparentTempCel = convertDegrees(data.currently.apparentTemperature);
	wwTemp.innerText = 'It is currently ' + curTempCel + ' \u00B0C  and feels like ' +
						curApparentTempCel + ' \u00B0C.';

	var wwSummary = document.getElementById('ww-summary');
	wwSummary.innerText = data.currently.summary;
}

/* this function converts degrees farenheit to 
 * degrees celsius
 */
function convertDegrees(temp) {
	var newTemp = (temp - 32) * (5/9);
	newTemp = Math.floor(newTemp);
	return newTemp;
}

/* this eventListener allows us to create a new tab when we click on 
 * a link in a chrome extension 
 */
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})
