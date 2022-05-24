const axios = require("axios").default;

const joongnaSingleSearch = (keyword) => {
  return Promise.resolve(
    axios
      .get(
        `http://43.200.35.46:18081/api/v2/joongna/${encodeURIComponent(
          keyword
        )}`
      )
      .then((res) => res.data[0])
      .catch((e) => undefined)
  );
};

const joongnaMultiSearch = (keyword) => {
  return Promise.resolve(
    axios
      .get(
        `http://43.200.35.46:18081/api/v2/joongna/${encodeURIComponent(
          keyword
        )}`
      )
      .then((res) => res.data)
      .catch((e) => undefined)
  );
};

module.exports = { joongnaSingleSearch, joongnaMultiSearch };