import express from "express";
import { createPostsTable, createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/postsController.js";
import { verifyToken } from "../middleware/token.js";

const postsRouter = express.Router();

postsRouter.get("/createPostsTable", createPostsTable);
postsRouter.post("/createPost", verifyToken ,createPost);
postsRouter.get("/getAllPosts", getAllPosts); //maybe if we want only users to see the posts on the plateform
postsRouter.get("/getPostById/:id", getPostById);
postsRouter.put("/updatePost/:id", verifyToken ,updatePost);
postsRouter.delete("/deletePost/:id", verifyToken ,deletePost);

export default postsRouter;