const express = require("express");
const line = require("@line/bot-sdk");
const setFlexMessage = require("./pushMessage");
require("dotenv").config();
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};

const app = express();
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  console.log(event);

  // push
  // 매물 테스트 알림
  return client.pushMessage(event.source.userId, {
    type: "flex",
    altText: "새로운 매물이 왔어요!",
    contents: setFlexMessage(
      "daangn",
      "RTX 3080",
      "1000000",
      "https://dnvefa72aowie.cloudfront.net/origin/article/202205/94cdd237258671d5806a70f64ab2b3c7dcd790da0384b394ef5809fe10c08ced.webp?q=95&s=1440x1440&t=inside",
      "https://www.daangn.com/articles/403755360"
    ),
  });
  // return client.replyMessage(event.replyToken, {
  //   type: "text",
  //   text: event.message.text,
  // });
}

app.listen(3000);
