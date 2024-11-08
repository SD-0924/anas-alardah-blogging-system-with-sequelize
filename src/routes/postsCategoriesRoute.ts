import express from "express";
import { createPostsCategoriesTable } from "../controllers/postsCategoriesController.js";

const postsCategoriesRouter = express.Router();

postsCategoriesRouter.get("/createPostsCategoriesTable", createPostsCategoriesTable);

export default postsCategoriesRouter;