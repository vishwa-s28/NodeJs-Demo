const express = require("express");
const app = express();
const path = require("path");
const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");
const { Result } = require("express-validator");

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://vishwas:Vishwa%402024@cluster0.s6fro.mongodb.net/rest"
  )
  .then((result) => {
    app.listen(3000, () => {
      console.log(3000);
    });
  })
  .catch((err) => console.log(err));
