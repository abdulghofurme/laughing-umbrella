const express = require("express");

const app = express();

app.use((req, res, next) => {
  next();
});

app.listen(9000);
