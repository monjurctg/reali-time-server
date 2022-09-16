const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    phone: {type: String, required: true},
    name: {type: String, required: false},
    avatar: {
      type: String,
      required: false,
      get: (avatar) => {
        return avatar ? `${process.env.BASE_URL}${avatar}` : avatar;
      },
    },
    activated: {type: Boolean, required: false, default: false},
  },
  {
    timestamps: true,
    toJSON: {getters: true},
  }
);

module.exports = mongoose.model("User", UserSchema, "users");
