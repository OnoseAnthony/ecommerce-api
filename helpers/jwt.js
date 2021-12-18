const expressJwt = require("express-jwt");
require("dotenv/config");

// middleware to protect api routes from unauthorized access
function authJwt() {
  const secret = process.env.SECRET_JWT_SEED_PHRASE;
  const baseUrl = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      `${baseUrl}/users/login`,
      `${baseUrl}/users/add`,
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "options"] }, //regular expression to capture all the get methods in the product route
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "options"] },
    ],
  });
}

/* 
explainer: The isRevoked function takes in a payload and checks user role. 
            if a user tries to perform actions for which he/she has no permissions their token is revoked
*/
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
