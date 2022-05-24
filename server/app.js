const express = require("express");
const line = require("@line/bot-sdk");
const fs = require("fs");
const { handleEvent } = require("./chatbot/index");
const { config } = require("./chatbot/index");

const app = express();
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) => {
    res.json(result);
  });
});

const port = 1231;
app.listen(port);
console.log(`listening...\nport : ${port}`);
