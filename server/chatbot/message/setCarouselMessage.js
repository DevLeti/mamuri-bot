const setFlexMessage = require("./setFlexMessage");

function setCarouselMessage(mamuls) {
  let flexMessages = [];
  let flexMessage = {};
  if (
    mamuls[0] == undefined &&
    mamuls[1] == undefined &&
    mamuls[2] == undefined
  ) {
    let nonMamulMessage = {
      type: "flex",
      altText: "매물 검색 에러",
      contents: setFlexMessage(
        "-",
        "매물이 없습니다!",
        "0",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/515px-Error.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/515px-Error.svg.png",
        "-"
      ),
    };
    return nonMamulMessage;
  }
  for (i = 0; i < mamuls.length; i++) {
    if (mamuls[i] == undefined) {
      continue;
    }
    try {
      if (
        mamuls[i]["platform"] === "bunjang" ||
        mamuls[i]["platform"] === "번개장터"
      ) {
        mamuls[i]["thumbnailUrl"] = mamuls[i]["thumbnailUrl"].replace(
          "{",
          "%7B"
        );
        mamuls[i]["thumbnailUrl"] = mamuls[i]["thumbnailUrl"].replace(
          "}",
          "%7D"
        );
      }

      if (
        mamuls[i]["thumbnailUrl"] == undefined ||
        mamuls[i]["thumbnailUrl"] == ""
      ) {
        mamuls[i]["thumbnailUrl"] =
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Grey.PNG";
      }

      if (mamuls[i]["extraInfo"] == undefined || mamuls[i]["extraInfo"] == "") {
        mamuls[i]["extraInfo"] = "없음";
      } else if (mamuls[i]["extraInfo"].length > 70) {
        mamuls[i]["extraInfo"] = mamuls[i]["extraInfo"].slice(0, 70) + "\n...";
      }

      flexMessage = setFlexMessage(
        mamuls[i]["platform"],
        mamuls[i]["name"],
        mamuls[i]["price"],
        mamuls[i]["thumbnailUrl"],
        mamuls[i]["itemUrl"],
        mamuls[i]["extraInfo"]
      );
      flexMessages.push(flexMessage);
    } catch (err) {
      console.log(err);
      continue;
    }
  }

  let carouselMessage = {
    type: "flex",
    altText: "Carousel mamul message",
    contents: {
      type: "carousel",
      contents: flexMessages,
    },
  };
  return carouselMessage;
}

module.exports = setCarouselMessage;
