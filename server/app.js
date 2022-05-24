const express = require("express");
const line = require("@line/bot-sdk");
const setFlexMessage = require("./apis/setFlexMessage");
const fs = require("fs");

const { sequelize } = require('./models')
const database = require("./apis/database");

// Initialize DB connection
sequelize.sync({ force: false })
    .then(() => {
        console.log('database connection complete');
        database.addKeyword("rtx3060", "junseok")
        database.getKeywordsByUserId("junseok")
        database.deleteKeyword("phobyjun", "rtx3080")
    })
    .catch((err) => {
        console.log('database connection failed');
    });

// Load .env configuration
require("dotenv").config();
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};

// Express app server initialization
const app = express();

// Create post request handler for chatbot
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

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
              "https://www.daangn.com/articles/403755360"
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
        client.replyMessage(event.replyToken, {
          type: "text",
          text: "왼쪽 하단 메뉴버튼(☰)을 클릭해 상호작용 해주세요!",
        })
      );
    } else {
      // TODO: 서버에 키워드 등록하는 api
      waitNewMamulList.splice(found, 1);
      console.log(waitNewMamulList[found]);
      return Promise.resolve(
        client.replyMessage(event.replyToken, {
          type: "text",
          text: "매물이 등록되었습니다!\n등록된 매물: " + event.message.text,
        })
      );
    }
  }
}

const port = 1231;
app.listen(port);
console.log(`listening...\nport : ${port}`);

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
