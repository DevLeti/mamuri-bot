const { marketMultiSearch } = require("../search/marketSearch");
const setCarouselMessage = require("../message/setCarouselMessage");
// Database APIs
const db = require("../../apis/database");
// API List
// database.addKeyword = async function(keyword, userId)
// database.deleteKeyword = async function(userId, keyword)
// database.getKeywordsByUserId = async function(userId)
// database.getUsersByKeyword = async function(keyword)
// database.getAllUsers = async function()
// database.getAllKeywords = async function()

const multiCheckMamul = (client) => {
  db.getAllKeywords().then((keywords) => {
    for (let i = 0, pending = Promise.resolve(); i < keywords.length; i++) {
      pending = db.getUsersByKeyword(keywords[i]).then((userIds) => {
        marketMultiSearch(keywords[i]).then((res) => {
          client.multicast(userIds, [setCarouselMessage(res)]);
        });
      });
    }
  });
};

const checkMamul = (client, userId) => {
  db.getKeywordsByUserId(userId).then((keywords) => {
    for (let i = 0, pending = Promise.resolve(); i < keywords.length; i++) {
      pending = marketMultiSearch(keywords[i]).then((res) => {
        client.multicast(
          [userId],
          [
            {
              type: "text",
              text: `유저님의 ${keywords[i]} 매물 알림이 도착했어요!`,
            },
            setCarouselMessage(res),
          ]
        );
      });
    }
  });
};

module.exports = { multiCheckMamul, checkMamul };
