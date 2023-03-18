const express = require("express");
const itemsRoutes = require("./routes/itemsRoutes")

const app = express();

app.use(express.json())

app.use("/items", itemsRoutes)

app.use((req, res, next) => {
  const err = new ExpressError("Not Found", 404);
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.msg
  })
})


module.exports = app;