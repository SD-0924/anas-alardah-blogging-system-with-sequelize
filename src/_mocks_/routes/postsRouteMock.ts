import express from "express";
import {createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/postsControllerMock.js";

const postsRouter = express.Router();

postsRouter.post("/createPost" ,createPost);
postsRouter.get("/getAllPosts", getAllPosts); //maybe if we want only users to see the posts on the plateform
postsRouter.get("/getPostById/:id", getPostById);
postsRouter.put("/updatePost/:id" ,updatePost);
postsRouter.delete("/deletePost/:id" ,deletePost);

export default postsRouter;