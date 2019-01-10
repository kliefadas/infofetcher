/* eslint-disable */
import TibiaAPI from './src/tibia-api';
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
  worldName: "Estela"
}
  const between = function( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms/one_day);
  }
  setInterval( ()=>{
const date1 = new Date()
    tibiaAPI.checkCharakterDeathsInWorld(options).then((result) => {
const date2 = new Date()
      const fs = require('fs');

      fs.appendFile('message.txt', (JSON.stringify(result, null, 4)), function (err) {
        if (err) throw err;
        console.log(between(date1,date2));
      });
    console.log(result,result.length)
  }).catch((error) => {
    console.log(error)
  })
  }, 14000);

});
