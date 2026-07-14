const request = require('supertest');
const app = require('../app');
const User = require("../models/User");
const redisClient = require("../config/redisconfig");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("../config/redisconfig");
jest.mock("argon2");
jest.mock("jsonwebtoken");

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('ZYNK');
    })
})

describe('POST /api/auth/signup', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    })
    it("should return 500 if redis get fails", async () => {
        redisClient.get.mockRejectedValue(new Error("Redis Error"));

        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "abc@gmail.com",
                username: "tester",
                password: "Password@123",
                otp: "123456"
            });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Signup failed");
    });
    it("should return 500 if argon2 hashing fails", async () => {

        redisClient.get.mockResolvedValue("123456");
        User.findOne.mockResolvedValue(null);
        redisClient.del.mockResolvedValue(1);

        argon2.hash.mockRejectedValue(new Error("Hash failed"));

        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "abc@gmail.com",
                username: "tester",
                password: "Password@123",
                otp: "123456"
            });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Signup failed");
    });
    it("should return 500 if user creation fails", async () => {
        redisClient.get.mockResolvedValue("123456");
        User.findOne.mockResolvedValue(null);
        redisClient.del.mockResolvedValue(1);
        argon2.hash.mockResolvedValue("hashed-password");

        User.create.mockRejectedValue(new Error("Mongo Error"));

        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "abc@gmail.com",
                username: "tester",
                password: "Password@123",
                otp: "123456"
            });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Signup failed");
    });
    it("should return 500 if user creation fails", async () => {

        redisClient.get.mockResolvedValue("123456");
        User.findOne.mockResolvedValue(null);
        redisClient.del.mockResolvedValue(1);
        argon2.hash.mockResolvedValue("hashed-password");

        User.create.mockRejectedValue(new Error("Mongo Error"));

        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "abc@gmail.com",
                username: "tester",
                password: "Password@123",
                otp: "123456"
            });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Signup failed");
    });
    it("should return 500 if jwt generation fails", async () => {

        redisClient.get.mockResolvedValue("123456");
        User.findOne.mockResolvedValue(null);
        redisClient.del.mockResolvedValue(1);
        argon2.hash.mockResolvedValue("hashed-password");

        User.create.mockResolvedValue({
            _id: "123",
            email: "abc@gmail.com",
            username: "tester",
            role: "user"
        });

        jwt.sign.mockImplementation(() => {
            throw new Error("JWT Error");
        });

        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "abc@gmail.com",
                username: "tester",
                password: "Password@123",
                otp: "123456"
            });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Signup failed");
    });
    it('should return 400 for invalid input', async () => {
        const res = await request(app).post('/api/auth/signup').send({
            email: 'invalid-email',
            username: 'testuser',
            password: 'password123',
            otp: '123456'
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid input');
        expect(redisClient.get).not.toHaveBeenCalled()
        expect(User.findOne).not.toHaveBeenCalled()
    })
    it('should return 400 for wrong otp', async () => {
        redisClient.get.mockResolvedValue(null);
        const res = await request(app).post('/api/auth/signup').send({
            email: 'email@gmail.com',
            username: 'tester',
            password: '12345678',
            otp: '112233'
        })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid or expired OTP');
        expect(redisClient.get).toHaveBeenCalledWith("otp:email@gmail.com");
        expect(User.findOne).not.toHaveBeenCalled();
    })
    it('should return 409 if user already exists', async () => {
        redisClient.get.mockResolvedValue("123456")
        User.findOne.mockResolvedValue({ id: "r4512", email: "tester@gmail.com", username: 'tester' })
        const res = await request(app).post('/api/auth/signup').send({
            email: 'tester@gmail.com',
            username: 'tester',
            password: '123456',
            otp: '123456'
        })
        expect(res.status).toBe(409)
        expect(res.body.message).toBe('User already exists');
        expect(redisClient.get).toHaveBeenCalledWith("otp:tester@gmail.com");
        expect(User.findOne).toHaveBeenCalledWith({ email: "tester@gmail.com" });
        expect(User.create).not.toHaveBeenCalled()
    })
    it("should return 500 if argon2 verify throws", async () => {

        User.findOne.mockResolvedValue({
            email: "tester@gmail.com",
            password: "hashedPassword"
        });

        argon2.verify.mockRejectedValue(new Error("Argon Error"));

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "tester@gmail.com",
                password: "Password123"
            });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Error logging in");
    });
    it('should return 201 for signup', async () => {
        redisClient.get.mockResolvedValue("123456");
        User.findOne.mockResolvedValue(null);
        redisClient.del.mockResolvedValue(1);
        argon2.hash.mockResolvedValue("hashed-password");
        User.create.mockResolvedValue({
            _id: "123",
            email: "abc@gmail.com",
            username: "anshu123",
            role: "user"
        });
        jwt.sign.mockReturnValueOnce("access-token").mockReturnValueOnce("refresh-token");
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "abc@gmail.com",
                username: "anshu123",
                password: "Password@123",
                otp: "123456"
            });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            msg: "Signup successful"
        });

        expect(redisClient.get).toHaveBeenCalledWith("otp:abc@gmail.com");

        expect(User.findOne).toHaveBeenCalledWith({
            email: "abc@gmail.com"
        });

        expect(redisClient.del).toHaveBeenCalledWith("otp:abc@gmail.com");

        expect(argon2.hash).toHaveBeenCalledWith("Password@123");

        expect(User.create).toHaveBeenCalledWith({
            email: "abc@gmail.com",
            username: "anshu123",
            password: "hashed-password",
            role: "user"
        });

        expect(jwt.sign).toHaveBeenCalledTimes(2);
    });
    it("should return 500 if jwt generation fails", async () => {

        User.findOne.mockResolvedValue({
            _id: "1",
            username: "tester",
            email: "tester@gmail.com",
            password: "hashedPassword",
            role: "user"
        });

        argon2.verify.mockResolvedValue(true);

        jwt.sign.mockImplementation(() => {
            throw new Error("JWT Error");
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "tester@gmail.com",
                password: "Password123"
            });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Error logging in");
    });
})

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it('check invalid input', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'invalid-email',
            password: 'password123',
        });
        expect(res.status).toBe(400);
        expect(User.findOne).not.toHaveBeenCalled()
    })
    it('check for user not found', async () => {
        User.findOne.mockResolvedValue(null)
        const res = await request(app).post('/api/auth/login').send({
            email: 'tester@gmail.com',
            password: 'password123',
        });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found')
        expect(User.findOne).toHaveBeenCalledWith({ email: "tester@gmail.com" });
    })
    it('check for incorrect password', async () => {
        User.findOne.mockResolvedValue({
            username: 'tester',
            email: 'tester@gmail.com',
            password: 'password123',
        });
        argon2.verify.mockResolvedValue(false)
        const res = await request(app).post('/api/auth/login').send({
            email: 'tester@gmail.com',
            password: 'password122',
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Password incorrect')
        expect(argon2.verify).toHaveBeenCalledWith("password123", "password122");
        expect(User.findOne).toHaveBeenCalledWith({ email: "tester@gmail.com" });
    })
    it('check for successfull login', async () => {
        User.findOne.mockResolvedValue({
            username: 'tester',
            email: 'tester@gmail.com',
            password: 'password123',
        });
        argon2.verify.mockResolvedValue(true)
        jwt.sign.mockReturnValueOnce('accesstoken').mockReturnValueOnce('refreshtoken')
        const res = await request(app).post('/api/auth/login').send({
            email: 'tester@gmail.com',
            password: 'password123',
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful')
        expect(res.body.user).toEqual({
            username: 'tester',
            email: 'tester@gmail.com',
            password: 'password123',
        });
        expect(argon2.verify).toHaveBeenCalledWith("password123", "password123");
        expect(User.findOne).toHaveBeenCalledWith({ email: "tester@gmail.com" });
        expect(jwt.sign).toHaveBeenCalledTimes(2)
    })
})
describe("POST /api/auth/logout", () => {

    it("should logout successfully", async () => {

        const res = await request(app)
            .get("/api/auth/logout");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Logged out");
    });

});
describe("GET /api/profile/getmyuser", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch current user", async () => {
        jwt.verify.mockReturnValue({
            _id: "123",
            email: "tester@gmail.com",
            username: "tester",
            role: "user"
        });
        User.findById.mockResolvedValue({
            _id: "123",
            username: "tester",
            email: "tester@gmail.com"
        });

        const res = await request(app)
            .get("/api/profile/getmyuser")
            .set("Cookie", ["accessToken=fakeToken"]);

        expect(jwt.verify).toHaveBeenCalled();
        expect(User.findById).toHaveBeenCalledWith("123");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            user: {
                _id: "123",
                username: "tester",
                email: "tester@gmail.com"
            }
        });
    });
});
describe("PUT /api/profile/updateuser", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update user", async () => {
        jwt.verify.mockReturnValue({
            _id: "123",
            email: "tester@gmail.com",
            username: "tester",
            role: "user"
        });

        User.findByIdAndUpdate.mockResolvedValue({
            _id: "123",
            username: "newtester",
            email: "tester@gmail.com"
        });

        const res = await request(app)
            .put("/api/profile/updateuser")
            .set("Cookie", ["accessToken=fakeToken"])
            .send({
                username: "newtester"
            });

        expect(jwt.verify).toHaveBeenCalled();

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { $set: { username: "newtester" } },
            { new: true }
        );

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual({
            user: {
                _id: "123",
                username: "newtester",
                email: "tester@gmail.com"
            }
        });
    });
});