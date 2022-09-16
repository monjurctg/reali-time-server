const UserModel = require("../models/user-model");

class UserService {
  async findUser(filter) {
    const user = await UserModel.findOne(filter);
    return user;
  }
  // create service
  async createUser(data) {
    const newUser = await UserModel.create(data);
    return newUser;
  }
}
module.exports = new UserService();
