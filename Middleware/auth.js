const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(403).send("Please login first");
  }

  console.log(token);
  console.log(process.env.JWT_SECRET);

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = decode;
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid Token");
  }

  next();
};

module.exports = auth;
// const jwt = require("jsonwebtoken");

// function checkToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//       if (err) {
//         res
//           .status(403)
//           .json({ message: "session timeout, please login again" });
//       } else {
//         req.user = decodedToken;
//         // Call next() to move to the next middleware or route handler
//         next();
//       }
//     });
//   } else {
//     res.status(401).json({ message: "Missing authorization header" });
//   }
// }

// module.exports = checkToken;
