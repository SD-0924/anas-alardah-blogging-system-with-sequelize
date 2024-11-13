import express from "express";
import { createCategory, getCategoriesByPostId } from "../controllers/categoriesControllerMock.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/createCategory", createCategory);
categoriesRouter.get("/getCategoriesByPostId/:postId", getCategoriesByPostId);

export default categoriesRouter;