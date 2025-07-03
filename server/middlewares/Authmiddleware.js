const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
      req.user = decoded;
      return next();
    } catch (err) {
return res.status(401).json({message:err.message})
    }
  }
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      const newAccessToken = jwt.sign(
        {_id: decoded._id,email: decoded.email, role: decoded.role, username: decoded.username },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: '15m' }
      );
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 15 * 60 * 1000
      });
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
  }
  return res.status(401).json({ message: 'No token. Authorization denied.' });
};

module.exports = AuthMiddleware;
