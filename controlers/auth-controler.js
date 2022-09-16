const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");

class AuthControler {
  // send otp method
  async sentOtp(req, res) {
    const {phone} = req.body;
    console.log(req.body);

    if (!phone) {
      res.status(400).json({message: "phone filed is require"});
    } else {
      const otp = await otpService.genrateOtp();
      // hash
      const til = 1000 * 60 * 5;
      const expire = Date.now() + til;
      const data = `{${phone}.${otp}.${expire}}`;
      const hashedOtp = hashService.hashOtp(`${data}`);

      // send otp
      try {
        // await otpService.sendBySms(phone, otp);
        res.status(200).json({
          hash: `${hashedOtp}.${expire}`,
          phone,
          otp,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({message: "message sending field"});
      }
    }

    // res.json({ hashedOtp, otp });
  }
  //   otp verify method
  async verifyOtp(req, res) {
    const {otp, phone, hash} = req.body;
    if (!otp || !hash || !phone) {
      res.status(400).json({message: "all filed required"});
    }
    const [hashedOtp, expire] = hash.split(".");
    if (Date.now() > +expire) {
      res.status(400).json({message: "otp expired"});
    }
    const data = `{${phone}.${otp}.${expire}}`;
    const isValid = await otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      res.status(400).json({message: "Invalid OTP"});
    }

    let user;

    try {
      user = await userService.findUser({phone});
      if (!user) {
        user = await userService.createUser({phone});
      }
    } catch (err) {
      clg.error(err);
      res.status(500).json({message: "DB error"});
    }
    // token
    let {accessToken, refreshToken} = tokenService.genetateToken({
      _id: user._id,
      activated: false,
    });
    tokenService.storeRefreshToken(refreshToken, user._id);
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      htmlOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      htmlOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({user: userDto, auth: true});

    //  res.cookie("refreshToken", refreshToken, {
    //    maxAge: 1000 * 60 * 60 * 24 * 30,
    //    httpOnly: true,
    //  });
  }

  async refresh(req, res) {
    // get refresh token from cokies
    console.log("hitting");
    const {refreshToken: refreshTokenFromCookie} = req.cookies;
    // check if token is valid
    let userData;
    console.log(userData);
    try {
      userData = await tokenService.verifuRefreshToken(refreshTokenFromCookie);
    } catch (err) {
      console.log(err);
      return res.status(401).json({message: "Invalid Token"});
    }
    // check  if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );
      if (!token) {
        return res.status(401).json({message: "Invalid Token"});
      }
    } catch (err) {
      return res.status(500).json({message: "Internal error"});
    }
    // check if a valid users
    const user = await userService.findUser({_id: userData._id});
    if (!user) {
      return res.status(404).json({message: "no user found"});
    }
    // generate new token
    const {refreshToken, accessToken} = await tokenService.genetateToken({
      _id: userData._id,
    });
    // update refresh token
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      console.log(err);
      return res.status(500).json({message: "Internal error"});
    }
    // put in cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      htmlOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      htmlOnly: true,
    });
    // response

    const userDto = new UserDto(user);
    res.json({user: userDto, auth: true});
  }
  async logout(req, res) {
    // get cookies from req
    const {refreshToken} = req.cookies;
    // delet refresh token from db
    await tokenService.removeToken(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({user: null, auth: false});
  }
}

module.exports = new AuthControler();
