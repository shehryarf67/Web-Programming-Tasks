const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    const existingUser = await UserModel.findOne({ username: this.username });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);

    const newUser = new UserModel({
      username: this.username,
      password: hashedPassword
    });

    await newUser.save();
    return newUser;
  }

  async login() {
    const foundUser = await UserModel.findOne({ username: this.username });

    if (!foundUser) {
      throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(this.password, foundUser.password);

    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    return foundUser;
  }
}

module.exports = User;