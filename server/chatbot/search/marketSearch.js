const { daangnMultiSearch } = require("./daangnSearch");
const { bunjangMultiSearch } = require("./bunjangSearch");
const { joongnaMultiSearch } = require("./joongnaSearch");

const marketMultiSearch = (keyword) => {
  const result = [];
  return new Promise((resolve, reject) => {
    daangnMultiSearch(keyword).then((res) => {
      console.log(`daangn: ${res}`);
      if (res !== undefined && res !== null) {
        for (let i = 0; i < res.length && i < 4; i++) {
          result.push(res[i]);
        }
      }
      bunjangMultiSearch(keyword).then((res) => {
        console.log(`bunjang: ${res}`);
        if (res !== undefined && res !== null) {
          for (let i = 0; i < res.length && i < 4; i++) {
            result.push(res[i]);
          }
        }
        joongnaMultiSearch(keyword).then((res) => {
          console.log(`joongna: ${res}`);
          if (res !== undefined && res !== null) {
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
