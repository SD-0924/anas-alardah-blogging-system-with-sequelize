import express from "express";
import { createPostsTable, createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/postsController.js";

const postsRouter = express.Router();

postsRouter.get("/createPostsTable", createPostsTable);
postsRouter.post("/createPost", createPost);
postsRouter.get("/getAllPosts", getAllPosts);
postsRouter.get("/getPostById/:id", getPostById);
postsRouter.put("/updatePost/:id", updatePost);
postsRouter.delete("/deletePost/:id", deletePost);

export default postsRouter;