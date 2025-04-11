const { SECRET_KEY } = require("../../config/env");
const { verifyjwtToken } = require("../../lib/token/jwt");

async function isAuthenticated(req, res, next) {
  try {
    let tokenString = req.headers.authorization || req.cookies.token;

    if (!tokenString) {
      return next({ status: 401, message: "Authorization token missing" });
    }

    if (tokenString.startsWith("Bearer ")) {
      tokenString = tokenString.split(" ")[1];
    }
    const result = await verifyjwtToken(tokenString, SECRET_KEY);

    if (!result) {
      return next({ status: 401, message: "Invalid Token" });
    }

    req._id = result.id;

    next();
  } catch (error) {
    next({ status: 500, message: error.message });
  }
}

module.exports = isAuthenticated;
