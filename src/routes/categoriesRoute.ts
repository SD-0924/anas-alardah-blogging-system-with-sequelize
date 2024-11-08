import express from "express";
import { createCategoriesTable, createCategory, getCategoriesByPostId } from "../controllers/categoriesController.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/createCategoriesTable", createCategoriesTable);
categoriesRouter.post("/createCategory", createCategory);
categoriesRouter.get("/getCategoriesByPostId/:postId", getCategoriesByPostId);

export default categoriesRouter;