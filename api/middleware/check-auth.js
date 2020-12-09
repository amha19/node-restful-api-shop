const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No Token' });
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // console.log('deco: ', decoded);
    req.userData = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: err,
      message: 'Auth Failed',
    });
  }
};
