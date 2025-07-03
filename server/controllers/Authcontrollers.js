const User = require('../models/User')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

const signup = async (req, res) => {
  const { email, username, password, role } = req.body;
  try {
    const hash = await argon2.hash(password);
    const user = await User.create({
      email,
      username,
      password: hash,
      role
    });

    const accessToken = jwt.sign(
      { email, role, username },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {email, role, username },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      msg: "Signup successful"
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", detail: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).send({ message: 'User not found' });

  try {
    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword)
      return res.status(401).send({ message: 'Password incorrect' });

    const accessToken = jwt.sign(
      {_id: user._id,email: user.email, role: user.role, username: user.username },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {_id: user._id,email: user.email, role: user.role, username: user.username },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).send({ user, message: 'Login successful' });

  } catch (err) {
    res.status(500).send({ message: 'Error logging in', error: err.message });
  }
};
const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).send({ message: 'Logged out' });
}
const getmyuser=async(req,res)=>{
  try{
const user=req.user;
console.log(user)
console.log(req.user)
res.status(200).json({user});
}catch(err){
  res.status(401).json({message:'Error fetching user',error:err.message});
}
}
module.exports = { login, signup, logout,getmyuser }