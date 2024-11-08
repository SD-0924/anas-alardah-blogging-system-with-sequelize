import { PostsCategories } from "../models/postsCategoriesModel.js";

export const createPostsCategoriesTable = async (req, res) => {
    try {
        await PostsCategories.sync({ force: true });
        res.status(200).json({ message: "PostsCategories table created successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};