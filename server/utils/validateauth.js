const { z } = require('zod');

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin", "host", "guest"]).optional(),
  otp: z.string().length(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
const sendotpSchema = z.object({
  email: z.string().email(),
});

const updateUserSchema = z.object({
  username: z.string().min(3)
});

module.exports = { signupSchema, loginSchema, updateUserSchema };
