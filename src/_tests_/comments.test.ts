import request from "supertest";
import express from "express";
import commentsRouter from "../_mocks_/routes/commentsRouteMock.js";
const app = express();
app.use(express.json());
app.use("/comments", commentsRouter);

describe("Comments route tests", () => {
    it("should create a new comment", async () => {
        const response = await request(app).post("/comments/createComment").send({
            content: "testcontent",
            userId: 1,
            postId: 1,
        });
        expect(response.status).toBe(201);
        expect(response.body.content).toBe("testcontent");
    });

   //test for getting all comments for a specific post
    it("should get all comments for a specific post", async () => {
        const response = await request(app).get("/comments/getAllComments/1");
        expect(response.status).toBe(200);
    });

});

describe("Comments error handling tests", () => {
    //getting a non-existent comment
    it("should return 404 for non-existent comment", async () => {
        const response = await request(app).get("/comments/getAllComments/999");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("No comments found for this post");
    });


});