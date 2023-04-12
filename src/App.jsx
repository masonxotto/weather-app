import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
//import api_key from '../config.json';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState({});
  const [currentCondition, setCurrentCondition] = useState({});
  const [location, setLocation] = useState({});
  const [next24Hours, setNext24Hours] = useState([]);
  const dateRange = 6;
  //const [currentForecast, setCurrentForecast] = useState([]);
  //const [hourlyConditions, setHourlyConditions] = useState([]);
  //const [currentTime , setCurrentTime] = useState('');

  //weatherapi.com key
  const APIKEY = import.meta.env.VITE_API_KEY;

  /*
    On mount latitude and longitude will be set if geolocation is enabled in browser.
    getWeather() will then request weather for those coords from weatherapi.com
    This saves the location data and the current weather data in location and currentWeather
  */
  useEffect(() => {
    
    async function getWeather() {
      if("geolocation" in navigator) {
        //gets latitude and longitue position for location to be sent to API for weather data
        const position = await getLocation();
        const latLong = `${position.coords.latitude},${position.coords.longitude}`;
        const theDate = new Date();
        const date = theDate.toISOString().slice(0, 10);
        const time = theDate.getHours() + ":" + theDate.getMinutes();
        //setCurrentTime(time);
        //sets future date to get date range for forecast - today through future date
        let futureDate = new Date(date);
        futureDate.setDate(futureDate.getDate() + dateRange);
        futureDate = futureDate.toISOString().slice(0, 10);
        
        //fetch to weather api
        const weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${latLong}&days=6&dt=${date}&dt=${futureDate}`);
        const weather = await weatherResponse.json();

        setCurrentWeather(weather.current);
        setCurrentCondition(weather.current.condition);
        setLocation(weather.location);
        set24HourConditions(weather.forecast.forecastday[0]["hour"], weather.forecast.forecastday[1]["hour"], time);
        setLoading(false);
        //setCurrentForecast(weather.forecast.forecastday);
        //setHourlyConditions(weather.forecast.forecastday[0]["hour"]);
        //setNextDayConditons(weather.forecast.forecastday[1]["hour"]);
      }
    }
    getWeather();
  }, []);

  /*
      Set a 24 hour conditions state to hold the conditions for the next 24 hours
    */
      function set24HourConditions(today, tomorrow, time) {
        const hours = parseInt(time.slice(0,2));
        const nextDays = hours;
        const conditionArr = []; 
        for(let i = hours; i < 24; i++) {
          conditionArr.push(today[i]);
        }
        for(let i = 0; i < nextDays; i++) {
          conditionArr.push(tomorrow[i]);
        }
        setNext24Hours(conditionArr);
      }

  /*
    Returns current position. Will extract latitude and longitude from this.
  */
  function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
  }

  /* 
    Compares current time to another time, if current time is larger or later than compare time
    then return true, otherwise it will return false
  */
  function compareTime(current, compare) {
    const currentHour = current.slice(0,2);
    const currentMinutes = current.slice(3,5);
    const compareHour = compare.slice(0,2);
    const compareMinutes = compare.slice(3,5);

    if(currentHour > compareHour) {
      return true;
    }
    if (currentHour === compareHour) {
      if(currentMinutes > compareMinutes) {
        return true;
      }
      if(currentMinutes === compareMinutes) {
        return true;
      }
    }
    return false;
  }

  function convertTo12Hour(time) {
    const hour = (time.slice(0,2));
    const minutes = time.slice(2);
    if(hour === '00') {
      return '12' + minutes + ' AM';
    }
    if(hour === '12') {
      return '12' + minutes + ' PM';; 
    }
    if(parseInt(hour) < 12) {
      return hour + minutes + ' AM';
    }
    return (parseInt(hour-12)).toString() + minutes + ' PM';
  }

  return (
    <div className="App"> 
      {!loading &&
        <div className="container">
        <div className="location-temp">
          <div className="temp">{`${Math.round(parseInt(currentWeather.temp_f))}`}&#176;F</div>
          <div className="location">{`${location.name}, ${location.region}`}</div>
        </div>
        <div className="weather-icon">
          <img src={currentCondition.icon}/>
          <div className="current-condition">{currentCondition.text}</div>
        </div>
        <div className="conditions">
          {next24Hours.map((condition, idx) => {
              return(
                <div className="condition-card" key={idx}>
                  <span>{Math.round(parseInt(condition.temp_f))}&#176;F</span>
                  <img src={condition.condition.icon}/>
                  <span style={{fontSize: '14px'}}>{convertTo12Hour((condition.time).slice(11))}</span>
                </div>
              );
          })}
        </div>
        <div className="forecast"></div>
      </div>
      }
      {loading && 
        <div className='container'>
        </div>
      }
    </div>
  )
}

export default App
