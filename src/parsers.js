/* eslint-disable */
import _ from 'lodash';
import cheerio from 'cheerio';
import { camelize } from './string-utils';

const getWorldsData = $ => {
  return (i, tr) => {
    const worldInfo = [];
    // To dont get the headers titles
    if (i === 0) return;

    $(tr).find('td').each((index, td) => {
      worldInfo.push($(td).text());
    });

    return {
      name: worldInfo[0],
      playersOnline: worldInfo[1],
      location: worldInfo[2],
      pvpType: worldInfo[3],
      additionalInfo:worldInfo[4]
    };
  }
};

const onlinePlayersData = $ => {
  return (i, tr) => {
    const characterData = [];
    // To dont get the headers titles
    if (i === 0) return;
    if (i === 1) return;
    $(tr).find('td').each((index, td) => {
      characterData.push($(td).text());
    });
    return {
      name: characterData[0],
      level: characterData[1],
      vocation: characterData[2],
    };
  }
};

const characterInformationData = $ => {
  return (i, tr) => {
    const characterData = [];
    // To dont get the headers titles
    if (i === 0) return;
    $(tr).find('td').each((index, td) => {
      characterData.push($(td).text());
    });
    return {
      [camelize(characterData[0].replace(/^0+/, ""))]: characterData[1]
    };
  }
};

const characterDeathInformationData = $ => {
  return (i, tr) => {
    const characterDeathData = [];
    // To dont get the headers titles
    if (i === 0) return;
    $(tr).find('td').each((index, td) => {
      characterDeathData.push($(td).text());
    });
    return {
      timeAgo: characterDeathData[0],
      killedBy: characterDeathData[1],
    };
  }
};

const singleCharacterDeathInformationData = $ => {
  return (i, tr) => {
    const characterDeathData = [];
    // To dont get the headers titles
    if (i === 0) return;
    if (i >= 2) return;
    $(tr).find('td').each((index, td) => {
      characterDeathData.push($(td).text());
    });

    if(!checkDeathTimer(characterDeathData[0]))
    {
      return
    }

    return {
      timeAgo: characterDeathData[0],
      killedBy: characterDeathData[1],
    };
  }
};

const checkDeathTimer = (time) => {
  time = encodeURIComponent(time)
  time = time.replace(/%C2%A0/g, "%20")
  time = decodeURIComponent(time)

  var aryLastDeathTime = time.split(",");
  var aryHourMinSec = aryLastDeathTime[1].split(" ");

  var aryHourMinSec = aryHourMinSec[0].split(":");
  var date01 = new Date();
  var dateLastDeathTime = new Date(aryLastDeathTime[0]);
  dateLastDeathTime.setHours(aryHourMinSec[0].trim());
  dateLastDeathTime.setMinutes(aryHourMinSec[1]);
  dateLastDeathTime.setSeconds(aryHourMinSec[2].replace(" CET", ""));

  var intDifSec = (date01.getTime()-dateLastDeathTime.getTime())/1000;

  if( intDifSec <= 10400 )
  {
    return true;
  }
  return false
};

const guildInvitedsData = $ => {
  return (i, tr) => {
    const invitedMemberData = [];
    // To dont get the headers titles
    if (i === 0 || i === 1) return;
    $(tr).find('td').each((index, td) => {
      invitedMemberData.push($(td).text());
    });
    return {
      name: invitedMemberData[0],
      invitationDate: invitedMemberData[1],
    };
  }
};

const guildInformationData = $ => {
  return (i, tr) => {
    const memberData = [];
    // To dont get the headers titles
    if (i === 0) return;
    $(tr).find('td').each((index, td) => {
      memberData.push($(td).text());
    });
    // This is basically a hack.
    // it was an easy fix related to this.
    // http://stackoverflow.com/questions/32413180/cheerio-scraping-returning-only-two-rows
    const level = memberData[3];
    if (!isNaN(parseInt(level))) {
      return {
        level,
        rank: memberData[0],
        name: memberData[1],
        vocation: memberData[2],
        joiningDate: memberData[4],
        status: memberData[5],
        isOnline: memberData[5] === 'online' ? true : false,
      };
    }
  }
};

export const tibiaWorldsParser = body => {
  const $ = cheerio.load(body);
  return $($('.Table3 .TableContent')[1])
         .find('tr')
         .map(getWorldsData($))
         .get()
};

export const tibiaOnlinePlayersParser = body => {
  const $ = cheerio.load(body);
  return $('.Table2')
         .find('tr')
         .map(onlinePlayersData($))
         .get();
};

export const tibiaCharacterDataParser = body => {
  const $ = cheerio.load(body);
  return $('b:contains("Character Information")')
         .parent()
         .parent()
         .parent()
         .find('tr')
         .map(characterInformationData($))
         .get()
         .reduce((result, object) => {
           console.log(result)
           const key = Object.keys(object);
           result[key] = object[key];
           return result;
         }, {});
};

export const tibiaCharacterDeathParser = body => {

  const $ = cheerio.load(body);
  if($('b:contains("Character Information")').get().length !== 0) {
    if($('b:contains("Character Deaths")').get().length !== 0){
    return $('b:contains("Character Deaths")')
           .parent()
           .parent()
           .parent()
           .find('tr')
           .map(characterDeathInformationData($))
           .get()
    }
    return []
  }

  return false
}
export const lastestTibiaCharacterDeathParser = body => {
  try{
  const $ = cheerio.load(body);
    if($('b:contains("Character Information")').get().length !== 0) {
      if($('b:contains("Character Deaths")').get().length !== 0){
        return $('b:contains("Character Deaths")')
          .parent()
          .parent()
          .parent()
          .find('tr')
          .map(singleCharacterDeathInformationData($))
          .get()
      }
      return []
    }
  }catch (e) {
    console.log(e)

  }
  return []
}

export const tibiaGuildInformationParser = body => {
  const $ = cheerio.load(body);
  const members = $('tr').map(guildInformationData($)).get();
  const invitedMembers = $($('tr').parent()[15]).find('tr').map(guildInvitedsData($)).get();
  const guildMembersOnline = _.compact(members.map(({ isOnline }) => isOnline));
  return Object.assign({}, {
    members,
    invitedMembers,
    guildMembersOnline: guildMembersOnline.length,
    guildInformation: $('#GuildInformationContainer').text(),
  });
}
