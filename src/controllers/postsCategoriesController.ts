import { Request, Response } from 'express';
import { PostsCategories } from '../models/postsCategoriesModel.js';

// Create PostsCategories table
export const createPostsCategoriesTable = async (req: Request, res: Response): Promise<void> => {
    try {
        await PostsCategories.sync({ force: true });
        res.status(200).json({ message: "PostsCategories table created successfully." });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};