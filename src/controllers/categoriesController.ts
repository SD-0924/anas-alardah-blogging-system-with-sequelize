import { Categories } from "../models/categoriesModel.js";
import { PostsCategories } from "../models/postsCategoriesModel.js";

export const createCategoriesTable = async (req, res) => {
    try {
        await Categories.sync();
        res.status(200).json({ message: "Categories table created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Create a new category for a post by ID
export const createCategory = async (req, res) => {
    try {
        const { description, postId } = req.body;
        const category = await Categories.create({ description, postId }) as any;
        const postCategories = await PostsCategories.create({ postId, categoryId: category.id });
        res.status(201).json({ category, postCategories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get Categories for a specific post by ID
export const getCategoriesByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId || isNaN(Number(postId))) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        const categories = await PostsCategories.findAll({ where: { postId } });

        if (!categories || categories.length === 0) {
            return res.status(404).json({ error: "Categories not found" });
        }

        res.status(200).json(categories);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
