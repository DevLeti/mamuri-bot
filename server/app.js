const express = require("express");
const line = require("@line/bot-sdk");
const fs = require("fs");
const { handleEvent } = require("./chatbot/index");
// const { config } = require("./chatbot/index");
const { sequelize } = require("./models");
const database = require("./apis/database");

// Initialize DB connection
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("database connection complete");
    database.addKeyword("rtx3060", "junseok");
    database.getKeywordsByUserId("junseok");
    database.deleteKeyword("phobyjun", "rtx3080");
    database.getAllUsers();
    database.getUsersByKeyword("rtx3060");
    database.getAllKeywords();
  })
  .catch((err) => {
    console.log("database connection failed");
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
  Promise.all(req.body.events.map(handleEvent)).then((result) => {
    res.json(result);
  });
});

const port = 1231;
app.listen(port);
console.log(`listening...\nport : ${port}`);
