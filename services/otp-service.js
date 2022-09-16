const crypto = require("crypto");
const hashService = require("./hash-service");
const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio")(smsSid, smsAuthToken, {
  lazyLoading: true,
});

class Otpservice {
  async genrateOtp() {
    const otp = await crypto.randomInt(1000, 9999);
    return otp;
  }
  async sendBySms(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `your app otp is ${otp}`,
    });
  }
  async verifyOtp(hashedOtp, data) {
    console.log(hashedOtp, "hashedOtp");
    /**
     * data is a otp what  you send in your phone or email
     *
     *
     */
    try {
      const computedHash = await hashService.hashOtp(data);
      console.log("computedHash === hashedOtp", computedHash === hashedOtp);
      return computedHash === hashedOtp;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new Otpservice();
