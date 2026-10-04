import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../src/app.js";
import Interview from "../src/models/Interview.js";
import User from "../src/models/User.js";

let mongoServer;
let firstUserToken;
let secondUserToken;
let firstUserId;

async function registerUser(name, email) {
  return request(app).post("/api/auth/register").send({
    name,
    email,
    password: "SecureTest123",
  });
}

beforeAll(async () => {
  process.env.JWT_SECRET =
    "test-jwt-secret-that-is-long-and-not-used-in-production";

  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), {
    dbName: "devprep_test",
  });
});

beforeEach(async () => {
  await Interview.deleteMany({});
  await User.deleteMany({});

  const firstUserResponse = await registerUser(
    "First User",
    "first@example.com",
  );

  const secondUserResponse = await registerUser(
    "Second User",
    "second@example.com",
  );

  firstUserToken = firstUserResponse.body.token;
  secondUserToken = secondUserResponse.body.token;
  firstUserId = firstUserResponse.body.user.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Authentication security", () => {
  it("rejects protected API access without a token", async () => {
    const response = await request(app).get("/api/interviews");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("rejects protected API access with an invalid token", async () => {
    const response = await request(app)
      .get("/api/interviews")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("rejects malformed registration input", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "A",
      email: "not-an-email",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Request validation failed");
  });
});

describe("Interview ownership security", () => {
  it("prevents another user from viewing an interview", async () => {
    const interview = await Interview.create({
      user: firstUserId,
      targetRole: "Frontend Engineer",
      experienceLevel: "Intermediate",
      interviewType: "Technical",
      topics: ["React"],
      questionCount: 5,
      questions: [
        {
          question: "Explain React reconciliation.",
          topic: "React",
          difficulty: "Medium",
        },
      ],
    });

    const response = await request(app)
      .get(`/api/interviews/${interview._id}`)
      .set("Authorization", `Bearer ${secondUserToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Interview not found");
  });

  it("allows the owner to view their interview", async () => {
    const interview = await Interview.create({
      user: firstUserId,
      targetRole: "Frontend Engineer",
      experienceLevel: "Intermediate",
      interviewType: "Technical",
      topics: ["React"],
      questionCount: 5,
      questions: [
        {
          question: "Explain React reconciliation.",
          topic: "React",
          difficulty: "Medium",
        },
      ],
    });

    const response = await request(app)
      .get(`/api/interviews/${interview._id}`)
      .set("Authorization", `Bearer ${firstUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.interview._id).toBe(String(interview._id));
  });
});
