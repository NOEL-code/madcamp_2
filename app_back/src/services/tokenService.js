const { Token } = require("../models/Token"); // 실제 경로에 맞게 수정

const TokenModel = {
  async findToken(userId) {
    const userToken = await Token.findOne({ user_id: userId });
    return userToken;
  },

  async updateRefresh({ user_id, refreshToken }) {
    const update = await Token.updateOne(
      { user_id },
      { refreshToken },
      { upsert: true }
    );
    return update;
  },

  async deleteToken(userId) {
    try {
      await Token.deleteOne({ user_id: userId });
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = TokenModel;
