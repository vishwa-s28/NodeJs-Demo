const path = require("path");

module.exports = (req, res, next) => {
  if (req.files && req.files.image) {
    req.file = req.files.image;
    req.file.path = path.join(__dirname, "images", req.file.name);
    console.log(req.file.path);
  }
  next();
};
