import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import api_key from '../config.json';

function App() {
  const [currentWeather, setCurrentWeather] = useState({});
  const [currentCondition, setCurrentCondition] = useState({});
  const [currentForecast, setCurrentForecast] = useState([]);
  const [location, setLocation] = useState({});

  //weatherapi.com key
  const APIKEY = api_key.api_key;

  /*
    On mount latitude and longitude will be set if geolocation is enabled in browser.
    getWeather() will then request weather for those coords from weatherapi.com
    This saves the location data and the current weather data in location and currentWeather
  */
  useEffect(() => {
    async function getWeather() {
      if("geolocation" in navigator) {
        const position = await getLocation();
        const latLong = `${position.coords.latitude},${position.coords.longitude}`;
        const weatherResponse = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${latLong}`);
        const weather = await weatherResponse.json();
        setCurrentWeather(weather.current);
        setCurrentCondition(weather.current.condition);
        setLocation(weather.location);
        setCurrentForecast(weather.forecast.forecastday.map((forecast) => {
          return [...currentForecast, forecast.hour];
        }));
      }
    }
    getWeather();
  }, []);


  /*
    Returns current position. Will extract latitude and longitude from this.
  */
  function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
  }
  
  let date = new Date();
  date = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });


  return (
    <div className="App"> 
      <div className="container">
        <div className="location-temp">
          <div className="temp">{`${currentWeather.temp_f}`}&#176;F</div>
          <div className="location">{`${location.name}, ${location.region}`}</div>
        </div>
        <div className="weather-icon"><img src={currentCondition.icon}/></div>
        <div className="current-condition">{currentCondition.text}</div>
        <div className="conditions">conditions</div>
        <div className="forecast">forecast</div>
      </div>
    </div>
  )
}

export default App
