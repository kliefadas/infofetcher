'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGuildInformationByUrl = exports.lastestTibiaCharacterDeath = exports.getCharacterDeathInformationByName = exports.getCharacterInformationByName = exports.getOnlinePlayersByWorld = exports.isAValidWorld = exports.getTibiaWorlds = exports.requestUrl = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _tinyreq = require('tinyreq');

var _tinyreq2 = _interopRequireDefault(_tinyreq);

var _parsers = require('./parsers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Promise = require("bluebird"); /* eslint-disable */
var requestUrl = exports.requestUrl = function requestUrl(url, parser) {
  return new Promise(function (resolve, reject) {
    var concatUrl = 'http://localhost:8080/?url=' + encodeURIComponent(url.trim());
    concatUrl = concatUrl.replace(/%C2%A0/g, "%20");
    //var concatUrl = url
    //console.log(url)
    /*    await requester.get(url.trim(), {}, function (body) {
          //console.log(parser(body))
          resolve(parser(body));
        });*/

    (0, _tinyreq2.default)(concatUrl, function (error, body) {
      if (error) reject(error);
      //console.log(parser(body).length)
      var parse = parser(body);
      resolve(parse);
    }).catch(function (error) {
      console.log(error);
    });
  }).timeout(10000).catch(Promise.TimeoutError, function (e) {
    console.log("could not read file within 10000ms, restart request with url", url);
    return requestUrl(url, parser);
  });
};

var getTibiaWorlds = exports.getTibiaWorlds = function getTibiaWorlds() {
  return new Promise(function (resolve, reject) {
    var tibiaWorldsURL = 'https://www.tibia.com/community/?subtopic=worlds';
    requestUrl(tibiaWorldsURL, _parsers.tibiaWorldsParser).then(function (result) {
      resolve(result);
    }).catch(function (error) {
      return reject(error);
    });
  });
};

var isAValidWorld = exports.isAValidWorld = function isAValidWorld(world) {
  return new Promise(function (resolve) {
    getTibiaWorlds().then(function (result) {
      return resolve(_lodash2.default.findIndex(result, function (world) {
        return world.name === world;
      }));
    }).catch(function (error) {
      return console.log(error);
    });
  });
};

var getOnlinePlayersByWorld = exports.getOnlinePlayersByWorld = function getOnlinePlayersByWorld(world) {
  return new Promise(function (resolve, reject) {
    var charactersByWorldUrl = '\n      https://secure.tibia.com/community/?subtopic=worlds&order=level_desc&world=' + world + '\n    ';
    requestUrl(charactersByWorldUrl, _parsers.tibiaOnlinePlayersParser).then(function (result) {
      resolve(result);
    }).catch(function (error) {
      return reject(error);
    });
  });
};

var getCharacterInformationByName = exports.getCharacterInformationByName = function getCharacterInformationByName(characterName) {
  return new Promise(function (resolve, reject) {
    var characterByNameUrl = '\n      https://secure.tibia.com/community/?subtopic=characters&name=' + characterName + '\n    ';
    requestUrl(characterByNameUrl, _parsers.tibiaCharacterDataParser).then(function (result) {
      resolve(result);
    }).catch(function (error) {
      return reject(error);
    });
  });
};

var getCharacterDeathInformationByName = exports.getCharacterDeathInformationByName = function getCharacterDeathInformationByName(characterName) {
  return new Promise(function (resolve, reject) {
    var characterByNameUrl = '\n     https://secure.tibia.com/community/?subtopic=characters&name=' + characterName + '\n    ';
    requestUrl(characterByNameUrl, _parsers.tibiaCharacterDeathParser).then(function (result) {
      resolve(result);
    }).catch(function (error) {
      return reject(error);
    });
  });
};

var lastestTibiaCharacterDeath = exports.lastestTibiaCharacterDeath = function lastestTibiaCharacterDeath(characterName) {
  return new Promise(function (resolve, reject) {
    var characterByNameUrl = '\n     https://secure.tibia.com/community/?subtopic=characters&name=' + characterName + '\n    ';
    console.log(characterName);
    requestUrl(characterByNameUrl, _parsers.lastestTibiaCharacterDeathParser).then(function (result) {
      resolve(result);
    }).catch(function (error) {
      return reject(error);
    });
  });
};

var getGuildInformationByUrl = exports.getGuildInformationByUrl = function getGuildInformationByUrl(guildUrl) {
  return new Promise(function (resolve, reject) {
    requestUrl(guildUrl, _parsers.tibiaGuildInformationParser).then(function (result) {
      resolve(result);
    }).catch(function (error) {
      return reject(error);
    });
  });
};