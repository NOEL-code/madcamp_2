const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  }
  // {
  //   timestamp: true,
  // }
);

const Token = mongoose.model("Token", TokenSchema);

module.exports = { Token };
