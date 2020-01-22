'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');



const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.send('Home Page');
})

//route definitions app.get

function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

app.get('/location', (request, response) => {
  try{
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    response.send(locationData);
  }
  catch(error){
    errorHandler('Not today, satan.', request, response);
  }
})

function Weather (skyData) {
  this.forecast = skyData.summary;
  this.time = new Date(skyData.time * 1000).toDateString();
  allWeather.push(this);
}

let allWeather=[];

app.get('/weather', (request, response) => {
  try{
    const skyData = require('./data/darksky.json');
    skyData.daily.data.forEach ((byDate) => {
      new Weather(byDate);
      console.log(allWeather);
    });
    response.send(allWeather);
  }
  catch(error){
    errorHandler('Not today, satan.', request, response);
  }
})













app.listen(PORT, () => console.log(`Server up on port ${PORT}`));