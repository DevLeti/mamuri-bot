var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.send("<h1>hello express!</h1>");
});

app.listen(3000);
