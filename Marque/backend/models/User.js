const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },    // use your DB field names
  password: { type: String, required: true }  // make sure this matches your DB
});

module.exports = mongoose.model("User", UserSchema);