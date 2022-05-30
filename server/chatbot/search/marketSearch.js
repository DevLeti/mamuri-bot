const { daangnMultiSearch } = require("./daangnSearch");
const { bunjangMultiSearch } = require("./bunjangSearch");
const { joongnaMultiSearch } = require("./joongnaSearch");
const setCarouselMessage = require("../message/setCarouselMessage");

const marketMultiSearch = (keyword) => {
  const result = [];
  return new Promise((resolve, reject) => {
    daangnMultiSearch(keyword).then((res) => {
      if (res !== undefined) {
        for (let i = 0; i < res.length && i < 4; i++) {
          result.push(res[i]);
        }
      }
      bunjangMultiSearch(keyword).then((res) => {
        if (res !== undefined) {
          for (let i = 0; i < res.length && i < 4; i++) {
            result.push(res[i]);
          }
        }
        joongnaMultiSearch(keyword).then((res) => {
          if (res !== undefined) {
            for (let i = 0; i < res.length && i < 4; i++) {
              result.push(res[i]);
            }
          }
          resolve(result);
        });
      });
    });
  });
};

module.exports = { marketMultiSearch };
