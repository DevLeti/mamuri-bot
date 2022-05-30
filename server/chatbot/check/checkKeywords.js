const setKeywordsFlexMessage = require("../message/setKeywordsFlexMessage");

const db = require("../../apis/database");

const checkKeywords = (client, event) => {
  db.getKeywordsByUserId(event.source.userId).then((keywords) => {
    flexMessage = setKeywordsFlexMessage(keywords);
    client.pushMessage(event.source.userId, flexMessage);
  });
};

module.exports = { checkKeywords };
