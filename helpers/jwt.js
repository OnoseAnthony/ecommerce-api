const expressJwt = require("express-jwt");
require("dotenv/config");

function authJwt() {
  const secret = process.env.SECRET_JWT_SEED_PHRASE;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  });
}

module.exports = authJwt;
