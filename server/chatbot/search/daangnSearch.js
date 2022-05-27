const axios = require("axios").default;

const daangnSingleSearch = (keyword) => {
  return Promise.resolve(
    axios
      .get(
        `http://daangn-api-server:8080/api/v2/daangn/${encodeURIComponent(keyword)}`
      )
      .then((res) => res.data["items"][0])
      .catch((e) => undefined)
  );
};

const daangnMultiSearch = (keyword) => {
  return Promise.resolve(
    axios
      .get(
        `http://daangn-api-server:8080/api/v2/daangn/${encodeURIComponent(keyword)}`
      )
      .then((res) => res.data["items"])
      .catch((e) => undefined)
  );
};

module.exports = { daangnSingleSearch, daangnMultiSearch };
