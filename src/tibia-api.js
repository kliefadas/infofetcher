/* eslint-disable */
import {
  requestUrl,
  isAValidWorld,
  getTibiaWorlds,
  getOnlinePlayersByWorld,
  getGuildInformationByUrl,
  getCharacterInformationByName,
  getCharacterDeathInformationByName,
  lastestTibiaCharacterDeath
} from './utils';
import { isUrl } from './string-utils';

export default class TibiaAPI {
  constructor(props) {
    if (props && props.worldName) {
      this.worldName = props.worldName;
    }
  }

  getOnlinePlayers(worldName) {
    return new Promise((resolve, reject) => {
      let worldNameToUse = worldName ? worldName : this.worldName;
      if (!worldNameToUse) {
        console.warn('No Game word passed');
        return;
      }
      isAValidWorld(worldNameToUse).then((isValid) => {
        if (isValid) {
          getOnlinePlayersByWorld(worldNameToUse).then((result) => {
            resolve(result)
          }).catch((error) => console.log(error))
        } else {
          reject(`${worldNameToUse} is not a valud Server World`);
        }
      }).catch((error) => reject(error));
    });
  }

  getCharacterInformation(characterName) {
    if (!characterName) {
      console.warn('Characte rname is needed');
      return;
    };
    return new Promise((resolve, reject) => {
      getCharacterInformationByName(characterName).then((result) => {
        resolve(result);
      }).catch((error) => reject(error));
    });
  }

  checkCharakterDeathsInWorld(options) {
    if (!options) {
      console.warn('options are needed, like worldName');
      return;
    };
    return new Promise((resolve, reject) => {
      getOnlinePlayersByWorld(options.worldName).then((result) => {
        this.getCharakterDeathsOfList(result).then((result) => {
          resolve(result);
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  getCharakterDeathsOfList(listOfChars) {
    return new Promise((resolve, reject) => {
      return Promise.all(listOfChars.map((listItem) => {
        return this.getLastestCharacterDeathInformation(listItem.name).then((result) => {
          return result
        })
      })).then((result) => {
        let returnResult = result.reduce((accumulatedResult, item) => {
          if(item.length !== 0) accumulatedResult.push(item)
          return accumulatedResult
        }, [])
        resolve( returnResult )
      }).catch((error) => reject(error));

    });


  }

  getCharacterDeathInformation(characterName) {
    if (!characterName) {
      console.warn('Charactername is needed');
      return;
    };
    return new Promise((resolve, reject) => {
      getCharacterDeathInformationByName(characterName).then((result) => {
        resolve(result);
      }).catch((error) => reject(error));
    });
  }
  getLastestCharacterDeathInformation(characterName) {
    if (!characterName) {
      console.warn('Charactername is needed');
      return;
    };
    return new Promise((resolve, reject) => {
      lastestTibiaCharacterDeath(characterName).then((result) => {
        resolve(result);
      }).catch((error) => reject(error));
    });
  }

  getGuildInformation({ guildUrl }) {
    if (!guildUrl) {
      console.warn('Guild Name or url is needed');
      return;
    };
    let guildUrlToUse = guildUrl;
    const baseGuildsUrl = 'https://secure.tibia.com/community/?subtopic=guilds&page=view&GuildName=';
    const isByUrl = isUrl(guildUrl);
    if (!isByUrl) {
      guildUrlToUse = `${baseGuildsUrl}${guildNameOrUrl.replace(/ /g, '+')}`;
    };
    return new Promise((resolve, reject) => {
      getGuildInformationByUrl(guildUrlToUse).then((result) => {
        resolve(result);
      }).catch((error) => reject(error));
    });
  }
}