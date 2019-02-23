/* eslint-disable */
import _ from 'lodash';
import tinyreq from 'tinyreq';
import {
  tibiaWorldsParser,
  tibiaOnlinePlayersParser,
  tibiaCharacterDataParser,
  tibiaCharacterDeathParser,
  tibiaGuildInformationParser,
  lastestTibiaCharacterDeathParser
} from './parsers';
const Promise = require("bluebird");

export const requestUrl = (url, parser) => {
  return new Promise( (resolve, reject) => {
    /*let concatUrl = 'http://localhost:8080/?url=' + encodeURIComponent(url.trim())
    concatUrl = concatUrl.replace(/%C2%A0/g, "%20")*/
    var concatUrl = url
    //console.log(url)
    /*    await requester.get(url.trim(), {}, function (body) {
          //console.log(parser(body))
          resolve(parser(body));
        });*/
    tinyreq(concatUrl, (error, body) => {
      if (error) reject(error);
      //console.log(parser(body).length)
      let parse = parser(body)
      resolve(parse)
    }).catch((error) => {
      console.log(error)
    })
  }).timeout(10000)
    .catch(Promise.TimeoutError, function(e) {
      console.log("could not read file within 10000ms, restart request with url",url);
      return requestUrl(url, parser)
    })
};

export const getTibiaWorlds = () => (
  new Promise((resolve, reject) => {
    const tibiaWorldsURL = 'https://www.tibia.com/community/?subtopic=worlds';
    requestUrl( tibiaWorldsURL, tibiaWorldsParser).then((result) => {
      resolve(result);
    }).catch((error) => reject(error))
  })
);

export const isAValidWorld = world => {
  return new Promise((resolve) => {
    getTibiaWorlds().then((result) => (
      resolve(_.findIndex(result, (world) => world.name === world))
    )).catch((error) => console.log(error))
  });
};

export const getOnlinePlayersByWorld = world => (
  new Promise((resolve, reject) => {
    const charactersByWorldUrl = `
      https://secure.tibia.com/community/?subtopic=worlds&order=level_desc&world=${world}
    `;
    requestUrl(charactersByWorldUrl, tibiaOnlinePlayersParser).then((result) => {
      resolve(result);
    }).catch((error) => reject(error))
  })
);


export const getCharacterInformationByName = characterName => (
  new Promise((resolve, reject) => {
    const characterByNameUrl = `
      https://secure.tibia.com/community/?subtopic=characters&name=${characterName}
    `;
    requestUrl(characterByNameUrl, tibiaCharacterDataParser).then((result) => {
      resolve(result)
    }).catch((error) => reject(error))
  })
);

export const getCharacterDeathInformationByName = characterName => (
  new Promise((resolve, reject) => {
    const characterByNameUrl = `
     https://secure.tibia.com/community/?subtopic=characters&name=${characterName}
    `;
    requestUrl(characterByNameUrl, tibiaCharacterDeathParser).then((result) => {
      resolve(result);
    }).catch((error) => reject(error))
  })
);

export const lastestTibiaCharacterDeath = characterName => (
  new Promise( (resolve, reject) => {
    const characterByNameUrl = `
     https://secure.tibia.com/community/?subtopic=characters&name=${characterName}
    `;
    console.log(characterName)
    requestUrl(characterByNameUrl, lastestTibiaCharacterDeathParser).then((result) => {
      resolve(result);
    }).catch((error) => reject(error))
  })
);

export const getGuildInformationByUrl = guildUrl => (
  new Promise((resolve, reject) => {
    requestUrl(guildUrl, tibiaGuildInformationParser).then((result) => {
      resolve(result);
    }).catch((error) => reject(error))
  })
)
