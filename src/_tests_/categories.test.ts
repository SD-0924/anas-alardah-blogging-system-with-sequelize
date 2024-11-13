import request from "supertest";
import express from "express";
import categoriesRouter from "../_mocks_/routes/categoriesRouteMock.js";

const app = express();
app.use(express.json());
app.use("/categories", categoriesRouter);

describe("Categories Route - Success cases", () => {
    
    it("should create a new category successfully", async () => {
        const response = await request(app).post("/categories/createCategory").send({
            description: "testcategory",
            postId: 1,
        });

        expect(response.status).toBe(201);
    });

    it("should retrieve categories for a specific post by post ID", async () => {
        const postId = 1; // Adjust based on your test data
        const response = await request(app).get(`/categories/getCategoriesByPostId/${postId}`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("Categories Route - Error Handling", () => {
    
    it("should return 404 for non-existent post's categories", async () => {
        const invalidPostId = 999; // Ensure this ID doesn't exist in your test DB
        const response = await request(app).get(`/categories/getCategoriesByPostId/${invalidPostId}`);
        
        expect(response.status).toBe(404);
    });

    it("should return 400 for invalid post ID format", async () => {
        const response = await request(app).get("/categories/getCategoriesByPostId/invalidID");
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid post ID format");
    });
});
