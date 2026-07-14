const request = require("supertest");
const Room = require("../models/Room");
const jwt = require("jsonwebtoken");

jest.mock("../models/Room");
jest.mock("jsonwebtoken");

const app = require("../app");

describe("Room Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        jwt.verify.mockReturnValue({
            _id: "123",
            username: "tester",
            email: "tester@gmail.com",
            role: "user"
        });
    });

    describe("POST /api/room/createroom", () => {

        it("should create a room", async () => {

            Room.findOne.mockResolvedValue(null);

            Room.create.mockResolvedValue({
                roomId: "abc-def-ghi",
                participants: [],
                duration: 0,
                host: "Anshu"
            });

            const res = await request(app)
                .post("/api/room/createroom")
                .set("Cookie", ["accessToken=fakeToken"])
                .send({
                    roomId: "abc-def-ghi",
                    participants: [],
                    duration: 0,
                    host: "Anshu"
                });

            expect(Room.findOne).toHaveBeenCalledWith({
                roomId: "abc-def-ghi"
            });

            expect(Room.create).toHaveBeenCalledWith({
                roomId: "abc-def-ghi",
                participants: [],
                duration: 0,
                host: "Anshu"
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Room created successfully");
        });

        it("should return 400 if room already exists", async () => {

            Room.findOne.mockResolvedValue({
                roomId: "abc-def-ghi"
            });

            const res = await request(app)
                .post("/api/room/createroom")
                .set("Cookie", ["accessToken=fakeToken"])
                .send({
                    roomId: "abc-def-ghi",
                    participants: [],
                    duration: 0,
                    host: "Anshu"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Room already exists");
        });
    });

    describe("PUT /api/room/addparticipant", () => {

        it("should add participant", async () => {

            const save = jest.fn().mockResolvedValue();

            Room.findOne.mockResolvedValue({
                roomId: "abc-def-ghi",
                participants: [],
                save
            });

            const res = await request(app)
                .put("/api/room/addparticipant")
                .set("Cookie", ["accessToken=fakeToken"])
                .send({
                    roomId: "abc-def-ghi",
                    participant: "Rahul"
                });

            expect(Room.findOne).toHaveBeenCalledWith({
                roomId: "abc-def-ghi"
            });

            expect(save).toHaveBeenCalled();

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Participant added successfully");
        });

        it("should return 404 if room not found", async () => {

            Room.findOne.mockResolvedValue(null);

            const res = await request(app)
                .put("/api/room/addparticipant")
                .set("Cookie", ["accessToken=fakeToken"])
                .send({
                    roomId: "abc-def-ghi",
                    participant: "Rahul"
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Room not found");
        });

    });

    describe("GET /api/room/validateroom/:roomId", () => {

        it("should validate room", async () => {

            Room.findOne.mockResolvedValue({
                roomId: "abc-def-ghi"
            });

            const res = await request(app)
                .get("/api/room/validateroom/abc-def-ghi")
                .set("Cookie", ["accessToken=fakeToken"]);

            expect(Room.findOne).toHaveBeenCalledWith({
                roomId: "abc-def-ghi"
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Room validated successfully");
        });

        it("should return 404 if room not found", async () => {

            Room.findOne.mockResolvedValue(null);

            const res = await request(app)
                .get("/api/room/validateroom/abc-def-ghi")
                .set("Cookie", ["accessToken=fakeToken"]);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Room not found");
        });

    });

    describe("PUT /api/room/endcall", () => {

        it("should end call", async () => {

            Room.findOne.mockResolvedValue({
                _id: "mongo123",
                roomId: "abc-def-ghi"
            });

            Room.findByIdAndUpdate.mockResolvedValue({
                _id: "mongo123",
                roomId: "abc-def-ghi",
                duration: 120
            });

            const res = await request(app)
                .put("/api/room/endcall")
                .set("Cookie", ["accessToken=fakeToken"])
                .send({
                    roomId: "abc-def-ghi",
                    duration: 120
                });

            expect(Room.findOne).toHaveBeenCalledWith({
                roomId: "abc-def-ghi"
            });

            expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
                "mongo123",
                {
                    $set: {
                        duration: 120
                    }
                },
                {
                    new: true
                }
            );

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Call ended successfully");
        });

        it("should return 404 if room not found", async () => {

            Room.findOne.mockResolvedValue(null);

            const res = await request(app)
                .put("/api/room/endcall")
                .set("Cookie", ["accessToken=fakeToken"])
                .send({
                    roomId: "abc-def-ghi",
                    duration: 120
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Room not found");
        });

    });

});