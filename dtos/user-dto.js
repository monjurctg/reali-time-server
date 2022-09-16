class UserDto {
  _id;
  phone;
  name;
  avatar;
  activated;
  createdAt;

  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
  }
}

module.exports = UserDto;
