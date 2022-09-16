const crypto = require("crypto");

class HashService {
  hashOtp(otp) {
    /**
     * Creates a Hmac object using the specified algorithm and key
     * make a hash otp
     * createHmach  take 2 arg first is algorithm and 2nd is secret key
     * update take your data  to hassing
     * digest take method what you want to return hex,number or other
     */
    try {
      const hashOtp = crypto
        .createHmac("sha256", process.env.HASH_SECRET)
        .update(otp)
        .digest("hex");
      return hashOtp;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new HashService();
