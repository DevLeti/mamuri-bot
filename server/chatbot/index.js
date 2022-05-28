// Line chatbot + Message generate functions
const line = require("@line/bot-sdk");
const setFlexMessage = require("./message/setFlexMessage");
const setCarouselMessage = require("./message/setCarouselMessage");
const setKeywordsFlexMessage = require("./message/setKeywordsFlexMessage");

// Market Search
const { daangnSingleSearch } = require("./search/daangnSearch");
const { daangnMultiSearch } = require("./search/daangnSearch");
const { joongnaSingleSearch } = require("./search/joongnaSearch");
const { joongnaMultiSearch } = require("./search/joongnaSearch");
const { bunjangSingleSearch } = require("./search/bunjangSearch");
const { bunjangMultiSearch } = require("./search/bunjangSearch");
const { marketMultiSearch } = require("./search/marketSearch");

// File search - Will be deleted (Unused)
const fs = require("fs");

// Cron for Mamul Notification
const schedule = require("node-schedule");
const job = schedule.scheduleJob("0 */1 * * *", () => {
  multiCheckMamul(client);
});

// Database APIs
const db = require("../apis/database");
// API List
// database.addKeyword = async function(keyword, userId)
// database.deleteKeyword = async function(userId, keyword)
// database.getKeywordsByUserId = async function(userId)
// database.getUsersByKeyword = async function(keyword)
// database.getAllUsers = async function()
// database.getAllKeywords = async function()

// Import credentials for Line chatbot
require("dotenv").config({ path: __dirname + "/../config/.env" });
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};

// Cron for Mamul Notification
const { multiCheckMamul, checkMamul } = require("./check/checkMamul");
const { checkKeywords } = require("./check/checkKeywords");

// Line chat bot client & event
const client = new line.Client(config);

let waitNewMamulList = []; // 매물 키워드 입력 기다리는 목록
let waitDeleteMamulList = []; // 매물 삭제 키워드 입력 기다리는 목록

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    console.log(event);
    if (event.type == "postback") {
      if (event.postback.data == "newKeyword") {
        var foundNew = waitNewMamulList.indexOf(event.source.userId);
        if (foundNew == -1) {
          waitNewMamulList.push(event.source.userId);
          console.log(`waitNewMamulList Changed : ${waitNewMamulList}`);
          return Promise.resolve(
            client.replyMessage(event.replyToken, {
              type: "text",
              text: "등록할 매물 키워드를 알려주세요!",
            })
          );
        } else {
          return Promise.resolve(
            client.replyMessage(event.replyToken, {
              type: "text",
              text: "등록할 매물 키워드를 알려주세요!",
            })
          );
        }
      } else if (event.postback.data == "checkItems") {
        return Promise.resolve(checkMamul(client, event.source.userId));
      } else if (event.postback.data == "deleteKeyword") {
        var foundDelete = waitDeleteMamulList.indexOf(event.source.userId);
        if (foundDelete == -1) {
          waitDeleteMamulList.push(event.source.userId);
          console.log(`waitDeleteMamulList Changed : ${waitDeleteMamulList}`);
          return Promise.resolve(
            client.replyMessage(event.replyToken, {
              type: "text",
              text: "삭제할 매물 키워드를 알려주세요!",
            })
          );
        }
      } else if (event.postback.data == "checkKeywords") {
        return Promise.resolve(checkKeywords(client, event));
      }
    }
    return Promise.resolve(null);
  } else {
    console.log(event);
    var foundNew = waitNewMamulList.indexOf(event.source.userId);
    if (foundNew != -1) {
      // TODO: 서버에 키워드 등록하는 api
      waitNewMamulList.splice(foundNew, 1);
      console.log(waitNewMamulList[foundNew]);
      return Promise.resolve(
        db.addKeyword(event.message.text, event.source.userId),
        client.replyMessage(event.replyToken, {
          type: "text",
          text: `매물이 등록되었습니다!\n등록된 매물: ${event.message.text}`,
        }),
        marketMultiSearch(event.message.text).then((res) => {
          client.pushMessage(event.source.userId, setCarouselMessage(res));
        })
      );
    }

    var foundDelete = waitDeleteMamulList.indexOf(event.source.userId);
    if (foundDelete != -1) {
      waitDeleteMamulList.splice(foundDelete, 1);
      console.log(waitDeleteMamulList[foundDelete]);
      return Promise.resolve(
        db.deleteKeyword(event.source.userId, event.message.text),
        client
          .replyMessage(event.replyToken, {
            type: "text",
            text: `매물이 삭제되었습니다!\n삭제된 매물: ${event.message.text}`,
          })
          .then(() => {
            checkKeywords(client, event);
          })
      );
    }
  }
}

