import request from "supertest";
import express from "express";
import usersRouter from "../_mocks_/routes/usersRouteMock.js";

const app = express();
app.use(express.json());
app.use("/users/mock", usersRouter);

// Utility function to generate random strings
const generateRandomString = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Test data generation for user fields
const generateRandomUser = () => ({
  username: generateRandomString(),
  email: `${generateRandomString()}@gmail.com`,
  password: generateRandomString(),
});

describe("Users Route - Success cases", () => {
  let testUserId;

  it("should create a new user", async () => {
    const userData = generateRandomUser();
    const response = await request(app).post("/users/mock/createUser").send(userData);
    testUserId = response.body.id; // Save the user ID for later tests

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      username: userData.username,
      email: userData.email,
    });
  });

  it("should get all users", async () => {
    const response = await request(app).get("/users/mock/getAllUsers");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get a user by ID", async () => {
    const response = await request(app).get(`/users/mock/getUserById/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
  });

  it("should update an existing user", async () => {
    const updatedData = { username: "updatedUser", email: "updated@example.com", password: "newpassword" };
    const response = await request(app).put(`/users/mock/updateUser/${testUserId}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      username: updatedData.username,
      email: updatedData.email,
    });
  });

  it("should delete the user", async () => {
    const response = await request(app).delete(`/users/mock/deleteUser/${testUserId}`);
    expect(response.status).toBe(200);
  });
});

describe("Users Route - Error handling", () => {
  const invalidUserId = 9999;

  it("should return 404 for non-existent user (get by ID)", async () => {
    const response = await request(app).get(`/users/mock/getUserById/${invalidUserId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 404 for non-existent user (delete)", async () => {
    const response = await request(app).delete(`/users/mock/deleteUser/${invalidUserId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 404 for non-existent user (update)", async () => {
    const response = await request(app).put(`/users/mock/updateUser/${invalidUserId}`).send({
      username: "nonExistentUser",
      email: "nope@example.com",
      password: "password",
    });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });
});