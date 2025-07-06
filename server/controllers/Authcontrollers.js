const User = require('../models/User')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const redisClient = require('../config/redisconfig.js');
const {generateOTP,transporter}=require('../utils/otpservice')
const { signupSchema, loginSchema, updateUserSchema } = require('../utils/validateauth');

const sendotp=async(req,res)=>{
  try {
    const { email } = req.body;
      const otp = generateOTP();
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
      }
 await redisClient.setEx(`otp:${email}`, 300, otp);
    const check = await redisClient.get(`otp:${email}`);
  await transporter.sendMail({
    from: `"Zynk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Secure OTP Code',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Secure OTP Code</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .logo {
            color: #D3500C;
            font-weight: bold;
            font-size: 24px;
        }
        .card {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .otp-display {
            background-color: #fff7ed;
            border: 1px solid #fed7aa;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            color: #D3500C;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #64748b;
        }
        .button {
            background-color: #D3500C;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            font-weight: 500;
            margin-top: 20px;
        }
        .note {
            font-size: 14px;
            color: #64748b;
            margin-top: 25px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Zynk</div>
        </div>
        
        <div class="card">
            <h2 style="margin-top: 0;">Your One-Time Password</h2>
            <p>Here's your secure OTP code to verify your identity:</p>
            
            <div class="otp-display">
                ${otp}
            </div>
            
            <p>Please enter this code in the verification field to complete your action.</p>
            
            <div class="note">
                <p><strong>Note:</strong> This OTP is valid for 5 minutes only. Do not share this code with anyone.</p>
                <p>If you didn't request this code, please ignore this email or contact support.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 Zynk. All rights reserved.</p>
            <p>28/A Newtown, Kolkata 700001, India</p>
        </div>
    </div>
</body>
</html>`,
    text: `Your OTP code is: ${otp}\n\nIt is valid for 5 minutes only.`,
});

  return res.status(200).json({ message: 'OTP sent successfully' });
}
catch (error) {
  return res.status(500).json({message:error.message})
}
}


const signup = async (req, res) => {
  console.log("api",req.body);
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
  console.error(validation.error.format());
  return res.status(400).json({ message: 'Invalid input', errors: validation.error.format() });
}

  const { email, username, password, otp, role = 'user' } = validation.data;

  try {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    await redisClient.del(`otp:${email}`);

    const hash = await argon2.hash(password);
    const user = await User.create({
      email,
      username,
      password: hash,
      role,
    });

    const accessToken = jwt.sign(
      { _id: user._id, email, role, username },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, email, role, username },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ msg: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed', detail: error.message });
  }
};

const login = async (req, res) => {
  const validation=loginSchema.safeParse(req.body)
  if(!validation.success)
    return res.status(400).json(validation.error);
  const {email,password}=validation.data;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).send({ message: 'User not found' });

  try {
    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword)
      return res.status(401).send({ message: 'Password incorrect' });

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role, username: user.username },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role, username: user.username },
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
const getmyuser = async (req, res) => {
  try {
 const newuser = await User.findById(req.user._id);
  res.status(200).json({ user:newuser });
  } catch (err) {
    res.status(401).json({ message: 'Error fetching user', error: err.message });
  }
}
const updateuser = async (req, res) => {
  try {
    const validation=updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid request', error: validation.error });
      }
      const {username}=req.body;
    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { username } },
      { new: true }
    );

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(401).json({ message: 'Error updating user', error: err.message });
  }
}
module.exports = { login, signup, logout, getmyuser, updateuser,sendotp }