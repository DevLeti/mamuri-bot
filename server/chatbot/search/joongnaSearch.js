const axios = require("axios").default;

const joongnaSingleSearch = (keyword) => {
  return Promise.resolve(
    axios
      .get(
        `http://joongna-api-server:8080/api/v2/joongna/${encodeURIComponent(
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
        `http://joongna-api-server:8080/api/v2/joongna/${encodeURIComponent(
          keyword
        )}`
      )
      .then((res) => res.data)
      .catch((e) => undefined)
  );
};

module.exports = { joongnaSingleSearch, joongnaMultiSearch };
