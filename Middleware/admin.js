const jwt = require('jsonwebtoken');
const jwtSecretKey = 'dframeAdmin';

exports.requireAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  });
};
