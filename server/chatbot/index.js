const line = require("@line/bot-sdk");
const setFlexMessage = require("./message/setFlexMessage");
const setCarouselMessage = require("./message/setCarouselMessage");
const fs = require("fs");
const { daangnSingleSearch } = require("./search/daangnSearch");
const { daangnMultiSearch } = require("./search/daangnSearch");
const { joongnaSingleSearch } = require("./search/joongnaSearch");
const { joongnaMultiSearch } = require("./search/joongnaSearch");
const { bunjangSingleSearch } = require("./search/bunjangSearch");
const { bunjangMultiSearch } = require("./search/bunjangSearch");
const { marketMultiSearch } = require("./search/marketSearch");

require("dotenv").config({ path: __dirname + "/../.env" });
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};

const client = new line.Client(config);

let waitNewMamulList = []; // 매물 키워드 입력 기다리는 목록

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    console.log(event);
    if (event.type == "postback") {
      if (event.postback.data == "new") {
        var found = waitNewMamulList.indexOf(event.source.userId);
        if (found == -1) {
          waitNewMamulList.push(event.source.userId);
          console.log(waitNewMamulList);
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
      } else if (event.postback.data == "check") {
        return Promise.resolve(
          client.replyMessage(event.replyToken, {
            type: "flex",
            altText: "등록된 매물",
            contents: setFlexMessage(
              "daangn",
              "RTX 3080",
              "1000000",
              "https://dnvefa72aowie.cloudfront.net/origin/article/202205/94cdd237258671d5806a70f64ab2b3c7dcd790da0384b394ef5809fe10c08ced.webp?q=95&s=1440x1440&t=inside",
              "https://www.daangn.com/articles/403755360",
              "채굴X, 흡연X, 반려동물X 입니다.\n직거래 희망하며, 쿨거래시 네고 1만원 가능합니다."
            ),
          })
        );
      }
    }
    return Promise.resolve(null);
  } else {
    console.log(event);
    var found = waitNewMamulList.indexOf(event.source.userId);
    if (found == -1) {
      return Promise.resolve(
        marketMultiSearch(event.message.text).then((res) => {
          client.pushMessage(event.source.userId, setCarouselMessage(res));
        })
      );
    } else {
      // TODO: 서버에 키워드 등록하는 api
      waitNewMamulList.splice(found, 1);
      console.log(waitNewMamulList[found]);
      return Promise.resolve(
        client.replyMessage(event.replyToken, {
          type: "text",
          text: `매물이 등록되었습니다!\n등록된 매물: ${event.message.text}`,
        }),
        marketMultiSearch(event.message.text).then((res) => {
          client.pushMessage(event.source.userId, setCarouselMessage(res));
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
//     width: 2500,
//     height: 843,
//   },
//   selected: false,
//   name: "Nice richmenu",
//   chatBarText: "Tap to open",
//   areas: [
//     {
//       bounds: {
//         x: 0,
//         y: 0,
//         width: 1250,
//         height: 843,
//       },
//       action: {
//         type: "postback",
//         label: "new",
//         data: "new",
//         displayText: "키워드 등록",
//         inputOption: "openKeyboard",
//         fillInText: "",
//       },
//     },
//     {
//       bounds: {
//         x: 1250,
//         y: 0,
//         width: 1250,
//         height: 843,
//       },
//       action: {
//         type: "postback",
//         label: "check",
//         data: "check",
//         displayText: "최신 매물 확인",
//         inputOption: "openKeyboard",
//         fillInText: "",
//       },
//     },
//   ],
// };
//// 등록
// client.createRichMenu(richMenu).then((richMenuId) => console.log(richMenuId));
// client.setRichMenuImage(
//   "richmenu-183eff606f059b8244f0a625b54bddf1",
//   fs.createReadStream("./static/img/richMenu.jpg")
// );
// client.setDefaultRichMenu("richmenu-183eff606f059b8244f0a625b54bddf1");
