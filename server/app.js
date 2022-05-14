const express = require("express");
const line = require("@line/bot-sdk");
require("dotenv").config();
console.log(process.env.channelAccessToken, process.env.channelSecret);
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
  client.pushMessage(event.source.userId, {
    type: "text",
    text: "hihihi",
  });
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text,
  });
}

app.listen(3000);
