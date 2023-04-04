import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import api_key from '../config.json';

function App() {
  const [currentWeather, setCurrentWeather] = useState({});
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
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${latLong}`);
        const weather = await response.json();
        setCurrentWeather(weather.current);
        setLocation(weather.location);
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
  
  return (
    <div className="App"> 
      <div className="container">
        <div className="location-temp">
        <div className="location">location</div>
        <div className="temp">temp</div>
        </div>
        <div className="weather-icon">icon</div>
        <div className="today-date">today date</div>
        <div className="conditions">conditions</div>
        <div className="forecast">forecast</div>
      </div>
    </div>
  )
}

export default App
