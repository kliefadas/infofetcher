'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable */


var _utils = require('./utils');

var _stringUtils = require('./string-utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');

var TibiaAPI = function () {
  function TibiaAPI(props) {
    _classCallCheck(this, TibiaAPI);

    if (props && props.worldName) {
      this.worldName = props.worldName;
    }
  }

  _createClass(TibiaAPI, [{
    key: 'getOnlinePlayers',
    value: function getOnlinePlayers(worldName) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var worldNameToUse = worldName ? worldName : _this.worldName;
        if (!worldNameToUse) {
          console.warn('No Game word passed');
          return;
        }
        (0, _utils.isAValidWorld)(worldNameToUse).then(function (isValid) {
          if (isValid) {
            (0, _utils.getOnlinePlayersByWorld)(worldNameToUse).then(function (result) {
              resolve(result);
            }).catch(function (error) {
              return console.log(error);
            });
          } else {
            reject(worldNameToUse + ' is not a valud Server World');
          }
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getCharacterInformation',
    value: function getCharacterInformation(characterName) {
      if (!characterName) {
        console.warn('Characte rname is needed');
        return;
      };
      return new Promise(function (resolve, reject) {
        (0, _utils.getCharacterInformationByName)(characterName).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'checkCharakterDeathsInWorld',
    value: function checkCharakterDeathsInWorld(options) {
      var _this2 = this;

      if (!options) {
        console.warn('options are needed, like worldName');
        return;
      };
      return new Promise(function (resolve, reject) {
        (0, _utils.getOnlinePlayersByWorld)(options.worldName).then(function (result) {
          _this2.getCharakterDeathsOfList(result).then(function (result) {
            resolve(result);
          }).catch(function (error) {
            return reject(error);
          });
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getCharakterDeathsOfList',
    value: function getCharakterDeathsOfList(listOfChars) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        console.log(listOfChars.length, "total requ");
        return Promise.map(listOfChars, function (listItem) {

          return _this3.getLastestCharacterDeathInformation(listItem.name).then(function (result) {
            return result;
          });
        }, { concurrency: 10 }).then(function (result) {
          var returnResult = result.reduce(function (accumulatedResult, item) {
            if (item.length !== 0) accumulatedResult.push(item);
            return accumulatedResult;
          }, []);
          resolve(returnResult);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getCharacterDeathInformation',
    value: function getCharacterDeathInformation(characterName) {
      if (!characterName) {
        console.warn('Charactername is needed');
        return;
      };
      return new Promise(function (resolve, reject) {
        (0, _utils.getCharacterDeathInformationByName)(characterName).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getLastestCharacterDeathInformation',
    value: function getLastestCharacterDeathInformation(characterName) {
      if (!characterName) {
        console.warn('Charactername is needed');
        return;
      };
      return new Promise(function (resolve, reject) {
        (0, _utils.lastestTibiaCharacterDeath)(characterName).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getGuildInformation',
    value: function getGuildInformation(_ref) {
      var guildUrl = _ref.guildUrl;

      if (!guildUrl) {
        console.warn('Guild Name or url is needed');
        return;
      };
      var guildUrlToUse = guildUrl;
      var baseGuildsUrl = 'https://secure.tibia.com/community/?subtopic=guilds&page=view&GuildName=';
      var isByUrl = (0, _stringUtils.isUrl)(guildUrl);
      if (!isByUrl) {
        guildUrlToUse = '' + baseGuildsUrl + guildNameOrUrl.replace(/ /g, '+');
      };
      return new Promise(function (resolve, reject) {
        (0, _utils.getGuildInformationByUrl)(guildUrlToUse).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }]);

  return TibiaAPI;
}();

exports.default = TibiaAPI;