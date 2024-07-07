const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  userEmail: String,
  userPassword: String,
  name: String,
  phoneNumber: String,
  photoUrl: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
