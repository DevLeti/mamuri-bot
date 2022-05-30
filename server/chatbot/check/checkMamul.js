const { marketMultiSearch } = require("../search/marketSearch");
const setCarouselMessage = require("../message/setCarouselMessage");

// Database APIs
const db = require("../../apis/database");

const multiCheckMamul = (client) => {
  db.getAllKeywords().then((keywords) => {
    for (let i = 0, pending = Promise.resolve(); i < keywords.length; i++) {
      pending = db.getUsersByKeyword(keywords[i]).then((userIds) => {
        marketMultiSearch(keywords[i]).then((res) => {
          client.multicast(userIds, [setCarouselMessage(res, keywords[i])]);
        });
      });
    }
  });
};

const checkMamul = (client, userId) => {
  db.getKeywordsByUserId(userId).then((keywords) => {
    for (let i = 0, pending = Promise.resolve(); i < keywords.length; i++) {
      pending = marketMultiSearch(keywords[i]).then((res) => {
        client.pushMessage(userId, setCarouselMessage(res, keywords[i]));
      });
    }
  });
};

module.exports = { multiCheckMamul, checkMamul };
