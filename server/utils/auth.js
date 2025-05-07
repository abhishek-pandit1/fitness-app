const jwt = require("jsonwebtoken");

const secret = "mysecretsdontmess";
const expiration = "6h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    console.log('Auth middleware - Headers:', req.headers);
    console.log('Auth middleware - Body:', req.body);
    console.log('Auth middleware - Query:', req.query);

    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    console.log('Auth middleware - Initial token:', token);

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
      console.log('Auth middleware - Extracted token:', token);
    }

    if (!token) {
      console.log('Auth middleware - No token found');
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Auth middleware - Token verified, user data:', data);
      req.user = data;
    } catch (error) {
      console.log('Auth middleware - Invalid token:', error.message);
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    console.log('Signing token with payload:', payload);
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
