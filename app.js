require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const errorController = require("./controllers/error");
const User = require("./models/user");
const multer = require("multer");
const fileUpload = require("express-fileupload");
// const csrf = require('csurf');
const flash = require("connect-flash");

const app = express();

// app.use(
//   fileUpload({
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//     abortOnLimit: true,
//     useTempFiles: false,
//     // tempFileDir: path.join(__dirname, "images"), // Temporary directory
//   })
// );

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
// const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { ADMIN_API_PREFIX } = require("./constants/routesConstants");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  multer({
    storage: fileStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter,
  }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    // name: 'myCustomSessionName'
  })
);

// app.use(csrfProtection);

app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(ADMIN_API_PREFIX.ADMIN_API, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("connected");
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
