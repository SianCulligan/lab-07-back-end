'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');



const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.send(`It's alllllive!`);
});


//Xrun npm init
//Xrun npm install w/ express, cors, superagent

//list out routes
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventfulHandler);


//callback functions
function locationHandler(request, response){
  try{
    let city = request.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];
        const location = new Location(city, geoData);
        response.send(location);
      })
      .catch(() => {
        errorHandler('not today satan.', request, response);
      });
  }
  catch(error){
    errorHandler(error, request, response);
  }
}

// let allWeather=[];

function weatherHandler(request, response) {
  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${latitude},${longitude}`;
  superagent.get(url)
    .then(data => {
      const weatherSummaries = data.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummaries);
    })
    .catch(() => {
      errorHandler('not today satan.', request, response);
    });
}



function eventfulHandler(request, response) {
  const url = `http://api.eventful.com/json/events/search?location=${locationObj.search_query}&app_key=${process.env.EVENTFUL_API_KEY}`;
  superagent.get(url)
    .then(results => {
      let eventsArr = JSON.parse(results.text).events.event;
      const finalEventsArr = eventsArr.map(value => new Eventful(value));
      response.send(finalEventsArr);
    })
    .catch(error => console.error(error));
}





//constructors
function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function Weather (day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
//   allWeather.push(this);
}

function Eventful (area){
  this.link = area.url;
  this.name = area.title;
  this.event_date = area.start_time;
  this.summary = area.description;
}






//helper functions (error catching)
function errorHandler(error, request, response) {
  response.status(500).send(error);
}




//server "listener"
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));




//route definitions app.get




// app.get('/location', (request, response) => {
//   try{
//     const geoData = require('./data/geo.json');
//     const city = request.query.city;
//     const locationData = new Location(city, geoData);
//     response.send(locationData);
//   }
//   catch(error){
//     errorHandler('Not today, satan.', request, response);
//   }
// })















