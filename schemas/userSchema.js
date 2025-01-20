const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  facebookId: { type: String },
  name: String,
  email: String,
  profilePhoto: String,
});

module.exports = mongoose.model("User", userSchema);
