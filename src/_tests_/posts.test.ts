import request from "supertest";
import express from "express";
import postsRouter from "../routes/postsRoute.js";

const app = express();
app.use(express.json());
app.use("/posts", postsRouter);

// Generate a new test user before each test suite
let testUserId;
beforeAll(async () => {
  const testUserData = {
    name: "Test User",
    email: "testuser@example.com",
    password: "testpassword"
  };

  const response = await request(app)
    .post("/users/create")
    .send(testUserData);

  testUserId = response.body.id;
});

// Delete the test user after each test suite
afterAll(async () => {
  await request(app)
    .delete(`/users/${testUserId}`)
    .send();
});

// Utility function to generate post data
const generatePostData = (overrides: { title?: string, content?: string, userId?: number } = {}) => ({
    title: overrides.title || "testpost",
    content: overrides.content || "testcontent",
    userId: overrides.userId || 3,
});

describe("Posts Route - Success cases", () => {
    let testPostId;

    it("should create a new post", async () => {
        const postData = generatePostData();
        const response = await request(app).post("/posts/createPost").send(postData);
        testPostId = response.body.id; // Save the post ID for later tests

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            title: postData.title,
            content: postData.content,
        });
    });

    it("should get all posts", async () => {
        const response = await request(app).get("/posts/getAllPosts");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("should get a post by ID", async () => {
        const response = await request(app).get(`/posts/getPostById/${testPostId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", testPostId);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("content");
    });

    it("should update an existing post", async () => {
        const updatedData = { title: "updatedTitle", content: "updatedContent" };
        const response = await request(app)
            .put(`/posts/updatePost/${testPostId}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedData);
    });

    it("should delete the post", async () => {
        const response = await request(app).delete(`/posts/deletePost/${testPostId}`);
        expect(response.status).toBe(200);
    });
});

describe("Posts Route - Error Handling", () => {
    const invalidPostId = 9999;

    it("should return 404 for non-existent post (get by ID)", async () => {
        const response = await request(app).get(`/posts/getPostById/${invalidPostId}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Post not found");
    });

    it("should return 404 for non-existent post (delete)", async () => {
        const response = await request(app).delete(`/posts/deletePost/${invalidPostId}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Post not found");
    });

    it("should return 404 for non-existent post (update)", async () => {
        const response = await request(app).put(`/posts/updatePost/${invalidPostId}`).send({
            title: "nonExistentPost",
            content: "noContent",
        });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Post not found");
    });
});