const { Token } = require('../models/Token'); // 실제 경로에 맞게 수정

exports.TokenModel = {
  async findToken(userId) {
    const userToken = await Token.findOne({ _id: userId });
    return userToken;
  },

  async updateRefresh({ _id, refreshToken }) {
    const update = await Token.updateOne(
      { _id },
      { refreshToken },
      { upsert: true }
    );
    return update;
  }
};
