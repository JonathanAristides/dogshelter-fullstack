const monError = require("../models/errorModel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class Helper {

  static createToken(id) {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({id}, secret, {expiresIn: 3 * 24 * 60 * 60});
  }

  static createNewMonError(err, code, description) {
    console.log(err)
    const errorAnswer = new monError({
      type: "Database error",
      code: code,
      message: err.message,
      description: description,
    });
    return errorAnswer;
  }


  static authenticate(cookies) {
    const {jwt, user, role} = cookies;
    //authenticate functionality
    let isAdmin;
    if (role === "admin") {
      isAdmin = true;
    }
    console.log(jwt, user, role);
    return {isAdmin, hasValidToken: true}
  }
}

module.exports = Helper;