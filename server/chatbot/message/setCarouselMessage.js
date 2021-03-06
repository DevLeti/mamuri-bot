const setFlexMessage = require("./setFlexMessage");

function setCarouselMessage(mamuls, keyword) {
  let flexMessages = [];
  let flexMessage = {};
  if (mamuls[0] == undefined) {
    let nonMamulMessage = {
      type: "flex",
      altText: `${keyword} 매물은 아직 없어요!`,
      contents: setFlexMessage(
        "-",
        "매물이 없습니다!",
        "0",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/515px-Error.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/515px-Error.svg.png",
        "-"
      ),
    };
    nonMamulMessage["contents"]["header"] = {
      type: "box",
      layout: "horizontal",
      contents: [
        { type: "text", text: "매무리 봇", size: "sm", color: "#1DB446" },
        {
          type: "text",
          text: `키워드: ${keyword}`,
          align: "end",
          color: "#1DB446",
          weight: "bold",
        },
      ],
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
      } else {
        if (
          mamuls[i]["platform"] === "joongna" ||
          mamuls[i]["platform"] === "중고나라"
        ) {
          let searchDot = mamuls[i]["extraInfo"].indexOf("...");
          if (searchDot !== -1) {
            mamuls[i]["extraInfo"] = mamuls[i]["extraInfo"].slice(0, searchDot);
          }
        }

        let searchValue = "\n";
        let pos = 0;
        let foundPos = 0;
        for (let j = 0; j < 4 && foundPos !== -1; j++) {
          foundPos = mamuls[i]["extraInfo"].indexOf(searchValue, pos);
          pos = foundPos + 1;
        }
        console.log(`pos: ${pos}`);
        if (foundPos !== -1) {
          mamuls[i]["extraInfo"] =
            mamuls[i]["extraInfo"].slice(0, foundPos) + "\n...";
        }
        if (mamuls[i]["extraInfo"].length > 40) {
          mamuls[i]["extraInfo"] =
            mamuls[i]["extraInfo"].slice(0, 40) + "\n...";
        }
      }
      // } else if (mamuls[i]["extraInfo"].length > 70) {
      //   mamuls[i]["extraInfo"] = mamuls[i]["extraInfo"].slice(0, 70) + "\n...";
      // } else {

      // }
      // else if (mamuls[i]["extraInfo"].indexOf("\n") !== -1) {
      //   console.log(mamuls[i]["extraInfo"].indexOf("\n", 4));
      //   let slicePoint = mamuls[i]["extraInfo"].indexOf("\n", 4);
      //   mamuls[i]["extraInfo"] =
      //     mamuls[i]["extraInfo"].slice(0, slicePoint) + "\n...";
      // }

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
  flexMessages[0]["header"] = {
    type: "box",
    layout: "horizontal",
    contents: [
      { type: "text", text: "매무리 봇", size: "sm", color: "#1DB446" },
      {
        type: "text",
        text: `키워드: ${keyword}`,
        align: "end",
        color: "#1DB446",
        weight: "bold",
      },
    ],
  };
  let carouselMessage = {
    type: "flex",
    altText: `${keyword} 매무리가 도착했어요!`,
    contents: {
      type: "carousel",
      contents: flexMessages,
    },
  };
  return carouselMessage;
}

module.exports = setCarouselMessage;