module.exports = { handleEvent, config };

/*Reply Message*/
// client.replyMessage(event.replyToken, {
//   type: "text",
//   text: "왼쪽 하단 메뉴버튼(☰)을 클릭해 상호작용 해주세요!",
// })

/*Push Message*/
// client.pushMessage(event.source.userId, {
//   type: "flex",
//   altText: "새로운 매물이 왔어요!",
//   contents: setFlexMessage(
//     "daangn",
//     "RTX 3080",
//     "1000000",
//     "https://dnvefa72aowie.cloudfront.net/origin/article/202205/94cdd237258671d5806a70f64ab2b3c7dcd790da0384b394ef5809fe10c08ced.webp?q=95&s=1440x1440&t=inside",
//     "https://www.daangn.com/articles/403755360"
//   ),
// })

/*Carousel Message (flex message 여러개)*/
// client.pushMessage(event.source.userId, {
//   type: "carousel",
//   contents: [
//     setFlexMessage(
//       "daangn",
//       "RTX 3080",
//       "1220000",
//       "https://dnvefa72aowie.cloudfront.net/origin/article/202205/a6ed5583ba1c0b206c264a96afcf5c736a1f055ad899c14d8087d0f7cd9e4805.webp?q=95&s=1440x1440&t=inside",
//       "https://www.daangn.com/articles/408099984"
//     ),
//     setFlexMessage(
//       "joongna",
//       "RTX 2080",
//       "1000000",
//       "https://cafeptthumb-phinf.pstatic.net/MjAyMjA1MjRfMTM1/MDAxNjUzMzY4MjU1MDUx.D2xeHlHLzhF3BhMD83GAMN7dAiu7YcArtpwL1AVnPR0g.dRILQe9D5XVBPbAtNKimAmYwgG1CKcr-rnSx3CeyFQIg.JPEG/%EA%B0%A4%EB%9F%AD%EC%8B%9C_GTX1060_3G.jpg?type=s3",
//       "https://cafe.naver.com/joonggonara/918947018"
//     ),
//     setFlexMessage(
//       "bunjang",
//       "RTX 3080",
//       "1059800",
//       "https://media.bunjang.co.kr/product/179119900_1_1652919446_w856.jpg",
//       "https://m.bunjang.co.kr/products/179119900"
//     ),
//   ],
// });

/*리치메뉴 설정*/
// let richMenu = {
//   size: {
//     width: 2006,
//     height: 827,
//   },
//   selected: false,
//   name: "Real richMenu",
//   chatBarText: "메뉴 열기",
//   areas: [
//     {
//       bounds: {
//         x: 0,
//         y: 0,
//         width: 1003,
//         height: 413,
//       },
//       action: {
//         type: "postback",
//         label: "newKeyword",
//         data: "newKeyword",
//         displayText: "키워드 추가",
//         inputOption: "openKeyboard",
//         fillInText: "",
//       },
//     },
//     {
//       bounds: {
//         x: 1003,
//         y: 0,
//         width: 1003,
//         height: 413,
//       },
//       action: {
//         type: "postback",
//         label: "deleteKeyword",
//         data: "deleteKeyword",
//         displayText: "키워드 삭제",
//         inputOption: "openKeyboard",
//         fillInText: "",
//       },
//     },
//     {
//       bounds: {
//         x: 0,
//         y: 413,
//         width: 1003,
//         height: 414,
//       },
//       action: {
//         type: "postback",
//         label: "checkKeywords",
//         data: "checkKeywords",
//         displayText: "키워드 확인",
//       },
//     },
//     {
//       bounds: {
//         x: 1003,
//         y: 413,
//         width: 1003,
//         height: 414,
//       },
//       action: {
//         type: "postback",
//         label: "checkItems",
//         data: "checkItems",
//         displayText: "매물 즉시 검색",
//       },
//     },
//   ],
// };
// 등록
// client.createRichMenu(richMenu).then((richMenuId) => {
//   console.log(richMenuId);
// });
// client.setRichMenuImage(
//   "richmenu-de8d05638cd98d81e765576986376314",
//   fs.createReadStream("./static/image/richMenu.png")
// );
// client.setDefaultRichMenu("richmenu-de8d05638cd98d81e765576986376314");
