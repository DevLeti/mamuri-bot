const axios = require("axios").default;

const bunjangSingleSearch = (keyword) => {
  return Promise.resolve(
    axios
      .get(
        `http://43.200.35.46:18082/api/v2/bunjang/${encodeURIComponent(
          keyword
        )}`
      )
      .then((res) => res.data[0])
      .catch((e) => undefined)
  );
};

const bunjangMultiSearch = (keyword) => {
  return Promise.resolve(
    axios
      .get(
        `http://43.200.35.46:18082/api/v2/bunjang/${encodeURIComponent(
          keyword
        )}`
      )
      .then((res) => res.data)
      .catch((e) => undefined)
  );
};

module.exports = { bunjangSingleSearch, bunjangMultiSearch };
