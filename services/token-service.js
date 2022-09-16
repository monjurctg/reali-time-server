const jwt = require("jsonwebtoken");
const refreshModel = require("../models/refresh-model");
class TokenService {
  genetateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_RERESH_TOKEN_SECRET,
      {expiresIn: "1y"}
    );
    return {accessToken, refreshToken};
  }

  async storeRefreshToken(token, userId) {
    try {
      await refreshModel.create({
        token,
        userId,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  }

  async verifuRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, process.env.JWT_RERESH_TOKEN_SECRET);
  }

  async findRefreshToken(userId, refreshToken) {
    return await refreshModel.findOne({
      userId: userId,
      token: refreshToken,
    });
  }

  async updateRefreshToken(userId, refreshToken) {
    return await refreshModel.updateOne(
      {userId: userId},
      {token: refreshToken}
    );
  }

  async removeToken(refreshToken) {
    return await refreshModel.deleteOne({token: refreshToken});
  }
}

module.exports = new TokenService();
