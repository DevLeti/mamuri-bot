const { marketMultiSearch } = require("../search/marketSearch");
const setCarouselMessage = require("../message/setCarouselMessage");
const combineCarouselMessage = require("../message/combineCarouselMessage");

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
          client.multicast(userIds, [
            {
              type: "text",
              text: `유저님의 매물 알림이 도착했어요!`,
            },
            setCarouselMessage(res, keywords[i]),
          ]);
        });
      });
    }
  });
};

const checkMamul = (client, userId) => {
  let combinedCarousel = {
    type: "flex",
    altText: `유저님의 매물 알림이 도착했어요!`,
    contents: {
      type: "carousel",
      contents: [],
    },
  };
  let carousel = {};
  db.getKeywordsByUserId(userId).then((keywords) => {
    for (let i = 0, pending = Promise.resolve(); i < keywords.length; i++) {
      if (i % 4 == 0) {
        combinedCarousel["contents"]["contents"] = [];
      }
      pending = marketMultiSearch(keywords[i]).then((res) => {
        carousel = setCarouselMessage(res, keywords[i]);
        combineCarouselMessage(combinedCarousel, carousel);
        if (i % 4 == 3 || i === keywords.length - 1) {
          client.multicast(
            [userId],
            [
              {
                type: "text",
                text: `유저님의 매물 알림이 도착했어요!`,
              },
              combinedCarousel,
            ]
          );
        }
      });
    }
  });
};

module.exports = { multiCheckMamul, checkMamul };
