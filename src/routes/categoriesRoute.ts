import express from "express";
import { createCategoriesTable, createCategory, getCategoriesByPostId } from "../controllers/categoriesController.js";
import { verifyToken } from "../middleware/token.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/createCategoriesTable", createCategoriesTable);
categoriesRouter.post("/createCategory", verifyToken ,createCategory);
categoriesRouter.get("/getCategoriesByPostId/:postId", getCategoriesByPostId);

export default categoriesRouter;