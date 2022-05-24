const { daangnSingleSearch } = require("./daangnSearch");
const { bunjangSingleSearch } = require("./bunjangSearch");
const { joongnaSingleSearch } = require("./joongnaSearch");
const setCarouselMessage = require("../message/setCarouselMessage");

const marketMultiSearch = (keyword) => {
  const result = [];
  return new Promise((resolve, reject) => {
    daangnSingleSearch(keyword).then((res) => {
      result.push(res);
      bunjangSingleSearch(keyword).then((res) => {
        result.push(res);
        joongnaSingleSearch(keyword).then((res) => {
          result.push(res);
          resolve(result);
        });
      });
    });
  });
};

module.exports = { marketMultiSearch };
