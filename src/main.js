/* eslint-disable */
import TibiaAPI from './tibia-api';
//var {TibiaAPI} = require('./tibia-api/src/tibia-api')

var express = require('express');
var app = express();

var server = app.listen(3000, () => {
  const tibiaAPI = new TibiaAPI();

/*  tibiaAPI.getOnlinePlayers("Estela").then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })*/
/*  tibiaAPI.getCharacterDeathInformation("zombie raviel").then((result) => {
    //console.log(result)
  }).catch((error) => {
    console.log(error)
  })*/
let options = {
  worldName: "Zuna"
}
  setInterval( ()=>{
    tibiaAPI.checkCharakterDeathsInWorld(options).then((result) => {
    console.log(result,result.length)
  }).catch((error) => {
    console.log(error)
  })
  }, 10000);

});
