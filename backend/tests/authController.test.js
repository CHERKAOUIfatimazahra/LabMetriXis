const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require("../utils/otpGenerator");

jest.mock("../utils/mailer");
jest.mock("../utils/otpGenerator");

process.env.JWT_SECRET = "your_jwt_secret_key";

const app = express();
app.use(bodyParser.json());
app.post("/auth/register", authController.register);
app.get("/auth/verify-email", authController.verifyEmail);
app.post("/auth/login", authController.login);
app.post("/auth/verify-otp", authController.verifyOTP);

// Test pour l'inscription
describe("Auth Controller - Register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user and send a verification email", async () => {
    jest.spyOn(User.prototype, "save").mockResolvedValue();
    jest.spyOn(jwt, "sign").mockReturnValue("mockToken");

    const mockUserData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
      phoneNumber: "1234567890",
      address: "123 Test Street",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(mockUserData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "User registered successfully. Please check your email for verification."
    );
  });

  it("should handle errors during user registration", async () => {
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Database Error"));

    const mockUserData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
      phoneNumber: "1234567890",
      address: "123 Test Street",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(mockUserData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database Error");
  });
});

// Test pour la vérification de l'email
describe("Auth Controller - Verify Email", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify a valid token and update user as verified", async () => {
    const mockUser = {
      _id: "123",
      isVerified: false,
      save: jest.fn().mockResolvedValue(),
    };

    jest.spyOn(jwt, "verify").mockImplementation((token, secret) => {
      if (token === "mockToken") return { id: "123" };
      throw new Error("Invalid token");
    });
    jest.spyOn(User, "findById").mockResolvedValue(mockUser);

    const response = await request(app).get(
      "/auth/verify-email?token=mockToken"
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      "mockToken",
      process.env.JWT_SECRET
    );
    expect(User.findById).toHaveBeenCalledWith("123");
    expect(mockUser.isVerified).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("http://localhost:5173/login");
  });

  it("should handle invalid tokens", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await request(app).get(
      "/auth/verify-email?token=invalidToken"
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidToken",
      process.env.JWT_SECRET
    );
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(
      "http://localhost:5173/error?message=invalid-token"
    );
  });
});

// Test pour le login
describe("Auth Controller - Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send an OTP for the first login", async () => {
    const mockUser = {
      _id: "123",
      email: "test@example.com",
      password: "$2a$10$e2vYTrf1z3vAqGhvnklo1ubGJmFDuFclDCk3InFvXiQlrk3HZ0m1y",
      isVerified: true,
      otp: undefined,
      otpExpires: undefined,
      lastOTPSentAt: undefined,
      save: jest.fn().mockResolvedValue(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jest.spyOn(jwt, "sign").mockReturnValue("mockToken");
    jest.spyOn(otpGenerator, "generateOTP").mockReturnValue("123456");

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "Password123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should login a user and generate a JWT token for subsequent logins", async () => {
    const mockUser = {
      _id: "123",
      email: "test@example.com",
      password: "$2a$10$e2vYTrf1z3vAqGhvnklo1ubGJmFDuFclDCk3InFvXiQlrk3HZ0m1y",
      isVerified: true,
      otp: "123456",
      otpExpires: Date.now() + 5 * 60 * 1000,
      lastOTPSentAt: Date.now(),
      save: jest.fn().mockResolvedValue(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jest.spyOn(jwt, "sign").mockReturnValue("mockToken");

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "Password123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("mockToken");
  });

  it("should return an error if user is not verified", async () => {
    const mockUser = {
      _id: "123",
      email: "test@example.com",
      password: "$2a$10$e2vYTrf1z3vAqGhvnklo1ubGJmFDuFclDCk3InFvXiQlrk3HZ0m1y",
      isVerified: false,
      save: jest.fn().mockResolvedValue(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "Password123" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Please verify your email before logging in."
    );
  });

  it("should handle invalid credentials during login", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "Password123" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});

// Test pour la vérification de l'OTP
describe("Auth Controller - Verify OTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify a valid OTP and generate a JWT token", async () => {
    const mockUser = {
      _id: "123",
      otp: "123456",
      otpExpires: Date.now() + 5 * 60 * 1000,
      save: jest.fn().mockResolvedValue(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/auth/verify-otp")
      .send({ email: "test@example.com", otp: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("OTP verified successfully");
    expect(response.body.token).toBeDefined();
  });

  it("should return an error if OTP is invalid or expired", async () => {
    const mockUser = {
      _id: "123",
      otp: "123456",
      otpExpires: Date.now() - 5 * 60 * 1000, // OTP expired
      save: jest.fn().mockResolvedValue(),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/auth/verify-otp")
      .send({ email: "test@example.com", otp: "123456" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid or expired OTP");
  });
});
